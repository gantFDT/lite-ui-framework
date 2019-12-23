
import request from '@/utils/request'


/**
 * 获取schema列表
 */
export const getSchemaListApi = () => {
  return request('/dbMigration/getSchemaList', {
    method: 'POST',
    data: {
    }
  })
}

/**
 * 获取脚本列表
 * @param schema
 */
export const getMigrationInfoApi = (schema: string) => {
  return request('/dbMigration/getMigrationInfo', {
    method: 'POST',
    data: {
      filterInfo: { schema },
      pageInfo: { pageSize: 50, beginIndex: 0 }
    }
  })
}

/**
 * 执行脚本
 * @param schema
 */
export const migrateApi = (schema: string) => {
  return request('/dbMigration/migrate', {
    method: 'POST',
    data: {
      schema
    }
  }, {
    showSuccess: true,
    successMessage: tr('脚本运行结束')
  })
}

/**
 * 获取脚本执行错误信息
 * @param schema
 */
export const getErrorMessageApi = (schema: string) => {
  return request('/dbMigration/getErrorMessage', {
    method: 'POST',
    data: {
      schema
    }
  })
}


/**
 * 强制将脚本状态改为SUCCESS
 * @param schema
 */
export const forceSuccessApi = (schema: string, id: string) => {
  return request('/dbMigration/forceSuccess', {
    method: 'POST',
    data: {
      schema,
      installedRank: id
    }
  }, {
    showSuccess: true,
    successMessage: tr(`ID 为 ${id} 的脚本状态变更为 SUCCESS`)
  })
}
