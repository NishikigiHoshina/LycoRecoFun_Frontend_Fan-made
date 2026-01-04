<script setup>

</script>

<template>
  <el-button type="text" @click="$message('点赞功能稍后开放')">
    <i class="el-icon-thumb" /> {{ count }}
  </el-button>
</template>

<script>
import { likePost } from '@/api/comment'
export default {
  props: ['id', 'count'],
  methods: {
    async like() {
      await likePost(this.id)
      this.$emit('refresh')
    }
  }
}
</script>

<style scoped>

</style>