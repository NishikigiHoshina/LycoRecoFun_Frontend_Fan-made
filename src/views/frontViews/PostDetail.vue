<script >
import axios from "axios";
import PostComment from '@/components/comment/PostComment.vue'
export default {
  name:'posts',
  components: { PostComment },
  data(){
    return{
      postid:this.$route.params.id,
      post: null,
      contentlist:[],
    }
  },
  computed:{
    // 作者首字母头像（post 实体无头像字段，用首字母生成）
    avatarInitial(){
      const n = this.post && this.post.post_username;
      return (n && n.trim()) ? n.trim().charAt(0).toUpperCase() : '?';
    }
  },
  created() {

  },
  mounted() {
    axios({
      method: 'post',
      url: 'http://localhost:12808/lycorisfunServer/api/getPostByid',
      params: { postid: this.postid }
    }).then((res)=>{
      this.post=res.data;
    })
  },
  watch: {
  },
  methods:{
    back(){
      this.$router.go(-1);
    }
  },
}
</script>

<template>
  <div class="posts-page">
    <el-row>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
      <el-col :span="20">
        <div class="card-main">
          <!-- 居中阅读列 -->
          <div class="post-container">
            <!-- 顶部工具栏 -->
            <div class="topbar">
              <el-button icon="el-icon-arrow-left" @click="back" size="small" plain>返回</el-button>
            </div>

            <!-- 文章卡 -->
            <article v-if="post" class="article-card">
              <header class="article-header">
                <h1 class="title">{{ post.title }}</h1>
                <div class="meta">
                  <div class="author">
                    <div class="author-avatar">{{ avatarInitial }}</div>
                    <div class="author-info">
                      <span class="author-name">{{ post.post_username || '匿名' }}</span>
                      <span class="post-date">{{ post.created_at }}</span>
                    </div>
                  </div>
                  <div v-if="post.tag && post.tag.length" class="tags">
                    <el-tag v-for="(t,i) in post.tag" :key="i" size="mini" effect="plain">{{ t }}</el-tag>
                  </div>
                </div>
              </header>

              <!-- 正文（富文本） -->
              <div class="article-body rich-content" v-html="post.content"></div>

              <!-- 附图 -->
              <div v-if="post.imgurl" class="article-image">
                <img :src="post.imgurl" alt="附图"/>
              </div>

              <!-- 相关链接 -->
              <div v-if="post.link && post.link !== '#/'" class="article-link">
                <a :href="post.link" target="_blank" rel="noopener">
                  <i class="el-icon-link"></i> 相关链接
                </a>
              </div>

              <!-- 底部统计条 -->
              <footer class="article-footer">
                <div class="stat">
                  <i class="el-icon-star-off"></i>
                  <span>{{ post.like_count || 0 }} 点赞</span>
                </div>
                <div class="stat">
                  <i class="el-icon-chat-dot-square"></i>
                  <span>{{ post.reply_count || 0 }} 回复</span>
                </div>
              </footer>
            </article>

            <!-- 帖子不存在 -->
            <div v-else class="empty-state">
              <i class="el-icon-document"></i>
              <p>帖子不存在或已被删除喵</p>
              <el-button type="primary" size="small" @click="back">返回</el-button>
            </div>

            <!-- 评论区 -->
            <div class="comment-section">
              <div class="section-title">
                <span class="bar"></span>
                <h2>评论区</h2>
              </div>
              <post-comment :post-id="postid" />
            </div>
          </div>
        </div>
      </el-col>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.posts-page{ padding: 10px 0; }

/* 外层卡：白表面 + 细边 + 投影 */
.card-main{
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  padding: 24px;
  border-radius: 15px;
  margin: 1vh;
  min-height: 500px;
}

/* 居中阅读列：长文专注阅读 */
.post-container{
  max-width: 860px;
  margin: 0 auto;
}

.topbar{
  margin-bottom: 16px;
}

/* 文章白卡 */
.article-card{
  background: var(--color-surface);
  border-radius: 14px;
  padding: 36px 40px;
  box-shadow: 0 4px 18px rgba(0, 0, 0, 0.06);
}

.article-header{ margin-bottom: 20px; }
.title{
  font-size: 30px;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.4;
  margin-bottom: 16px;
}
.meta{
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-canvas);
}
.author{ display: flex; align-items: center; gap: 12px; }
.author-avatar{
  width: 42px; height: 42px; border-radius: 50%;
  background: linear-gradient(135deg, var(--color-secondary) 0%, var(--color-deco-a) 100%);
  color: #fff; font-size: 18px; font-weight: 600;
  display: flex; align-items: center; justify-content: center;
}
.author-info{ display: flex; flex-direction: column; gap: 2px; }
.author-name{ font-size: 15px; font-weight: 600; color: var(--color-secondary); }
.post-date{ font-size: 13px; color: var(--color-muted); }
.tags{ display: flex; gap: 6px; flex-wrap: wrap; }
.tags .el-tag{
  background: transparent;
  color: var(--color-secondary);
  border-color: var(--color-secondary);
  transition: background .3s var(--ease-main), color .3s var(--ease-main), border-color .3s var(--ease-main);
}
.tags .el-tag:hover{
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

/* 正文 */
.article-body{
  font-size: 16px;
  line-height: 1.85;
  color: var(--color-text);
  margin: 20px 0;
  word-break: break-word;
}
.article-body::v-deep img{ max-width: 100%; height: auto; border-radius: 6px; }
.article-body::v-deep p{ margin: 0 0 1em; }
.article-body::v-deep a{ color: var(--color-secondary); }
.article-body::v-deep a:hover{ color: var(--color-primary); }

.article-image{
  margin: 20px 0;
  text-align: center;
}
.article-image img{
  max-width: 100%;
  max-height: 520px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.08);
}

.article-link{ margin: 16px 0; }
.article-link a{
  color: var(--color-secondary); text-decoration: none; font-size: 14px;
}
.article-link a:hover{ color: var(--color-primary); text-decoration: underline; }

/* 底部统计 */
.article-footer{
  display: flex;
  gap: 24px;
  padding-top: 18px;
  margin-top: 8px;
  border-top: 1px solid var(--color-canvas);
}
.stat{
  display: flex; align-items: center; gap: 6px;
  font-size: 14px; color: var(--color-muted);
}
.stat i{ font-size: 16px; }

/* 空态 */
.empty-state{
  text-align: center;
  padding: 80px 20px;
  color: var(--color-muted);
}
.empty-state i{ font-size: 48px; color: var(--color-muted); }
.empty-state p{ margin: 12px 0 20px; font-size: 15px; }

/* 评论区 */
.comment-section{
  margin-top: 24px;
  background: var(--color-surface);
  border-radius: 14px;
  padding: 24px 28px;
  box-shadow: 0 4px 18px rgba(0,0,0,0.06);
}
.section-title{
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 16px;
}
.section-title .bar{
  width: 4px; height: 18px; border-radius: 2px;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-primary));
}
.section-title h2{ font-size: 18px; color: var(--color-text); }

/* 移动端适配 */
@media (max-width: 768px){
  .article-card{ padding: 20px; }
  .comment-section{ padding: 18px; }
  .title{ font-size: 24px; }
  .meta{ flex-direction: column; align-items: flex-start; }
}
</style>
