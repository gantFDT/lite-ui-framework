
import request from '@/utils/request'


/**
 * 获取消息列表
 */
export const getMessageInfoApi = () => {
  return request('/messageManager/getMessageInfo', {
    method: 'POST',
    data: {
      pageInfo: { pageSize: 25, beginIndex: 0 }
    }
  })
}

