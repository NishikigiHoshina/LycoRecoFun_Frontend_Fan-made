<template>
  <div id="app">
<!--    根壳-->
    <router-view/>

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
import './Dev-tools-detect-index.js';   // 只触发一次，挂 window.devtools
</script>