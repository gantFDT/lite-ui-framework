
import request from '@/utils/request'

/**
 * 获取在线连接列表
 */
export const getOnlineClientApi = () => {
  return request('/notification/getOnlineClient', {
    method: 'POST',
    data: {
      pageInfo: { pageSize: 50, beginIndex: 0 }
    }
  })
}
