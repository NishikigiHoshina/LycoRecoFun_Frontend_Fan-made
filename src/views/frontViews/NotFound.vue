<script>
export default {
  name: 'NotFound',
  computed: {
    // 供页面回显"你没找到的那个地址"，无路由信息时退回占位
    missedPath() {
      return this.$route.fullPath && this.$route.fullPath !== '/404'
          ? this.$route.fullPath
          : ''
    },
  },
  methods: {
    goHome() {
      this.$router.push('/Index/index')
    },
    goBack() {
      // 直接输错地址进来的没有上一页可回，退化为回首页
      if (window.history.length > 1) {
        this.$router.go(-1)
      } else {
        this.goHome()
      }
    },
  },
}
</script>

<template>
  <div class="nf">
    <div class="nf__box anim-rise">
      <p class="nf__code">
        <span class="nf__digit">4</span><span class="nf__digit nf__digit--accent">0</span><span class="nf__digit">4</span>
      </p>
      <h1 class="nf__title">页面走丢了</h1>
      <p class="nf__desc">你要找的页面不存在，或者已经被移走了。</p>
      <p v-if="missedPath" class="nf__path">{{ missedPath }}</p>
      <div class="nf__actions">
        <el-button type="primary" @click="goHome">返回首页</el-button>
        <el-button @click="goBack">返回上一页</el-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.nf {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  background: var(--color-bg);
}

.nf__box {
  text-align: center;
  max-width: 560px;
  padding: 56px 40px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 10px 40px rgba(0, 0, 0, .06);
}

/* 大号 404：衬线标题呼应全站设计层 */
.nf__code {
  margin: 0;
  font-family: var(--font-serif);
  font-size: 96px;
  line-height: 1;
  letter-spacing: .06em;
  color: var(--color-text);
}

.nf__digit--accent {
  color: var(--color-primary);
}

.nf__title {
  margin: 18px 0 8px;
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 600;
  color: var(--color-primary);
}

.nf__desc {
  margin: 0;
  font-size: 14px;
  color: var(--color-muted);
}

/* 回显错误地址：等宽感 + 静置青绿，悬停珊瑚（角色色政策） */
.nf__path {
  display: inline-block;
  margin: 16px 0 0;
  padding: 6px 12px;
  max-width: 100%;
  overflow-wrap: break-word;
  font-size: 13px;
  color: var(--color-secondary);
  background: var(--color-inset);
  border-left: 3px solid var(--color-secondary);
  transition: color .3s var(--ease-smooth), border-color .3s var(--ease-smooth);
}

.nf__path:hover {
  color: var(--color-primary);
  border-left-color: var(--color-primary);
}

.nf__actions {
  margin-top: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}
</style>
