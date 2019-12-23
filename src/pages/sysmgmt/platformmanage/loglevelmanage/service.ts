
import request from '@/utils/request'
import { CurrentLog, Level, Appender } from './model'

/**
 * 获取当前日志级别
 */
export const getCurrentTargetDataSourceApi = () => {
  return request('/debugLog/getCurrentTargetDataSource', {
    method: 'POST',
    data: {
    }
  })
}

/**
 * 获取日志级别列表信息
 */
export const getLoggersInfoApi = () => {
  return request('/debugLog/getLoggersInfo', {
    method: 'POST',
    data: {
      pageInfo: { pageSize: 25, beginIndex: 0 }
    }
  })
}

/**
 * 修改当前日志级别
 * @param targetDataSource
 */
export const changeCurrentTargetDataSourceApi = (targetDataSource: CurrentLog) => {
  return request('/debugLog/changeCurrentTargetDataSource', {
    method: 'POST',
    data: {
      targetDataSource
    }
  }, {
    showSuccess: true,
    successMessage: tr('修改成功')
  })
}

/**
 * 添加或更新日志级别信息
 * @param level
 * @param type
 */
export const setLoggerLevelApi = (level: Level, type: 'add' | 'update') => {
  return request('/debugLog/setLoggerLevel', {
    method: 'POST',
    data: {
      ...level
    }
  }, {
    showSuccess: true,
    successMessage: tr(type === 'add' ? '添加成功' : '修改成功')
  })
}

/**
 * 更新日志输出器信息
 * @param appender
 */
export const setAppenderFilterLevelApi = (appender: Appender) => {
  return request('/debugLog/setAppenderFilterLevel', {
    method: 'POST',
    data: {
      ...appender
    }
  }, {
    showSuccess: true,
    successMessage: tr('修改成功')
  })
}
