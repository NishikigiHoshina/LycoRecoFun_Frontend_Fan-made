<script>
import axios from "axios";

export default {
  name:"Home",
  data(){
    return{
      // currentDate: new Date(),
      imglinklist:[],
      newsList:null,
      Announcement:null,
    };
  },
  created() {

    axios.post("http://localhost:12808/lycorisfunServer/api/newslist").then((res)=>{
      console.log(res)
      this.newsList=res.data;
    }).catch(function (err){
      console.log(err)
      console.log("找不到方法喵")
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getAnnouncement").then((res)=>{
      console.log(res)
      this.Announcement=res.data;
    }).catch(function (err){
      console.log(err)
      console.log("找不到方法喵")
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getIndexIMG").then((res)=>{
      console.log(res)
      this.imglinklist=res.data.data;
    }).catch(function (err){
      console.log(err)
      console.log("找不到方法喵")
    })
  },
  mounted() {

  },
  methods:{
    // lycoris 悬停圆环：由光标位置扩散
    rippleOn(e){
      const el=e.currentTarget, rect=el.getBoundingClientRect();
      el.style.setProperty('--rx', (e.clientX-rect.left)+'px');
      el.style.setProperty('--ry', (e.clientY-rect.top)+'px');
      el.classList.add('is-rippling');
    },
    rippleOff(e){ e.currentTarget.classList.remove('is-rippling'); },
  },
}
</script>

<template>
<div class="text_in_center">
  <div>
    <el-row>
<!--      <el-carousel :interval="6000" type="card" height="40vh">-->
<!--        <el-carousel-item v-for="item in imginRound" :key="item.id">-->
<!--          <img style="width: 100%;height: 100%;" :src="item.url" alt="">-->

<!--        </el-carousel-item>-->
<!--      </el-carousel>-->
      <el-carousel :interval="6000" height="60vh" direction="horizontal" :autoplay="true">
        <el-carousel-item v-for="item in imglinklist" :key="item.id">
          <img style="width: 100%;height: 130%;" :src="item.function_link" alt="">

<!--          <div style="text-align: left; position: absolute; bottom:2%; left: 2%; margin: 0;padding: 0">-->
<!--            <h3>这里是标题</h3>-->
<!--            <el-button type="text">查看详情></el-button>-->
<!--          </div>-->
        </el-carousel-item>
      </el-carousel>
    </el-row>
  </div>
  <el-divider content-position="left">全站公告</el-divider>
  <div>
    <el-row>
      <h2 v-if="Announcement">
        {{ Announcement }}
      </h2>
      <h2 v-else>
        暂无公告
      </h2>
    </el-row>
  </div>
  <el-divider content-position="left">近期新闻</el-divider>
  <div>
    <el-row>
      <el-col :span="3">
        <p>&nbsp;</p>
      </el-col>
      <el-col :span="18" style="padding: 0">
        <el-row style="padding: 0">
          <div v-if="newsList">
            <el-col
                :span="24"
                v-for="(news, index) in newsList"
                :key="news.id"
                style="margin-bottom: 80px"
            >
              <div
                  class="card hov-card anim-rise"
                  :style="{ backgroundImage: `url(${news.imgurl})`, animationDelay: (index % 6) * 0.08 + 's' }"
                  @mousemove="rippleOn"
                  @mouseleave="rippleOff"
              >
                <!-- lycoris 悬停圆环 -->
                <span class="hov-card__ripple"></span>
                <!-- hover 才浮现的信息层 -->
                <div class="info">
                  <h2>{{ news.title }}</h2>
                  <!-- news 表实际列名为 news_link（后端 News 实体同名字段），勿写成 news.link -->
                  <a :href="news.news_link"  target="_blank" rel="noopener">
                    <el-button type="text" >查看详情</el-button>
                  </a>
                </div>
              </div>
            </el-col>
            <el-button disabled>More</el-button>
          </div>
          <div v-else>
            <p>暂无新闻，可能是由于网络异常</p>
          </div>

        </el-row>
      </el-col>
      <el-col :span="3">
        <p>&nbsp;</p>
      </el-col>
    </el-row>
  </div>
  <el-divider content-position="center">这里是底线喵</el-divider>
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
  color: #475669;
  font-size: 18px;
  opacity: 0.75;
  line-height: 300px;
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

.image {
  width: 100%;
  display: block;
}

.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
  clear: both
}

.card {
  width: 100%;
  height: 440px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-color: #a6b6c8;     /* 加载前底色 */
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}
.info {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  padding: 12px 16px;
  opacity: 0;
  transition: opacity .3s;
}

.card:hover .info {
  opacity: 1;
}

.info h2,
.info h3 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #fff;
}

.info .el-button {
  color: #fff;
  padding: 0;
}
</style>