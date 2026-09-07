import Vue from 'vue';
import VueRouter from 'vue-router';
import BasicLayout from '@/layouts/BasicLayout.vue';
// 后台样式模板
import ValueDemo from "@/views/backViews/ValueDemo.vue";
import HomeDemo from "@/views/backViews/HomeDemo.vue";
import PostControl from "@/views/backViews/PostControl.vue";
import UserControl from "@/views/backViews/UserControl.vue";
import NewsControl from "@/views/backViews/NewsControl.vue";
import SiteControl from "@/views/backViews/SiteControl.vue";

import LayoutVersion1 from "@/layouts/LayoutVersion1.vue";
// 客户端样式模板
import IndexDemo from "@/views/frontViews/IndexDemo.vue";
import Plaza from "@/views/frontViews/Plaza.vue";
import Set from "@/views/frontViews/Set.vue";
import Contact from "@/views/frontViews/Contact.vue";
import Gallery from "@/views/frontViews/Gallery.vue";
import Message from "@/views/frontViews/TakeMessage.vue"
import Login from "@/views/frontViews/Login.vue";
import WritePost from "@/views/frontViews/WritePost.vue";
import UploadWork from "@/views/frontViews/UploadWork.vue";

//课堂测试页
import Demo from "@/views/frontViews/demo.vue";





Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/Index',
    name: 'Home',
  },
  {
    path: '/Login',
    name: 'Login',
    component: Login,
  },
  {
    path:'/homeDemo',
    name:'HomeDemo',
    component: BasicLayout,
    redirect:'/homeDemo/Index',
    children:[
      {path: 'Index', component: HomeDemo},
      {path: 'UserControl', component: UserControl},
      {path: 'NewsControl', component: NewsControl},
      {path: 'PostControl', component: PostControl},
      {path: 'SiteControl', component: SiteControl},
      {path: 'value/:value', name:'homedemoValue',component: ValueDemo},
    ],
  },
  {
    path:'/Index',
    name:'indexDemo',
    component: LayoutVersion1,
    redirect:'/Index/index',
    children:[
      {path: 'index',name:'index', component: IndexDemo},
      {path:'posts/:id',name:'post',component: () => import('@/views/frontViews/posts.vue') },
      {path: 'plaza',name: 'plaza',component:Plaza },
      {path: 'gallery',name: 'gallery',component:Gallery },
      {path: 'set',name: 'set',component:Set},
      {path: 'contact',name: 'contact',component:Contact},
      {path:'personal',name:'personal',component: () => import('@/views/frontViews/Personal.vue'),
        beforeEnter: (to, from, next) => {
          let token = localStorage.getItem('token');
          if (!token) { next('/Login'); } else { next(); }
        }},
      {path: 'message',name: 'message',component:Message },
      {path: 'write',name: 'write',component:WritePost,
        beforeEnter: (to, from, next) => {
          let token =localStorage.getItem('token');// 你的登录态判断
          if (!token) {
            next('/login');                // 未登录直接重定向，不再进组件
          } else {
            next();                        // 已登录正常进入
          }
        }},
      {
        path: 'uploadwork',name: 'uploadwork',component:UploadWork,
      }
    ],
  },
  {
    path:'/Demo',
    name:'Demo',
    component: Demo,
  },


]

const router = new VueRouter({
  routes
})

export default router
