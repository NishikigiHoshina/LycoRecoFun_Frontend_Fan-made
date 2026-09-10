<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
import { registerPending, clearPending } from '@/utils/pendingUploads'

/** 与后端 lycorisfun.upload.types[1]（post-img）保持同口径 */
const IMG_MIME = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
const MAX_IMG_SIZE = 5 * 1024 * 1024

/**
 * 工具栏白名单：**只留能进正文 schema 的菜单**。
 *
 * 这是"部分富文本"的**体验边界**——让作者看到的按钮与最终能保存的格式一致，
 * 而不是点了斜体/字号却发现存不下来。**它不是安全边界**，安全边界在服务端的
 * PostDocValidator（见 utils/postDoc.js 头注释）。
 *
 * 刻意去掉的菜单：
 * - `insertImage`：按 URL 插入外链图片。正文只接受本站上传的图片（防外链追踪像素／
 *   `data:` URI），留着这个按钮只会让用户插完图提交时报错，故直接不提供。
 * - `insertVideo` / `uploadVideo` / `insertTable` / `color` / `bgColor` / `fontSize` /
 *   `fontFamily` / `indent` / `through` / `todo` 等：产物不在 schema 白名单内，会被丢弃。
 */
const TOOLBAR_KEYS = [
  'headerSelect', 'bold', 'italic', 'underline', 'code',
  'blockquote', 'codeBlock',
  'bulletedList', 'numberedList',
  'insertLink', 'uploadImage',
  '|', 'undo', 'redo',
]

export default {
  components: { Editor, Toolbar },
  props: {
    value: { type: String, default: '' }   // 接收父组件 v-model
  },
  data() {
    return {
      editor: null,
      mode: 'default'
    }
  },
  created() {
    // 这两个配置**刻意放在 created 里而不是 data()**：data() 的对象会被 Vue 递归转成响应式，
    // 而 wangEditor 会读写、改写自己收到的配置对象（含函数型回调），套上响应式代理没有必要
    // 且容易出怪问题。模板只是首次绑定它们，不需要响应式。
    this.toolbarConfig = { toolbarKeys: TOOLBAR_KEYS }
    this.editorConfig = {
      placeholder: '请输入内容',
      MENU_CONF: {
        uploadImage: {
          /**
           * ★ 图片**不在插入时上传**，改到"发表"那一刻（见 views/frontViews/WritePost.vue）。
           *
           * 插入时只把 File 登记到 utils/pendingUploads，并给编辑器一个 blob: 本地预览地址。
           * 好处：用户插了又删、或压根没发表的图片不会上传，服务器不会留下孤儿文件；
           * 上传这个"服务端副作用"也从高频的编辑阶段挪到了提交阶段。
           *
           * ⚠️ 一旦提供 customUpload，wangEditor 会**完全绕开它内置的 Uppy 上传器**
           * （upload-image-module 的 upload-images.ts 里是 if/else 二选一），因此：
           *   - 不再需要 `server`，也不会再报"没有配置上传地址"；
           *   - `maxFileSize` / `allowedFileTypes` 这两个配置项**在这条路径上不会生效** ——
           *     尺寸与类型必须由下面自己校验，否则就是无校验放开。
           * 文件选择、粘贴、拖拽三种入口都汇聚到这个函数（后者由该模块重写 insertData 实现）。
           */
          customUpload: (file, insertFn) => {
            if (!IMG_MIME.includes(file.type)) {
              this.$message.error('仅支持 jpg / jpeg / png / gif / webp 图片')
              return
            }
            if (file.size > MAX_IMG_SIZE) {
              this.$message.error('图片大小不能超过 5MB')
              return
            }
            // insertFn(src, alt, href)；href 传空，避免把图片套成链接
            insertFn(registerPending(file), file.name, '')
          },
        },
      },
    }
  },
  methods: {
    onCreated(editor) {
      this.editor = Object.seal(editor)
    },
    onChange(editor) {                    // 内容变化时触发
      this.$emit('input', editor.getHtml())  // Vue2 的 v-model 默认事件名是 input
    }
  },
  beforeDestroy() {
    this.editor && this.editor.destroy()
    clearPending()      // 回收尚未上传的 blob 预览地址
  }
}
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<template>
  <div style="border: 1px solid var(--color-border)">
    <Toolbar :editor="editor" :defaultConfig="toolbarConfig" :mode="mode" />
    <!-- 把外部 value 传进来，变化时回抛 -->
    <Editor
        :value="value"
        :defaultConfig="editorConfig"
        :mode="mode"
        @onCreated="onCreated"
        @onChange="onChange"
    />
  </div>
</template>

<style scoped>

</style>
