<script>
import axios from "axios";

export default{
  name:"UserControl",
  data(){
    return{
      userlist:null,
      editdialogVisible: false,
      detaildialogVisible: false,
      currentuser:[],
      currentRow: null,
      changeuser:[],

    }
  },
  methods:{
    async submit() {
      try {
        // 1. 深拷贝一份，避免提交过程中意外修改原数据
        const payload = JSON.parse(JSON.stringify(this.currentuser))

        // 2. 发 POST，Content-Type: application/json 自动设置
        await axios.post('http://localhost:12808/lycorisfunServer/api/updatePostinfo', payload)

        // 3. 成功回写 + 提示
        const idx = this.currentRow - 1
        this.$set(this.userlist, idx, payload)   // Vue2 响应式
        this.$message.success('已保存')
      } catch (err) {
        this.$message.error(err.message || '保存失败')
      }
    },
    setCurrent(row) {
      this.$refs.singleTable.setCurrentRow(row);
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    handleCurrentChange(val) {
      this.currentRow = val;
    },
    loadinfo(){
      this.currentuser = JSON.parse(JSON.stringify(this.userlist[this.currentRow-1]))
      //深拷贝-将json数据复制一遍，再赋给新变量
      this.changeuser = JSON.parse(JSON.stringify(this.userlist[this.currentRow-1]))
      // this.changepost=this.postlist[this.currentRow-1];浅拷贝-不同变量指向相同地址
    },
    deleteuser(){
      axios.post('http://localhost:12808/lycorisfunServer/api/deletePost?postid='+this.currentRow)
    }
  },
  created() {
    axios.get("http://localhost:12808/lycorisfunServer/api/userlist").then((res)=>{
      console.log(res.data)
      this.userlist=res.data;
    }).catch(function (err){
      console.log(err)
    });
  }

}
</script>

<template>
  <div>
    <h2>
      用户管理
    </h2>
    <hr>
    <div style="text-align: center;">
      <table v-if="userlist">
        <thead>
        <tr>
          <th>用户id</th>
          <th>用户名</th>
          <th>性别</th>
          <th>注册时间</th>
          <th>签名</th>
          <th>头像url</th>
          <th>邮箱</th>
          <th>个人主页链接</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
          <tr  v-for="user in userlist" :key="user.userId">
            <td>{{user.userId}}</td>
            <td>{{user.userName}}</td>
            <td>{{user.gender}}</td>
            <td>{{user.registerTime}}</td>
            <td>{{user.signature}}</td>
            <td>{{user.avaterURL}}</td>
            <td>{{user.email}}</td>
            <td>{{user.PersonalIndexLink}}</td>
            <td>{{user.status}}</td>
            <td><el-button type="text" @click="function(){currentRow=user.userId;loadinfo();detaildialogVisible=true}">查看</el-button><br>
              <el-button type="text" @click="function(){currentRow=user.userId;loadinfo();editdialogVisible=true;}">编辑</el-button><br>
              <el-button type="text" @click="function(){$confirm('确认删除？').then(deleteuser).catch(_ => {}); currentRow=user.userId;loadinfo();}">删除</el-button></td>
          </tr>
      </table>
      <div v-else>
        <h2 style="color: red">查询不到数据喵，请检查服务器状态喵！</h2>
      </div>
    </div>
    <div>
      <!--      编辑框-->
      <el-dialog
          title="编辑"
          :visible.sync="editdialogVisible"
          width="30%"
          :before-close="handleClose">
        <p><span>用户id</span><el-input v-model="changeuser.userId" placeholder="请输入内容"></el-input></p>
        <p><span>用户名</span><el-input v-model="changeuser.userName" placeholder="请输入内容"></el-input></p>
        <p><span>性别</span><el-input v-model="changeuser.gender" placeholder="请输入内容"></el-input></p>
        <p><span>签名</span><el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="changeuser.signature">
        </el-input></p>
        <p><span>注册时间</span><el-input v-model="changeuser.registerTime" placeholder="请输入内容"></el-input></p>
        <p><span>头像链接</span><el-input v-model="changeuser.avaterURL" placeholder="请输入内容"></el-input></p>
        <p><span>邮箱</span><el-input v-model="changeuser.email" placeholder="请输入内容"></el-input></p>
        <p><span>个人主页链接</span><el-input v-model="changeuser.PersonalIndexLink" placeholder="请输入内容"></el-input></p>
        <p><span>状态</span><el-input v-model="changeuser.status" placeholder="请输入内容"></el-input></p>
        <span slot="footer" class="dialog-footer">
    <el-button @click="function(){editdialogVisible = false;}">取 消</el-button>
    <el-button type="primary" @click="function(){$confirm('确认修改？').then(_ => {
            submit();
          })
          .catch(_ => {}); editdialogVisible = false;}">提 交</el-button>
  </span>
      </el-dialog>
      <!--查看框-->
      <el-dialog
          title="查看"
          :visible.sync="detaildialogVisible"
          width="35%"
          :before-close="handleClose">
        <h2>用户id:</h2>
        <h3>{{currentuser.userId}}</h3>
        <h2>标题:</h2>
        <h3>{{currentuser.userName}}</h3>
        <h2>用户id:</h2>
        <h3>{{currentuser.gender}}</h3>
        <h2>前面:</h2>
        <h3>{{currentuser.signature}}</h3>
        <h2>注册时间:</h2>
        <h3>{{currentuser.registerTime}}</h3>
        <h2>头像链接:</h2>
        <h3>{{currentuser.avaterURL}}</h3>
        <h2>邮箱:</h2>
        <h3>{{currentuser.email}}</h3>
        <h2>个人主页链接:</h2>
        <h3>{{currentuser.PersonalIndexLink}}</h3>
        <h2>状态:</h2>
        <h3>{{currentuser.status}}</h3>
        <span slot="footer" class="dialog-footer">
    <el-button type="primary" @click="detaildialogVisible = false">关 闭</el-button>
  </span>
      </el-dialog>
    </div>
  </div>
</template>

<style scoped>
h2 {
  font-family: var(--font-serif);
  font-size: 22px;
  color: var(--color-primary);
  margin: 2px 0;
  padding-left: 14px;
  border-left: 4px solid var(--color-primary);
}
hr { margin: 10px 0 18px; }

table {
  border-collapse: collapse;
  width: 97%;
  margin: 0 auto 26px;
  background: #fff;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .06);
}
th, td { padding: 12px 16px; text-align: left; }
th {
  background: #fff5f5;
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
  white-space: nowrap;
}
td {
  border-bottom: 1px solid #f1f3f5;
  color: #4a5560;
  font-size: 14px;
  word-break: break-word;
}
tbody tr:hover { background: #fafcfd; }
tbody tr:last-child td { border-bottom: none; }
</style>