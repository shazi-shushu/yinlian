import axios from 'axios'

// create an axios instance
const service = axios.create({
  baseURL: process.env.baseURL, // api 的 base_url
  timeout: 60 * 1000 // request timeout
})
// request interceptor
// service.interceptors.request.use(
//   config => {
//     // Do something before request is sent
//     // if (store.getters.token) {
//     // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
//     // config.headers['X-Token'] = getToken()
//     // }
//     // config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
//     // config.headers['Content-Type'] = 'multipart/form-data'
//     // config.headers['Content-Type'] = 'application/json'
//     // return config
//   },
//   error => {
//     // Do something with request error
//     console.log(error) // for debug
//     Promise.reject(error)
//   }
// )
// response interceptor
service.interceptors.response.use(
  response => {
    return response
  },
  error => {
    return Promise.reject(error)
  }
)

export default service
