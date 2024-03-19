import axios from 'axios'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 1000 * 600 //超时时间 10分钟
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

//响应拦截器
service.interceptors.response.use(
  res => {
    if (res.status == 200 || res.data.code === 0) {
      // 数据剥离
      return res.data
    } else {
      // ElMessage.error(res.data.error)
      // 为了不执行后面的操作,排除一个错误进行终止.then的执行,直接执行.catch
      return Promise.reject(new Error(res.data.error.message || 'Error'))
    }
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
