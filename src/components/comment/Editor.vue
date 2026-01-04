<script setup>

</script>

<template>
  <div :class="['editor-box', { slim }]">
    <el-input
        type="textarea"
        :rows="slim ? 1 : 2"
        :placeholder="placeholder"
        v-model="txt"
    />
    <el-button
        type="primary"
        size="mini"
        style="margin-top:6px"
        :loading="loading"
        @click="submit"
    >发送</el-button>
  </div>
</template>

<script>
import { addComment } from '@/api/comment'
export default {
  props: {
    topicId: [String, Number],
    parentId: [String, Number],
    placeholder: { type: String, default: '写评论…' },
    slim: Boolean
  },
  data() {
    return { txt: '', loading: false }
  },
  methods: {
    async submit() {
      if (!this.txt.trim()) return
      this.loading = true
      await addComment({
        parent_id: this.parentId,
        root_id: this.topicId,
        post_userid: +localStorage.getItem('userid'),
        content: this.txt.trim(),
      })
      this.txt = ''
      this.loading = false
      this.$emit('publish')
    }
  }
}
</script>

<style scoped>
.editor-box { padding: 8px 0; }
.slim .el-textarea__inner { resize: none; }
</style>