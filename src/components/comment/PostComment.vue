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
import { getUserId } from '@/utils/auth'
import { warnIfUnsupported } from '@/utils/validate'
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
      allList: [],        // 后端一次返回该帖全部顶级评论
      list: [],           // 当前已展开的切片（模板渲染这个）
      page: 1,            // 已展开到第几页
      pageSize: 10,
      editor: { content: '', loading: false }
    }
  },
  computed: {
    total() {
      return this.allList.length
    },
    hasMore() {
      return this.list.length < this.allList.length
    }
  },
  created() {
    this.fetchComments()
  },
  methods: {
    /* 拉取该帖全部顶级评论并重置回第一页。
       后端 /getReply 是"一次返回全部"，并不支持分页参数，所以此处不能在服务端分页：
       旧实现把 total 直接设成 list.length，使 hasMore 恒为 false，"加载更多"永远不可见。
       改为一次取全、客户端按 page/pageSize 逐步展开。 */
    async fetchComments() {
      try {
        const list = await getReply(this.postId)
        this.allList = list || []
      } catch (e) {
        // 失败原因已由 utils/request.js 统一弹窗提示，这里只记录并清空
        console.warn('[PostComment] 获取评论失败:', e)
        this.allList = []
      }
      this.page = 1
      this.applyPage()
    },
    /* 按 page/pageSize 从完整列表切出当前可见部分 */
    applyPage() {
      this.list = this.allList.slice(0, this.page * this.pageSize)
    },
    async submitComment() {
      if (!this.editor.content.trim()) return
      if (warnIfUnsupported(this, [{ name: '评论内容', value: this.editor.content }])) return
      this.editor.loading = true
      await addComment({
        parent_id: this.postId,      // 后端实体字段 parent_id
        root_id: this.postId,        // root_id
        post_userid: +getUserId(), // 非空
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
      this.fetchComments()
    },
    /* 完整列表已在内存里，加载更多只需扩大切片，无需再请求 */
    loadMore() {
      this.page += 1
      this.applyPage()
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
.list-header { font-size: 14px; color: var(--color-muted); margin-bottom: 12px; }
.comment-item { display: flex; padding: 10px 0; border-bottom: 1px solid #f5f5f5; }
.avatar { width: 32px; height: 32px; border-radius: 50%; margin-right: 10px; }
.right-box { flex: 1; }
.username { font-size: 14px; color: var(--color-secondary); margin-bottom: 4px; }
.content { font-size: 14px; line-height: 1.6; }
.footer { font-size: 12px; color: var(--color-muted); margin-top: 6px; }
.load-more { text-align: center; padding: 10px; color: var(--color-secondary); cursor: pointer; }
.load-more:hover { color: var(--color-primary); }
.empty { text-align: center; padding: 50px; color: var(--color-muted); }
</style>