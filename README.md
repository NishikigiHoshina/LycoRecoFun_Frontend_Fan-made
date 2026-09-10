# posts — 前台 SPA

本站点的**前端单页应用**：面向普通用户的**前台**与面向管理员的**后台**合一，对接后端 `lycorisfunServer`（Spring Boot 3）。支持**浅色/深色**双主题；登录态走 **HttpOnly Cookie** 会话。
帖子正文以**结构化文档**（白名单 JSON）存储与渲染，支持内嵌图片，**全站不使用 `v-html`**；未匹配的路径由 404 兜底页承接。

> `package.json` 内 `name` 为 `news`（历史遗留），与目录名 `posts` 不一致。

---

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 2.7.16 | vue-router 3 / vuex 3（store 空壳未用）；约定只用 Options API（Vue2 不支持 `<script setup>`） |
| UI | Element UI 2.15 | 全局 re-skin 到 lycoris 角色色 |
| HTTP | axios | 见下「请求层」 |
| 富文本 | wangEditor 5 | 仅用于**编辑**；产出 HTML 会在提交时转成结构化文档（见「帖子正文与图片」） |
| 构建 | @vue/cli-service 5 | `npm run serve` / `npm run build` |

### 请求层

- 带 200/404 code 契约的 `utils/request.js` 仅 `api/comment.js`（评论/回复）与 `Personal.vue`（个人中心）使用；
- 其余页面（登录/发帖/留言/首页/后台）直连**全局 axios**——`main.js` 已为全局实例开启 `withCredentials` 并注册 401 拦截（清登录态并回登录页），故登录态与统一 401 均生效。

---

## 快速开始

> 需先启动后端（端口 `12808`），接口前缀 `http://localhost:12808/lycorisfunServer/api`。

```bash
npm install
npm run serve      # 开发，默认 http://localhost:8080（Cookie/CORS 白名单限 localhost）
npm run build      # 生产构建，输出 dist/
```

- 局域网访问：`vue.config.js` 已开 `host: 0.0.0.0`，需与后端 CORS 白名单一致。
- 登录：用后端库中已注册的邮箱+密码；`status=3` 为管理员（可进后台），注册可在登录页自助完成。

---

## 目录结构

```
src/
├── main.js                  # 入口：ElementUI + lycoris.css + 主题初始化 + 全局 axios 凭证/401
├── styles/lycoris.css       # ★ lycoris 设计层（角色色/主题变量/深色模式）
├── App.vue                  # 根壳 + 右下角 ☾/☀ 主题切换
├── api/comment.js           # 评论/回复接口（走 request 实例）
├── utils/
│   ├── request.js           # axios 实例：withCredentials + code 契约 + 401 处理
│   ├── auth.js              # 认证画像（可读 cookie lycorecofun_profile）
│   ├── theme.js             # 主题工具（localStorage: lycorecofun-theme）
│   ├── validate.js          # 输入字符校验（库 utf8mb3 → 拦截 emoji 等 >U+FFFF）
│   ├── asset.js             # ★ 上传资源：后端 origin、相对↔绝对路径互转、上传前缀校验
│   ├── postDoc.js           # ★ 正文文档：HTML→doc 白名单转换、纯文本、行内片段摊平
│   └── pendingUploads.js    # ★ 待上传图片登记（blob 预览 → 发表时才真正上传）
├── router/index.js          # 双布局嵌套路由 + 登录守卫 + 404 兜底（末尾通配）
├── layouts/                 # FrontLayout（前台）/ AdminLayout（后台，status=3 守卫）
├── components/              # WangEditor + comment/（PostComment/ReplyList/Editor/LikeBtn）
│                            #   + post/（PostBody/PostRuns：正文渲染，无 v-html）
└── views/
    ├── frontViews/          # 前台页面（见下表，含 NotFound.vue）
    └── backViews/           # 后台管理页
```

### 页面路由

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/Login` | 登录/注册 | 双面板 |
| `/Index/index` | 首页 | 轮播 + 公告 + 近期新闻 |
| `/Index/plaza` | 广场 | 帖子瀑布流 + 分页 + 搜索 |
| `/Index/posts/:id` | 帖子详情 | 结构化正文（`<post-body>` 渲染，无 `v-html`）+ 评论/楼中楼 |
| `/Index/gallery` | 图集 | 空壳 |
| `/Index/contact` | 联系站长 | 邮箱展示 |
| `/Index/personal` | 个人中心 | `/getMyProfile`（需登录） |
| `/Index/message` | 我要留言 | 匿名留言 |
| `/Index/write` | 发帖 | wangEditor + 正文配图（需登录） |
| `/Index/uploadwork` | 上传作品 | 占位 |
| `/homeDemo/*` | 后台 | 仅 `status=3` 管理员 |
| `/404` · `*` | 404 兜底 | `NotFound.vue`；**必须放路由数组末尾**，用 `component` 而非 `redirect` 以保留 URL |

---

## 认证与权限

| 存储 | 载体 | 内容 | 前端能否读 |
| --- | --- | --- | --- |
| `lycorecofun_token` | HttpOnly cookie（后端写/清，7 天） | JWT | 否 |
| `lycorecofun_profile` | 普通 cookie（`auth.js` 写读） | userId/status/username/avatar | 是 |
| `lycorecofun-theme` | localStorage | 主题模式 | 是 |

- 登录由后端写 HttpOnly cookie，浏览器随请求自动携带，前端**不拼 `Authorization`**；401 由 request 实例与全局 axios 两层统一处理（清登录态→回登录页）。
- 前端 profile 里的 `status` 仅用于展示与路由守卫；**后端**在写接口负责身份（发帖/评论作者由 token 推导）与权限（改删“属主或管理员”、新闻管理“仅管理员”）判定。

---

## 数据与字符约束

- 后端库表为 **utf8mb3**（只支持 BMP），emoji 等 4 字节字符无法入库；前端 `utils/validate.js` 在发请求前拦截并友好提示（已接入新闻/评论/留言/注册用户名/**发帖标题与正文**），后端另有 `TextValidator` 兜底。
- 帖子正文走结构化文档，服务端在 `PostDocValidator` 里整串校验字符；**全站不再有 `v-html`**，因此不存在 HTML 注入面（详见下一节）。

---

## 帖子正文与图片

### 正文为什么不是 HTML

存 HTML 就必须在渲染时用 `v-html`，安全性就押在"某个清洗库不被绕过"上。改为存**白名单节点树**（schema v1）、前端按 schema 出标签、文本一律走 `{{ }}` 自动转义后，**"HTML 注入"这一类漏洞在架构上不存在** —— 因此本项目没有引入 DOMPurify / Jsoup 之类的清洗器。

| 环节 | 位置 | 说明 |
| --- | --- | --- |
| 编辑器 | `components/WangEditor.vue` | wangEditor 5；用 `toolbarKeys` 把工具栏收成白名单（去掉产物不在 schema 内的菜单，如按 URL 插图） |
| 转换 | `utils/postDoc.js` | `buildDocFromHtml` 用 `DOMParser` 把编辑器 HTML 转成文档（**只解析、不执行、不插入真实文档**，故无 DOM XSS 面）；`docToPlainText` 供校验；`inlineToRuns` 把行内标记摊平成片段 |
| 渲染 | `components/post/PostBody.vue` + `PostRuns.vue` | 块级显式 `v-if` 白名单分支，行内一层 `v-for`；图片只接受本站上传前缀，链接协议白名单且固定 `rel="noopener noreferrer"` |
| 存量帖 | `PostDetail.vue` | 老帖 `doc` 为 NULL 时，用**同一个转换器**把 `content` 里的短 HTML 现转现渲染 —— 因此老帖无需数据迁移也能安全打开 |

### 图片：插入时不上传

`WangEditor` 用 `MENU_CONF.uploadImage.customUpload` 接管上传：**插入图片时不发请求**，只把 `File` 登记进 `utils/pendingUploads.js` 并给编辑器一个 `blob:` 本地预览地址；真正的上传发生在点"发表"时（`WritePost.uploadPendingImages`），随后把 blob 地址替换成服务端返回的相对路径再转文档。**插了又删、或没发表的图片不会落盘。**

> 两个从 wangEditor 源码确认的行为（反直觉）：**① 一旦提供 `customUpload`，它内置的 Uppy 上传器被完全绕开** —— 不再需要配 `server`，但 **`maxFileSize` / `allowedFileTypes` 也同时失效**，尺寸与类型必须自己在钩子里校验；**② 文件选择、粘贴、拖拽三种入口都汇聚到同一个 `customUpload`**，一个钩子足够覆盖。

- 上传接口 `POST /uploadPostImg`（**仅需登录**，不需管理员），落盘目录 `{user.home}/lycorisfun-upload/post`，对外 URL 形如 `/upload/post/<uuid>.<ext>`。
- 正文里存的是**相对路径**（`utils/asset.js` 负责与绝对地址互转），换域名/部署环境不失效。
- 未上传的 blob 地址与已上传结果按 blob 地址缓存，**提交失败重试不会重复上传**；编辑器销毁时回收 blob 内存。

---

## 后台管理

后台页仅 `status=3` 管理员可进（`AdminLayout.beforeRouteEnter` 守卫），写操作后端一律按 **DB 判定**的管理员身份把关。

| 页面 | 现状 |
| --- | --- |
| `NewsControl` | 新建 / 编辑 / 删除（二次确认 + 软删除 `status=0`，状态可改回 1 恢复显示），对应 `/api/addnews`、`/updatenews`、`/deletenews` |
| `UserControl` | 编辑（`/updateUserinfo`）、删除（`/deleteUser`，软删 → `status=2` 停用）。弹窗里 `userId` 只读、状态为下拉、保存成功才关闭 |
| `PostControl` | **正文只读**，只可改 **标题 / 摘要 / 状态**；其余字段（帖子id、用户id、计数、层级、链接）一律 `disabled` —— 主键与作者误改会把更新打到别的行 |
| `SiteControl` | 宣传图增删（`/addIndexIMG`、`/deleteIndexIMG`）、功能开关（`/updateStatus`）、**全站公告编辑**（`/updateAnnouncement`） |
| `Dashboard` / `ValueDemo` | `ValueDemo` 是演示残留，`Dashboard` 内若干 `jump*` 方法为死代码但未被模板引用 |

**分页**：`PostControl` / `UserControl` / `NewsControl` 三个列表页已加分页（站内管理页未做）。采用**客户端分页** —— 这三个列表接口本来就是一次返回全部，前端也本来就全量持有，所以只加 `computed` 切片，不新增接口、不新增服务端查询。若将来单页上百行、或列表接口开始返回大字段，再照 `/postlistPage` 的既有做法改成服务端分页即可。

---

## 主题与样式

- 右下角 ☾/☀ 全局切换，模式存 localStorage，`html[data-theme]` + CSS 变量驱动浅/深色。
- lycoris-recoil 风格：主色珊瑚/辅色青绿角色色、直角化、标题衬线、站标双图。

---

## 相关文档

- 更详细的分层、历史变更、遗留问题与 Post 富文本审计：工作区根目录 `前端项目结构说明(posts).md`。
- 后端接口与库：`lycorisfunServer/README.md`。
