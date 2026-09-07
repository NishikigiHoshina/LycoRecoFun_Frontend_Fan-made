<script>
import axios from "axios";
export default {
  name:'Plaza',
  data(){
    return{
      activeIndex: '1',
      postinfo:null,
      input:null,
      // 分页相关
      currentPage: 1,
      pageSize: 10,
      total: 0,
      searchMode: false,   // 搜索时不走分页
      loading: false,
    }
  },
  mounted() {
    this.fetchPage();
  },
  methods:{
    // 分页查询：拉取当前页帖子
    fetchPage(){
      this.loading = true;
      axios.post("http://localhost:12808/lycorisfunServer/api/postlistPage", null, {
        params: { page: this.currentPage, size: this.pageSize }
      }).then((res)=>{
        const d = res.data || {};
        this.postinfo = d.list || [];
        this.total = d.total || 0;
      }).catch((err)=>{
        console.log("出错了喵"+err);
        this.postinfo = [];
        this.total = 0;
      }).finally(()=>{
        this.loading = false;
      });
    },
    // 翻页
    handlePageChange(page){
      this.currentPage = page;
      this.fetchPage();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    // 搜索：进入搜索模式，结果不参与分页
    searchPost(){
      if(this.input){
        this.searchMode = true;
        axios({
          method:'post',
          url:'http://localhost:12808/lycorisfunServer/api/searchBytitle',
          params: { title: this.input }
        }).then((res)=>{
          this.postinfo = res.data || [];   // 直接拿数组
          this.total = 0;
        }).catch(() => {
          this.postinfo = [];
        });
      }else
        this.$message.warning('搜索内容不能为空')
    },
    // 退出搜索，回到分页列表
    clearSearch(){
      this.searchMode = false;
      this.input = '';
      this.currentPage = 1;
      this.fetchPage();
    },
    gowritepost(){
      const { path } = this.$route
      if (path !== '/Index/write') {
        this.$router.push('/Index/write')
      }
    },
    gologin(){
      this.$router.push('/Login')
    },
    // lycoris 悬停圆环：由光标位置扩散
    rippleOn(e){
      const el=e.currentTarget, rect=el.getBoundingClientRect();
      el.style.setProperty('--rx', (e.clientX-rect.left)+'px');
      el.style.setProperty('--ry', (e.clientY-rect.top)+'px');
      el.classList.add('is-rippling');
    },
    rippleOff(e){ e.currentTarget.classList.remove('is-rippling'); },

  },
  computed:{
    islogin(){
      let token = localStorage.getItem('token')
      if (token){
        return true
      }else
        return false
    }
  }

}
</script>

<template>
<div>
  <div>
    <el-row>

    </el-row>
  </div>

  <el-row>
    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>
    <el-col :span="20">
      <!--消息区-->
      <div class="padding_20px card-main min-height" >
        <el-row class="padding_20px">
          <h1 style="text-align: right;color: var(--color-primary)">留言板</h1>
          <hr>
          <el-row>
            <div style="margin: 10px">
              <el-button class="margin_5px" v-if="islogin" type="primary" @click="gowritepost">发 帖</el-button>
              <el-button class="margin_5px" v-else type="primary" @click="gologin">登录后发帖</el-button>
              <el-card >
                <div style="padding-bottom: 5px;">
                  <div style="display: flex; justify-content: center; align-items: center;">
                    <el-input v-model="input" placeholder="搜索帖子" @keyup.enter.native="searchPost"></el-input>
                    <el-button @click="searchPost" type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button v-if="searchMode" @click="clearSearch" icon="el-icon-refresh-left">清除</el-button>
                  </div>
                </div>
              </el-card>
            </div>
          </el-row>
        </el-row>
        <el-row>
          <el-col :span="24">
            <!-- 五色加载点 -->
            <div v-if="loading" class="loader"><i></i><i></i><i></i><i></i><i></i></div>

            <div v-else-if="postinfo && postinfo.length">
              <div class="father">
                <section
                    v-for="(o,index) in postinfo" :key="o.postid"
                    class="image card hov-card anim-rise"
                    :style="{ backgroundImage: `url(${o.imgurl})`, animationDelay: (index % 6) * 0.06 + 's' }"
                    @mousemove="rippleOn"
                    @mouseleave="rippleOff"
                >
                  <span class="hov-card__ripple"></span>
                  <div class="overlay"></div>
                  <div class="content">
                    <h2>{{o.title}}</h2>
                    <p class="author-line">by:{{o.post_username}}</p>
                    <time class="time">{{o.created_at}} </time>
                    <el-button type="text" @click="$router.push(`posts/${o.postid}`)">details</el-button>
                  </div>
                </section>
              </div>

            </div>
            <div v-else class="nothingHere">
              <h2>{{ searchMode ? '没搜到相关帖子喵' : '暂无帖子喵' }}</h2>
            </div>
          </el-col>
        </el-row>
        <div style="margin:20px">
          <hr>
        </div>
        <el-row v-if="!searchMode && postinfo">
          <!--            分页控件-->
          <div class="dom_in_center">
            <div class="block">
              <el-pagination
                  background
                  layout="prev, pager, next"
                  :current-page="currentPage"
                  :page-size="pageSize"
                  :total="total"
                  @current-change="handlePageChange">
              </el-pagination>
            </div>
          </div>
        </el-row>
      </div>
    </el-col>

    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>

  </el-row>

</div>
</template>


<style>
body{
  background-color: var(--color-bg);
}
</style>
<style scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.text_in_center{
  text-align: center;
}
.headline{
  height: 8vh;
  display: inline;
  align-items: center;
  justify-content: center;
  background-color: #9de6cd;
}

.el-carousel__item h3 {
  color: #d5e0f1;
  font-size: 18px;
  opacity: 0.75;
  line-height: 30px;
  margin: 0;
}

.el-carousel__item:nth-child(2n) {
  background-color: #99a9bf;
}

.el-carousel__item:nth-child(2n+1) {
  background-color: #d3dce6;
}


.time {
  font-size: 13px;
  color: var(--color-muted);
}

.bottom {
  margin-top: 13px;
  line-height: 12px;

}

.button {
  padding: 0;
  float: right;
}

.min-height{
  min-height: 500px;
}

.clearfix:before,
.clearfix:after {
  display: table;
}
.clearfix:after {
  content: "";
  clear: both
}

.dom_in_center{
  display: flex;
  justify-content: center;
  align-items: center;
}

.padding_20px{
  padding: 20px;
}
.margin_5px{
  margin: 5px;
}
.card-main{
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  margin: 1vh;
  border-radius: 15px;
}

.nothingHere{
  height: 60vh;
}


.father{
  /*"瀑布流样式";*/
  padding: 10px;
  column-count:5;
  col-gap: 15px;

}
.image{
  margin-bottom:15px;
  border-radius:15px;

  overflow:hidden;
  background-color: var(--color-canvas);
  padding: 5px;
  box-shadow: 1px 1px 1px gray;
  transition: 0.1s;
}
.image:hover{
  box-shadow: 2px 3px 3px gray;
  transition: 0.1s;
}
.card {
  position: relative;
  background-size: cover;
  background-position: center;
  border-radius: 8px;
  overflow: hidden;
  color: rgba(28, 174, 153, 0.8);
}
.overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to top, rgba(255,255,255,.78), rgba(255,255,255,.18));
}
.content {
  position: relative;
  z-index: 1;
  padding: 16px;
}
.content h2 {
  font-size: 18px;
  color: var(--color-text);
  margin-bottom: 4px;
}
.content .author-line {
  color: var(--color-secondary);
  font-weight: 600;
}
.content .time { color: var(--color-muted); display: inline-block; margin-right: 8px; }

.limit{
  width: 200px;
  height: 200px;
  overflow: hidden;
}
.image img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  transition: 0.5s;
  cursor: pointer;
}
.image img:hover{
  width:110%;
  height:110%;
  overflow:hidden;
}
@media (max-width:1200px){
  .father{
    column-count:4;
  }
}
@media (max-width:850px) {
  .father {
    column-count: 3;
  }
}
@media (max-width:600px) {
  .father {
    column-count: 2;
  }
}

</style>
