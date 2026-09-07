# Posts — 前台 SPA

本站点的**前端单页应用**，面向用户的前台 + 面向管理员的后台整合在一个 Vue 项目里，后端为 `lycorisfunServer`（Spring Boot 3）。内置**浅色 / 深色**双主题。

> package.json 内 `name` 为 `news`（历史遗留），与目录名 `posts` 不一致。

---

## 技术栈

| 分类 | 选型 | 说明 |
| --- | --- | --- |
| 框架 | Vue 2.6 | vue-router 3 / vuex 3（store 空壳未用） |
| UI | Element UI 2.15 | 全局 re-skin 到 lycoris 角色色 |
| HTTP | axios | 封装于 `utils/request.js`，自动带 Bearer token |
| 富文本 | wangEditor 5 | 发帖使用 |
| 构建 | @vue/cli-service 5 | `npm run serve` / `npm run build` |

---

## 运行

> 需先启动后端服务（端口 `12808`），前端请求前缀为
> `http://localhost:12808/lycorisfunServer/api`。

```bash
npm install
npm run serve      # 开发热更新，http://localhost:8080
npm run build      # 生产构建，输出 dist/
```

- 局域网访问：`vue.config.js` 已开 `host: 0.0.0.0`。
- 登录：前端只负责提交账号密码，用户数据在后端库中（`usermanage` 等表），用已注册邮箱 + 密码登录；注册可在登录页自助创建。`status=3` 为管理员，登录后可进后台。

---

## 目录结构

```
src/
├── main.js                    # 入口：ElementUI + lycoris.css 全局设计层 + 主题初始化
├── styles/lycoris.css         # ★ lycoris 设计层：角色色/字体/Element 换肤/动效/锐角/深色模式
├── App.vue                    # 根组件 + 右下角全局“浅/深色”切换按钮(☾/☀)
├── Dev-tools-detect-index.js  # 开发者工具检测
├── api/comment.js             # 评论/帖子接口封装（走 request）
├── utils/
│   ├── request.js             # axios 实例 + 拦截器
│   └── theme.js               # 主题工具（localStorage: lycorecofun-theme）
├── router/index.js            # 双布局嵌套路由 + 登录守卫
├── layouts/
│   ├── FrontLayout.vue        # ★ 前台布局：顶部菜单(站标双图) + 右侧“个人”抽屉 + 底部
│   └── AdminLayout.vue        # ★ 后台布局：左侧 lycoris 后台外壳 + 管理员守卫
├── components/
│   ├── WangEditor.vue         # 富文本
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
| `/Index/plaza` | `Plaza.vue` | 广场/留言板：帖子瀑布流 + **分页** + 搜索/清除 |
| `/Index/posts/:id` | `PostDetail.vue` | 帖子详情：正文 + **评论/楼中楼**（懒加载） |
| `/Index/gallery` | `Gallery.vue` | 图集（**空壳，未实现**） |
| `/Index/contact` | `Contact.vue` | 联系站长（站长邮箱展示/复制） |
| `/Index/personal` | `Personal.vue` | 个人中心（`/getMyProfile`，token 推导；userId/邮箱隐藏） |
| `/Index/message` | `TakeMessage.vue` | 我要留言 |
| `/Index/write` | `WritePost.vue` | 我要发帖（wangEditor，需登录） |
| `/Index/uploadwork` | `UploadWork.vue` | 作品上传（预览用占位地址，未真正落库） |
| `/homeDemo/*` | `backViews/` | 后台（仅 `status=3` 管理员） |

> 管理页：`Dashboard.vue`（入口卡）、`PostControl.vue`、`UserControl.vue`、`NewsControl.vue`、`SiteControl.vue`、`ValueDemo.vue`（值传递演示）。

---

## 前台布局说明（FrontLayout）

- **顶部**：左侧站标（`assets/header.png` / `header_dark.png`，随主题双图切换），中间横向菜单（首页 / 广场 / 资料 / 个人中心；若干子项按后端功能开关 `getfuncstatus` 置灰），右侧个人按钮。
- **右侧“个人”抽屉**：
  - 已登录：`个人信息` → 头像+用户名+角色标签 → 功能项列表（个人主页 / 我要留言 / 留言板 / 管理员多一项“前往后台”）→ 退出登录。
  - 未登录：居中引导 + 登录按钮。
- 底部页脚。

---

## 主题（浅色 / 深色）

- 右下角 ☾ / ☀ 按钮全局切换（`App.vue` 浮层，所有路由可用）。
- 模式存 `localStorage`（键 `lycorecofun-theme`），刷新保持；`main.js` 启动时先应用避免首帧闪色。
- **深色只改**：大幅背景/中性容器 + 黑↔白文字 + 中性控件；**强调色/装饰色组件（珊瑚/青绿等）不变**。
- 深色基准 `#0D1117`；实现以 `html[data-theme]` + CSS 变量驱动（见 `utils/theme.js` 与 `styles/lycoris.css`）。

---

## 前后端协作约定

- **接口前缀**：`/api/**`（后端 context-path `/lycorisfunServer`）。
- **鉴权**：登录成功把后端返回的 JWT 存 `localStorage.token`；`request.js` 请求拦截器自动附加 `Authorization: Bearer <token>`；后端带 `@RequireToken` 的写接口校验。
- **响应契约**：后端统一 `{ code, msg, data|list|... }`，前端拦截器把 `code=200/404` 视为成功并返回整包。
- **登录态存储**（localStorage）：`token`、`userId`、`status`、`username`、`avatar`（见 `Login.vue`）。

主要接口对应：

| 功能 | 接口 |
| --- | --- |
| 登录 / 注册 | `POST /admin/login`、`POST /admin/register` |
| 帖子分页列表 | `POST /postlistPage?page=&size=` |
| 帖子详情 | `POST /getPostByid?postid=` |
| 搜索帖子 | `POST /searchBytitle?title=` |
| 发帖 / 留言 | `POST /writepost`、`POST /takemessage` |
| 评论 / 楼中楼 | `POST /getReply?parent_id=`、`POST /writecomment` |
| 个人中心 | `POST /getMyProfile`（需登录） |
| 功能开关 / 站内图 | `getfuncstatus`、`updateStatus`、`getIndexIMG` 等 |
| 新闻 / 公告 | `newslist`、`newslistAll`、`getAnnouncement` |

---

## 样式体系

`src/styles/lycoris.css` 定义了整套设计层，**后台/前台共用**：

- **角色色**（CSS 变量）：主色 `#f0555a` 珊瑚（悬停/强调）、辅色 `#00b4aa` 青绿（静止链接/激活）、文字近黑、背景白、装饰 蓝/黄/紫。
- **核心交互**：静止=辅色，悬停=主色。
- **锐角政策**：卡片/按钮/标签/容器一律直角；头像、加载点、轮播指示点、悬停圆环等纯圆元素保留圆角。
- **动效**：`riseIn` 交错入场、五色 `loader`、`hov-card` 光标圆环、`pyoko` 小跳。
- **标题衬线**（宋体系），UI/正文无衬线。
- **双主题**：`html[data-theme='dark']` 深色模式（基准 `#0D1117`），仅切换大幅背景/中性表面/黑白色文字，强调色不变。
- 后台 `AdminLayout` 为 lycoris 后台外壳（白侧栏 + 导航激活珊瑚高亮 + 顶栏），子页表格/弹窗亦走同一套皮肤。

---


