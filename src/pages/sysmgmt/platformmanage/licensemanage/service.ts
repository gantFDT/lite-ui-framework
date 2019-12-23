
import request from '@/utils/request'


/**
 * 获取许可证信息
 */
export const getLicenseManagerInfoApi = () => {
  return request('/platformManager/getLicenseManagerInfo', {
    method: 'POST',
    data: {
    }
  })
}

/**
 * 分析许可证信息
 * @param fildId
 */
export const analyseLicenseInfoApi = (fildId: string) => {
  return request('/platformManager/analyseLicenseInfo', {
    method: 'POST',
    data: {
      id: fildId
    }
  })
}

/**
 * 更新许可证信息
 * @param fildId
 */
export const updateLicenseApi = (fildId: string) => {
  return request('/platformManager/updateLicense', {
    method: 'POST',
    data: {
      id: fildId
    }
  }, {
    showSuccess: true
  })
}

/**
 * 更改通知用户
 * @param userloginName
 */
export const updateNotificationUserApi = (userloginName: string) => {
  return request('/platformManager/updateNotificationUser', {
    method: 'POST',
    data: {
      id: userloginName
    }
  }, {
    showSuccess: true,
    successMessage: userloginName ? tr('通知用户设置成功') : tr('通知用户已取消')
  })
}
