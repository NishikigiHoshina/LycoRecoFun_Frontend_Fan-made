/**
 * 认证存储（方案 B）
 * - 真正的凭证 JWT 存在后端写入的 HttpOnly cookie（lycorecofun_token），JS 不可读；
 * - 前端只保存“非机密画像”（userId / status / username / avatar）于可读 cookie
 *   lycorecofun_profile，供守卫、抽屉、发帖/评论等展示与业务使用。
 * - 旧方案 localStorage 的 5 个认证 key 不再使用；写入/清空时顺带清理，避免残留。
 * - 视觉主题（lycorecofun-theme）仍走 localStorage，与本模块无关。
 */
const PROFILE_KEY = 'lycorecofun_profile';
const LEGACY_KEYS = ['token', 'userId', 'status', 'username', 'avatar'];

function encode(obj) {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))); }
  catch (e) { return ''; }
}
function decode(str) {
  try {
    const json = decodeURIComponent(escape(atob(str)));
    return JSON.parse(json) || {};
  } catch (e) { return {}; }
}
function readCookie() {
  const m = document.cookie.match('(?:^|; )' + PROFILE_KEY + '=([^;]*)');
  return m ? decode(m[1]) : {};
}
function writeCookie(obj, days) {
  const expires = days ? '; max-age=' + (days * 86400) : '; max-age=0';
  document.cookie = PROFILE_KEY + '=' + encode(obj) +
      '; path=/; SameSite=Lax' + expires;
}
function clearLegacy() {
  LEGACY_KEYS.forEach(k => window.localStorage.removeItem(k));
}

/** 登录/更新后保存画像；入参对齐后端返回（avater 后端拼写） */
export function setAuthProfile({ userId, username, avater, status } = {}) {
  writeCookie({ userId, username, avatar: avater, status }, 7);
  clearLegacy();
}

/** 清空（前端画像 cookie；HttpOnly token cookie 由后端 /logout 清） */
export function clearAuth() {
  writeCookie({}, 0);
  clearLegacy();
}

export function getProfile() {
  return readCookie();
}

export function isLoggedIn() {
  const p = readCookie();
  return !!(p.userId || p.username);
}

export function getUserId() {
  const v = readCookie().userId;
  return v === undefined || v === null ? '' : String(v);
}

export function getStatus() {
  const v = readCookie().status;
  return v === undefined || v === null ? '' : String(v);
}

export function getUserName() {
  return readCookie().username || '';
}

export function getAvatar() {
  return readCookie().avatar || '';
}
