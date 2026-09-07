<script>
export default {
  name: "Dashboard",
  data(){
    return{
      typeId:0
    }
  },
  methods:{
    jump(){
      this.$router.push('/homeDemo/One')
    },
    jumptwo(){
      this.$router.push({path:'/homeDemo/Two'})
    },
    jumptoValue(){
      this.$router.push({
        name: 'valueDemo',      // /homeDemo/value/:value
        params: { value: 39 }
      })
    },
    jumptocover(){
      this.$router.push({
        name: 'SiteHome'})      // /Index
    }
  },
  created() {
    this.typeId=this.$route.query.typeid
    console.log(this.$route.query.typeid)
  }
}
</script>

<template>
  <section>
    <!-- 页头 -->
    <header class="page-head">
      <h1 class="page-title">后台管理</h1>
      <p class="page-sub">一站式管理本站的帖子 · 用户 · 新闻 · 站内配置</p>
    </header>

    <!-- 管理模块入口 -->
    <div class="grid">
      <div class="mod-card mod--1">
        <div class="mod-top">
          <span class="mod-icon"><img src="../../img/post.png" alt="post"></span>
          <div class="mod-title">帖子管理</div>
        </div>
        <p class="mod-desc">审核、编辑与删除全站帖子</p>
        <router-link class="mod-go" to="/homeDemo/PostControl">前往管理 <i class="el-icon-arrow-right"></i></router-link>
      </div>

      <div class="mod-card mod--2">
        <div class="mod-top">
          <span class="mod-icon"><img src="../../img/user.png" alt="user"></span>
          <div class="mod-title">用户管理</div>
        </div>
        <p class="mod-desc">查看与维护注册用户资料</p>
        <router-link class="mod-go" to="/homeDemo/UserControl">前往管理 <i class="el-icon-arrow-right"></i></router-link>
      </div>

      <div class="mod-card mod--3">
        <div class="mod-top">
          <span class="mod-icon"><img src="../../img/news.png" alt="news"></span>
          <div class="mod-title">新闻管理</div>
        </div>
        <p class="mod-desc">维护首页近期新闻与轮播素材</p>
        <router-link class="mod-go" to="/homeDemo/NewsControl">前往管理 <i class="el-icon-arrow-right"></i></router-link>
      </div>

      <div class="mod-card mod--4">
        <div class="mod-top">
          <span class="mod-icon"><img src="../../img/site.png" alt="site"></span>
          <div class="mod-title">站内管理</div>
        </div>
        <p class="mod-desc">公告、宣传图与站点功能开关</p>
        <router-link class="mod-go" to="/homeDemo/SiteControl">前往管理 <i class="el-icon-arrow-right"></i></router-link>
      </div>
    </div>
  </section>
</template>

<style scoped>
.page-head {
  padding: 6px 2px 22px;
}
.page-title {
  font-family: var(--font-serif);
  font-size: 26px;
  color: var(--color-text);
  margin: 0 0 6px;
  display: inline-block;
  border-left: 4px solid var(--color-primary);
  padding-left: 14px;
}
.page-sub { color: var(--color-muted); font-size: 14px; margin: 0 0 0 18px; }

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.mod-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 14px;
  padding: 22px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  transition: transform .3s var(--ease-main), box-shadow .3s var(--ease-smooth);
}
.mod-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 16px 34px rgba(0, 0, 0, .1);
}
/* 顶部彩色条 */
.mod-card::before {
  content: '';
  position: absolute;
  left: 0; right: 0; top: 0;
  height: 4px;
}
.mod--1::before { background: var(--color-primary); }
.mod--2::before { background: var(--color-secondary); }
.mod--3::before { background: var(--color-deco-a); }
.mod--4::before { background: var(--color-deco-c); }

.mod-top { display: flex; align-items: center; gap: 14px; }
.mod-icon {
  width: 52px; height: 52px; flex: 0 0 52px;
  border-radius: 12px;
  display: flex; align-items: center; justify-content: center;
}
.mod--1 .mod-icon { background: rgba(240,85,90,.12); }
.mod--2 .mod-icon { background: rgba(0,180,170,.12); }
.mod--3 .mod-icon { background: rgba(42,150,250,.12); }
.mod--4 .mod-icon { background: rgba(122,86,104,.14); }
.mod-icon img { width: 30px; height: 30px; object-fit: contain; }
.mod-title {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 700;
  color: var(--color-text);
}
.mod-desc {
  color: var(--color-muted);
  font-size: 13px;
  margin: 12px 0 18px;
}
.mod-go {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  color: var(--color-secondary);
  font-size: 14px;
  font-weight: 600;
  text-decoration: none;
  transition: color .3s var(--ease-main), gap .3s var(--ease-main);
}
.mod-go:hover { color: var(--color-primary); gap: 10px; }
.mod-go i { font-size: 13px; }
</style>
