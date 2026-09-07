<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
</script>
<script>
import axios from "axios";

export default {
  data() {
    return {
      activeIndex: '1',
      input: '',
      drawer: false,
      direction: 'rtl',
      connect_status:true,
      upload_status:true,
      database_status:true,
      userstatus:window.localStorage.getItem("status"),
      username:window.localStorage.getItem("username"),
      avater:window.localStorage.getItem("avatar"),
    };
  },
  computed:{
    login_status(){
      const a=window.localStorage.getItem('token')
      if (a){
        return true
      }else
        return false
    },
    user_status(){
      const a=window.localStorage.getItem('status')
      if (a===null&& a===''){
        return false
      }
      else if (a==='1' || a==='2'){
        return false
      }else if(a==='3'){
        return true
      }
    }
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },

    isLogin(){

    },
    gologin(){
      this.$router.push('/Login')
    },

    logout(){
      window.localStorage.removeItem('username');
      window.localStorage.removeItem('userId');
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('avatar');
      window.localStorage.removeItem('status');
      this.$message('已退出账号');
      const { path } = this.$route
      if (path !== '/Index/index') {
        this.$router.push('/Index/index')
      }else {
        this.$router.go(0); // 刷新当前路由组件
// 或者 location.reload(); // 强制整个页面刷新
      }
    },

    handleClose(done) {
      done();
      // this.$confirm('确认关闭？')
      //     .then(_ => {
      //       done();
      //     })
      //     .catch(_ => {});
    }
    ,
    linktoindex(){
      const { path } = this.$route
      if (path !== '/Index/index') {
        this.$router.push('/Index/index')
      }
    },
    linktocontact(){
      const { path } = this.$route
      if (path !== '/Index/contact') {
        this.$router.push('/Index/contact')
      }
    },
    linktoplaza(){
      const { path } = this.$route
      if (path !== '/Index/plaza') {
        this.$router.push('/Index/plaza')
      }
    },
    linktomessage(){
      const { path } = this.$route
      if (path !== '/Index/message') {
        this.$router.push('/Index/message')
      }
    },
    gowritepost(){
      const { path } = this.$route
      if (path !== '/Index/write') {
        this.$router.push('/Index/write')
      }
    },
    linktoset(){
      const { path } = this.$route
      if (path !== '/Index/set') {
        this.$router.push('/Index/set')
      }
    },
    linktogallery(){
      const { path } = this.$route
      if (path !== '/Index/gallery') {
        this.$router.push('/Index/gallery')
      }
    },
    linktoseccreate(){
      const { path } = this.$route
      if (path !== '/Index/seccreate') {
        this.$router.push('/Index/seccreate')
      }
    },
    linktoupload(){
      const { path } = this.$route
      if (path !== '/Index/uploadwork') {
        this.$router.push('/Index/uploadwork')
      }
    },
  },
  created() {
    window.addEventListener('devtoolschange', e => {
      console.log('[devtools-detect] 状态：', e.detail.open ? '开启' : '关闭');
    });
    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=connectWebSiteOwner").then((res)=>{
      console.log(res.data)
      this.connect_status=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=uploadWork").then((res)=>{
      console.log(res.data)
      this.upload_status=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=databaseFunction").then((res)=>{
      console.log(res.data)
      this.database_status=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })
  }
};
</script>

<template>
<div>
  <div><!--head-->
<!--    <el-backtop target=".page-component__scroll .el-scrollbar__wrap"></el-backtop>-->
    <el-row class="flex-header headline">
      <div class="bg-lightgreen">
        <el-col :span="4">
          <div style="text-align: center;">
            <p>网站图标</p>
          </div>
        </el-col>
        <el-col :span="8">
          <!--      菜单-->
          <el-menu index="1" class="el-menu"
                   :span="2"
                   :default-active="activeIndex"
                   mode="horizontal"
                   @select="handleSelect"
                   background-color="#9de6cd"
                   text-color="#1476ea"
                   active-text-color="#fff"
          >
            <el-submenu index="1" :span="2">
              <template slot="title">首页</template>
              <el-menu-item index="1-1" @click="linktoindex">新闻</el-menu-item>
              <el-menu-item :disabled="!connect_status" :title="connect_status ? '联系站长' : '功能未开放喵'" index="1-2" @click="linktocontact">联系站长</el-menu-item>
            </el-submenu>

            <el-submenu index="2" :span="2">
              <template slot="title">广场</template>
              <el-menu-item index="2-1" @click="linktoplaza">留言板</el-menu-item>
              <el-menu-item :disabled="!login_status" title="请登录后发帖喵" index="2-2" @click="gowritepost">我要发帖</el-menu-item>
              <el-menu-item index="2-3" @click="linktomessage">我要留言</el-menu-item>
              <el-menu-item :disabled="!(upload_status && login_status)" title="不在开放时间内，请留意公告喵" index="2-4" @click="linktoupload">上传作品</el-menu-item>
<!--              <el-submenu index="3-3" :span="2">-->
<!--                <template slot="title">选项三</template>-->
<!--                <el-menu-item index="3-3-1">子选项一</el-menu-item>-->
<!--                <el-menu-item index="3-3-1">子选项二</el-menu-item>-->
<!--                <el-menu-item index="3-3-1">子选项三</el-menu-item>-->
<!--              </el-submenu>-->
            </el-submenu>

            <el-submenu :disabled="!database_status" index="3" :span="2" title="还在施工喵">
              <template slot="title">资料</template>
              <el-menu-item index="3-1" @click="linktoset">设定</el-menu-item>
              <el-menu-item index="3-2" @click="linktogallery">图集</el-menu-item>
              <el-menu-item index="3-3" @click="linktoseccreate">二创</el-menu-item>
            </el-submenu>

            <el-menu-item index="2" :span="2" :disabled="!login_status" title="请登录后查看喵" @click="$router.push('/Index/personal')">
              个人中心
            </el-menu-item>
          </el-menu>

        </el-col>
        <el-col :span="6">
          <div style="display: flex; justify-content: center; align-items: center;">
            <el-input v-model="input" placeholder="请输入内容"></el-input>
            <el-button type="primary" icon="el-icon-search">搜索</el-button>
          </div>
        </el-col>
        <el-col :span="6">
          <div style="display: flex; justify-content: right; align-items: center;">
<!--            <p>账号状态栏</p>-->
            <el-button @click="drawer = true" type="primary" style="margin-left: 20px;">
              {{ login_status?'个人':'请登录' }}
            </el-button>

            <div>
              <el-drawer
                  title="个人信息"
                  :visible.sync="drawer"
                  :direction="direction"
                  :before-close="handleClose"
                  size="20%"
              >
                <div style="padding: 7px">
                  <div v-if="login_status" style="justify-items: center;">
                    <img :src="avater" style="border-radius: 50%;margin: 10px; width: 70px;height:70px;float: left;"  alt="avater"/>
                    <h3 ><span style="color: #667eea">{{username}}</span>,欢迎喵!</h3>
                    <el-button type="primary" @click="logout">退出登录</el-button>
                  </div>
                  <div class="clearfix"></div>

                  <hr>
                  <router-link v-if="user_status" class="el-button--success" to="/homeDemo/index">前往后台</router-link>

                  <br>
<!--                  <router-link class="el-button&#45;&#45;success" to="/Demo">前往课堂测试页</router-link>-->
                  <br>
                  <router-link v-if="login_status" class="el-button--primary" to="/Index/personal">个人主页</router-link>
                  <br>
                  <el-button v-if="!login_status" type="primary" @click="gologin">登 录</el-button>
                </div>
              </el-drawer>
            </div>

          </div>

        </el-col>
        &nbsp;
      </div>
    </el-row>
  </div>

  <div>
    <main class="content">
      <router-view />
    </main>
  </div>

  <div>
    <!--footer-->
    <el-row>
      <div class="footer">
        <el-row>
          <div >
            <a style="color: white; text-decoration: #3c4147" href="">萌备号:00000000</a>
          </div>
        </el-row>
      </div>
    </el-row>
  </div>
</div>
</template>

<style scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.headline{
  height: 8vh;
  display: inline;
  align-items: center;
  justify-content: center;
  background-color: #9de6cd;
}
.el-menu{
  border-bottom: 0px;
}

.bg-lightgreen{
  background: #9de6cd;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer{
  background-color: #3c4147;
  padding: 40px;
  height: 30vh;
}
.clearfix{
  content: "";
  clear: both
}

.padding_20px{
  padding: 20px;
}
</style>
