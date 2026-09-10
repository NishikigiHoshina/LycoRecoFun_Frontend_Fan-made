import Vue from 'vue';
import VueRouter from 'vue-router';
import { isLoggedIn } from '@/utils/auth';

/* 后台布局 + 后台页面（/homeDemo，仅 status=3 管理员可进） */
import AdminLayout from '@/layouts/AdminLayout.vue';
import Dashboard from '@/views/backViews/Dashboard.vue';
import PostControl from '@/views/backViews/PostControl.vue';
import UserControl from '@/views/backViews/UserControl.vue';
import NewsControl from '@/views/backViews/NewsControl.vue';
import SiteControl from '@/views/backViews/SiteControl.vue';
import ValueDemo from '@/views/backViews/ValueDemo.vue';

/* 前台布局 + 前台页面（/Index） */
import FrontLayout from '@/layouts/FrontLayout.vue';
import Home from '@/views/frontViews/Home.vue';
import Plaza from '@/views/frontViews/Plaza.vue';
import Gallery from '@/views/frontViews/Gallery.vue';
import Contact from '@/views/frontViews/Contact.vue';
import TakeMessage from '@/views/frontViews/TakeMessage.vue';
import Login from '@/views/frontViews/Login.vue';
import WritePost from '@/views/frontViews/WritePost.vue';
import UploadWork from '@/views/frontViews/UploadWork.vue';
import NotFound from '@/views/frontViews/NotFound.vue';

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Index',
    name: 'Root',
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/homeDemo',
    name: 'AdminHome',
    component: AdminLayout,
    redirect: '/homeDemo/index',
    children: [
      { path: 'index', name: 'dashboard', component: Dashboard },
      { path: 'PostControl', name: 'postControl', component: PostControl },
      { path: 'UserControl', name: 'userControl', component: UserControl },
      { path: 'NewsControl', name: 'newsControl', component: NewsControl },
      { path: 'SiteControl', name: 'siteControl', component: SiteControl },
      { path: 'value/:value', name: 'valueDemo', component: ValueDemo },
    ],
  },
  {
    path: '/Index',
    name: 'SiteHome',
    component: FrontLayout,
    redirect: '/Index/index',
    children: [
      { path: 'index', name: 'home', component: Home },
      { path: 'posts/:id', name: 'post', component: () => import('@/views/frontViews/PostDetail.vue') },
      { path: 'plaza', name: 'plaza', component: Plaza },
      { path: 'gallery', name: 'gallery', component: Gallery },
      { path: 'contact', name: 'contact', component: Contact },
      {
        path: 'personal', name: 'personal',
        component: () => import('@/views/frontViews/Personal.vue'),
        beforeEnter: (to, from, next) => {
          if (!isLoggedIn()) { next('/Login'); } else { next(); }
        },
      },
      { path: 'message', name: 'message', component: TakeMessage },
      {
        path: 'write', name: 'write', component: WritePost,
        beforeEnter: (to, from, next) => {
          if (!isLoggedIn()) { next('/Login'); } else { next(); }
        },
      },
      { path: 'uploadwork', name: 'uploadwork', component: UploadWork },
    ],
  },

  /* 404 兜底：必须放在数组最后（vue-router 3 按声明顺序匹配，通配符会吃掉后面所有路由）。
     用 component 而非 redirect，URL 才会原样保留，页面才能把出错的地址回显给用户。 */
  { path: '/404', name: 'notFound', component: NotFound },
  { path: '*', component: NotFound },
]

const router = new VueRouter({
  routes
})

export default router
