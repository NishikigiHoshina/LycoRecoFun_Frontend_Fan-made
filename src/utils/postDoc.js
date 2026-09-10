/**
 * 帖子正文文档（schema v1）与 HTML 之间的转换。
 *
 * 为什么要有这一层：正文**不存 HTML**，只存白名单节点树。渲染端按 schema 出标签、文本一律走
 * Vue 的 `{{ }}` 自动转义，因此不存在"HTML 注入"这一类漏洞，也就不需要 DOMPurify/Jsoup ——
 * 没有清洗器，就没有可被绕过的清洗器。安全性由**服务端**的白名单校验（PostDocValidator）承担，
 * 本文件只负责"把富文本编辑器吐出的 HTML 转成那个结构"，并在转换时顺手做一遍同样的过滤
 * （纵深防御 + 避免用户提交后才拿到 400）。
 *
 * schema（v1）：
 *   Doc    = { v:1, nodes:[Block...] }
 *   Block  = {t:'p'|'h2'|'h3'|'blockquote', c:[Inline...]}
 *          | {t:'ul'|'ol', c:[{t:'li', c:[Inline...]}]}
 *          | {t:'pre', c:['代码文本']}
 *          | {t:'img', src:'/upload/...', alt:'...'}
 *   Inline = {t:'b'|'i'|'u'|'code', c:[Inline...]}
 *          | {t:'a', href:'http(s)/mailto', c:[Inline...]}
 *          | '纯文本'
 */
import { toUploadRelativePath } from './asset'

export const DOC_VERSION = 1

const MAX_TEXT_CHARS = 5000
const MAX_ALT_CHARS = 200
const MAX_JSON_CHARS = 64 * 1024

/** 块级标签 → 文档块类型（h1/h4/h5/h6 一律归并到 h2/h3，schema 只留三级） */
const BLOCK_TAGS = {
  P: 'p', DIV: 'p',
  H1: 'h2', H2: 'h2', H3: 'h3', H4: 'h3', H5: 'h3', H6: 'h3',
  BLOCKQUOTE: 'blockquote',
}

/** 行内标签 → 文档行内类型 */
const INLINE_TAGS = {
  STRONG: 'b', B: 'b',
  EM: 'i', I: 'i',
  U: 'u',
  CODE: 'code',
}

/** 整棵丢弃（含内容）：绝不允许这些进文档 */
const DROP_TAGS = new Set([
  'SCRIPT', 'STYLE', 'NOSCRIPT', 'IFRAME', 'OBJECT', 'EMBED', 'SVG', 'MATH',
  'LINK', 'META', 'BASE', 'TEMPLATE', 'FORM', 'INPUT', 'BUTTON', 'TEXTAREA',
  'SELECT', 'OPTION', 'CANVAS', 'AUDIO', 'VIDEO', 'SOURCE', 'TRACK',
])

const LIST_TAGS = new Set(['UL', 'OL', 'MENU'])

/* ==================== HTML → Doc ==================== */

/**
 * 把编辑器 HTML 转成文档结构。
 * @returns {{ doc: object, externalImages: string[], truncated: boolean }}
 *          externalImages 非空时，调用方应提示用户"这些图片不是本站上传的，已移除"。
 */
export function buildDocFromHtml(html) {
  const empty = { doc: { v: DOC_VERSION, nodes: [] }, externalImages: [], truncated: false }
  if (!html || typeof html !== 'string') return empty

  // DOMParser 只解析、**不执行**脚本；下面只读 nodeName/textContent/属性，
  // 从不把解析结果插入真实文档（不碰 innerHTML），所以这里没有 DOM XSS 面。
  const parsed = new DOMParser().parseFromString(html, 'text/html')
  const externalImages = []
  const nodes = []
  for (const child of parsed.body.childNodes) {
    blockOf(child, nodes, externalImages)
  }

  // 服务端上限是 64KB，这里先自查并提示，避免用户点提交才拿到 400
  const json = JSON.stringify({ v: DOC_VERSION, nodes })
  if (json.length > MAX_JSON_CHARS) {
    return { doc: { v: DOC_VERSION, nodes: [] }, externalImages, truncated: true }
  }
  return { doc: { v: DOC_VERSION, nodes }, externalImages, truncated: false }
}

/** 只要文档的便捷包装（存量帖子渲染、后台预览用） */
export function htmlToDoc(html) {
  return buildDocFromHtml(html).doc
}

/** 空白文本数组判定：用于丢掉 <p><br></p> 这类空段 */
function isBlankInline(c) {
  for (const item of c) {
    if (typeof item === 'string') {
      if (item.trim()) return false
    } else {
      return false
    }
  }
  return true
}

function normalizeText(s) {
  // HTML 语义里连续空白会被折叠，这里显式折叠；换行由 <br> 显式转成 '\n' 保留。
  // 只折叠 \s（不含 U+00A0）：作者手动敲的 &nbsp; 保留为非断行空格，是符合预期的。
  return s ? s.replace(/\s+/g, ' ') : ''
}

function hasBlockChild(el) {
  for (const ch of el.children) {
    if (BLOCK_TAGS[ch.tagName] || LIST_TAGS.has(ch.tagName) || ch.tagName === 'PRE') return true
  }
  return false
}

/** 行内节点 → 追加到 out（返回数组以便"拆壳"时把子项摊平） */
function inlineOf(node, out) {
  if (node.nodeType === 3) {                       // 文本
    const t = normalizeText(node.nodeValue)
    if (t) out.push(t)
    return
  }
  if (node.nodeType !== 1) return                  // 注释/其他一律忽略

  const tag = node.tagName
  if (DROP_TAGS.has(tag)) return
  if (tag === 'BR') { out.push('\n'); return }
  if (tag === 'IMG') {
    const img = imgNode(node)
    if (img) out.push(img)
    return
  }
  if (tag === 'A') {
    const inner = []
    for (const c of node.childNodes) inlineOf(c, inner)
    if (isBlankInline(inner)) return
    const href = safeHref(node.getAttribute('href'))
    if (!href) { out.push(...inner); return }      // 协议不合法 → 去链接、保文字
    out.push({ t: 'a', href, c: inner })
    return
  }
  if (INLINE_TAGS[tag]) {
    const inner = []
    for (const c of node.childNodes) inlineOf(c, inner)
    if (!isBlankInline(inner)) out.push({ t: INLINE_TAGS[tag], c: inner })
    return
  }
  // 其余标签（含块级标签混入行内、未知标签）→ 拆壳，保留内容
  const inner = []
  for (const c of node.childNodes) inlineOf(c, inner)
  out.push(...inner)
}

function blockOf(node, out, externalImages) {
  if (node.nodeType === 3) {
    const t = normalizeText(node.nodeValue)
    if (t.trim()) out.push({ t: 'p', c: [t.trim()] })
    return
  }
  if (node.nodeType !== 1) return

  const tag = node.tagName
  if (DROP_TAGS.has(tag)) return

  if (tag === 'IMG') {
    const img = imgNode(node, externalImages)
    if (img) out.push(img)
    return
  }
  if (tag === 'PRE') {
    const code = clip(node.textContent || '')
    if (code.trim()) out.push({ t: 'pre', c: [code] })
    return
  }
  if (LIST_TAGS.has(tag)) {
    const items = []
    for (const li of node.children) {
      if (li.tagName !== 'LI') continue
      const c = []
      for (const ch of li.childNodes) inlineOf(ch, c)
      if (!isBlankInline(c)) items.push({ t: 'li', c })
    }
    if (items.length) out.push({ t: tag === 'OL' ? 'ol' : 'ul', c: items })
    return
  }
  if (BLOCK_TAGS[tag]) {
    const c = []
    for (const ch of node.childNodes) inlineOf(ch, c)
    if (!isBlankInline(c)) out.push({ t: BLOCK_TAGS[tag], c })
    return
  }
  if (hasBlockChild(node)) {
    // 未知的块级容器（section/article/…）→ 递归当块处理，保住段落切分
    for (const ch of node.childNodes) blockOf(ch, out, externalImages)
    return
  }
  // 行内标签出现在块级位置（如裸 <strong>）→ 包成一个段落
  const c = []
  for (const ch of node.childNodes) inlineOf(ch, c)
  if (!isBlankInline(c)) out.push({ t: 'p', c })
}

/** 图片节点：只接受本站上传（相对或本机绝对都归一化成相对路径） */
function imgNode(el, externalImages) {
  const raw = (el.getAttribute('src') || '').trim()
  if (!raw) return null
  const rel = toUploadRelativePath(raw)
  if (!rel) {
    if (externalImages) externalImages.push(raw)
    return null
  }
  const alt = (el.getAttribute('alt') || '').trim().slice(0, MAX_ALT_CHARS)
  return { t: 'img', src: rel, alt }
}

/** 链接协议白名单：只放行 http/https/mailto（等价于服务端规则） */
function safeHref(href) {
  if (!href || typeof href !== 'string') return null
  const h = href.trim()
  const colon = h.indexOf(':')
  if (colon <= 0) return null
  const scheme = h.slice(0, colon).toLowerCase()
  if (scheme === 'mailto') return h
  if ((scheme === 'http' || scheme === 'https') && h.slice(colon + 1, colon + 3) === '//') return h
  return null
}

/** 截断到单节点文本上限，避免整篇被服务端拒绝 */
function clip(text) {
  const s = text || ''
  return s.length <= MAX_TEXT_CHARS ? s : s.slice(0, MAX_TEXT_CHARS)
}

/* ==================== Doc → 纯文本 ==================== */

/** 抽取纯文本（图片以 [图片] 占位），用于摘要预览与"正文是否为空"判断 */
export function docToPlainText(doc) {
  if (!doc || !Array.isArray(doc.nodes)) return ''
  const parts = []
  const walk = (nodes) => {
    for (const n of nodes) {
      if (typeof n === 'string') { parts.push(n); continue }
      if (!n || typeof n !== 'object') continue
      if (n.t === 'img') { parts.push('[图片]'); continue }
      if (Array.isArray(n.c)) walk(n.c)
    }
  }
  walk(doc.nodes)
  return parts.join(' ').replace(/\s+/g, ' ').trim()
}

/* ==================== Doc → 渲染用行内片段 ==================== */

/**
 * 把行内节点摊平成"片段"数组，供渲染器用**一层 v-for** 输出（不需要递归组件）。
 * 每个片段 = { text, marks:['b','i'...], href }，链接与强调最终都落到 class 上。
 */
export function inlineToRuns(nodes) {
  const runs = []
  const walk = (list, marks, href) => {
    for (const n of list) {
      if (typeof n === 'string') {
        pushRun(runs, { text: n, marks, href })
        continue
      }
      if (!n || typeof n !== 'object') continue
      if (n.t === 'a') {
        walk(Array.isArray(n.c) ? n.c : [], marks, n.href)
        continue
      }
      if (n.t === 'img') {
        // 行内图片：当作一个独立片段交给渲染器（正常路径下图都是块级）
        pushRun(runs, { text: '', marks, href, img: n })
        continue
      }
      if (['b', 'i', 'u', 'code'].includes(n.t)) {
        walk(Array.isArray(n.c) ? n.c : [], marks.concat(n.t), href)
      }
    }
  }
  walk(nodes, [], null)
  return runs
}

/** 合并相邻的同类文本片段，减少 DOM 节点数 */
function pushRun(runs, run) {
  const last = runs[runs.length - 1]
  if (last && run.text && !run.img && !last.img
      && last.href === run.href
      && last.marks.join(',') === run.marks.join(',')) {
    last.text += run.text
    return
  }
  runs.push(run)
}
