<script>
import axios from "axios";
import { warnIfUnsupported } from '@/utils/validate'

export default {
  name: "NewsControl",
  data() {
    return {
      newslist: null,
      loading: false,
      createVisible: false,
      editdialogVisible: false,
      detaildialogVisible: false,
      createForm: { title: '', imgurl: '', news_link: '', time: '' },
      editingNews: { news_id: 0, title: '', imgurl: '', news_link: '', time: '', status: 1 },
      viewingNews: {},
      // 分页：列表接口一次返回全部，这里在客户端切片（见下方 pagedNews 的说明）
      currentPage: 1,
      pageSize: 10
    }
  },
  computed: {
    total() {
      return (this.newslist || []).length
    },
    pageCount() {
      return Math.max(1, Math.ceil(this.total / this.pageSize))
    },
    /**
     * 当前页要展示的行。
     * 用 Math.min 对越界页做自愈：删掉末页最后一条后不必再手动兜底，否则会看到一张空表。
     */
    pagedNews() {
      const list = this.newslist || []
      const page = Math.min(this.currentPage, this.pageCount)
      const start = (page - 1) * this.pageSize
      return list.slice(start, start + this.pageSize)
    }
  },
  methods: {
    loadNews() {
      this.loading = true
      axios.post("http://localhost:12808/lycorisfunServer/api/newslistAll").then((res) => {
        this.newslist = res.data || []
        this.clampPage()
      }).catch(err => {
        console.log(err)
        this.$message.error('新闻列表加载失败：' + (err.response?.data?.msg || err.message))
      }).finally(() => { this.loading = false })
    },
    /** 列表变动后把页码收回有效范围（删除/新建/刷新都走这里） */
    clampPage() {
      if (this.currentPage > this.pageCount) this.currentPage = this.pageCount
    },
    handleSizeChange(size) {
      this.pageSize = size
      this.currentPage = 1
    },
    handlePageChange(page) {
      this.currentPage = page
    },
    statusText(s) { return s === 0 ? '已删除' : '正常' },
    statusType(s) { return s === 0 ? 'info' : 'success' },

    openCreate() {
      this.createForm = { title: '', imgurl: '', news_link: '', time: '' }
      this.createVisible = true
    },
    async saveNews() {
      if (!this.createForm.title.trim()) { this.$message.warning('标题不能为空'); return }
      if (warnIfUnsupported(this, [
        { name: '标题', value: this.createForm.title },
        { name: '图片链接', value: this.createForm.imgurl },
        { name: '新闻链接', value: this.createForm.news_link }
      ])) return
      try {
        const res = await axios({
          method: 'post',
          url: 'http://localhost:12808/lycorisfunServer/api/addnews',
          data: { ...this.createForm }
        })
        this.$message.success(res.data.msg || '发布成功')
        this.createVisible = false
        this.loadNews()
      } catch (err) {
        this.$message.error('发布失败：' + (err.response?.data?.msg || err.message))
      }
    },

    openEdit(row) {
      this.editingNews = JSON.parse(JSON.stringify(row))
      if (this.editingNews.status == null) this.editingNews.status = 1
      this.editdialogVisible = true
    },
    async submitEdit() {
      if (!this.editingNews.title || !String(this.editingNews.title).trim()) {
        this.$message.warning('标题不能为空'); return
      }
      if (warnIfUnsupported(this, [
        { name: '标题', value: this.editingNews.title },
        { name: '图片链接', value: this.editingNews.imgurl },
        { name: '新闻链接', value: this.editingNews.news_link }
      ])) return
      try {
        const payload = {
          news_id: this.editingNews.news_id,
          title: this.editingNews.title,
          imgurl: this.editingNews.imgurl,
          news_link: this.editingNews.news_link,
          time: this.editingNews.time,
          status: Number(this.editingNews.status)
        }
        const res = await axios({
          method: 'post',
          url: 'http://localhost:12808/lycorisfunServer/api/updatenews',
          data: payload
        })
        this.$message.success(res.data.msg || '保存成功')
        this.editdialogVisible = false
        this.loadNews()
      } catch (err) {
        this.$message.error('保存失败：' + (err.response?.data?.msg || err.message))
      }
    },

    openDetail(row) {
      this.viewingNews = row
      this.detaildialogVisible = true
    },

    askDelete(row) {
      this.$confirm(
        `确认删除《${row.title || ('#' + row.news_id)}》？删除后前台将不再展示（软删除，status=0）。`,
        '删除确认',
        { type: 'warning', confirmButtonText: '删除', cancelButtonText: '取消' }
      ).then(async () => {
        try {
          const res = await axios.post('http://localhost:12808/lycorisfunServer/api/deletenews?news_id=' + row.news_id)
          this.$message.success(res.data.msg || '删除成功')
          this.loadNews()
        } catch (err) {
          this.$message.error('删除失败：' + (err.response?.data?.msg || err.message))
        }
      }).catch(() => { })
    }
  },
  created() {
    this.loadNews()
  }
}
</script>

<template>
  <div>
    <h2>新闻管理</h2>
    <hr>
    <div class="toolbar">
      <el-button type="primary" size="small" icon="el-icon-plus" :loading="loading" @click="openCreate">新建新闻</el-button>
    </div>

    <div class="table-wrap" v-if="newslist && newslist.length">
      <table>
        <thead>
          <tr>
            <th style="width: 70px">id</th>
            <th>标题</th>
            <th style="width: 170px">发布时间</th>
            <th style="width: 100px">状态</th>
            <th style="width: 170px">操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="news in pagedNews" :key="news.news_id">
            <td>{{ news.news_id }}</td>
            <td class="cell-title">{{ news.title }}</td>
            <td>{{ news.time }}</td>
            <td>
              <el-tag :type="statusType(news.status)" size="mini">{{ statusText(news.status) }}</el-tag>
            </td>
            <td>
              <el-button type="text" size="small" @click="openDetail(news)">查看</el-button>
              <el-button type="text" size="small" @click="openEdit(news)">编辑</el-button>
              <el-button type="text" size="small" class="danger" @click="askDelete(news)">删除</el-button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div v-else-if="!loading" class="empty">
      <h2>查询不到数据喵，请检查服务器状态喵！</h2>
    </div>

    <!-- 分页：始终在 total>0 时显示（若改成"超过一页才显示"，把 pageSize 调大后控件会消失、就切不回来了） -->
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

    <!-- 新建新闻 -->
    <el-dialog title="新建新闻" :visible.sync="createVisible" width="40%">
      <p><span>标题 *</span><el-input v-model="createForm.title" placeholder="请输入标题"></el-input></p>
      <p><span>图片链接</span><el-input v-model="createForm.imgurl" placeholder="https://…/xxx.png"></el-input></p>
      <p><span>新闻链接</span><el-input v-model="createForm.news_link" placeholder="https://…"></el-input></p>
      <p><span>发布时间</span><el-input v-model="createForm.time" placeholder="留空使用当前时间，格式 2026-09-10 10:00"></el-input></p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="createVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveNews">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 编辑新闻 -->
    <el-dialog title="编辑新闻" :visible.sync="editdialogVisible" width="40%">
      <p><span>ID</span><el-input :value="editingNews.news_id" disabled></el-input></p>
      <p><span>标题 *</span><el-input v-model="editingNews.title" placeholder="请输入标题"></el-input></p>
      <p><span>图片链接</span><el-input v-model="editingNews.imgurl" placeholder="https://…/xxx.png"></el-input></p>
      <p><span>新闻链接</span><el-input v-model="editingNews.news_link" placeholder="https://…"></el-input></p>
      <p><span>发布时间</span><el-input v-model="editingNews.time" placeholder="格式 2026-09-10 10:00"></el-input></p>
      <p>
        <span>状态</span>
        <el-select v-model="editingNews.status" style="width:100%">
          <el-option :value="1" label="正常（前台展示）"></el-option>
          <el-option :value="0" label="已删除（前台隐藏，可改回 1 恢复）"></el-option>
        </el-select>
      </p>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editdialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitEdit">保 存</el-button>
      </span>
    </el-dialog>

    <!-- 查看新闻 -->
    <el-dialog title="查看" :visible.sync="detaildialogVisible" width="40%">
      <p><span>ID</span><span class="val">{{ viewingNews.news_id }}</span></p>
      <p><span>标题</span><span class="val">{{ viewingNews.title }}</span></p>
      <p><span>图片链接</span><span class="val">{{ viewingNews.imgurl }}</span></p>
      <p><span>新闻链接</span><span class="val">{{ viewingNews.news_link }}</span></p>
      <p><span>发布时间</span><span class="val">{{ viewingNews.time }}</span></p>
      <p><span>状态</span><span class="val">{{ statusText(viewingNews.status) }}</span></p>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="detaildialogVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
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
hr { margin: 10px 0 14px; }

/* 工具栏 */
.toolbar {
  padding: 0 16px 12px;
  text-align: left;
}

/* ===== 主题化表格卡片 ===== */
.table-wrap {
  width: 97%;
  margin: 0 auto 26px;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 28px rgba(0, 0, 0, .06);
}
table {
  border-collapse: collapse;
  width: 100%;
}
th, td {
  padding: 12px 16px;
  text-align: left;
  font-size: 14px;
}
thead th {
  background: var(--color-canvas);
  color: var(--color-primary);
  font-family: var(--font-serif);
  font-weight: 600;
  border-bottom: 2px solid var(--color-primary);
  white-space: nowrap;
}
tbody td {
  color: var(--color-text);
  border-bottom: 1px solid var(--color-border);
  word-break: break-word;
  vertical-align: middle;
}
tbody tr:hover { background: var(--color-surface-hover); }
tbody tr:last-child td { border-bottom: none; }

.cell-title {
  font-weight: 600;
  color: var(--color-text);
}
.el-button.danger { color: var(--color-primary); }
.el-button.danger:hover { color: var(--color-secondary); }

.empty {
  text-align: center;
  color: var(--color-muted);
  padding: 40px 0;
}

/* 分页控件：居中，与表格卡片留出间距 */
.pager {
  display: flex;
  justify-content: center;
  padding: 0 0 26px;
}
</style>
