<script>
export default {
  name: "HomeDemo",
  data(){
    return{
      typeId:0
    }
  },
  methods:{
    jump(){
      this.$router.push('/homeDemo/One')
    },
    jumptwo(){
      this.$router.push({path:'/homeDemo/Two'})
    },
    jumptoValue(){
      this.$router.push({
        name: 'homedemoValue',      // 父路由 name 即可
        params: { value: 39 }  // 自动拼成 /homeDemo/value/39
      })
    },
    jumptocover(){
      this.$router.push({
        name: 'indexDemo'})
    }
  },
  created() {
    this.typeId=this.$route.query.typeid
    console.log(this.$route.query.typeid)
  }
}

</script>

<template>
  <div id="app">

    <div>
      <section>
        <div class="bggray">
          <h3>后台管理</h3>
        </div>
        <div style="width: 100%; padding: 30px; display: flex; justify-content: center; align-items: center;">
          <div style="width: 100%">
            <el-row>
              <div class="card card1">
                <h1><img class="img-icon" src="../../img/post.png" alt="icon">帖子管理</h1>
                <router-link class="noneunderline" to="/homeDemo/PostControl">前往</router-link>
              </div>
              <div class="card card2">
                <h1><img class="img-icon" src="../../img/user.png" alt="icon">用户管理</h1>
                <router-link class="noneunderline" to="/homeDemo/UserControl">前往</router-link>
              </div>
            </el-row>
            <el-row>
              <div class="card card3">
                <h1><img class="img-icon" src="../../img/news.png" alt="icon">新闻管理</h1>
                <router-link class="noneunderline" to="/homeDemo/NewsControl">前往</router-link>
              </div>
              <div class="card card4">
                <h1><img class="img-icon" src="../../img/site.png" alt="icon">站内管理</h1>
                <router-link class="noneunderline" to="/homeDemo/SiteControl">前往</router-link>
              </div>
            </el-row>

          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<style scoped>
*{
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
  .bggray{
    background-color: #7e9299;
    color: #f5f7fa
  }

  .card{
    width: 45%;
    box-shadow: 2px 2px 2px gray;
    border-radius: 10px;
    padding: 20px;
    float: left;
    color: white;
    margin: 10px;
  }
  .card1{
    background-color: chartreuse;
  }
  .card2{
    background-color: hotpink;
  }
  .card3{
    background-color: dodgerblue;
  }
  .card4{
    background-color: #d5d536;
  }

  .noneunderline{
    text-decoration: none;
  }
  .img-icon{
    width: 50px;
    height: 50px;
  }
</style>