<script>
import axios from "axios";

// 与后端 lycorisfun.upload.types.index-img.* 保持一致（后端调整配置时请同步此处）
const MAX_IMG_SIZE = 5 * 1024 * 1024   // 5MB
const IMG_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']

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
      // 打开弹窗：清空上次预览与文件列表，避免残留旧文件再次提交产生重复图片
      this.imageUrl = ''
      this.dialogVisible = true
      this.$nextTick(() => {
        if (this.$refs.upload) this.$refs.upload.clearFiles()
      })
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
        params:{id},
      }).then(res => {
        this.$message.success(res.data.msg || '删除成功')
        this.loadImgs()
      }).catch(err=>{
        this.$message.error('删除失败：' + (err.response?.data?.msg || err.message))
      })
    },
    handleChange(file, fileList) {
      if (file.status === 'ready') {   // 刚选完
        const isImg = IMG_MIME.includes(file.raw.type)
        if (!isImg) {
          this.$message.error('仅支持 jpg/jpeg/png/gif/webp 图片')
          fileList.pop()          // 移除不合格文件
          return
        }
        if (file.raw.size > MAX_IMG_SIZE) {
          this.$message.error('图片大小不能超过 5MB')
          fileList.pop()
          return
        }
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
        this.loadImgs()                  // 刷新宣传图列表
        if (this.$refs.upload) this.$refs.upload.clearFiles()
      } else {
        this.$message.error(res.msg || '上传失败')
      }
    },

    /* 上传前最后一次校验（与 handleChange 同口径，双保险） */
    beforeUpload(file) {
      if (file.size > MAX_IMG_SIZE) {
        this.$message.error('图片大小不能超过 5MB')
        return false
      }
      return true
    },
    /* 后端拒绝时（超限/非图片/越权）展示后端 msg */
    handleUploadError(err) {
      const msg = err && err.response && err.response.data && err.response.data.msg
      this.$message.error('上传失败：' + (msg || '网络错误'))
    },
    loadImgs() {
      axios.post("http://localhost:12808/lycorisfunServer/api/getIndexIMG").then((res)=>{
        this.imglinklist = (res.data && res.data.data) || []
      }).catch(() => {})
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
        params:{funcname:'connectWebSiteOwner',status:newstatus}
      }).catch(err => console.warn('[SiteControl] 更新 connectWebSiteOwner 失败:', err))
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
        params:{funcname:'uploadWork',status: newstatus}
      }).catch(err => console.warn('[SiteControl] 更新 uploadWork 失败:', err))
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
        params:{funcname:'databaseFunction',status:newstatus}
      }).catch(err => console.warn('[SiteControl] 更新 databaseFunction 失败:', err))
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

    this.loadImgs()

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
              :with-credentials="true"
          action="http://localhost:12808/lycorisfunServer/api/addIndexIMG"
          :auto-upload="false"
          :limit="1"
          :on-change="handleChange"
          :on-success="handleSuccess"
          :on-error="handleUploadError"
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
/* ---- 页面标题 ---- */
h1 {
  font-family: var(--font-serif);
  font-size: 24px;
  color: var(--color-primary);
  margin: 2px 0;
  padding-left: 14px;
  border-left: 4px solid var(--color-primary);
}
hr { margin: 10px 0 18px; }

/* ---- 小节标题 ---- */
h3 {
  font-family: var(--font-serif);
  font-size: 16px;
  color: var(--color-text);
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 18px 0 10px;
}
h3::before {
  content: '';
  width: 9px;
  height: 9px;
  border-radius: 2px;
  background: var(--color-primary);
}
h4 {
  font-size: 14px;
  font-weight: 500;
  color: var(--color-text);
  margin: 0;
}

/* ---- 功能区白色行卡 ---- */
section {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .04);
  padding: 16px 20px;
  margin: 12px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  transition: box-shadow .3s var(--ease-smooth);
}
section:hover { box-shadow: 0 10px 26px rgba(0, 0, 0, .08); }

/* ---- 公告文本框 ---- */
textarea {
  width: 60%;
  min-height: 96px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
  padding: 10px 12px;
  font-family: var(--font-sans);
  font-size: 14px;
  color: var(--color-text);
  resize: vertical;
  outline: none;
}
textarea:focus { border-color: var(--color-secondary); }

/* ---- 宣传图白卡条 ---- */
.clearfix {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, .04);
  padding: 16px;
  margin: 12px 0;
}
.clearfix img {
  border-radius: 6px;
  margin: 0 10px 10px 0;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .08);
}
.clearfix::after {
  content: '';
  display: block;
  clear: both;
}

.avatar-uploader .el-upload {
  border: 1px dashed var(--color-border-strong);
  border-radius: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: var(--color-secondary);
}
.avatar-uploader-icon {
  font-size: 28px;
  color: var(--color-muted);
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