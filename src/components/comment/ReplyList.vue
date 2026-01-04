<script setup>

</script>

<template>
  <div class="reply-list">
    <div v-for="r in replies" :key="r.postid" class="reply-item">
      <span class="name">{{ r.post_username }}：</span>
      <span class="cnt">{{ r.content }}</span>
      <time>{{ r.created_at | formatTime }}</time>
    </div>
    <Editor
        slim
        :topic-id="topicId"
        :parent-id="parent.postid"
        placeholder="写回复…"
        @publish="refresh"
    />
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
      this.replies = await getReply(this.topicId, this.parent.postid)
    },
    refresh() {
      this.fetch()
      this.$emit('publish')
    }
  }
}
</script>

<style scoped>
.reply-list { margin-left: 42px; padding: 8px 0; background: #cff3f3; border-radius: 4px; }
.reply-item { font-size: 13px; padding: 2px 0; }
.name { color: #576b95; }
time { color: #999; font-size: 12px; margin-left: 6px; }
</style>