<script>
import axios from "axios";

export default {
  name:"SiteControl",
  data(){
    return{
      Announcement:null,
      connect_function:false,
      upload_function:false,
      database_function:false,
      imglinklist:[],
      dialogVisible: false,
      imageUrl: '',
      editdialogVisible:false,
    }
  },
  methods:{
    axios,
    changevisible(){
      this.dialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    deleteIndexImg(id){
      axios({
        method: "post",
        url: "http://localhost:12808/lycorisfunServer/api/deleteIndexIMG",
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')   // 标准字段
        },
        params:{id},
      }).then(res => {
        console.log(res)
        this.$message.success(res.data.msg)
        setTimeout(2000)
        this.$router.go(0)
      }).catch(err=>{
        console.log(err)
      })
    }
    ,
    handleChange(file, fileList) {
      if (file.status === 'ready') {   // 刚选完
        const isImg = ['image/jpeg','image/png','image/gif'].includes(file.raw.type)
        const isLt2M = file.raw.size / 1024 / 1024 < 2
        if (!isImg || !isLt2M) {
          this.$message.error('格式或大小不符')
          fileList.pop()          // 移除不合格文件
          this.fileSelected = false
          return
        }
        this.fileSelected = true
        this.imageUrl = URL.createObjectURL(file.raw) // 本地预览
      }
    },

    /* 真正上传 */
    submitUpload() {
      this.$refs.upload.submit()   // 手动触发表单上传
    },

    /* 上传成功回调 */
    handleSuccess(res) {
      if (res.code === 200) {
        this.$message.success('上传成功')
        this.imageUrl = res.dataobject   // 回显远程地址
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    /* 上传前最后一次校验（可选） */
    beforeUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) this.$message.error('大小不能超过 2MB')
      return isLt2M
    },

    updateStatus_connect(){
      var newstatus;
      if(this.connect_function){
        newstatus=1;
      }else
        newstatus=0;
      axios({
        method: 'post',
        url:"http://localhost:12808/lycorisfunServer/api/updateStatus",
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')   // 标准字段
        },
        params:{funcname:'connectWebSiteOwner',status:newstatus}
      })
    },
    updateStatus_uploadwork(){
      var newstatus;
      if(this.upload_function){
        newstatus=1;
      }else
        newstatus=0;
      axios({
        method: 'post',
        url:"http://localhost:12808/lycorisfunServer/api/updateStatus",
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')   // 标准字段
        },
        params:{funcname:'uploadWork',status: newstatus}
      })
    },
    updateStatus_database(){
      var newstatus;
      if(this.database_function){
        newstatus=1;
      }else
        newstatus=0;
      axios({
        method: 'post',
        url:"http://localhost:12808/lycorisfunServer/api/updateStatus",
        headers: {
          Authorization: 'Bearer ' + localStorage.getItem('token')   // 标准字段
        },
        params:{funcname:'databaseFunction',status:newstatus}
      })
    },


  },
  created() {
    axios.post("http://localhost:12808/lycorisfunServer/api/getAnnouncement").then((res)=>{
      console.log(res)
      this.Announcement=res.data;
    }).catch(function (err){
      console.log(err)
      console.log("找不到方法喵")
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=connectWebSiteOwner").then((res)=>{
      console.log(res.data)
      this.connect_function=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=uploadWork").then((res)=>{
      console.log(res.data)
      this.upload_function=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getfuncstatus?funcname=databaseFunction").then((res)=>{
      console.log(res.data)
      this.database_function=res.data
    }).catch(function (err){
      console.log("出错了喵"+err)
    })

    axios.post("http://localhost:12808/lycorisfunServer/api/getIndexIMG").then((res)=>{
      console.log(res)
      this.imglinklist=res.data.data;
    }).catch(function (err){
      console.log(err)
      console.log("找不到方法喵")
    })

  }
}
</script>

<template>
<div>
<h1>站内管理</h1>
  <hr>
  <div>
    <div v-if="Announcement">
      <h3>全站公告:</h3>
      <textarea style="width: 50vh; height: 8vh;">
        {{Announcement}}
      </textarea>
      <el-button>更新</el-button>
    </div>
    <div v-else>
      <h3>全站公告:</h3>
      <textarea style="width: 50vh; height: 8vh;">
        无法连接到服务器，请检查网络
      </textarea>
    </div>
    <hr>
    <div>
      <h3>首页宣传报</h3>
      <div v-if="imglinklist" class="clearfix">
        <div v-for="img in imglinklist" style="float: left; ">
          <img :src="img.function_link" style="height: 10vh;width: 15vh">
        </div>
        <el-button @click="function(){editdialogVisible = true;}" >更 改</el-button>
        <el-dialog
            title="更改"
            :visible.sync="editdialogVisible"
            width="30%"
            :before-close="handleClose">
          <div v-for="img in imglinklist" style="float: left; ">
            <img :src="img.function_link" style="height: 10vh;width: 15vh"><el-button @click="deleteIndexImg(img.id)">删除</el-button>
          </div>
          <span slot="footer" class="dialog-footer">
    <el-button @click="function(){editdialogVisible = false;}">取 消</el-button>
          </span>
        </el-dialog>
        <el-button @click="changevisible">添 加</el-button>
        <el-dialog
            title="上 传"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
          <el-upload
              ref="upload"
          action="http://localhost:12808/lycorisfunServer/api/addIndexIMG"
          :auto-upload="false"
          :limit="1"
          :on-change="handleChange"
          :on-success="handleSuccess"
          :before-upload="beforeUpload">
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <span slot="footer" class="dialog-footer">
    <el-button @click="dialogVisible = false">取 消</el-button>
    <el-button type="primary" @click="submitUpload(),dialogVisible = false">确 定</el-button>
  </span>
        </el-dialog>
      </div>
      <div v-else class="clearfix">
        <p>暂无数据，请检查与服务器的连接</p>
    </div>
    <hr>
    <div>
      <h3>站内功能</h3>
      <section>
        <h4>联系站长功能启用</h4>
        <el-switch @change="updateStatus_connect" v-model="connect_function"></el-switch>
      </section>

      <section>
        <h4>上传作品功能启用</h4>
        <el-switch @change="updateStatus_uploadwork" v-model="upload_function"></el-switch>
      </section>

      <section>
        <h4>资料库功能启用</h4>
        <el-switch @change="updateStatus_database" v-model="database_function"></el-switch>
      </section>

    </div>
  </div>
</div>
</div>
</template>

<style scoped>
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>