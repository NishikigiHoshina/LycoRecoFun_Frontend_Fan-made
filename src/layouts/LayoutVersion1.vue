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
    },
    roleInfo(){
      const s=window.localStorage.getItem('status')
      if(s==='3') return { text:'管理员', admin:true }
      if(s==='1') return { text:'普通用户', admin:false }
      if(s==='2') return { text:'已停用', admin:false }
      return { text:'访客', admin:false }
    },
    avatarInitial(){
      const t=(window.localStorage.getItem('username')||'').trim()
      return t ? t.charAt(0).toUpperCase() : '?'
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
            <p class="brand">网站图标</p>
          </div>
        </el-col>
        <el-col :span="8">
          <!--      菜单-->
          <el-menu index="1" class="el-menu"
                   :span="2"
                   :default-active="activeIndex"
                   mode="horizontal"
                   @select="handleSelect"
                   background-color="#ffffff"
                   text-color="#4a5560"
                   active-text-color="#f0555a"
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
                  size="340px"
              >
                <!-- 已登录：个人信息卡 + 功能列表 -->
                <div v-if="login_status" class="d-body">
                  <div class="d-head">个人信息</div>

                  <!-- 头像 + 用户名 + 角色 -->
                  <div class="d-profile">
                    <span v-if="!avater" class="d-avatar">{{ avatarInitial }}</span>
                    <span v-else class="d-avatar"><img :src="avater" alt="avatar"/></span>
                    <div class="d-meta">
                      <div class="d-name">{{ username }}</div>
                      <span :class="['d-role', roleInfo.admin ? 'd-role--admin' : '']">{{ roleInfo.text }}</span>
                    </div>
                  </div>

                  <!-- 功能项列表 -->
                  <div class="d-list">
                    <router-link class="d-item" to="/Index/personal"><i class="el-icon-user"></i><span>个人主页</span><i class="el-icon-arrow-right d-arrow"></i></router-link>
                    <router-link class="d-item" to="/Index/set"><i class="el-icon-setting"></i><span>个人设定</span><i class="el-icon-arrow-right d-arrow"></i></router-link>
                    <router-link class="d-item" to="/Index/message"><i class="el-icon-chat-line-square"></i><span>我要留言</span><i class="el-icon-arrow-right d-arrow"></i></router-link>
                    <router-link class="d-item" to="/Index/plaza"><i class="el-icon-message"></i><span>留言板</span><i class="el-icon-arrow-right d-arrow"></i></router-link>
                    <router-link v-if="user_status" class="d-item d-item--admin" to="/homeDemo/index"><i class="el-icon-s-tools"></i><span>前往后台</span><i class="el-icon-arrow-right d-arrow"></i></router-link>
                  </div>

                  <div class="d-foot">
                    <el-button class="d-logout" @click="logout" plain>退出登录</el-button>
                  </div>
                </div>

                <!-- 未登录：引导登录 -->
                <div v-else class="d-guest">
                  <i class="el-icon-user d-guest-icon"></i>
                  <p class="d-guest-text">登录后查看个人中心与更多功能喵</p>
                  <el-button type="primary" @click="gologin">登 录</el-button>
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
  background-color: transparent;
}
.el-menu{
  border-bottom: 0px;
}

/* 顶栏 hover 悬停/激活下划线统一为珊瑚主色 */
.el-menu--horizontal .el-menu-item:hover,
.el-menu--horizontal .el-submenu .el-submenu__title:hover {
  border-bottom: 2px solid #f0555a;
}

.brand{
  font-family: var(--font-serif);
  font-weight: 700;
  letter-spacing: .14em;
  color: #f0555a;
}

.bg-lightgreen{
  background: #ffffff;
  height: 8vh;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 2px 14px rgba(0,0,0,.04);
}

.footer{
  background-color: #1f2328;
  border-top: 4px solid #f0555a;
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

<style>
/* ===== 个人抽屉（el-drawer 渲染到 body，用非 scoped 保证生效） ===== */
.d-body { padding: 6px 20px 18px; }
.d-head {
  font-family: var(--font-serif);
  font-size: 13px;
  letter-spacing: .14em;
  color: var(--color-muted);
  text-transform: uppercase;
  margin: 2px 0 16px;
}

.d-profile {
  display: flex;
  align-items: center;
  gap: 15px;
  padding: 4px 2px 18px;
  border-bottom: 1px solid var(--color-border);
}
.d-avatar {
  width: 58px;
  height: 58px;
  border-radius: 50%;
  flex: 0 0 58px;
  overflow: hidden;
  background: linear-gradient(135deg, var(--color-secondary), var(--color-deco-a));
  color: #fff;
  font-family: var(--font-serif);
  font-size: 24px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
}
.d-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.d-meta { display: flex; flex-direction: column; align-items: flex-start; gap: 7px; }
.d-name {
  font-family: var(--font-serif);
  font-size: 19px;
  font-weight: 700;
  color: #1a1a1a;
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.d-role {
  font-size: 12px;
  line-height: 1.4;
  padding: 2px 9px;
  border: 1px solid var(--color-border);
  color: var(--color-muted);
}
.d-role--admin {
  color: var(--color-primary);
  border-color: var(--color-primary);
}

.d-list { display: flex; flex-direction: column; padding-top: 4px; }
.d-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 4px;
  color: #4a5560;
  text-decoration: none;
  font-size: 14px;
  border-bottom: 1px solid #f4f5f7;
  transition: color .3s var(--ease-main), padding-left .3s var(--ease-main);
}
.d-item > i:first-child { color: var(--color-secondary); font-size: 16px; transition: color .3s; }
.d-item > span { flex: 1; }
.d-arrow { font-size: 12px; color: #c2c8cf; }
.d-item:hover { color: var(--color-primary); padding-left: 8px; }
.d-item:hover > i:first-child { color: var(--color-primary); }
.d-item--admin { color: var(--color-primary); font-weight: 600; }

.d-foot { margin-top: 18px; text-align: center; }
.d-logout { width: 100%; }

/* 未登录态 */
.d-guest { text-align: center; padding: 46px 10px; }
.d-guest-icon { font-size: 48px; color: #c2c8cf; }
.d-guest-text { color: var(--color-muted); font-size: 14px; margin: 14px 0 20px; }
</style>
