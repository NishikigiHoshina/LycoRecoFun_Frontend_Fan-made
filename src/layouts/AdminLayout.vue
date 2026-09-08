<!-- 后台布局 · lycoris 后台外壳（视觉重构，导航/守卫语义不变） -->
<template>
  <div class="layout">
    <!-- 左侧导航栏 -->
    <aside :class="['side-nav', { collapsed }]">
      <!-- 品牌 -->
      <div class="side-brand">
        <span class="brand-name">管理后台</span>
      </div>

      <!-- 导航 -->
      <nav class="navlist">
        <router-link to="/homeDemo/index" class="nav-link">
          <span class="nav-label">首页</span>
        </router-link>
        <router-link to="/homeDemo/PostControl" class="nav-link">
          <span class="nav-label">帖子管理</span>
        </router-link>
        <router-link to="/homeDemo/UserControl" class="nav-link">
          <span class="nav-label">用户管理</span>
        </router-link>
        <router-link to="/homeDemo/NewsControl" class="nav-link">
          <span class="nav-label">新闻管理</span>
        </router-link>
        <router-link to="/homeDemo/SiteControl" class="nav-link">
          <span class="nav-label">站内管理</span>
        </router-link>

        <div class="nav-divider"></div>

        <router-link to="/Index/index" class="nav-link nav-back">
          <span class="nav-label">返回前台</span>
        </router-link>
      </nav>

      <!-- 折叠开关 -->
      <button class="nav-toggle" @click="collapsed = !collapsed">
        <span class="toggle-bar" :class="{ back: collapsed }"></span>
      </button>
    </aside>

    <!-- 右侧主体 -->
    <div class="main-area">
      <!-- 顶栏 -->
      <header class="top-bar">
        <div class="crumb">
          <span class="crumb-flag">LYCORIS</span>
          <span class="crumb-slash">/</span>
          <span class="crumb-title">管理控制台</span>
        </div>
        <div class="top-right">
          <span class="status-dot"></span>
          <span>管理员在线</span>
        </div>
      </header>

      <!-- 内容区 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script>
import { getStatus, isLoggedIn } from '@/utils/auth';

export default {
  name: 'AdminLayout',
  data() {
    return { collapsed: false };
  },
  beforeRouteEnter(to, from, next) {
    if (!isLoggedIn()) next('/Login');
    else if (getStatus() !== '3') next('/Index/index');
    else next();
  },
};
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  background: var(--color-canvas);
}

/* ===== 左侧导航栏 ===== */
.side-nav {
  width: 236px;
  flex-shrink: 0;
  background: var(--color-surface);
  border-right: 1px solid var(--color-border);
  display: flex;
  flex-direction: column;
  height: 100vh;
  position: sticky;
  top: 0;
  transition: width .3s var(--ease-sharp);
  overflow: hidden;
}
.side-nav.collapsed { width: 78px; }

.side-brand {
  height: 72px;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 0 22px;
  border-bottom: 1px solid var(--color-border);
}
.brand-name {
  font-family: var(--font-serif);
  font-weight: 700;
  font-size: 18px;
  letter-spacing: .08em;
  white-space: nowrap;
  color: var(--color-text);
}
.side-nav.collapsed .brand-name,
.side-nav.collapsed .nav-label,
.side-nav.collapsed .nav-divider { display: none; }
.side-nav.collapsed .side-brand { display: none; }

.navlist {
  flex: 1;
  overflow-y: auto;
  padding: 16px 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 13px;
  padding: 12px 14px;
  border-radius: 10px;
  color: var(--color-text);
  text-decoration: none;
  font-size: 14px;
  white-space: nowrap;
  position: relative;
  transition: background .3s var(--ease-smooth), color .3s var(--ease-smooth);
}
/* 导航圆点（区分层级色彩） */
.nav-link::before {
  content: '';
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-deco-a);
  flex-shrink: 0;
  transition: transform .3s var(--ease-main), box-shadow .3s var(--ease-smooth);
}
.nav-link:nth-of-type(1)::before { background: var(--color-primary); }
.nav-link:nth-of-type(2)::before { background: var(--color-secondary); }
.nav-link:nth-of-type(3)::before { background: var(--color-deco-a); }
.nav-link:nth-of-type(4)::before { background: var(--color-deco-b); }
.nav-link:nth-of-type(5)::before { background: var(--color-deco-c); }
.nav-back::before { background: var(--color-muted); }

.nav-link:hover { background: var(--color-surface)4f4; color: var(--color-primary); }
.nav-link:hover::before { transform: scale(1.3); }

/* 激活态：浅红渐变 + 珊瑚字 + 左侧强调条 */
.nav-link.router-link-active {
  background: linear-gradient(90deg, rgba(240, 85, 90, .12), transparent 85%);
  color: var(--color-primary);
  font-weight: 600;
}
.nav-link.router-link-active::after {
  content: '';
  position: absolute;
  left: 0;
  top: 22%;
  bottom: 22%;
  width: 3px;
  border-radius: 3px;
  background: var(--color-primary);
}
.nav-link.router-link-active::before {
  transform: scale(1.35);
  box-shadow: 0 0 0 4px rgba(240, 85, 90, .14);
}

.side-nav.collapsed .nav-link { justify-content: center; padding: 12px 0; }

.nav-divider { height: 1px; background: var(--color-border); margin: 8px 6px; }
.nav-back.router-link-active::before,
.nav-back.router-link-active { background: none; }
.nav-back.router-link-exact-active { color: var(--color-secondary); font-weight: 400; }

/* 底部折叠钮 */
.nav-toggle {
  border: none;
  background: transparent;
  cursor: pointer;
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top: 1px solid var(--color-border);
}
.toggle-bar {
  position: relative;
  width: 18px;
  height: 2px;
  background: var(--color-muted);
  border-radius: 2px;
  transition: background .3s;
}
.toggle-bar::before,
.toggle-bar::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-muted);
  border-radius: 2px;
}
.toggle-bar::before { top: -6px; }
.toggle-bar::after { top: 6px; }
.nav-toggle:hover .toggle-bar,
.nav-toggle:hover .toggle-bar::before,
.nav-toggle:hover .toggle-bar::after { background: var(--color-primary); }
/* 折叠态箭头回指 */
.toggle-bar.back::before { transform: translateX(-2px); }
.toggle-bar.back::after { transform: translateX(-2px); }

/* ===== 右侧主体 ===== */
.main-area {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.top-bar {
  height: 64px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px;
  position: sticky;
  top: 0;
  z-index: 5;
}
.crumb { display: flex; align-items: center; gap: 10px; }
.crumb-flag {
  font-family: var(--font-serif);
  font-weight: 900;
  letter-spacing: .22em;
  font-size: 15px;
  color: var(--color-primary);
}
.crumb-slash { color: var(--color-muted); }
.crumb-title {
  font-family: var(--font-serif);
  font-size: 15px;
  color: var(--color-text);
}
.top-right {
  display: flex;
  align-items: center;
  gap: 9px;
  font-size: 13px;
  color: var(--color-muted);
}
.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--color-secondary);
  box-shadow: 0 0 0 4px rgba(0, 180, 170, .18);
}

.content {
  flex: 1;
  padding: 22px 26px;
  overflow: auto;
  min-height: 0;
  background: var(--color-canvas);
}

/* 窄屏收起 */
@media (max-width: 768px) {
  .side-nav { width: 64px; }
  .side-nav .brand-name, .side-nav .nav-label, .side-nav .nav-divider { display: none; }
  .side-nav .side-brand { justify-content: center; padding: 0; }
  .side-nav .nav-link { justify-content: center; padding: 12px 0; }
}
</style>
