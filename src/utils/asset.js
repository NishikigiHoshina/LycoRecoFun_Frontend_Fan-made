/**
 * 静态资源地址解析。
 *
 * 后端上传接口返回并落库的是**相对 URL**（如 `/upload/post/xxx.png`）——正文里存相对路径，
 * 换域名/部署环境时不会失效，渲染时在这里补上后端 origin。
 *
 * 允许的路径前缀与后端 `lycorisfun.upload.types[*].urlPath` 对应；渲染前再校验一次前缀，
 * 是防止"有人直接改库塞入外链图片"的纵深防御（写入时后端已用同一规则把关）。
 */

/** 后端 origin：从 axios 的 baseURL 去掉结尾的 /api */
export const API_ORIGIN = (process.env.VUE_APP_BASE_API || 'http://localhost:12808/lycorisfunServer/api')
    .replace(/\/api\/?$/, '')

/** 允许出现在正文里的图片路径前缀（与后端上传类型配置保持一致） */
export const UPLOAD_PREFIXES = ['/upload']

/** src 是否指向本站上传目录 */
export function isUploadPath(path) {
  if (!path || typeof path !== 'string') return false
  return UPLOAD_PREFIXES.some(p => path.startsWith(p))
}

/** 相对上传路径 → 可直接给 <img src> 的绝对地址 */
export function resolveAssetUrl(path) {
  if (!path || typeof path !== 'string') return ''
  if (/^https?:\/\//i.test(path)) return path    // 已是绝对地址（历史数据里存在这种）
  if (path.startsWith('/')) return API_ORIGIN + path
  return path
}

/**
 * 绝对地址 → 本站上传相对路径；不是本站上传则返回空串。
 *
 * 编辑器里图片需要绝对地址才能预览（编辑器页面在 :8080，后端在 :12808），
 * 但**落库的文档一律存相对路径**（换域名不失效）。转换时用这个函数归一化回去。
 */
export function toUploadRelativePath(src) {
  if (!src || typeof src !== 'string') return ''
  if (isUploadPath(src)) return src                       // 本来就是相对路径
  if (src.startsWith(API_ORIGIN)) {
    const rel = src.slice(API_ORIGIN.length)
    return isUploadPath(rel) ? rel : ''
  }
  return ''
}

/**
 * 正文内图片的安全解析：只接受本站上传路径或 http(s) 绝对地址，
 * 其余（data:、javascript:、blob: 等）一律返回空串，调用方据此跳过该图。
 */
export function resolveDocImage(src) {
  if (!isUploadPath(src)) return ''
  return resolveAssetUrl(src)
}
