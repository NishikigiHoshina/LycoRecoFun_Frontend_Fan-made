<script setup>

</script>
<script>
import axios from "axios";

export default {
  name:"login",
  data() {
    return{
      showLogin:false,   // false=看注册，true=看登录
      lgn:{email:'',password:''},
      reg:{username:'',email:'',password:'',pwd2:''},
      commitreg:{userName:'',email:'',password:''}
  };

  },
  methods: {
    handleLogin(){
      axios({
        method:'post',
        url:'http://localhost:12808/lycorisfunServer/api/admin/login',
        data:this.lgn
      }).then(res=>{

        this.$message({
          message: '登录成功',
          type: 'success'
        });
        window.localStorage.setItem('token', res.data.token);
        window.localStorage.setItem('userId', res.data.userId);
        window.localStorage.setItem('username', res.data.username);
        window.localStorage.setItem('avatar', res.data.avater);
        window.localStorage.setItem('status', res.data.status);


        this.$router.push('/Index/index');

      }).catch(err=>{
         this.$message.warning(err.response.data.msg);
      });
      // alert('登录演示\n账号：'+this.lgn.email+'\n密码：'+this.lgn.password);
    },
    handleReg(){
      if(this.reg.password!==this.reg.pwd2){ this.$message.warning('两次密码不一致'); return; }
      this.commitreg.email=JSON.parse(JSON.stringify(this.reg.email))
      this.commitreg.userName=JSON.parse(JSON.stringify(this.reg.username))
      this.commitreg.password=JSON.parse(JSON.stringify(this.reg.pwd2))
      axios({
        method:'post',
        url:'http://localhost:12808/lycorisfunServer/api/admin/register',
        data:this.commitreg
      }).then(res=>{

        this.$message({
          message:res.data.msg,
          type: 'warning'
        });
        setTimeout(() => {
          //console.log("3秒后执行");
          this.$router.go(0)
        }, 2000);

      }).catch(err=>{
        this.$message.warning(err.response.data.msg);
      });
      //alert('注册演示\n账号：'+this.reg.username+'\n邮箱：'+this.reg.email);
    }
  },computed:{
    allowLogin(){
      return this.lgn.email.trim().length>0 && this.lgn.password.trim().length>0
    },
    allowregi(){
      return this.reg.email.trim().length>0
          && this.reg.password.trim().length>0
          && this.reg.username.trim().length>0
          && this.reg.pwd2.trim().length>0
    }
  },
  created() {
    // 2. debugger 时间差
    setInterval(() => {
      const t0 = performance.now();
      debugger;               // 只有 DevTools 打开才会暂停
      if (performance.now() - t0 > 100) {
        console.log('[debugger] 检测到 DevTools 开启');
      }
    }, 1000);
    setInterval(checkDevTools, 1000);
// 1. devtools-detect 事件
    window.addEventListener('devtoolschange', e => {
      console.log('[devtools-detect] 状态：', e.detail.open ? '开启' : '关闭');
    });

  },
  beforeRouteEnter(to, from, next){
    let token =localStorage.getItem('token');
    if(token)next('/Index/index');
    else next()
  }

}

</script>

<template>
<div>
  <div class="bg"></div>

  <div >
    <div class="frame" :class="{'show-login':showLogin}">
      <div class="panels">
        <!-- 登录 -->
        <div class="panel">
          <h2>登 录</h2>
          <input class="inp" v-model="lgn.email" placeholder="邮箱" required />
          <input class="inp" type="password" v-model="lgn.password" placeholder="密码" required />
          <button class="btn btn-prim" :disabled="!allowLogin" @click="handleLogin">登录</button>
          <button class="btn btn-ghost" @click="showLogin=false">还没有账号？立即注册</button>
        </div>

        <!-- 注册 -->
        <div class="panel">
          <h2>注 册</h2>
          <input class="inp" v-model="reg.username" placeholder="用户名" required />
          <input class="inp" type="email" v-model="reg.email" placeholder="邮箱" required />
          <input class="inp" type="password" v-model="reg.password" placeholder="密码" required />
          <input class="inp" type="password" v-model="reg.pwd2" placeholder="确认密码" required />
          <button class="btn btn-prim" :disabled="!allowregi" @click="handleReg">注册</button>
          <button class="btn btn-ghost" @click="showLogin=true">已有账号？立即登录</button>
        </div>
      </div>

      <!-- 遮罩 -->
      <div class="mask">
        <h3 v-if="showLogin">留下您的足迹</h3>
        <h3 v-else>交流从此开始</h3>
      </div>
    </div>
  </div>


</div>
</template>

<style scoped>
* { margin: 0; padding: 0; box-sizing: border-box; }

/* ===== 全屏背景 ===== */
.bg{
  position:fixed;
  inset:0;
  background:url("https://free.picui.cn/free/2025/10/12/68ea81ac3595f.jpg") center/cover;
  filter:brightness(.75);
}

/* ===== 外框：静止，只负责裁剪 ===== */
.frame{
  position:fixed;
  top:50%; left:50%;
  transform:translate(-50%,-50%);   /* 仅做居中，不再移动 */
  width:800px; height:480px;
  border-radius:18px;
  overflow:hidden;
  box-shadow:0 8px 32px rgba(0,0,0,.4);
}

/* ===== 双面板：永远静止 ===== */
.panels{
  display:flex;
  width:800px; height:100%;
  /* 不再做 transform 切换 */
}
.panel{
  width:400px; height:100%;
  padding:50px 40px;
  color:#fff;
  display:flex;
  flex-direction:column;
  justify-content:center;
}
.panel h2{ text-align:center; margin-bottom:30px; }

/* ===== 统一输入 ===== */
.inp{
  width:100%;
  padding:12px 15px;
  margin-bottom:18px;
  background:rgba(255,255,255,.12);
  border:1px solid rgba(255,255,255,.35);
  border-radius:8px;
  color:#fff;
  font-size:14px;
  transition:all .3s;
}
.inp:focus{
  background:rgba(255,255,255,.2);
  border-color:rgba(255,255,255,.7);
  outline:none;
}
.inp::placeholder{color:rgba(255,255,255,.7);}

/* ===== 按钮 ===== */
.btn{
  width:100%;
  padding:12px;
  border:none;
  border-radius:8px;
  font-size:16px;
  font-weight:600;
  cursor:pointer;
  transition:all .3s;
}
.btn-prim{
  background:linear-gradient(45deg,#667eea 0%,#764ba2 100%);
  color:#fff;
}
.btn-prim:hover{
  transform:translateY(-2px);
  box-shadow:0 5px 18px rgba(102,126,234,.45);
}
.btn-ghost{
  margin-top:15px;
  background:transparent;
  color:#fff;
  border:1px solid rgba(255,255,255,.5);
}
.btn-ghost:hover{background:rgba(255,255,255,.1);}

/* ===== 遮罩：唯一移动的元素 ===== */
.mask{
  position:absolute;
  top:0; left:0;
  width:400px; height:100%;
  display:flex;
  align-items:center; justify-content:center;
  transition:transform .6s cubic-bezier(.4,0,.2,1),
  background .6s cubic-bezier(.4,0,.2,1);
  /* 初始盖住右侧注册面板 */
  transform:translateX(0);
  background: rgb(0, 182, 112,.25);
  /*background:linear-gradient(135deg, rgb(22, 103, 72) 0%, rgb(58, 87, 89) 100%);*/
  backdrop-filter:blur(12px);
  border-radius:18px;
  pointer-events:all;
}

/* Vue 切换类：滑到左侧盖住登录面板 */
.frame.show-login .mask{
  transform:translateX(400px);
  background: rgb(0, 161, 88,.25);
  /*background:linear-gradient(135deg,rgba(80,200,220) 0%,rgba(180,220,80) 100%);*/
}
.mask h3{
  color: white;
  font-size:26px;
  letter-spacing:2px;
  text-shadow:0 2px 8px rgba(0,0,0,.4);
}
</style>