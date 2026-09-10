<script>
import WangEditor from '@/components/WangEditor.vue'
import axios from "axios";
import { buildDocFromHtml, docToPlainText } from '@/utils/postDoc'
import { warnIfUnsupported } from '@/utils/validate'
import { extractPendingSrcs, getPending, replaceSrcs } from '@/utils/pendingUploads'

/** 后端接口前缀（本页沿用全站"直连 axios"的写法） */
const API = process.env.VUE_APP_BASE_API || 'http://localhost:12808/lycorisfunServer/api'

/** 上传时的扩展名：服务端按文件名的后缀做白名单校验，粘贴进来的图可能没有正常文件名 */
const MIME_EXT = {
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif',
  'image/webp': 'webp',
}

export default {
  name: 'writepost',
  components: { WangEditor },
  data(){
    return{
      form:{
        title:'',
        content:'',        // 编辑器产出的 HTML（图片此时是 blob 本地预览地址）；提交时才转成文档
      },
      submitting: false,
      // blob 地址 → 已上传的相对路径。提交失败重试时复用，避免同一张图重复上传
      uploadedImages: {},
    }
  },
  methods:{
    async handlePost() {
      // ① 廉价预检：emoji 这类"注定被拒"的情况先拦掉，不去白传一遍图片
      //    （库为 utf8mb3，emoji 等 4 字节字符无法入库；后端 TextValidator 兜底）
      const rawText = this.form.content.replace(/<[^>]*>/g, '')
      if (warnIfUnsupported(this, [
        { name: '标题', value: this.form.title },
        { name: '正文', value: rawText },
      ])) return

      this.submitting = true
      try {
        // ② 此刻才把编辑器里的待上传图片真正传到服务器，并换成本站地址
        const html = await this.uploadPendingImages()

        // ③ 编辑器 HTML → 结构化文档（白名单转换；外链图片会被剔除并在下面提示）
        const { doc, externalImages, truncated } = buildDocFromHtml(html)
        if (truncated) {
          this.$message.warning('正文过长，请精简后再发表')
          return
        }
        if (externalImages.length) {
          this.$message.warning(`已移除 ${externalImages.length} 张非本站上传的图片，请用工具栏的「上传图片」插入`)
          return
        }
        if (!docToPlainText(doc)) {
          this.$message.warning('正文不能为空')
          return
        }

        // ④ 只提交 title + doc：作者身份由后端从 token 推导，created_at 由后端生成
        const { data } = await axios({
          method:'post',
          url:`${API}/writepost`,
          data:{
            title: this.form.title,
            doc: JSON.stringify(doc),
          },
        })
        this.$message.success(data.msg)
        setTimeout(() => this.$router.go(0), 1500)
      } catch (e) {
        const msg = (e && e.response && e.response.data && e.response.data.msg)
            || (e && e.message)
        this.$message.warning(msg || '网络错误')
      } finally {
        this.submitting = false
      }
    },

    /**
     * 把编辑器里所有"待上传"图片传到 /uploadPostImg，返回把 blob 地址替换成本站地址后的 HTML。
     * 只有走到"发表"这一步才会调它 —— 插入时上传的问题见 utils/pendingUploads.js 的说明。
     */
    async uploadPendingImages() {
      const html = this.form.content
      const srcs = extractPendingSrcs(html)
      if (!srcs.length) return html

      const map = {}
      for (const blobUrl of srcs) {
        if (this.uploadedImages[blobUrl]) {
          map[blobUrl] = this.uploadedImages[blobUrl]     // 重试：复用上次的结果，不重复上传
          continue
        }
        const file = getPending(blobUrl)
        if (!file) {
          throw new Error('有图片的预览已失效，请删除后重新插入')
        }
        const fd = new FormData()
        fd.append('file', this.withSafeName(file))
        // 不手写 Content-Type：交给 axios 生成带 boundary 的 multipart 头
        const { data } = await axios.post(`${API}/uploadPostImg`, fd)
        if (!data || data.code !== 200 || !data.url) {
          throw new Error((data && data.msg) || '图片上传失败')
        }
        this.$set(this.uploadedImages, blobUrl, data.url)   // 服务端返回的是相对路径
        map[blobUrl] = data.url
      }
      // 相对路径（/upload/post/…）正是文档里要存的形态，转换器会原样保留
      return replaceSrcs(html, map)
    },

    /** 用 MIME 推出后端白名单内的扩展名，保证"客户端放行的类型"与"服务端认的后缀"一致 */
    withSafeName(file) {
      const ext = MIME_EXT[file.type] || 'png'
      return new File([file], `pending.${ext}`, { type: file.type })
    },

    goback() {
      this.$router.back()
    }
  },
  computed:{
    // 只做"能不能点"的廉价判断（每次按键都会求值，不要在这里做 DOMParser 解析）；
    // 真正的正文校验放在提交时。纯图片帖子也算有正文。
    allowsubmit(){
      const html = this.form.content
      return this.form.title.trim().length > 0
          && (html.replace(/<[^>]*>/g, '').trim().length > 0 || /<img[\s>]/i.test(html))
    }
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
            <div style="text-align: right">
              <h1 style="text-align: right;color: var(--color-primary)">发帖</h1>
              <hr>
            </div>
            <div class="padding_20px" >
              <el-form ref="form" :model="form"  label-width="70px">
                <el-form-item  label="标题">
                  <el-input v-model="form.title" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item  label="正文">
                  <WangEditor v-model="form.content" />
                </el-form-item>
                <el-form-item>
                  <el-button
                      type="primary"
                      :loading="submitting"
                      :disabled="!allowsubmit"
                      @click="handlePost">发表</el-button>
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
  width: 100%;
}

.card-main{
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  box-shadow: 0 8px 28px rgba(0, 0, 0, .05);
  margin: 1vh;
  border-radius: 15px;
  min-height: 60vh;
}
</style>
