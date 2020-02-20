import request from '../utils/requests'

export function apply(param) {
  return request({
    url: '/register/apply',
    method: 'post',
    data: param
  })
}
export function getRegisterVerify(info) {
  return request({
    url: `/register/verify?${info}`,
    method: 'get'
  })
}
