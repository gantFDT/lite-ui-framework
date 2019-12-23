
import request from '@/utils/request'
import { EventClass, BaseClassEvent } from './model'

const COMMON_PAGE_INFO = { pageSize: 1000000, beginIndex: 0 }

/**
 * 获取事件对象列表
 */
export const getEventClassesApi = () => {
  return request('/event/getEventClasses', {
    method: 'POST',
    data: {
      pageInfo: COMMON_PAGE_INFO
    }
  })
}

/**
 * 获取发起事件列表
 * @param params
 */
export const getClassEventsApi = (params: EventClass) => {
  return request('/event/getClassEvents', {
    method: 'POST',
    data: {
      ...params,
      pageInfo: COMMON_PAGE_INFO
    }
  })
}

/**
 * 获取事件监听列表
 * @param params
 */
export const getEventListnersApi = (params: BaseClassEvent) => {
  return request('/event/getEventListners', {
    method: 'POST',
    data: {
      ...params,
      pageInfo: COMMON_PAGE_INFO
    }
  })
}
