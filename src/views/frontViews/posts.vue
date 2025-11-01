<script >
import axios from "axios";
export default {
  name:'posts',
  data(){
    return{
      postinfo:[],
      post: null,
    }
  },
  created() {
    axios.get("http://localhost:12808/lycorisfunServer/api/getPostList").then((res)=>{
      console.log(res)
      this.postinfo=res.data;
    }).catch(function (err){
      console.log(err)
    })
  },
  mounted() {


    this.loadPost()
  },
  watch: {
    postinfo() {
      this.loadPost()   // 数据只要更新就重新匹配
    },
    '$route.params.id': 'loadPost'
    // 同组件切换时重新加载
  },
  methods:{
    loadPost() {
      const id = Number(this.$route.params.id)
      this.post = this.postinfo.find(p => p.id === id) || null
    },
    back(){
      this.$router.go(-1);
    }
  },
}
</script>

<template>
<div style="text-align: center;margin-bottom: 30px;">


  <el-row>
    <p>&nbsp;</p>
  </el-row>
  <el-row>
    <el-col span="5">
      <p>&nbsp;</p>
      <el-button @click="back" type="primary">返回</el-button>
    </el-col>
    <el-col span="14">
      <el-card class="box-card">
        <div v-if="post">
          <h1>{{ post.title }}</h1>
          <p>by: {{ post.user }}  at  {{ post.time }}</p>
          <div>{{ post.main }}</div>
          <div>
            <img style="height: 40%;width: 40%;margin: 15px;" :src="post.imgurl" alt="img">
          </div>
        </div>
        <div v-else>帖子不存在</div>
      </el-card>
    </el-col>
    <el-col span="5">
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

.text_in_center{
  text-align: center;
}
.headline{
  height: 8vh;
  display: inline;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.el-carousel__item h3 {
  color: #475669;
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

.text {
  font-size: 14px;
}

.item {
  padding: 18px 0;
}

.box-card {
  text-align: left;
  width: 880px;
  height: 700px;
  margin-left: 50%;
  transform:translateX(-50%);
}

.bg-white{
  background: #f5f7fa;
  height: 8vh;
}
</style>