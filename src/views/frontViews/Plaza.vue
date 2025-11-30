<script>
import axios from "axios";
import {left} from "core-js/internals/array-reduce";
import searchResult from "@/views/frontViews/SearchResult.vue";
export default {
  name:'Plaza',
  data(){
    return{
      activeIndex: '1',
      postinfo:null,
      input:null,


    }
  },
  mounted() {
    axios.post("http://localhost:12808/lycorisfunServer/api/postlist").then((res)=>{
      console.log(res)
      this.postinfo=res.data;
    }).catch(function (err){
      console.log(err)
    })

  },
  methods:{
    searchPost(){

    }

  },

}
</script>

<template>
<div>
  <div>
    <el-row>

    </el-row>
  </div>

  <el-row>
    <el-col :span="1">
      <p>&nbsp;</p>
    </el-col>
    <el-col :span="22">
      <!--消息区-->
      <div class="padding_20px card-main" >
        <el-row class="padding_20px">
          <h1 style="text-align: right;color: #159ee6">留言板</h1>
          <hr>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-row>
              <p style="height: 7vh;">&nbsp;</p>
            </el-row>
            <el-row>
              <div style="margin: 10px">
                <el-card >
                  <div style="padding-bottom: 5px;">
                    <div style="display: flex; justify-content: center; align-items: center;">
                      <el-input v-model="input" placeholder="搜索留言"></el-input>
                      <el-button @click="searchPost()" type="primary" icon="el-icon-search">搜索</el-button>
                    </div>
                  </div>
                </el-card>
              </div>
            </el-row>
            <el-row>
              <p style="height: 7vh;">&nbsp;</p>
            </el-row>
          </el-col>
          <el-col :span="18">
            <div v-if="postinfo">
              <div class="father">
                <section v-for="(o,index) in postinfo" :key="o.postid" class="image">
                  <a :href="o.link" target="_blank">
                    <div class="limit">
                      <img :src="o.imgurl" alt="img">
                    </div>
                    <span>{{o.title}}</span>
                    <time class="time">{{o.created_at}}</time>
                  </a>
                </section>
              </div>

            </div>
            <div class="nothingHere" v-else>
              <h2>这里还没有留言喵</h2>
            </div>
          </el-col>
        </el-row>
        <el-row v-if="postinfo">
          <!--            分页控件-->
          <div class="dom_in_center">
            <div class="block">
              <!--      <span class="demonstration">大于 7 页时的效果</span>-->
              <el-pagination
                  background
                  layout="prev, pager, next"
                  :total="1000">
              </el-pagination>
            </div>
          </div>
        </el-row>
      </div>
    </el-col>

    <el-col :span="1">
      <p>&nbsp;</p>
    </el-col>

  </el-row>

</div>
</template>


<style>
body{
  background-color: azure;
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
  color: #999;
}

.bottom {
  margin-top: 13px;
  line-height: 12px;

}

.button {
  padding: 0;
  float: right;
}



.clearfix:before,
.clearfix:after {
  display: table;
  content: "";
}

.clearfix:after {
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
.card-main{
  background-color: #cff3f3;
  margin: 1vh;
  border-radius: 15px;
}

.nothingHere{
  height: 60vh;
}


.father{
  zheshizhushi:"瀑布流样式";
  width:100%;
  row-count:5;
  row-gap: 15px;


}
.image{
  margin-bottom:15px;
  border-radius:15px;

  overflow:hidden;
  background-color: #d5e0f1;
  padding: 5px;
}
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