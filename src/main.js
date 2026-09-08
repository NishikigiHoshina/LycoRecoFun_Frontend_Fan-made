import Vue from 'vue'
import axios from 'axios'
import App from './App.vue'
import router from './router'
import store from './store'
import { clearAuth } from './utils/auth'
// 方案 B：全局请求带 cookie（登录态在 HttpOnly cookie 中）
axios.defaults.withCredentials = true
// 统一 401 处理：凡直接 import axios 的原生请求（后台管理页等）也走“清登录态→回登录页”
axios.interceptors.response.use(
    res => res,
    err => {
        const status = err.response && err.response.status
        if (status === 401) {
            clearAuth()
            if (window.location.hash !== '#/Login') {
                window.location.hash = '#/Login'
            }
        }
        return Promise.reject(err)
    }
)
import  ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// 在 element-ui 样式之后引入，保证同优先级覆盖生效
import './styles/lycoris.css';
// import axios from "axios";

Vue.use(ElementUI)
Vue.config.productionTip = false
// Vue.prototype.$axios = axios
// 尽早应用存储的主题，避免首帧闪白/闪黑
import { initTheme } from './utils/theme';
initTheme();
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
