<template>
  <el-button type="text" @click="$message('点赞功能稍后开放')">
    <i class="el-icon-thumb" /> {{ count }}
  </el-button>
</template>

<script>
export default {
  props: ['id', 'count']
}
</script>

<style scoped>

</style>