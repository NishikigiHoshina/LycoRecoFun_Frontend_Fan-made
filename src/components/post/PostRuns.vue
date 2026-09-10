<script>
/**
 * 行内片段渲染器：把 {@link inlineToRuns} 产出的扁平片段数组渲染成 DOM。
 *
 * 两个刻意的设计：
 * 1. **不递归、不拼 HTML 字符串**。片段被摊平成 tokens 数组，模板只是一层 v-for；
 *    文本一律走 `{{ }}` 由 Vue 自动转义，所以这里不存在注入面。
 * 2. **换行用 `<br>` 显式表达**，不依赖 CSS 的 `white-space: pre-wrap`——
 *    否则模板里元素之间的换行缩进也会被渲染成真实换行，非常难排查。
 */
import { resolveDocImage } from '@/utils/asset'

/** 行内标记 → class（显式映射，不拼 class 名，避免任何数据驱动的标识符） */
const MARK_CLASS = { b: 'pb-b', i: 'pb-i', u: 'pb-u', code: 'pb-code' }

export default {
  name: 'PostRuns',
  props: {
    runs: { type: Array, default: () => [] }
  },
  computed: {
    /** 把片段摊平成可直接 v-for 的 token：文本 / 换行 / 链接 / 行内图 */
    tokens() {
      const out = []
      for (const run of this.runs) {
        if (run.img) {
          const src = resolveDocImage(run.img.src)
          if (src) out.push({ kind: 'img', src, alt: run.img.alt || '' })
          continue
        }
        const parts = String(run.text || '').split('\n')
        for (let i = 0; i < parts.length; i++) {
          if (i > 0) out.push({ kind: 'br' })
          if (parts[i]) {
            out.push({
              kind: run.href ? 'a' : 'text',
              text: parts[i],
              href: run.href,
              cls: this.clsOf(run),
            })
          }
        }
      }
      return out
    },
  },
  methods: {
    clsOf(run) {
      return (run.marks || []).map(m => MARK_CLASS[m]).filter(Boolean)
    },
  },
}
</script>

<template>
  <span class="post-runs">
    <template v-for="(t, i) in tokens">
      <br v-if="t.kind === 'br'" :key="'br' + i">
      <img v-else-if="t.kind === 'img'" :key="'img' + i" :src="t.src" :alt="t.alt" loading="lazy">
      <a
          v-else-if="t.kind === 'a'"
          :key="'a' + i"
          :href="t.href"
          :class="t.cls"
          target="_blank"
          rel="noopener noreferrer"
      >{{ t.text }}</a>
      <span v-else :key="'s' + i" :class="t.cls">{{ t.text }}</span>
    </template>
  </span>
</template>

<style scoped>
.post-runs { word-break: break-word; }

.pb-b { font-weight: 700; }
.pb-i { font-style: italic; }
.pb-u { text-decoration: underline; }
.pb-code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: .92em;
  background: var(--color-inset);
  border: 1px solid var(--color-border);
  padding: 0 4px;
}

/* 链接沿用角色色：静止青绿、悬停珊瑚 */
a { color: var(--color-secondary); text-decoration: none; border-bottom: 1px solid transparent; transition: color .25s var(--ease-smooth), border-color .25s var(--ease-smooth); }
a:hover { color: var(--color-primary); border-bottom-color: var(--color-primary); }

img { max-width: 100%; height: auto; vertical-align: middle; }
</style>
