
import request from '@/utils/request'
import { Password } from './model'

/**
 * 更新密码
 * @param params
 */
export default (params: Password) => {
  return request('/platformManager/updateIP2AdminPassword', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: tr('超级管理员密码设置成功')
  })
}
