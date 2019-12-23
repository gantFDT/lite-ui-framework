import request, { sucMessage } from '@/utils/request'

export const EXPORT_URL = '/api/workflowTemplate/exportTemplate'

export interface DeployTemplateApiProps {
  fileEntityId: string
  name: string
  key: string
  category: string
  strategy: string
}

export interface UpdateTemplateApiProps {
  fileEntityId: string
  id: string
}

export interface ModifyTemplateApiProps {
  category: string
  customOwner: '' | 'on'
  id: string
  name: string
}

/**
 * 获取模板列表
 * @param params {"filterInfo":{"filterModel":true},"node":"root","pageInfo":{}}
 */
export async function listFlowTempAPI(params: Object) {
  return request('/workflowTemplate/find', {
    method: 'POST',
    data: params
  });
}

/**
 * 发布流程模板
 * @param params
 */
export async function deployTemplateApi(params: DeployTemplateApiProps) {
  return request('/workflowTemplate/deployTemplate', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: sucMessage.deployMes
  })
}

/**
 * 更新流程模板
 * @param params
 */
export async function updateTemplateApi(params: UpdateTemplateApiProps) {
  return request('/workflowTemplate/updateTemplate', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: sucMessage.modifyMes
  })
}

/**
 * 编辑流程模板
 * @param params
 */
export async function modifyTemplateApi(params: ModifyTemplateApiProps) {
  return request('/workflowTemplate/modifyTemplate', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: sucMessage.modifyMes
  })
}

/**
 * 获取超时阈值信息
 * @param templateId
 */
export async function findTemplateTimeoutApi(templateId: string) {
  return request('/workflowTemplate/findTemplateTimeout', {
    method: 'POST',
    data: {
      templateId
    }
  })
}

/**
 * 更新超时阈值信息
 */
export async function modifyTemplateTimeoutApi(params: { templateId: string, thresholds: any[] }) {
  return request('/workflowTemplate/modifyTemplateTimeout', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: tr('设置超时阈值成功')
  })
}

