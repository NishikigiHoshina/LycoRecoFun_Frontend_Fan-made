<script setup>

</script>

<template>
  <div class="reply-list">
    <div v-if="replies.length" class="reply-list-inner">
      <div v-for="r in replies" :key="r.postid" class="reply-item">
        <div class="avatar">{{ initial(r.post_username) }}</div>
        <div class="reply-main">
          <div class="reply-head">
            <span class="name">{{ r.post_username || '匿名' }}</span>
            <time class="time">{{ fmt(r.created_at) }}</time>
          </div>
          <div class="cnt">{{ r.content }}</div>
        </div>
      </div>
    </div>
    <div v-else class="empty-reply">暂无回复喵</div>

    <Editor slim :topic-id="topicId" :parent-id="parent.postid" placeholder="写回复…" @publish="refresh" />
  </div>
</template>

<script>
import { getReply } from '@/api/comment'
import Editor from './Editor.vue'
export default {
  components: { Editor },
  props: ['parent', 'topicId'],
  data() {
    return { replies: [] }
  },
  created() {
    this.fetch()
  },
  methods: {
    async fetch() {
      // 楼中楼：查该评论下的回复，parent_id = 评论 id（不是帖子 id）
      this.replies = await getReply(this.parent.postid)
    },
    refresh() {
      this.fetch()
      this.$emit('publish')
    },
    initial(name) {
      const n = (name || '').trim()
      return n ? n.charAt(0).toUpperCase() : '?'
    },
    fmt(t) {
      // 2026-09-07T15:12:01.883 -> 2026-09-07 15:12
      if (!t) return ''
      const s = t.length > 16 ? t.slice(0, 16) : t
      return s.replace('T', ' ')
    }
  }
}
</script>

<style scoped>
.reply-list{
  margin-left: 42px;
  margin-top: 8px;
  padding: 10px 12px;
  background: var(--color-canvas);
  border-radius: 8px;
}
.reply-list-inner{ display: flex; flex-direction: column; gap: 12px; }
.reply-item{ display: flex; gap: 10px; }
.avatar{
  width: 28px; height: 28px; border-radius: 50%; flex-shrink: 0;
  background: linear-gradient(135deg, #667eea, #159ee6);
  color: #fff; font-size: 13px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
.reply-main{ flex: 1; min-width: 0; }
.reply-head{ display: flex; align-items: center; gap: 8px; margin-bottom: 2px; }
.name{ font-size: 13px; font-weight: 600; color: var(--color-secondary); }
.time{ font-size: 12px; color: #bbb; }
.cnt{ font-size: 14px; line-height: 1.6; color: var(--color-text); word-break: break-word; }
.empty-reply{ font-size: 13px; color: #bbb; padding: 4px 0; }
</style>
