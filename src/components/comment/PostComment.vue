<script setup>

</script>

<template>
  <div class="post-comment">
    <!-- 发评论 -->
    <div class="comment-editor">
      <el-input
          type="textarea"
          :rows="3"
          placeholder="写点什么…"
          v-model="editor.content"
      />
      <el-button
          type="primary"
          size="small"
          style="margin-top:8px"
          :loading="editor.loading"
          @click="submitComment"
      >发表</el-button>
    </div>

    <!-- 评论列表 -->
    <div v-if="total" class="comment-list">
      <div class="list-header">{{ total }} 条评论</div>
      <div
          v-for="item in list"
          :key="item.postid"
          class="comment-item"
      >
        <img class="avatar" :src="item.imgurl" />
        <div class="right-box">
          <div class="username">{{ item.post_username }}</div>  <!-- 下划线 -->
          <div class="content">{{ item.content }}</div>
          <div class="footer">
            <time>{{ item.created_at | formatTime }}</time>
            <el-button type="text" @click="toggleReply(item)">
              回复 <span v-if="item.reply_count">({{ item.reply_count }})</span>
            </el-button>
            <like-btn :id="item.postid" :count="item.like_count" />
          </div>

          <reply-list
              v-if="item.showReply"
              :parent="item"
              :topic-id="postId"
              @publish="refresh"
          />
        </div>
      </div>

      <!-- 加载更多 -->
      <div v-if="hasMore" class="load-more" @click="loadMore">加载更多</div>
    </div>

    <!-- 空态 -->
    <div v-else class="empty">
      <h3>暂无评论</h3>
    </div>
  </div>
</template>

<script>
import { getReply, addComment } from '@/api/comment'
import LikeBtn from './LikeBtn.vue'
import ReplyList from './ReplyList.vue'

export default {
  name: 'PostComment',
  components: { LikeBtn, ReplyList },
  props: {
    postId: { type: [String, Number], required: true }
  },
  data() {
    return {
      list: [],
      total: 0,
      page: 1,
      editor: { content: '', loading: false }
    }
  },
  computed: {
    hasMore() {
      return this.total > this.list.length
    }
  },
  created() {
    this.fetchComments(1)
  },
  methods: {
    async fetchComments() {
      const list = await getReply(this.postId)  // 已经驼峰化
      console.log('【getReply 返回值】', list)   // ← 看这里
      this.list = list
      this.total = list.length
    },
    async submitComment() {
      if (!this.editor.content.trim()) return
      this.editor.loading = true
      await addComment({
        parent_id: this.postId,      // 后端实体字段 parent_id
        root_id: this.postId,        // root_id
        post_userid: +localStorage.getItem('userId'), // 非空
        content: this.editor.content.trim(),
        // 其余允许为空的字段不传
      })
      this.editor.content = ''
      this.editor.loading = false
      this.$message.success('发表成功')
      this.refresh()
    },
    toggleReply(item) {
      this.$set(item, 'showReply', !item.showReply)
      if (item.showReply && !item.replies) this.$set(item, 'replies', [])
    },
    refresh() {
      this.fetchComments(1)
    },
    loadMore() {
      this.fetchComments(this.page + 1)
    }
  },
  filters: {
    formatTime(t) {
      return t // 可换成 dayjs 格式化
    }
  }
}
</script>

<style scoped>
.post-comment { padding: 12px 0; }
.comment-editor { margin-bottom: 16px; }
.list-header { font-size: 14px; color: #999; margin-bottom: 12px; }
.comment-item { display: flex; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
.avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; }
.right-box { flex: 1; }
.username { font-size: 14px; color: var(--color-secondary); margin-bottom: 4px; }
.content { font-size: 14px; line-height: 1.6; }
.footer { font-size: 12px; color: #999; margin-top: 6px; }
.load-more { text-align: center; padding: 10px; color: var(--color-secondary); cursor: pointer; }
.load-more:hover { color: var(--color-primary); }
.empty { text-align: center; padding: 50px; color: var(--color-muted); }
</style>