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
      usercontent:{
        id:window.localStorage.getItem('userid'),
        content:'',
        root_id:this.$route.params.id,
      },
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
<div>
  <el-row>
    <p>&nbsp;</p>
  </el-row>
  <el-row>
    <el-col :span="2">
      <p>&nbsp;</p>
      <el-button @click="back" type="primary" style="width: 80px;height: 30px; margin-left: 50px">返回</el-button>
    </el-col>
    <el-col :span="20" style="padding: 0">
        <div class="box-card">
          <div class="post-area">
            <div v-if="post">
              <h1>{{ post.title }}</h1>
              <p>by:<span style="color: deepskyblue">{{ post.post_username }} </span>  at  {{ post.created_at }}</p>
              <hr>
              <div class="rich-content" v-html="post.content"></div>
              <div v-if="post.imgurl">
                <img style="height: 40%;width: 40%;margin: 15px;" :src="post.imgurl" alt="img">
              </div>
            </div>
            <div v-else>帖子不存在</div>
          </div>
          <el-divider content-position="left">评论区</el-divider>
          <div class="content-area">
<!--            content-area-->
            <post-comment :post-id="postid" />
          </div>
        </div>
    </el-col>
    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>
  </el-row>
  <el-row>
    <p>&nbsp;</p>
  </el-row>
</div>
</template>

<style scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.box-card {
  background-color: #cff3f3;
  padding: 30px;
  min-height: 490px;
  text-align: left;
  border-radius: 10px;
  margin: 10px;
}

.post-area{
  min-height: 200px;
}
.content-area{
  min-height: 200px;
  padding: 20px;
}
.floatarea{
  /* float: left; */
}
.input{
  padding: 5px;
  margin: 0;
  min-width: 500px;
  max-width: 100%;
  width: 90%;
  min-height: 50px;
  border: 2px solid #63af95;
  border-radius: 10px;
}
.input:hover{
  border: 2px solid #27aee8;
}
.submit_button{
  width: 10%;
  height: 35px;
  padding: 5px;
}
.clearfloat{
  clear: both;
}

</style>