import request from '@/utils/request';

/**
 * 获取实例列表
 * @param params {"pageInfo":{"pageSize":50,"beginIndex":0},"filterInfo":{"filterModel":true}}
 */
export async function listFlowProcessAPI(params: any) {
  return request('/workflowProcess/findProcesses', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 获取模板列表
 */
export const findTemplateListApi = () => {
  return request('/workflowProcess/findTemplateList', {
    method: 'POST',
    data: {
    }
  })
}

/**
 * 获取允许状态列表
 */
export const findProcessStatusTypeListApi = () => {
  return request('/workflowProcess/findProcessStatusTypeList', {
    method: 'POST',
    data: {
    }
  })
}
