<script>
export default {
  name:"PageOne",
  data(){
    return{
    id:0,
    }
  },
  methods:{
    back(){
      this.$router.push({path:'/homeDemo/Index?typeid=1'});
      // this.$router.go(-1);
    }
  },
}
</script>
<!-- 引入组件库 -->
<!--<script src="https://unpkg.com/element-ui/lib/index.js"></script>-->

<!--dom元素-->
<template>
<div class="is-background">
  <div style="text-align: center">
    This is page one<br>
    <i class="el-icon-edit"></i>
    <i class="el-icon-share"></i>
    <i class="el-icon-delete"></i>
    <el-button type="primary" icon="el-icon-search">搜索</el-button>
    <el-row>
      <el-col :span="24"><div class="grid-content bg-purple-dark">
1
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="12"><div class="grid-content bg-purple">
2-1
      </div></el-col>
      <el-col :span="12"><div class="grid-content bg-purple-light">
2-2
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="8"><div class="grid-content bg-purple">
3-1
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple-light">
3-2
      </div></el-col>
      <el-col :span="8"><div class="grid-content bg-purple">
3-3
      </div></el-col>
    </el-row>
    <el-row>
      <el-col :span="6"><div class="grid-content bg-purple">
4-1
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
4-2
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple">
4-3
      </div></el-col>
      <el-col :span="6"><div class="grid-content bg-purple-light">
        4-4
      </div></el-col>
    </el-row>
  </div>
  <div>
    <button @click="back">
      返回
    </button>
  </div>
</div>
</template>

<!-- 引入样式 -->
<link rel="stylesheet" href="https://unpkg.com/element-ui/lib/theme-chalk/index.css">
<style scoped>
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-col {
  border-radius: 4px;
}
.bg-purple-dark {
  background: #99a9bf;
}
.bg-purple {
  background: #d3dce6;
}
.bg-purple-light {
  background: #e5e9f2;
}
.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
.row-bg {
  padding: 10px 0;
  background-color: #f9fafc;
}
</style>
