<script setup>
import { ref } from 'vue'
const collapsed = ref(false)
</script>
<script>
export default {
  data() {
    return {
      activeIndex: '1',
      input: '',

      drawer: false,
      direction: 'rtl',
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
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
              <el-menu-item disabled title="还在施工喵" index="1-2">联系站长</el-menu-item>
            </el-submenu>

            <el-submenu index="2" :span="2">
              <template slot="title">广场</template>
              <el-menu-item index="2-1" @click="linktoplaza">留言板</el-menu-item>
              <el-menu-item index="2-2" @click="linktomessage">我要留言</el-menu-item>
              <el-menu-item disabled title="不在开放时间内，请留意公告喵" index="2-3" @click="linktomessage">上传作品</el-menu-item>
<!--              <el-submenu index="3-3" :span="2">-->
<!--                <template slot="title">选项三</template>-->
<!--                <el-menu-item index="3-3-1">子选项一</el-menu-item>-->
<!--                <el-menu-item index="3-3-1">子选项二</el-menu-item>-->
<!--                <el-menu-item index="3-3-1">子选项三</el-menu-item>-->
<!--              </el-submenu>-->
            </el-submenu>

            <el-submenu index="3" :span="2">
              <template slot="title">资料</template>
              <el-menu-item index="3-1">设定</el-menu-item>
              <el-menu-item index="3-2">图集</el-menu-item>
              <el-menu-item index="3-3">二创</el-menu-item>
            </el-submenu>

            <el-menu-item index="2" :span="2">
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
              请登录
            </el-button>

            <div>
              <el-drawer
                  title="我是标题"
                  :visible.sync="drawer"
                  :direction="direction"
                  :before-close="handleClose"
                  size="20%"
              >
                <span>我是内容</span><br>
                <hr>
                <router-link class="el-button--success" to="/homeDemo/index">前往后台</router-link>
                <br>
                <router-link class="el-button--success" to="/Demo">前往课堂测试页</router-link>
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

.padding_20px{
  padding: 20px;
}
</style>