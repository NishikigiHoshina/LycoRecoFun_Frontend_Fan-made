<script>
export default {
  name: "PageTwo",
  data(){
    return{
      pickerOptions: {
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      value1: '',
      value2: '',
      value3: ''
    }
  },
  methods:{
    back(){
      this.$router.push('/homeDemo/Index?type=2');
      // this.$router.go(-1);
    }
  },
}
</script>

<template>
<div>
  <div>
    This is page two
    <br>
    <div class="block">
      <span class="demonstration">默认</span>
      <el-date-picker
          v-model="value1"
          type="datetime"
          placeholder="选择日期时间">
      </el-date-picker>
    </div>
    <div class="block">
      <span class="demonstration">带快捷选项</span>
      <el-date-picker
          v-model="value2"
          type="datetime"
          placeholder="选择日期时间"
          align="right"
          :picker-options="pickerOptions">
      </el-date-picker>
    </div>
    <div class="block">
      <span class="demonstration">设置默认时间</span>
      <el-date-picker
          v-model="value3"
          type="datetime"
          placeholder="选择日期时间"
          default-time="12:00:00">
      </el-date-picker>
  </div>
  <div>
    <button @click="back">返回</button>
  </div>

</div>
</div>
</template>

<style scoped>

</style>