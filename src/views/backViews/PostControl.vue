<script >
import axios from "axios";

export default{
  name:"PostControl",
  data(){
    return{
      postlist:null,
      editdialogVisible: false,
      detaildialogVisible: false,
      currentpost:[],
      currentRow: null,
      changepost:[],

    }
  },
  methods:{
    async submit() {
      try {
        // 1. 深拷贝一份，避免提交过程中意外修改原数据
        const payload = JSON.parse(JSON.stringify(this.changepost))

        // 2. 发 POST，Content-Type: application/json 自动设置
        await axios.post('http://localhost:12808/lycorisfunServer/api/updatePostinfo', payload)

        // 3. 成功回写 + 提示
        const idx = this.currentRow - 1
        this.$set(this.postlist, idx, payload)   // Vue2 响应式
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
      this.currentpost = JSON.parse(JSON.stringify(this.postlist[this.currentRow-1]))
      //深拷贝-将json数据复制一遍，再赋给新变量
      this.changepost = JSON.parse(JSON.stringify(this.postlist[this.currentRow-1]))
      // this.changepost=this.postlist[this.currentRow-1];浅拷贝-不同变量指向相同地址
    },
    deletepost(){
      axios.post('http://localhost:12808/lycorisfunServer/api/deletePost?postid='+this.currentRow)
    }
  },
  created() {
    axios.get("http://localhost:12808/lycorisfunServer/api/getPostList").then((res)=>{
      console.log(res.data)
      this.postlist=res.data;
    }).catch(function (err){
      console.log(err)
    });
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
          <th>内容</th>
          <th>创建时间</th>
          <th>根节点</th>
          <th>状态</th>
          <th>用户名</th>
          <th>操作</th>
        </tr>
        </thead>
          <tr  v-for="post in postlist" :key="post.postid">
            <td style="border:1px solid">{{post.postid}}</td>
            <td>{{post.title}}</td>
            <td>{{post.content}}</td>
            <td>{{post.created_at}}</td>
            <td>{{post.root_id}}</td>
            <td>{{post.status}}</td>
            <td>{{post.post_username}}</td>
            <td><el-button type="text" @click="function(){currentRow=post.postid;loadinfo();detaildialogVisible=true}">查看</el-button><br>
              <el-button type="text" @click="function(){currentRow=post.postid;loadinfo();editdialogVisible=true;}">编辑</el-button><br>
              <el-button type="text" @click="function(){$confirm('确认删除？').then(deletepost).catch(_ => {}); currentRow=post.postid;loadinfo();}">删除</el-button></td>
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
        <p><span>帖子id</span><el-input v-model="changepost.postid" placeholder="请输入内容"></el-input></p>
        <p><span>标题</span><el-input v-model="changepost.title" placeholder="请输入内容"></el-input></p>
        <p><span>用户id</span><el-input v-model="changepost.post_userid" placeholder="请输入内容"></el-input></p>
        <p><span>内容</span><el-input
            type="textarea"
            :rows="2"
            placeholder="请输入内容"
            v-model="changepost.content">
        </el-input></p>
        <p><span>创建时间</span><el-input v-model="changepost.created_at" placeholder="请输入内容"></el-input></p>
        <p><span>点赞数</span><el-input v-model="changepost.like_count" placeholder="请输入内容"></el-input></p>
        <p><span>跳转链接</span><el-input v-model="changepost.link" placeholder="请输入内容"></el-input></p>
        <p><span>图片链接</span><el-input v-model="changepost.imgurl" placeholder="请输入内容"></el-input></p>
        <p><span>父节点id</span><el-input v-model="changepost.parent_id" placeholder="请输入内容"></el-input></p>
        <p><span>根节点id</span><el-input v-model="changepost.root_id" placeholder="请输入内容"></el-input></p>
        <p><span>帖子状态</span><el-input v-model="changepost.status" placeholder="请输入内容"></el-input></p>
        <p><span>回复统计</span><el-input v-model="changepost.reply_count" placeholder="请输入内容"></el-input></p>
        <p><span>发帖人用户名</span><el-input v-model="changepost.post_username" placeholder="请输入内容"></el-input></p>
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
        <h2>帖子id:</h2>
        <h3>{{currentpost.postid}}</h3>
        <h2>标题:</h2>
        <h3>{{currentpost.title}}</h3>
        <h2>用户id:</h2>
        <h3>{{currentpost.post_userid}}</h3>
        <h2>内容:</h2>
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
table {
  border-collapse: collapse;
  width: 80%;
  margin: 20px auto;
  font-family: Arial, sans-serif;
}

th, td {
  padding: 10px 15px;
  text-align: left;
}

/* 表头双边框 */
th {
  position: relative;
  border: 1px solid #ccc;
  background-color: #f5f5f5;
  outline: 1px solid #000;
  outline-offset: -2px;
}

/* 普通单元格单边框 */
td {
  border: 1px solid #ccc;
}

/* 可选：鼠标悬行高亮 */
tr:hover {
  background-color: #f9f9f9;
}
</style>