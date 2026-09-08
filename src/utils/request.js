import axios from 'axios'
import { Message } from 'element-ui'
import { clearAuth, isLoggedIn } from './auth'

// 创建实例（方案 B：登录态在 HttpOnly cookie，跨源需 withCredentials）
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:12808/lycorisfunServer/api',
    timeout: 8000,
    withCredentials: true
})

// 请求拦截：token 由浏览器随 cookie 自动携带，无需手动拼 Header
service.interceptors.request.use(
    config => config,
    error => Promise.reject(error)
)

// 响应拦截
service.interceptors.response.use(
    response => {
        const res = response.data
        // 后端约定：200 成功（含空列表），404 空列表，其他才是异常
        if (res.code === 200 || res.code === 404) {
            return res   // 统一返回整包，调用端自己取 replylist/data
        }
        // 其余码当异常
        Message.error(res.msg || 'Error')
        return Promise.reject(new Error(res.msg || 'Error'))
    },
    error => {
        const status = error.response && error.response.status
        if (status === 401 && isLoggedIn()) {
            // 凭证失效 → 清前端画像并回登录页
            clearAuth()
            if (window.location.hash !== '#/Login') {
                window.location.hash = '#/Login'
            }
        }
        const msg = (error.response && error.response.data && error.response.data.msg) || error.message || 'Network Error'
        Message.error(msg)
        return Promise.reject(error)
    }
)

export default service
