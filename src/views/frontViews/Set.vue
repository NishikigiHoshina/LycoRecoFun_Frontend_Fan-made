<script >
export default {
  name:'Set',
  data(){
    return{

    }
  },
  methods:{

  },
}
</script>

<template>
<div>
  <el-row>
    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>
    <el-col :span="20">
      <!--消息区-->
      <div class="padding_20px card-main min-height" >
        <el-row class="padding_20px">
          <div>
            <h2>设定</h2>
            <hr>
          </div>
        </el-row>
      </div>
    </el-col>

    <el-col :span="2">
      <p>&nbsp;</p>
    </el-col>

  </el-row>
</div>
</template>

<style scoped>
.padding_20px{
  padding: 20px;
}
.card-main{
  background-color: #cff3f3;
  margin: 1vh;
  border-radius: 15px;
}
.min-height{
  min-height: 500px;
}
</style>
