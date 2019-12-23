import request from '@/utils/request'

export function getValidateCodeApi(params = {}) {
  return request('/authentication/getValidateCode', {
    method: 'POST',
    data: params
  })
}