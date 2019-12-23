
import request from '@/utils/request'


/**
 * 获取缓存列表
 */
export const getCacheInfoApi = () => {
  return request('/cacheManager/getCacheInfo', {
    method: 'POST',
    data: {
      pageInfo: { pageSize: 25, beginIndex: 0 }
    }
  })
}

/**
 * 清除缓存
 * @param cacheNames
 */
export const clearCacheApi = (cacheNames: string[]) => {
  return request('/cacheManager/clearCache', {
    method: 'POST',
    data: {
      cacheNames
    }
  }, {
    showSuccess: true,
    successMessage: tr('已清除')
  })
}

