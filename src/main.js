import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
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
