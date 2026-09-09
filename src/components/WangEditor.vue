<script>
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
export default {
  components: { Editor, Toolbar },
  props: {
    value: { type: String, default: '' }   // 接收父组件 v-model
  },
  data() {
    return {
      editor: null,
      toolbarConfig: {},
      editorConfig: { placeholder: '请输入内容' },
      mode: 'default'
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