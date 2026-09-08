# Posts — 前台 SPA

本站点的**前端单页应用**，面向用户的前台 + 面向管理员的后台整合在一个 Vue 项目里，后端为 `lycorisfunServer`（Spring Boot 3）。内置 **浅色 / 深色**双主题；登录态采用 **HttpOnly Cookie** 会话。

> package.json 内 `name` 为 `news`（历史遗留），与目录名 `posts` 不一致。

---

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 2.6 | vue-router 3 / vuex 3（store 空壳未用） |
| UI | Element UI 2.15 | 全局 re-skin 到 lycoris 角色色 |
| HTTP | axios | 统一走 `utils/request.js`；全局默认实例也已开启凭证与 401 处理 |
| 富文本 | wangEditor 5 | 发帖使用 |
| 构建 | @vue/cli-service 5 | `npm run serve` / `npm run build` |

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
├── main.js                    # 入口：ElementUI + lycoris.css + 主题初始化 + axios 默认凭证/全局 401
├── styles/lycoris.css         # ★ lycoris 设计层 + 深色模式
├── App.vue                    # 根壳 + 右下角全局“浅/深色”切换按钮(☾/☀)
├── Dev-tools-detect-index.js  # 开发者工具检测
├── api/comment.js             # 评论/帖子接口封装（走 request）
├── utils/
│   ├── request.js             # axios 实例：withCredentials + 响应契约 + 401→登出
│   ├── auth.js                # ★ 认证画像存储（可读 cookie lycorecofun_profile）
│   └── theme.js               # 主题工具（localStorage: lycorecofun-theme，不受认证改动影响）
├── router/index.js            # 双布局嵌套路由 + 登录守卫（用 auth.js）
├── layouts/
│   ├── FrontLayout.vue        # ★ 前台布局：顶栏(站标双图/横向菜单) + 右侧“个人”抽屉 + 页脚
│   └── AdminLayout.vue        # ★ 后台布局：lycoris 后台外壳 + 管理员守卫
├── components/
│   ├── WangEditor.vue
│   └── comment/               # PostComment / ReplyList(楼中楼) / Editor / LikeBtn
└── views/
    ├── frontViews/            # 前台页面（见下表）
    └── backViews/             # 后台管理页
```

### 路由与页面

| 路径 | 文件 | 说明 |
| --- | --- | --- |
| `/Login` | `Login.vue` | 登录/注册（双面板） |
| `/Index/index` | `Home.vue` | 前台首页：轮播 + 全站公告 + 近期新闻 |
| `/Index/plaza` | `Plaza.vue` | 广场/留言板：帖子瀑布流 + 分页 + 搜索/清除 |
| `/Index/posts/:id` | `PostDetail.vue`（懒加载） | 帖子详情：正文 + 评论/楼中楼 |
| `/Index/gallery` | `Gallery.vue` | 图集（空壳） |
| `/Index/contact` | `Contact.vue` | 联系站长（邮箱展示/复制） |
| `/Index/personal` | `Personal.vue`（懒加载+守卫） | 个人中心 `/getMyProfile` |
| `/Index/message` | `TakeMessage.vue` | 我要留言 |
| `/Index/write` | `WritePost.vue`（守卫） | 我要发帖（wangEditor） |
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
- 401 统一处理（两层，保证“任何一处请求”都走新流程）：
  - `utils/request.js` 实例拦截器；
  - `main.js` 给全局 axios 默认实例也加了 401 拦截器（后台页直接 `import axios` 的原生请求同样 `clearAuth()` + 跳 `/Login`）。
- 登出：前端先调 `POST /api/logout`（后端清 HttpOnly token），再 `clearAuth()` 清 profile。

> 前端各页/守卫用 `auth.js` 的 `isLoggedIn/getUserId/getStatus/...` 读取画像；真实凭证是否有效仍由后端校验（`@RequireToken` 接口），token 过期时由 401 兜底登出。

---

## 主题（浅色 / 深色）

- 右下角 ☾/☀ 全局切换（`App.vue` 浮层），模式存 `localStorage`（键 `lycorecofun-theme`），刷新保持。
- 深色只改大幅背景/中性容器 + 黑↔白文字；强调/装饰色不变；基准 `#0D1117`。
- 实现：`html[data-theme]` + CSS 变量（见 `utils/theme.js`、`styles/lycoris.css`）。与认证存储互相独立。

---

## 前后端协作约定

- 接口前缀 `/api/**`；`POST /admin/login` 写会话 cookie，`POST /api/logout` 清会话（`POST /logout` 亦同路径）。
- 主要接口（鉴权标注为后端 `@RequireToken`）：

| 功能 | 接口 |
| --- | --- |
| 登录 / 注册 / 登出 | `POST /admin/login`、`/admin/register`、`POST /logout` |
| 帖子分页列表 | `POST /postlistPage?page=&size=` |
| 帖子详情 / 搜索 | `POST /getPostByid?postid=`、`POST /searchBytitle?title=` |
| 发帖 / 留言 | `POST /writepost`（需登录）、`POST /takemessage` |
| 评论 / 楼中楼 | `POST /getReply?parent_id=`、`POST /writecomment`（需登录） |
| 个人中心 | `POST /getMyProfile`（需登录） |
| 功能开关 / 站内图 | `getfuncstatus`、`updateStatus`、`getIndexIMG`、`addIndexIMG`、`deleteIndexIMG`（写操作需登录） |
| 新闻 / 公告 | `newslist`、`newslistAll`、`getAnnouncement` |

---

## 样式体系（lycoris-recoil · Level 2）

- 角色色 CSS 变量：主色珊瑚 `#f0555a` / 辅色青绿 `#00b4aa` / 文字近黑 / 背景白 / 装饰蓝黄紫；静止=辅色、悬停=主色。
- 锐角政策：盒状组件直角，纯圆元素（头像/加载点/轮播指示点/圆环）保留圆角。
- 标题衬线、UI 无衬线；动效 `riseIn`/五色 `loader`/光标圆环/`pyoko`。
- 后台 `AdminLayout` 白侧栏外壳 + 子页表格/弹窗同皮肤。

---


