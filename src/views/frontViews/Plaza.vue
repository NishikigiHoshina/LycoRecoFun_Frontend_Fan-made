<script>
import axios from "axios";
import {left} from "core-js/internals/array-reduce";
export default {
  name:'Plaza',
  data(){
    return{
      activeIndex: '1',
      postinfo:null,
      // postinfo:[{
      //   id:1,
      //   title:"Hello, Nice to meet you!",
      //   user:"xxxLUCY",
      //   main:"hello everyone,i want to show my exciting to meet you, hope we can get on well",
      //   time:"2025-10-11 18:07",
      //   link:"#/Index/posts/1",
      //   imgurl:"https://free.picui.cn/free/2025/10/12/68ea87d94f445.jpg"
      // },{
      //   id:2,
      //   title:"How could i change my avater?",
      //   user:"Dark Angels",
      //   main:"wait…could anyone tell me how could i change my avater? the default one looks not pretty……",
      //   time:"2025-10-11 23:17",
      //   link:"#/Index/posts/2",
      //   imgurl:"https://free.picui.cn/free/2025/10/12/68ea81a34978d.png"
      // },{
      //   id:3,
      //   title:"Hello, Nice to meet you!",
      //   user:"xxxLUCY",
      //   main:"hello everyone,i want to show my exciting to meet you, hope we can get on well",
      //   time:"2025-10-11 18:07",
      //   link:"#/Index/posts/1",
      //   imgurl:"https://free.picui.cn/free/2025/10/12/68ea87d94f445.jpg"
      // },{
      //   id:4,
      //   title:"How could i change my avater?",
      //   user:"Dark Angels",
      //   main:"wait…could anyone tell me how could i change my avater? the default one looks not pretty……",
      //   time:"2025-10-11 23:17",
      //   link:"#/Index/posts/2",
      //   imgurl:"https://free.picui.cn/free/2025/10/12/68ea81a34978d.png"
      // }],

      tags: [
        { name: '标签一', type: '' },
        { name: '标签二', type: 'success' },
        { name: '标签三', type: 'info' },
        { name: '标签四', type: 'warning' },
        { name: '标签五', type: 'danger' }
      ],

    }
  },
  mounted() {
    axios.get("http://localhost:12808/lycorisfunServer/api/getPostList").then((res)=>{
      console.log(res)
      this.postinfo=res.data;
    }).catch(function (err){
      console.log(err)
    })

  },
  methods:{
    left

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
                    <el-tag size="small"
                        v-for="tag in tags"
                        :key="tag.name"
                        closable
                        :type="tag.type">
                      {{tag.name}}
                    </el-tag>
                  </div>
                  <hr>
                  <div style="padding-top: 5px;">
                    <el-tag size="medium" >标签一</el-tag>
                    <el-tag size="medium" type="success">标签二</el-tag>
                    <el-tag size="medium" type="info">标签三</el-tag>
                    <el-tag size="medium" type="warning">标签四</el-tag>
                    <el-tag size="medium" type="danger">标签五</el-tag>
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
                <section v-for="(o,index) in postinfo" :key="o.id" class="image">
                  <img :src="o.imgurl" alt="img">
                  <span>{{o.title}}</span>
                  <time class="time">{{o.time}}</time>
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
  column-count:5;
  column-gap:15px;

}
.image{
  margin-bottom:15px;
  border-radius:15px;

  overflow:hidden;
  background-color: #d5e0f1;
  padding: 5px;
}
.image img {
  width: 100%;
  height: 100%;
  border-radius: 15px;
  transition: 0.5s;
  cursor: pointer;
  max-height:130%;
}
.image img:hover{
  width:120%;
  height:120%;
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

.preview-container {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.6);
  opacity: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  pointer-events:auto;
  transition: opacity 0.3s ease;
}

.preview-container img {
  max-width: 80%;
  max-height: 80%;
  margin: auto;
}

</style>