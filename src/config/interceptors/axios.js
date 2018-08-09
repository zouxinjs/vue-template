import { CONSOLE_REQUEST_ENABLE, CONSOLE_RESPONSE_ENABLE } from '../index.js'

export function requestSuccessFunc (req) {
  CONSOLE_REQUEST_ENABLE && console.info('requestInterceptorFunc', `url: ${req.url}`, req)

  // 自定义请求拦截逻辑，可以处理权限，请求发送监控等
  // ...

  return req
}

export function requestFailFunc (err) {
  // 自定义发送请求失败逻辑，断网，请求发送监控等
  // ...

  return Promise.reject(err)
}

export function responseSuccessFunc (res) {
  CONSOLE_RESPONSE_ENABLE && console.info('responseInterceptorFunc', `url: ${res.url}`, res)

  // 自定义响应成功逻辑，全局拦截接口，根据不同业务做不同处理，响应成功监控等
  // ...
  // window.GLOBAL.APP === vue 根实例

  return res
}

export function responseFailFunc (err) {
  // 响应失败，可根据 err.message 和 err.response.status 来做监控处理
  // ...

  return Promise.reject(err)
}
