<script >
export default {
  name: "TakeMessage",
  data() {
    return {
      form: {
        name: '',
        link: '',
        message: '',
        email:'',
        avater: '',
      },
      ifallow: true,
    }
  },
  methods: {
    onSubmit() {
      console.log('submit!');
    },
    goback(){
      this.$router.go(-1);
    }
  },
  computed: {
    ifallow() {
      const { name, link, message,email } = this.form
      return !!name && !!link && !!message && !!email
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
            <h2>写留言</h2>
            <hr>
          </div>
          <div class="padding_20px width_70vh" >
            <el-form ref="form" :model="form"  label-width="70px">
                <el-form-item  label="昵称">
                  <el-input :model="form.name" placeholder="请输入昵称"></el-input>
                </el-form-item>
                <el-form-item  label="个人主页">
                  <el-input :model="form.link" placeholder="请输入您的主页链接"></el-input>
                </el-form-item>
                <el-form-item  label="留言">
                  <el-input :model="form.message" placeholder="请输入留言内容" type="textarea" ></el-input>
                </el-form-item>
                <el-form-item  label="头像链接">
                  <el-input :model="form.avater" placeholder="请输入您的头像链接"></el-input>
                </el-form-item>
              <el-form-item>
                <el-button type="primary" :disabled="ifallow" @click="onSubmit">提交</el-button>
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