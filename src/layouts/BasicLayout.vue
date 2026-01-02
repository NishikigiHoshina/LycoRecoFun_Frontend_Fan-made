<!-- src/layouts/BasicLayout.vue -->
<template>
  <div class="layout">
    <!-- 左侧导航 -->
    <aside :class="['side-nav', { collapsed }]">
      <button class="toggle" @click="collapsed = !collapsed">
        {{ collapsed ? '▶' : '◀' }}
      </button>
      <nav v-show="!collapsed">
        <router-link to="/homeDemo/index">首页</router-link>
        <router-link to="/homeDemo/PostControl">帖子管理</router-link>
        <router-link to="/homeDemo/UserControl">用户管理</router-link>
        <router-link to="/homeDemo/NewsControl">新闻管理</router-link>
        <router-link to="/homeDemo/SiteControl">站内管理</router-link>
        <router-link to="/Index/index">返回前台</router-link>
      </nav>
    </aside>

    <!-- 右侧主体 -->
    <div class="main-area">
      <!-- 顶部标题栏 -->
      <header class="top-bar">
        <span class="title">Welcome</span>
      </header>

      <!-- 子页面 -->
      <main class="content">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const collapsed = ref(false)

</script>
<script>
export default {
  name: 'homeLayout',
  beforeRouteEnter(to, from, next){
    let token =localStorage.getItem('token');
    if(!token)next('/Login');
    else next()
  }
}
</script>

<style scoped>
/* 整体左右布局 */
.layout {
  height: 100vh;
  display: flex;
  overflow: hidden;
}

/* 左侧导航 10vh 宽 */
.side-nav {
  width: 25vh;
  background: #304156;
  color: #bfcbd9;
  display: flex;
  flex-direction: column;
  align-items: center;
  transition: width 0.3s;
}
.side-nav.collapsed {
  width: 60px;
}
.toggle {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  margin: 8px 0;
}
nav {
  display: flex;
  flex-direction: column;
  width: 100%;
}
nav a {
  padding: 10px 0;
  text-align: center;
  color: inherit;
  text-decoration: none;
}
nav a.router-link-active {
  background: #263445;
}

/* 右侧主体 = 标题栏 + 内容区 */
.main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
}

/* 顶部标题栏 5vh */
.top-bar {
  height: 5vh;
  background: rgba(232, 121, 217, 0.8);
  color: #fff;
  display: flex;
  align-items: center;
  padding: 0 16px;
}
.title {
  font-size: 18px;
  font-weight: bold;
}

/* 内容区占剩余高度 */
.content {
  flex: 1;
  padding: 16px;
  background: #f5f7fa;
  overflow: auto;
}
</style>