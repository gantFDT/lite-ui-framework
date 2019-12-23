
import request from '@/utils/request'


/**
 * 获取数据库连接状态
 */
export const getGraphDbEnabledApi = () => {
  return request('/graphDbManager/getGraphDbEnabled', {
    method: 'POST'
  })
}

/**
 * 获取图形数据库模式
 */
export const listDgraphSchemaApi = () => {
  return request('/graphDbManager/listDgraphSchema', {
    method: 'GET'
  })
}

/**
 * 初始化图数据库
 */
export const initDgraphApi = () => {
  return request('/graphDbManager/initDgraph', {
    method: 'POST',
    data: {
    }
  }, {
    showSuccess: true,
    successMessage: tr('初始化图数据库操作完成')
  })
}

/**
 * 执行查询
 */
export const queryDgraphApi = (ql: string) => {
  return request('/graphDbManager/queryDgraph', {
    method: 'POST',
    data: {
      graphql: ql
    }
  })
}
