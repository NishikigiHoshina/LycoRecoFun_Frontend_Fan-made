<script>
/**
 * 帖子正文渲染器：把结构化文档（schema v1）渲染成 DOM。
 *
 * **全站不再使用 `v-html`**。这里对白名单里的每一种块类型走一条显式 `v-if` 分支，
 * 文本交给 {@link PostRuns} 用 `{{ }}` 输出（Vue 自动转义），因此"HTML 注入"这一类
 * 漏洞在架构上不存在 —— 渲染器根本没有把字符串当 HTML 用的地方。
 *
 * 服务端（PostDocValidator）已经做了白名单校验；下面每一处仍是"白名单内才渲染"的写法，
 * 属于纵深防御：即便有人直接改库塞入非法节点，这里也只会什么都不渲染。
 */
import { inlineToRuns } from '@/utils/postDoc'
import { resolveDocImage } from '@/utils/asset'
import PostRuns from './PostRuns.vue'

export default {
  name: 'PostBody',
  components: { PostRuns },
  props: {
    /** 文档的 nodes 数组（不是整个 doc 对象） */
    nodes: { type: Array, default: () => [] }
  },
  methods: {
    runsOf(node) {
      return inlineToRuns(Array.isArray(node.c) ? node.c : [])
    },
    liRuns(li) {
      return inlineToRuns(li && Array.isArray(li.c) ? li.c : [])
    },
    codeOf(node) {
      return Array.isArray(node.c) ? String(node.c[0] || '') : ''
    },
    /** 只接受本站上传路径；非法 src 返回空串，模板据此整块跳过 */
    imgSrc(src) {
      return resolveDocImage(src)
    },
  },
}
</script>

<template>
  <div class="post-body">
    <template v-for="(node, i) in nodes">
      <p v-if="node.t === 'p'" :key="'p' + i"><post-runs :runs="runsOf(node)"/></p>

      <h2 v-else-if="node.t === 'h2'" :key="'h2' + i"><post-runs :runs="runsOf(node)"/></h2>

      <h3 v-else-if="node.t === 'h3'" :key="'h3' + i"><post-runs :runs="runsOf(node)"/></h3>

      <blockquote v-else-if="node.t === 'blockquote'" :key="'q' + i">
        <post-runs :runs="runsOf(node)"/>
      </blockquote>

      <ul v-else-if="node.t === 'ul'" :key="'ul' + i">
        <li v-for="(li, j) in node.c" :key="j"><post-runs :runs="liRuns(li)"/></li>
      </ul>

      <ol v-else-if="node.t === 'ol'" :key="'ol' + i">
        <li v-for="(li, j) in node.c" :key="j"><post-runs :runs="liRuns(li)"/></li>
      </ol>

      <pre v-else-if="node.t === 'pre'" :key="'pre' + i"><code>{{ codeOf(node) }}</code></pre>

      <figure v-else-if="node.t === 'img' && imgSrc(node.src)" :key="'img' + i" class="pb-figure">
        <img :src="imgSrc(node.src)" :alt="node.alt || ''" loading="lazy">
        <figcaption v-if="node.alt">{{ node.alt }}</figcaption>
      </figure>

      <!-- 其余类型一律不渲染（白名单外/结构损坏时的兜底） -->
    </template>
  </div>
</template>

<style scoped>
.post-body {
  color: var(--color-text);
  font-size: 15px;
  line-height: 1.85;
  word-break: break-word;
}

.post-body p { margin: 0 0 14px; }

.post-body h2,
.post-body h3 {
  font-family: var(--font-serif);
  color: var(--color-text);
  margin: 26px 0 12px;
  padding-left: 12px;
  border-left: 4px solid var(--color-primary);
  line-height: 1.4;
}
.post-body h2 { font-size: 21px; }
.post-body h3 { font-size: 18px; }

.post-body ul,
.post-body ol { margin: 0 0 14px; padding-left: 24px; }
.post-body li { margin: 4px 0; }

.post-body blockquote {
  margin: 0 0 14px;
  padding: 8px 16px;
  color: var(--color-muted);
  border-left: 3px solid var(--color-secondary);
  background: var(--color-inset);
}

.post-body pre {
  margin: 0 0 14px;
  padding: 12px 14px;
  overflow-x: auto;
  background: var(--color-inset);
  border: 1px solid var(--color-border);
}
.post-body pre code {
  font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre;
}

.pb-figure { margin: 18px 0; }
.pb-figure img {
  display: block;
  max-width: 100%;
  height: auto;
  border: 1px solid var(--color-border);
}
.pb-figure figcaption {
  margin-top: 6px;
  font-size: 13px;
  color: var(--color-muted);
  text-align: center;
}
</style>
