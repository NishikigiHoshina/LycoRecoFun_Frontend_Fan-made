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
import Gallery from "@/views/frontViews/Gallery.vue";
import Message from "@/views/frontViews/TakeMessage.vue"

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
      {path: 'message',name: 'message',component:Message }
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
