
import request from '@/utils/request'


/**
 * 获取锁列表
 */
export const getLockInfoApi = () => {
  return request('/resourceLockManager/getLockInfo', {
    method: 'POST',
    data: {
      pageInfo: { pageSize: 25, beginIndex: 0 }
    }
  })
}

/**
 * 释放锁
 * @param nameList
 */
export const killResourceLockApi = (nameList: string[]) => {
  return request('/resourceLockManager/kill', {
    method: 'POST',
    data: {
      nameList
    }
  }, {
    showSuccess: true,
    successMessage: `${tr('已强制释放：')}[${nameList}]`
  })
}

