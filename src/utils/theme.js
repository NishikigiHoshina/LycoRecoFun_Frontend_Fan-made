/**
 * 主题工具：浅色/深色
 * 存 localStorage，键带网站前缀以区分：lycorecofun-theme
 * 主题以 <html data-theme="light|dark"> 驱动 CSS 变量切换
 */
const KEY = 'lycorecofun-theme';

export function getMode() {
  const m = localStorage.getItem(KEY);
  return m === 'dark' ? 'dark' : 'light';
}

export function applyMode(mode) {
  const m = mode === 'dark' ? 'dark' : 'light';
  localStorage.setItem(KEY, m);
  document.documentElement.setAttribute('data-theme', m);
  return m;
}

export function initTheme() {
  return applyMode(getMode());
}

export function toggleMode() {
  return applyMode(getMode() === 'dark' ? 'light' : 'dark');
}
