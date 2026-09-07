<template>
  <div id="app">
    <router-view/>

    <!-- 全局主题切换（深色/浅色） -->
    <button
      type="button"
      class="theme-fab"
      :title="isDark ? '切换为浅色' : '切换为深色'"
      :aria-label="isDark ? '浅色模式' : '深色模式'"
      @click="switchTheme"
    >
      {{ isDark ? '☀' : '☾' }}
    </button>
  </div>
</template>

<style>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
</style>
<script setup lang="ts">
import { ref } from 'vue';
import './Dev-tools-detect-index.js';   // 只触发一次，挂 window.devtools
import { getMode, toggleMode } from './utils/theme';

// 主题初始化放在 main.js（应用最早期）；此处再同步一次状态
const isDark = ref(getMode() === 'dark');

function switchTheme() {
  isDark.value = toggleMode() === 'dark';
}
</script>
