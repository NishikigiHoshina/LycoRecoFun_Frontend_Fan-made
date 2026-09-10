<script >
import axios from "axios";

const API = "http://localhost:12808/lycorisfunServer/api";

export default{
  name:"PostControl",
  data(){
    return{
      postlist:null,
      editdialogVisible: false,
      detaildialogVisible: false,
      currentpost:{},
      changepost:[],
      saving: false,
      // 分页：/getPostList 一次返回全部（含评论与留言），这里在客户端切片
      currentPage: 1,
      pageSize: 10,
      // posts 表的 status 一列多用：1 帖子/评论、3 留言、0 软删除
      statusOptions:[
        { value:1, label:'1 · 正常（帖子/评论）' },
        { value:3, label:'3 · 留言' },
        { value:0, label:'0 · 已删除（软删）' },
      ],

    }
  },
  computed: {
    total() {
      return (this.postlist || []).length
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
    /** 当前页要展示的行；Math.min 对越界页自愈，避免"删掉末页最后一条后看到空表" */
    pagedPosts() {
      const list = this.postlist || []
      const page = Math.min(this.currentPage, this.pageCount)
      const start = (page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    }
  },
  methods:{
    async submit() {
      this.saving = true
      try {
        // 1. 深拷贝一份，避免提交过程中意外修改原数据
        const payload = JSON.parse(JSON.stringify(this.changepost))

        // 2. 发 POST，Content-Type: application/json 自动设置
        await axios.post(`${API}/updatePostinfo`, payload)

        // 3. 成功回写 + 提示。**按 postid 定位**，不能用「postid - 1」当下标：
        //    行数远小于 id、且分页后可见行只是切片的一部分，按下标写会改错行；
        //    越界时 $set 还会给数组追加元素，凭空多出一行、把分页总数也带偏。
        const idx = this.postlist.findIndex(p => p.postid === payload.postid)
        if (idx !== -1) {
          this.$set(this.postlist, idx, { ...this.postlist[idx], ...payload })
        }
        this.$message.success('已保存')
        this.editdialogVisible = false           // 保存成功才关弹窗，失败时保留用户输入
      } catch (err) {
        const msg = err.response && err.response.data && err.response.data.msg
        this.$message.error(msg || err.message || '保存失败')
      } finally {
        this.saving = false
      }
    },
    /* 查看：直接用表格行，不再用「postid - 1」当下标 —— 行数与 id 都不保证连续 */
    openDetail(row) {
      this.currentpost = row
      this.detaildialogVisible = true
    },
    /* 编辑：深拷贝一份，弹窗里的改动在提交前不污染列表 */
    openEdit(row) {
      this.changepost = JSON.parse(JSON.stringify(row))
      this.editdialogVisible = true
    },
    handleClose(done) {
      this.$confirm('确认关闭？')
          .then(_ => {
            done();
          })
          .catch(_ => {});
    },
    async deletepost(row) {
      try {
        await this.$confirm(`确认删除帖子《${row.title || ('#' + row.postid)}》？`, '提示', { type: 'warning' })
      } catch (cancel) {
        return   // 点了取消
      }
      try {
        await axios.post(`${API}/deletePost?postid=` + row.postid)
        this.$message.success('已删除')
        await this.loadPosts()          // 重新拉列表，让软删后的状态立即反映出来
      } catch (err) {
        const msg = err.response && err.response.data && err.response.data.msg
        this.$message.error(msg || err.message || '删除失败')
      }
    },
    async loadPosts() {
      try {
        const res = await axios.get(`${API}/getPostList`)
        this.postlist = res.data
        this.clampPage()
      } catch (err) {
        console.log(err)
      }
    },
    /** 列表变动后把页码收回有效范围 */
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
  created() {
    this.loadPosts()
  }

}
</script>

<template>
  <div>
    <h2>
      帖子管理
    </h2>
    <hr>
    <div style="text-align: center;">
      <table v-if="postlist">
        <thead>
        <tr>
          <th>帖子id</th>
          <th>标题</th>
          <th>摘要</th>
          <th>创建时间</th>
          <th>根节点</th>
          <th>状态</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
        </thead>
          <tr  v-for="post in pagedPosts" :key="post.postid">
            <td>{{post.postid}}</td>
            <td>{{post.title}}</td>
            <td>{{post.content}}</td>
            <td>{{post.created_at}}</td>
            <td>{{post.root_id}}</td>
            <td>{{post.status}}</td>
            <td>{{post.post_username}}</td>
            <td><el-button type="text" @click="openDetail(post)">查看</el-button><br>
              <el-button type="text" @click="openEdit(post)">编辑</el-button><br>
              <el-button type="text" @click="deletepost(post)">删除</el-button></td>
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
        <!-- 只有 标题 / 摘要 / 状态 可改，其余全部只读：
             ① 正文已是结构化文档（另存 post_bodies），后台不做文档编辑器，故只展示摘要；
             ② postid 是主键、post_userid 是作者，误改会把更新打到别的行；
             ③ 计数与层级字段由业务流程维护，手改只会造成数据不一致。 -->
        <p><span>帖子id</span><el-input v-model="changepost.postid" disabled placeholder="不可修改"></el-input></p>
        <p><span>标题</span><el-input v-model="changepost.title" placeholder="请输入标题"></el-input></p>
        <p><span>用户id</span><el-input v-model="changepost.post_userid" disabled placeholder="不可修改"></el-input></p>
        <p><span>摘要</span><el-input
            type="textarea"
            :rows="2"
            placeholder="列表页展示的纯文本摘要"
            v-model="changepost.content">
        </el-input></p>
        <p><span>创建时间</span><el-input v-model="changepost.created_at" disabled placeholder="不可修改"></el-input></p>
        <p><span>点赞数</span><el-input v-model="changepost.like_count" disabled placeholder="不可修改"></el-input></p>
        <p><span>跳转链接</span><el-input v-model="changepost.link" disabled placeholder="不可修改"></el-input></p>
        <p><span>图片链接</span><el-input v-model="changepost.imgurl" disabled placeholder="不可修改"></el-input></p>
        <p><span>父节点id</span><el-input v-model="changepost.parent_id" disabled placeholder="不可修改"></el-input></p>
        <p><span>根节点id</span><el-input v-model="changepost.root_id" disabled placeholder="不可修改"></el-input></p>
        <p><span>帖子状态</span>
          <el-select v-model="changepost.status" placeholder="请选择状态">
            <el-option
                v-for="opt in statusOptions"
                :key="opt.value"
                :label="opt.label"
                :value="opt.value">
            </el-option>
          </el-select>
        </p>
        <p><span>回复统计</span><el-input v-model="changepost.reply_count" disabled placeholder="不可修改"></el-input></p>
        <p><span>发帖人用户名</span><el-input v-model="changepost.post_username" disabled placeholder="不可修改"></el-input></p>
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
        <h2>帖子id:</h2>
        <h3>{{currentpost.postid}}</h3>
        <h2>标题:</h2>
        <h3>{{currentpost.title}}</h3>
        <h2>用户id:</h2>
        <h3>{{currentpost.post_userid}}</h3>
        <h2>摘要:</h2>
        <h3>{{currentpost.content}}</h3>
        <h2>创建时间:</h2>
        <h3>{{currentpost.created_at}}</h3>
        <h2>点赞数:</h2>
        <h3>{{currentpost.like_count}}</h3>
        <h2>跳转链接:</h2>
        <h3>{{currentpost.link}}</h3>
        <h2>图片链接:</h2>
        <h3>{{currentpost.imgurl}}</h3>
        <h2>父节点id:</h2>
        <h3>{{currentpost.parent_id}}</h3>
        <h2>根节点id:</h2>
        <h3>{{currentpost.root_id}}</h3>
        <h2>帖子状态:</h2>
        <h3>{{currentpost.status}}</h3>
        <h2>回复统计:</h2>
        <h3>{{currentpost.reply_count}}</h3>
        <h2>发帖人用户名:</h2>
        <h3>{{currentpost.post_username}}</h3>
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

/* 编辑弹窗里的“帖子状态”下拉：与同弹窗的 el-input 等宽（el-select 默认按内容收缩） */
.el-select { width: 100%; }

/* 分页控件：居中，与表格留出间距 */
.pager {
  display: flex;
  justify-content: center;
  padding: 0 0 26px;
}
</style>