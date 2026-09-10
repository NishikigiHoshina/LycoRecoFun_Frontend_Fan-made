<script>
import axios from "axios";
import { warnIfUnsupported } from "@/utils/validate";

const API = "http://localhost:12808/lycorisfunServer/api";

export default{
  name:"UserControl",
  data(){
    return{
      userlist:null,
      editdialogVisible: false,
      detaildialogVisible: false,
      currentuser:{},        // 查看：当前选中用户（只读，直接引用表格行）
      changeuser:{},         // 编辑：可改副本，提交的就是它
      saving: false,
      // 分页：/userlist 一次返回全部，这里在客户端切片（见下方 pagedUsers）
      currentPage: 1,
      pageSize: 10,
      // 状态取值与后端校验一致：1 正常 / 2 停用 / 3 管理员
      statusOptions:[
        { value:1, label:'1 · 正常' },
        { value:2, label:'2 · 停用' },
        { value:3, label:'3 · 管理员' },
      ],
    }
  },
  methods:{
    /* 查看：直接用表格行，无需拷贝 */
    openDetail(user){
      this.currentuser = user
      this.detaildialogVisible = true
    },
    /* 编辑：深拷贝一份，弹窗里的改动在提交前不污染列表 */
    openEdit(user){
      this.changeuser = JSON.parse(JSON.stringify(user))
      this.editdialogVisible = true
    },
    async submit() {
      if (warnIfUnsupported(this, [
        { name: '用户名', value: this.changeuser.userName },
        { name: '签名', value: this.changeuser.signature },
        { name: '头像链接', value: this.changeuser.avaterURL },
        { name: '个人主页链接', value: this.changeuser.PersonalIndexLink },
      ])) return

      this.saving = true
      try {
        // 提交的是弹窗绑定的 changeuser（此前误提交 currentuser，导致输入被丢弃）
        const payload = JSON.parse(JSON.stringify(this.changeuser))
        const res = await axios.post(`${API}/updateUserinfo`, payload)
        const saved = (res.data && res.data.data) || payload

        // 按 userId 定位回写：userId 不保证连续，不能用「行号 = id - 1」
        const idx = this.userlist.findIndex(u => u.userId === saved.userId)
        if (idx !== -1) {
          this.$set(this.userlist, idx, { ...this.userlist[idx], ...saved })
        }
        this.$message.success((res.data && res.data.msg) || '已保存')
        this.editdialogVisible = false
      } catch (err) {
        const msg = err.response && err.response.data && err.response.data.msg
        this.$message.error(msg || err.message || '保存失败')
      } finally {
        this.saving = false
      }
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    /* 删除用户：走后端 /deleteUser（软删除 → users.status=2「停用」）。
       修复前这里打的是 /deletePost?postid=<userId>，删用户 #5 会把帖子 #5 一起删掉。 */
    async deleteuser(user) {
      try {
        await this.$confirm(
            `确认删除用户「${user.userName}」（ID ${user.userId}）？该操作会将其状态置为「停用」。`,
            '提示',
            { type: 'warning' }
        )
      } catch (cancel) {
        return   // 点了取消，什么都不做
      }
      try {
        const res = await axios.post(`${API}/deleteUser?userid=` + user.userId)
        this.$message.success((res.data && res.data.msg) || '删除成功')
        await this.loadUsers()          // 重新拉列表，状态列立即变「2」
      } catch (err) {
        const msg = err.response && err.response.data && err.response.data.msg
        this.$message.error(msg || err.message || '删除失败')
      }
    },
    async loadUsers() {
      try {
        const res = await axios.get(`${API}/userlist`)
        this.userlist = res.data
        this.clampPage()
      } catch (err) {
        console.log(err)
      }
    },
    /** 列表变动后把页码收回有效范围（删除/刷新都走这里） */
    clampPage() {
      if (this.currentPage > this.pageCount) this.currentPage = this.pageCount
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    }
  },
  computed: {
    total() {
      return (this.userlist || []).length
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
    /** 当前页要展示的行；Math.min 对越界页自愈，避免"删掉末页最后一条后看到空表" */
    pagedUsers() {
      const list = this.userlist || []
      const page = Math.min(this.currentPage, this.pageCount)
      const start = (page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    }
  },
  created() {
    this.loadUsers()
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
          <tr  v-for="user in pagedUsers" :key="user.userId">
            <td>{{user.userId}}</td>
            <td>{{user.userName}}</td>
            <td>{{user.gender}}</td>
            <td>{{user.registerTime}}</td>
            <td>{{user.signature}}</td>
            <td>{{user.avaterURL}}</td>
            <td>{{user.email}}</td>
            <td>{{user.PersonalIndexLink}}</td>
            <td>{{user.status}}</td>
            <td><el-button type="text" @click="openDetail(user)">查看</el-button><br>
              <el-button type="text" @click="openEdit(user)">编辑</el-button><br>
              <el-button type="text" @click="deleteuser(user)">删除</el-button></td>
          </tr>
      </table>
      <div v-else>
        <h2 style="color: red">查询不到数据喵，请检查服务器状态喵！</h2>
      </div>
    </div>
    <!-- 分页：total>0 时始终显示（若改成"超过一页才显示"，把 pageSize 调大后控件会消失、切不回来） -->
    <div class="pager" v-if="total > 0">
      <el-pagination
          background
          layout="total, sizes, prev, pager, next, jumper"
          :page-sizes="[10, 20, 50, 100]"
          :current-page="currentPage"
          :page-size="pageSize"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handlePageChange">
      </el-pagination>
    </div>
    <div>
      <!--      编辑框-->
      <el-dialog
          title="编辑"
          :visible.sync="editdialogVisible"
          width="30%"
          :before-close="handleClose">
        <!-- userId 是主键，改动会把更新打到别的用户身上；这里锁死只读 -->
        <p><span>用户id</span><el-input v-model="changeuser.userId" disabled placeholder="不可修改"></el-input></p>
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
        <p><span>状态</span>
          <el-select v-model="changeuser.status" placeholder="请选择状态">
            <el-option
                v-for="opt in statusOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value">
            </el-option>
          </el-select>
        </p>
        <span slot="footer" class="dialog-footer">
    <el-button @click="function(){editdialogVisible = false;}">取 消</el-button>
    <el-button type="primary" :loading="saving" @click="function(){$confirm('确认修改？').then(_ => {
            submit();
          })
          .catch(_ => {});}">提 交</el-button>
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
        <h2>用户名:</h2>
        <h3>{{currentuser.userName}}</h3>
        <h2>性别:</h2>
        <h3>{{currentuser.gender}}</h3>
        <h2>签名:</h2>
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
  background: var(--color-surface);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .06);
}
th, td { padding: 12px 16px; text-align: left; }
th {
  background: var(--color-surface)5f5;
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
  white-space: nowrap;
}
td {
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  font-size: 14px;
  word-break: break-word;
}
tbody tr:hover { background: var(--color-surface-hover); }
tbody tr:last-child td { border-bottom: none; }

/* 编辑弹窗里的“状态”下拉：与同弹窗的 el-input 等宽（el-select 默认按内容收缩） */
.el-select { width: 100%; }

/* 分页控件：居中，与表格留出间距 */
.pager {
  display: flex;
  justify-content: center;
  padding: 0 0 26px;
}
</style>