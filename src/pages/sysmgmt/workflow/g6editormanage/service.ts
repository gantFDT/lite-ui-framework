import request from '@/utils/request';

/**
 * 获取函数列表
 * @param params {"pageInfo":{"pageSize":50,"beginIndex":0}}
 */
export async function listCallbackFunctionsAPI(params: object) {
  return request('/workflowDesign/getCallbackFunctions', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取条件函数列表
 * @param params {"pageInfo":{"pageSize":50,"beginIndex":0}}
 */
export async function listCallbackConditionFunctionsAPI(params: object) {
  return request('/workflowDesign/getCallbackConditionFunctions', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取用户筛选函数列表
 * @param params {"pageInfo":{"pageSize":50,"beginIndex":0}}
 */
export async function listCallbackUserFunctionsAPI(params: object) {
  return request('/workflowDesign/getCallbackUserFunctions', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取已部署流程模板列表
 * @param params {node:"root",pageInfo:{}}
 */
export async function listWorkflowTemplatesAPI(params: object) {
  return request('/workflowTemplate/find', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取已部署流程模板详情
 * @param params {contentId: ""}
 */
export async function getDeployTemplateAPI(params: object) {
  return request('/workflowDesign/getDeployTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取设计模板列表
 * @param params {"name":"","pageInfo":{"pageSize":0,"beginIndex":0}}
 */
export async function listDesignTemplateAPI(params: object) {
  return request('/workflowDesign/findDesignTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 获取设计模板详情
 * @param params {contentId: ""}
 */
export async function getDesignTemplateAPI(params: object) {
  return request('/workflowDesign/getDesignTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 修改设计模板名称
 * @param params {"id":"","name":""}
 */
export async function updateDesignNameAPI(params: object) {
  return request('/workflowDesign/updateDesignName', {
    method: 'POST',
    data: params
  });
}

/**
 * 删除设计模板
 * @param params {"id":""}
 */
export async function removeDesignTemplateAPI(params: object) {
  return request('/workflowDesign/removeDesignTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 保存设计模板
 * @param params {}
 */
export async function saveDesignTemplateAPI(params: object) {
  return request('/workflowDesign/saveDesignTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 发布设计模板
 * @param params { designName: "",  imageBase64: "", strategy: "on", templateCategory: "TYPE_A", templateKey: "", templateName: "" }
 */
export async function releaseDesignTemplateAPI(params: object) {
  return request('/workflowDesign/releaseDesignTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 更新设计模板
 * @param params { designName: "",  imageBase64: "", templateName: "", templateId: "" }
 */
export async function updateDeployTemplateAPI(params: object) {
  return request('/workflowDesign/updateDeployTemplate', {
    method: 'POST',
    data: params
  });
}

/**
 * 导入设计模板
 * @param params { fileEntityId: "", name: "", textfield-1372-inputEl: "", textfield-1373-inputEl: "" }
 */
export async function importDesignTemplateAPI(params: object) {
  return request('/workflowDesign/importDesignTemplate', {
    method: 'POST',
    data: params
  });
}