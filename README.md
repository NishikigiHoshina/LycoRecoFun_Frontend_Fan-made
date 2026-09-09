# Posts — 前台 SPA

本站点的**前端单页应用**，面向用户的前台 + 面向管理员的后台整合在一个 Vue 项目里，后端为 `lycorisfunServer`（Spring Boot 3）。内置 **浅色 / 深色**双主题；登录态采用 **HttpOnly Cookie** 会话。

> package.json 内 `name` 为 `news`（历史遗留），与目录名 `posts` 不一致。

---

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 2.7.16 | vue-router 3 / vuex 3（store 空壳未用）。**约定只用 Options API，禁写 `<script setup>`**（Vue2 编译不支持） |
| UI | Element UI 2.15 | 全局 re-skin 到 lycoris 角色色 |
| HTTP | axios | 见下方“请求层”；`main.js` 给全局 axios 设 `withCredentials` + 401 拦截 |
| 富文本 | wangEditor 5 | 发帖使用（富文本输入链路见文末审计） |
| 构建 | @vue/cli-service 5 | `npm run serve` / `npm run build` |

### 请求层边界（2026-09 明确）

- 带 **200/404 code 契约** 的 `utils/request.js` 目前仅 `api/comment.js`（评论/回复）与 `Personal.vue`（`/getMyProfile`）使用；
- 其余页面（登录/发帖/留言/首页/后台管理页等）与后台直连**全局 `axios`**——`main.js` 已给全局实例开 `withCredentials` 并注册 401 拦截（`clearAuth()` + 回登录页），因此登录态与统一 401 仍生效，只是不走 code 契约；
- 暂无把所有请求统一到 request 实例的计划。

---

## 运行

> 需先启动后端服务（端口 `12808`），前端请求前缀为
> `http://localhost:12808/lycorisfunServer/api`。

```bash
npm install
npm run serve      # 开发热更新（请在 http://localhost:8080 测试，Cookie/CORS 白名单限 localhost）
npm run build      # 生产构建，输出 dist/
```

- 局域网访问：`vue.config.js` 已开 `host: 0.0.0.0`（跨源 Cookie 认证需以后端 CORS 白名单一致，见后端 README）。
- 登录：账号数据在后端库中，用已注册邮箱 + 密码登录（注册可在登录页自助创建）；`status=3` 为管理员，可进后台。

---

## 目录结构

```
src/
├── main.js                    # 入口：ElementUI + lycoris.css + 主题初始化 + axios 全局凭证/401
├── styles/lycoris.css         # ★ lycoris 设计层 + 深色模式
├── App.vue                    # 根壳 + 右下角全局“浅/深色”切换按钮(☾/☀)（Options API）
├── Dev-tools-detect-index.js  # 开发者工具检测
├── api/comment.js             # 评论/帖子接口封装（走 request 实例）
├── utils/
│   ├── request.js             # axios 实例：withCredentials + code 契约 + 401→登出（使用方见上）
│   ├── auth.js                # ★ 认证画像存储（可读 cookie lycorecofun_profile）
│   ├── theme.js               # 主题工具（localStorage: lycorecofun-theme）
│   └── validate.js            # ★ 输入字符校验（库 utf8mb3 → 拦截 emoji 等 >U+FFFF）
├── router/index.js            # 双布局嵌套路由 + 登录守卫（用 auth.js）
├── layouts/  FrontLayout.vue / AdminLayout.vue
├── components/  WangEditor.vue + comment/（PostComment/ReplyList/Editor/LikeBtn）
└── views/
    ├── frontViews/            # 前台页面（见下表）
    └── backViews/             # 后台管理页（Dashboard/PostControl/UserControl/NewsControl/SiteControl/ValueDemo）
```

### 路由与页面

| 路径 | 文件 | 说明 |
| --- | --- | --- |
| `/Login` | `Login.vue` | 登录/注册（双面板；注册用户名带字符校验） |
| `/Index/index` | `Home.vue` | 前台首页：轮播 + 全站公告 + 近期新闻 |
| `/Index/plaza` | `Plaza.vue` | 广场/留言板：帖子瀑布流 + 分页 + 搜索/清除 |
| `/Index/posts/:id` | `PostDetail.vue`（懒加载） | 帖子详情：正文 + 评论/楼中楼 |
| `/Index/gallery` | `Gallery.vue` | 图集（空壳） |
| `/Index/contact` | `Contact.vue` | 联系站长（邮箱展示/复制） |
| `/Index/personal` | `Personal.vue`（懒加载+守卫） | 个人中心 `/getMyProfile` |
| `/Index/message` | `TakeMessage.vue` | 我要留言（昵称/主页/内容带字符校验） |
| `/Index/write` | `WritePost.vue`（守卫） | 我要发帖（wangEditor 富文本） |
| `/Index/uploadwork` | `UploadWork.vue` | 作品上传（占位地址） |
| `/homeDemo/*` | `backViews/` | 后台（仅 `status=3` 管理员） |

---

## 认证（方案 B：HttpOnly Cookie 会话）

| 存储 | 载体 | 内容 | 前端能否读 |
| --- | --- | --- | --- |
| `lycorecofun_token` | **HttpOnly** cookie（后端写/清，SameSite=Lax，7 天） | JWT | 否 |
| `lycorecofun_profile` | 普通 cookie（前端 `utils/auth.js` 写/读） | userId/status/username/avatar | 是 |
| `lycorecofun-theme` | localStorage | 主题模式 | 是 |

- 登录：`POST /admin/login` 校验通过 → 后端写 HttpOnly token cookie，响应返回非机密画像 → 前端 `setAuthProfile()` 写 profile cookie。
- 请求：`axios` 开启 `withCredentials`，token 由浏览器随请求自动携带，**不再手动拼 `Authorization: Bearer`**。
- 401 统一处理（两层）：`utils/request.js` 实例拦截器 + `main.js` 全局 axios 默认实例拦截器（后台页直连 axios 的原生请求同样 `clearAuth()` + 跳 `/Login`）。
- 登出：前端先调 `POST /api/logout`（后端清 HttpOnly token），再 `clearAuth()` 清 profile。
- **后端已加固**（详见后端 README）：`/writepost` `/writecomment` 的作者 `post_userid` 由后端 token 推导并覆盖，前端随请求体发送的该字段会被忽略（仍发送属冗余，可后续移除）；`/updatePostinfo` `/deletePost`、新闻管理写操作由后端做“属主或管理员 / 仅管理员”校验。前端 profile 里的 status 仅用于展示与路由守卫，**不作权鉴定论据**。

---

## 输入字符校验（2026-09）

- 背景：后端库表为 **utf8mb3**（单字符最长 3 字节，只支持 BMP，码点 ≤ U+FFFF）；emoji 等 4 字节字符入库会触发 MySQL 报错。
- 前端 `utils/validate.js` 提供 `warnIfUnsupported(vm, [{name,value}…])`，在**发出请求前**拦截并弹提示；后端另有 `TextValidator` 兜底。
- 已接入：新闻新建/编辑（NewsControl）、评论（PostComment/Editor）、留言（TakeMessage）、注册用户名（Login）。
- **例外**：Post 发帖（WritePost 富文本正文/标题）未接该校验，走独立审计（见文末 §Post 富文本输入审计）。

---

## 后台 · 新闻管理（NewsControl）

- 列表来自 `/newslistAll`，含软删行，状态列用 el-tag（`1` 正常 / `0` 已删除）。
- **新建**：顶部“新建新闻”→ 弹窗表单（标题/图片链接/新闻链接/发布时间）→ `POST /api/addnews` → 刷新。
- **编辑**：每行“编辑”→ 按行对象弹窗（title/imgurl/news_link/time/status，可把状态改回 1 恢复显示）→ `POST /api/updatenews` → 刷新。
- **删除**：二次确认 → `POST /api/deletenews?news_id=`（后端软删除 status=0）→ 刷新。
- 三个写接口均由后端做“仅管理员 status==3”校验。
- 注意：news 表**没有 content/author 列**，表单字段以实际列（title/imgUrl/news_link/time/status）为准。

---

## 主题（浅色 / 深色）

- 右下角 ☾/☀ 全局切换（`App.vue` 浮层），模式存 `localStorage`（键 `lycorecofun-theme`），刷新保持。
- 深色只改大幅背景/中性容器 + 黑↔白文字；强调/装饰色不变；基准 `#0D1117`。
- 实现：`html[data-theme]` + CSS 变量（见 `utils/theme.js`、`styles/lycoris.css`）。与认证存储互相独立。

---

## 前后端协作约定

- 接口前缀 `/api/**`；`POST /admin/login` 写会话 cookie，`POST /api/logout` 清会话。
- 主要接口（鉴权标注为后端 `@RequireToken`，权限语义见后端 README）：

| 功能 | 接口 |
| --- | --- |
| 登录 / 注册 / 登出 | `POST /admin/login`、`/admin/register`、`POST /logout` |
| 帖子分页列表 | `POST /postlistPage?page=&size=` |
| 帖子详情 / 搜索 | `POST /getPostByid?postid=`、`POST /searchBytitle?title=` |
| 发帖 / 评论 | `POST /writepost`（需登录，作者由 token 推导）、`POST /writecomment`（需登录） |
| 留言 | `POST /takemessage`（匿名，刻意开放） |
| 个人中心 | `POST /getMyProfile`（需登录） |
| 帖子改 / 删 | `POST /updatePostinfo`、`POST /deletePost`（需登录，属主或管理员） |
| 新闻管理 | `POST /addnews`、`/updatenews`、`/deletenews`（仅管理员 status==3） |
| 功能开关 / 站内图 | `getfuncstatus`、`updateStatus`、`getIndexIMG`、`addIndexIMG`、`deleteIndexIMG`（写操作需登录） |
| 新闻 / 公告 | `newslist`、`newslistAll`、`getAnnouncement` |

---

## 样式体系（lycoris-recoil · Level 2）

- 角色色 CSS 变量：主色珊瑚 `#f0555a` / 辅色青绿 `#00b4aa` / 文字近黑 / 背景白 / 装饰蓝黄紫；静止=辅色、悬停=主色。
- 锐角政策：盒状组件直角，纯圆元素（头像/加载点/轮播指示点/圆环）保留圆角。
- 标题衬线、UI 无衬线；动效 `riseIn`/五色 `loader`/光标圆环/`pyoko`。
- 后台 `AdminLayout` 白侧栏外壳；子页表格/弹窗均以主题 CSS 变量渲染（浅/深色自适应）。

---

## 变更记录（2026-09 会话）

- **后端写接口鉴权加固（09-09）**：发帖/评论作者由后端 token 推导；改/删加“属主或管理员”。（前端无需配合）
- **Vue 语法统一 + 构建通过（09-09）**：移除 9 个文件的 Vue3 `<script setup>`（`App.vue` 主题逻辑改为 Options）；技术栈定版 Vue 2.7.16。
- **新闻管理（09-10）**：NewsControl 新建（`/addnews`）、编辑（`/updatenews`）、删除二次确认 + 软删（`/deletenews`），状态列标签展示、可恢复显示。
- **输入字符校验（09-10）**：新增 `utils/validate.js`（拦截 emoji 等 >U+FFFF），接入新闻/评论/留言/注册用户名；后端 `TextValidator` 兜底。
- **NewsControl 表格样式（09-10）**：表格区恢复为主题变量排版（原生 `<table>` + CSS 变量）。
- **死代码清理（09-10）**：`LikeBtn` 移除对不存在 `likePost` 的引用与未调用的 `like()`；`PostDetail` 移除未用 `usercontent` data 及多余 `getUserId` import。（Gallery/UploadWork/死路由/UserControl 等占位仍保留）

---

## 备注 / 待办

- 密钥、数据库口令明文在源码/配置；CORS 白名单限 localhost（生产改成配置项并收紧）。
- 死代码/遗留：`Gallery` 空壳、`LikeBtn` 占位（点赞功能未做，仅按钮提示）、`UploadWork` 上传为 jsonplaceholder 占位地址、导航“二创”指向不存在路由 `/Index/seccreate`、后台 Dashboard 残留 `/homeDemo/One、Two` 死链。
- 后台 `NewsControl` 已可用；`UserControl` 把 User 对象 POST 到帖子端点，仍不可用（见后端 README 遗留）。
- 组件 scoped 样式仍有个别硬编码中性色（如 `ReplyList` `#bbb`），深色模式有盲区（待收敛）。

---

## Post 富文本输入审计（2026-09-10 · 仅审计，未改码）

**链路**：`WritePost.vue` → `WangEditor.vue`（@wangeditor/editor-for-vue，`v-model` 值 = `editor.getHtml()` 原始 HTML）→ 整包 `POST /writepost` → 后端原样落库 `posts.content`（无服务端净化）→ 详情页 `<div v-html="post.content">` 直接渲染；标题为普通 `el-input`。

**发现**
1. **无净化（XSS 面）**：HTML 生成 → 存储 → `v-html` 渲染全链路没有 DOMPurify 之类白名单净化；wangEditor 自带过滤不等同安全边界，可能被构造 `script`/`on*`/`javascript:` 造成**存储型 XSS**。评论区走 `{{ }}` 文本渲染，相对安全。
2. **字符集未覆盖**：`posts` 表 utf8mb3，正文/标题含 emoji 等 4 字节字符仍会报 “Incorrect string value”；发帖刻意未接 `TextValidator`，故发 emoji 仍会失败。
3. 次要：正文无长度上限；服务端对富文本无结构化校验。

**建议（未实施，待定夺）**
- 入库前与/或渲染时用 DOMPurify 净化（服务端 + 展示双保险）消除 XSS；
- 若希望 emoji 可用：将 `posts` 表 `CONVERT TO CHARACTER SET utf8mb4` 并让连接使用 utf8mb4，再放宽/移除校验；否则把发帖的 title/content 也接入 `TextValidator`（content 为 HTML，需整串校验）。
