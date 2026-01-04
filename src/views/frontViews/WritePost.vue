<script setup>
</script>
<script>
import WangEditor from '@/components/WangEditor.vue'
import axios from "axios";

export default {
  name: 'writepost',
  components: { WangEditor },
  data(){
    return{
      form:{
        title:'',
        content:'',
        post_userid:'',
        created_at:'',
      }
    }
  },
  methods:{
    async handlePost() {
      this.form.post_userid = window.localStorage.getItem('userId')
      this.form.created_at = new Date().toLocaleString('zh-CN') // 用真实时间
      if (!this.form.post_userid) {
        this.$message.warning('用户信息为空')
        return
      }
      try {
        const { data } = await axios({
          method:'post',
          url:'http://localhost:12808/lycorisfunServer/api/writepost',
          headers: {
            Authorization: 'Bearer ' + localStorage.getItem('token')   // 标准字段
          },
          data:this.form})
        this.$message.success(data.msg)
        setTimeout(() => this.$router.go(0), 2000)
      } catch (e) {
        this.$message.warning(e?.response?.data?.msg || '网络错误')
      }
    },
    goback() {
      this.$router.back()
    }
  },
  computed:{
    allowsubmit(){
      return this.form.title.trim().length>0
          && this.form.content.trim().length>11
    }
  }


}
</script>

<template>
  <div>
    <el-row>
      <el-col :span="2">
        <p>&nbsp;</p>
      </el-col>
      <el-col :span="20">
        <div class="padding_20px card-main" >
          <el-row class="padding_20px">
            <div style="text-align: right">
              <h1 style="text-align: right;color: #159ee6">发帖</h1>
              <hr>
            </div>
            <div class="padding_20px" >
              <el-form ref="form" :model="form"  label-width="70px">
                <el-form-item  label="标题">
                  <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item  label="留言">
                  <WangEditor v-model="form.content" />
                </el-form-item>
                <el-form-item>
                  <el-button type="primary" :disabled="!allowsubmit" @click="handlePost">发表</el-button>
                  <el-button @click="goback">取消</el-button>
                </el-form-item>
              </el-form>
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
  width: 100%;
}

.card-main{
  background-color: #cff3f3;
  margin: 1vh;
  border-radius: 15px;
  min-height: 60vh;
}
</style>