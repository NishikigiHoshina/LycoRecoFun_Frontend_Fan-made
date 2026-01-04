<script >
import axios from "axios";

export default {
  name: "TakeMessage",
  data() {
    return {
      form: {
        post_username:'',
        content: '',
        link:'',
      },
      allow:true,
      // ifallow: true,
    }
  },
  methods: {
    async onSubmit() {
      try {
        // 1. 整包提交（字段名 == 构造器参数名）
        const res = await axios.post(
            'http://localhost:12808/lycorisfunServer/api/takemessage',
            this.form          // {title, post_username, content, link, imgurl}
        )
        // 2. 后端返回 boolean
        if (res.data === true) {
          this.$message.success('发布成功')
          // 可选：清空表单
          this.$refs.form.resetFields()
        } else {
          this.$message.error('发布失败')
        }
      } catch (err) {
        // 3. 统一异常
        this.$message.error(err.response?.data || '网络错误')
      }
    },
    goback(){
      this.$router.go(-1);
    }


  },
  computed: {
    ifallow() {
      return this.form.post_username.trim().length > 0 &&
          this.form.link.trim().length > 0 &&
          this.form.content.trim().length > 0
    }
  },
  watch: {
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
          <div>
            <h1 style="text-align: right;color: #159ee6">写留言</h1>
            <hr>
          </div>
          <div class="padding_20px width_70vh" >
            <el-form ref="form" v-model="form"  label-width="70px">
                <el-form-item  label="昵称">
                  <el-input v-model="form.post_username" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item  label="个人主页">
                  <el-input v-model="form.link" placeholder="请输入您的主页链接"></el-input>
                </el-form-item>
                <el-form-item  label="留言">
                  <el-input v-model="form.content" placeholder="请输入留言内容" type="textarea" ></el-input>
                </el-form-item>
<!--                <el-form-item  label="头像链接">
                  <el-input v-model="form.imgurl" placeholder="请输入您的头像链接"></el-input>
                </el-form-item>-->
              <el-form-item>
                <el-button type="primary" :disabled="!ifallow" @click="onSubmit">提交</el-button>
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
}
.width_70vh{
  width: 70vh;
}
.card-main{
  background-color: #cff3f3;
  margin: 1vh;
  border-radius: 15px;
  min-height: 60vh;
}
</style>