# posts — 前台 SPA

本站点的**前端单页应用**：面向普通用户的**前台**与面向管理员的**后台**合一，对接后端 `lycorisfunServer`（Spring Boot 3）。支持**浅色/深色**双主题；登录态走 **HttpOnly Cookie** 会话。

> `package.json` 内 `name` 为 `news`（历史遗留），与目录名 `posts` 不一致。

---

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 2.7.16 | vue-router 3 / vuex 3（store 空壳未用）；约定只用 Options API（Vue2 不支持 `<script setup>`） |
| UI | Element UI 2.15 | 全局 re-skin 到 lycoris 角色色 |
| HTTP | axios | 见下「请求层」 |
| 富文本 | wangEditor 5 | 发帖正文使用 |
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
│   └── validate.js          # 输入字符校验（库 utf8mb3 → 拦截 emoji 等 >U+FFFF）
├── router/index.js          # 双布局嵌套路由 + 登录守卫
├── layouts/                 # FrontLayout（前台）/ AdminLayout（后台，status=3 守卫）
├── components/              # WangEditor + comment/（PostComment/ReplyList/Editor/LikeBtn）
└── views/
    ├── frontViews/          # 前台页面（见下表）
    └── backViews/           # 后台管理页
```

### 页面路由

| 路径 | 页面 | 说明 |
| --- | --- | --- |
| `/Login` | 登录/注册 | 双面板 |
| `/Index/index` | 首页 | 轮播 + 公告 + 近期新闻 |
| `/Index/plaza` | 广场 | 帖子瀑布流 + 分页 + 搜索 |
| `/Index/posts/:id` | 帖子详情 | 富文本正文 + 评论/楼中楼 |
| `/Index/gallery` | 图集 | 空壳 |
| `/Index/contact` | 联系站长 | 邮箱展示 |
| `/Index/personal` | 个人中心 | `/getMyProfile`（需登录） |
| `/Index/message` | 我要留言 | 匿名留言 |
| `/Index/write` | 发帖 | wangEditor（需登录） |
| `/Index/uploadwork` | 上传作品 | 占位 |
| `/homeDemo/*` | 后台 | 仅 `status=3` 管理员 |

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

- 后端库表为 **utf8mb3**（只支持 BMP），emoji 等 4 字节字符无法入库；前端 `utils/validate.js` 在发请求前拦截并友好提示（已接入新闻/评论/留言/注册用户名），后端另有 `TextValidator` 兜底。
- Post 发帖为富文本（wangEditor → HTML → `v-html` 渲染），字符/XSS 相关审计见结构文档。

---

## 后台 · 新闻管理（NewsControl）

新建 / 编辑 / 删除（二次确认 + 软删除 `status=0`，状态可改回 1 恢复显示），三个写接口对应 `/api/addnews`、`/updatenews`、`/deletenews`，后端限定管理员。

---

## 主题与样式

- 右下角 ☾/☀ 全局切换，模式存 localStorage，`html[data-theme]` + CSS 变量驱动浅/深色。
- lycoris-recoil 风格：主色珊瑚/辅色青绿角色色、直角化、标题衬线、站标双图。

---

## 相关文档

- 更详细的分层、历史变更、遗留问题与 Post 富文本审计：工作区根目录 `前端项目结构说明(posts).md`。
- 后端接口与库：`lycorisfunServer/README.md`。
