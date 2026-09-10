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
import { getUserId } from '@/utils/auth'
import { warnIfUnsupported } from '@/utils/validate'
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
      if (warnIfUnsupported(this, [{ name: '回复内容', value: this.txt }])) return
      this.loading = true
      try {
        await addComment({
          parent_id: this.parentId,
          root_id: this.topicId,
          post_userid: +getUserId(),
          content: this.txt.trim(),
        })
        this.txt = ''
        this.$emit('publish')
      } catch (e) {
        // 失败原因已由 utils/request.js 拦截器统一弹窗提示，此处不重复提示，
        // 只记录日志；关键是 finally 一定复位 loading，避免按钮卡在转圈状态。
        console.warn('[Editor] 发送回复失败:', e)
      } finally {
        this.loading = false
      }
    }
  }
}
</script>

<style scoped>
.editor-box { padding: 8px 0; }
.slim .el-textarea__inner { resize: none; }
</style>