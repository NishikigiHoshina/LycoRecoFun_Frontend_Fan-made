/**
 * 待上传图片登记处（延迟上传）。
 *
 * 背景：wangEditor 默认在用户**插入图片的那一刻**就把文件传到服务器。这有两个问题：
 *   1. 用户可能插了又删、或干脆没点"发表" —— 图片早已落盘，白占空间（孤儿文件）；
 *   2. 上传是服务端副作用，却发生在"编辑"这个高频、可撤销的阶段。
 *
 * 做法：插入时只把 File 攥在内存里，给编辑器一个 `blob:` 本地预览地址；真正的上传发生在
 * 提交帖子时（由 WritePost 统一处理），并且上传结果按 blob 地址缓存，提交失败重试不会重复上传。
 *
 * 登记项只存在于会话内存中（blob 地址与 File 都是页面级对象），页面销毁即失效 —— 这正是想要的语义。
 */

/** blob 预览地址 → File */
const pending = new Map()

/** 登记一个待上传文件，返回可放进 `<img src>` 的本地预览地址 */
export function registerPending(file) {
  const url = URL.createObjectURL(file)
  pending.set(url, file)
  return url
}

/** 取回文件。**不删除**：提交失败后用户可能重试，删了就取不到了 */
export function getPending(blobUrl) {
  return pending.get(blobUrl) || null
}

/** 释放单个：撤销 blob 地址并移除登记 */
export function releasePending(blobUrl) {
  if (pending.has(blobUrl)) {
    URL.revokeObjectURL(blobUrl)
    pending.delete(blobUrl)
  }
}

/** 清空全部（编辑器销毁时调用，回收 blob 内存） */
export function clearPending() {
  for (const url of pending.keys()) {
    URL.revokeObjectURL(url)
  }
  pending.clear()
}

/** 从编辑器 HTML 里找出所有待上传图片的地址（`src="blob:…"`） */
export function extractPendingSrcs(html) {
  if (!html || typeof html !== 'string') return []
  const out = []
  const re = /src=["'](blob:[^"']+)["']/gi
  let m
  while ((m = re.exec(html)) !== null) {
    if (!out.includes(m[1])) out.push(m[1])
  }
  return out
}

/**
 * 按映射替换 HTML 里的地址（上传后把 blob 地址换成本站相对路径）。
 *
 * blob 地址只由 URL 安全字符组成（无引号、无 `&`），所以用字符串 split/join 就够了 ——
 * 反而比构造正则更稳：正则需要转义，漏转义就会静默漏替换。
 */
export function replaceSrcs(html, map) {
  if (!html) return html
  let out = html
  for (const from of Object.keys(map)) {
    out = out.split(from).join(map[from])
  }
  return out
}
