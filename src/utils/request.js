import axios from 'axios'
import { Message } from 'element-ui'

// 创建实例
const service = axios.create({
    baseURL: process.env.VUE_APP_BASE_API || 'http://localhost:12808/lycorisfunServer/api',
    timeout: 8000
})

// 请求拦截（可选：带 token）
service.interceptors.request.use(
    config => {
        const token = window.localStorage.getItem('token')
        if (token) config.headers['Authorization'] ='Bearer ' + token
        return config
    },
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
        Message.error(error.message || 'Network Error')
        return Promise.reject(error)
    }
)

export default service