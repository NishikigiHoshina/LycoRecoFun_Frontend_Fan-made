<script>
import axios from "axios";

export default{
  name:"NewsControl",
  data(){
    return{
      newslist:null,
      editdialogVisible: false,
      detaildialogVisible: false,
      currentnews:[],
      currentRow: null,
      changenews:[],

    }
  },
  methods:{
    async submit() {
      try {
        // 1. 深拷贝一份，避免提交过程中意外修改原数据
        const payload = JSON.parse(JSON.stringify(this.currentnews))

        // 2. 发 POST，Content-Type: application/json 自动设置
        await axios({
          method:'post',
          url: 'http://localhost:12808/lycorisfunServer/api/updatePostinfo',
          headers:{
            'token': localStorage.getItem('token')
          },
          payload
        })

        // 3. 成功回写 + 提示
        const idx = this.currentRow - 1
        this.$set(this.newslist, idx, payload)   // Vue2 响应式
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
      this.currentnews = JSON.parse(JSON.stringify(this.newslist[this.currentRow-1]))
      //深拷贝-将json数据复制一遍，再赋给新变量
      this.changenews = JSON.parse(JSON.stringify(this.newslist[this.currentRow-1]))
      // this.changepost=this.postlist[this.currentRow-1];浅拷贝-不同变量指向相同地址
    },
    deleteuser(){
      axios.post('http://localhost:12808/lycorisfunServer/api/deletePost?postid='+this.currentRow)
    }
  },
  created() {
    axios.post("http://localhost:12808/lycorisfunServer/api/newslistAll").then((res)=>{
      console.log(res.data)
      this.newslist=res.data;
    }).catch(function (err){
      console.log(err)
    });
  }

}
</script>

<template>
  <div>
    <h2>
      新闻管理
    </h2>
    <hr>
    <div style="text-align: center;">
      <table v-if="newslist">
        <thead>
        <tr>
          <th>id</th>
          <th>标题</th>
          <th>发布时间</th>
          <th>状态</th>
          <th>操作</th>
        </tr>
        </thead>
        <tr v-for="news in newslist" :key="news.news_id">
          <td>{{news.news_id}}</td>
          <td>{{news.title}}</td>
          <td>{{news.time}}</td>
          <td>{{news.status}}</td>
          <td><el-button type="text" @click="function(){currentRow=news.news_id;loadinfo();detaildialogVisible=true}">查看</el-button><br>
            <el-button type="text" @click="function(){currentRow=news.news_id;loadinfo();editdialogVisible=true;}">编辑</el-button><br>
            <el-button type="text" @click="function(){$confirm('确认删除？').then(deleteuser).catch(_ => {}); currentRow=news.news_id;loadinfo();}">删除</el-button></td>
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
        <p><span>id</span><el-input v-model="changenews.news_id" placeholder="请输入内容"></el-input></p>
        <p><span>标题</span><el-input v-model="changenews.title" placeholder="请输入内容"></el-input></p>
        <p><span>图片链接</span><el-input v-model="changenews.imgurl" placeholder="请输入内容"></el-input></p>
        <p><span>内容</span><el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="changenews.content">
        </el-input></p>
        <p><span>新闻链接</span><el-input v-model="changenews.news_link" placeholder="请输入内容"></el-input></p>
        <p><span>发布时间</span><el-input v-model="changenews.time" placeholder="请输入内容"></el-input></p>
        <p><span>状态</span><el-input v-model="changenews.status" placeholder="请输入内容"></el-input></p>
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
        <h2>id:</h2>
        <h3>{{ currentnews.news_id }}</h3>
        <h2>标题:</h2>
        <h3>{{ currentnews.title }}</h3>
        <h2>图片链接:</h2>
        <h3>{{ currentnews.imgurl }}</h3>
        <h2>内容:</h2>
        <h3>{{ currentnews.content }}</h3>
        <h2>新闻链接:</h2>
        <h3>{{ currentnews.news_link }}</h3>
        <h2>发布时间:</h2>
        <h3>{{ currentnews.time }}</h3>
        <h2>状态:</h2>
        <h3>{{ currentnews.status }}</h3>
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