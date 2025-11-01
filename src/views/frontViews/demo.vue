<script >
import axios from "axios";
import index from "vuex";

export default {
  name:"demo",
  computed: {
    index() {
      return index
    }
  },
  data(){
    return{
      user:{},
      userlist:[],
      status:null,
      respondse:'',
    }
  },
  methods:{

  },
  mounted() {
    axios.get("http://localhost:12808/lycorisfunServer/searchUser?").then((res)=>{
      console.log(res)
      this.user=res.data;
    }).catch(function (err){
      console.log(err)
    });

    axios.get("http://localhost:12808/lycorisfunServer/userlist?").then((res)=>{
      console.log(res)
      this.userlist=res.data;
    }).catch(function (err){
      console.log(err)
    });

    axios.get("http://localhost:12808/lycorisfunServer/getStatus").then((res)=>{
      console.log(res)
      this.status=res.data;
    }).catch(err=>{
      console.log(err)
    });
    axios.get("http://localhost:12808/lycorisfunServer/getgood01?id=1&name=apple").then((res)=>{
      console.log(res)
      this.respondse=res.data;
    });
    axios.get("http://localhost:12808/lycorisfunServer/getStatu200").then((res)=>{
      console.log(res)
      this.respondse=res.data;
    }).catch(err=>{
      console.log(err)
      console.log("查询失败")
    });
  }
}
</script>

<template>
<div>
  {{user}}
  <hr>
  <div>
    <p v-for="(list,index) in userlist" >id:{{list.id}}-name:{{list.name}}-email:{{list.email}}</p>
  </div>
  <hr>
  <div>
    <p v-if="status">statu:{{status.statu}}-msg:{{status.msg}}-</p>
    <p v-else>未接收到返回</p>
    <p v-if="respondse">{{respondse}}</p>
  </div>

</div>
</template>

<style scoped>

</style>