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
        <div class="bgblue">
          <p>传值:{{typeId}}</p>
        </div>
        <div>
          <input type="button" value="跳转" @click="jump" ><br/>
          <input type="button" value="跳转" @click="jumptwo" ><br/>
          <input type="button" value="跳转" @click="jumptoValue" ><br/>
          <input type="button" value="前往落地页" @click="jumptocover" >
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
  .bgblue{
    background-color: #7e9299;
    color: #f5f7fa
  }
</style>