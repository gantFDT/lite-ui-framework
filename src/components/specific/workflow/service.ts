
import request from '@/utils/request'
import { Owner } from './ownercolumn'

export interface ApproveTaskInfoApiProps {
  processId: string
  taskId: string
  userLoginName: string
}

export interface DoActionApiProps {
  taskId: string
  action: any
  approveComment: string
  feedbackContent: any[]
}

export interface DoDispatchApiProps {
  processIds: string[]
  taskIds: string[]
  dispatchUserLoginName: string
  dispatchUserName: string
  force: boolean
  dispatchComment: string
}

export interface DoAdjustTaskOwnerApiProps {
  processId: string
  templateStepId: string
  owners: Owner[]
}

export interface FindByIdsExcludeIdsApiProps {
  filterInfo: {
    userLoginName?: string
    userName?: string
    organizationId_text?: string
    organizationId?: string
    ids: string[] | number[]
    filterModel: boolean
    onlyActive?: boolean
  },
  pageInfo: {
    pageSize: number
    beginIndex: number
  }
}

export interface FindPreprocessTaskApiProps {
  templateKey: string // 流程模版关键字
  resourceName: string // 流程关联资源名称
  resourceUri: string // 流程关联资源URI
  variables: any // 流程变量
}

export interface StartProcessApiProps extends FindPreprocessTaskApiProps {
  processDetail: string // 流程流程说明
}

export interface StartProcessPtApiProps extends FindPreprocessTaskApiProps {
  processDetail: string // 流程流程说明
  preprocessType: string // 流程流程类型
  taskUsers: any[] // 流程预分配任务及待办人员
}

export interface SaveTaskUserTemplateApiProps {
  templateKey: string //模板key
  taskUsers: any[] // 流程预分配任务及待办人员
}

export interface DoStopProcessApiProps {
  processId: string // 流程实例编号
  reason: string // 流程中止原因
}

export interface SaveMultiTaskUserTemplateApiProps extends SaveTaskUserTemplateApiProps {
  userTemplateName: string // 模板名称
}

/**
 * 获取审批任务信息
 * @param params
 */
export const getApproveTaskInfoApi = (params: ApproveTaskInfoApiProps) => {
  return request('/workflowProcess/getApproveTaskInfo', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 获取任务操作列表
 * @param taskId
 */
export const findActionsApi = (taskId: string) => {
  return request('/workflowProcess/findActions', {
    method: 'POST',
    data: {
      taskId
    }
  })
}

/**
 * 获取导入候选人列表信息
 * @param processId
 */
export const findSelectTaskUserApi = (processId: string) => {
  return request('/taskUserTemplate/findSelectTaskUser', {
    method: 'POST',
    data: {
      id: processId
    }
  })
}

/**
 * 执行审批操作
 * @param params
 */
export const doActionApi = (params: DoActionApiProps) => {
  return request('/workflowProcess/doAction', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 获取审批历史信息
 * @param processId
 */
export const findAllTasksApi = (processId: string) => {
  return request('/workflowProcess/findAllTasks', {
    method: 'POST',
    data: {
      processId: processId
    }
  })
}

/**
 * 获取转派日志信息
 * @param processId
 */
export const findDispatchApi = (processId: string) => {
  return request('/workflowProcess/findDispatch', {
    method: 'POST',
    data: {
      processId: processId
    }
  })
}

/**
 * 计算工作日持续时间
 * @param startTime
 * @param endTime
 */
export const calculateWorkingTimesApi = (startTime: string, endTime: string) => {
  return request('/workingCalendar/calculateWorkingTimes', {
    method: 'POST',
    data: {
      startDate: startTime,
      endDate: endTime
    }
  })
}

/**
 * 获取任务说明信息
 * @param processId
 * @param stepId
 */
export const getStepDescriptionByProcessIdApi = (processId: string, stepId: string) => {
  return request('/workflowProcess/getStepDescriptionByProcessId', {
    method: 'POST',
    data: {
      processId: processId,
      templateStepId: stepId
    }
  })
}

/**
 * 获取反馈意见列表信息
 * @param processId
 */
export const findExpectFeedbackApi = (processId: string) => {
  return request('/workflowProcess/findExpectFeedback', {
    method: 'POST',
    data: {
      processId: processId
    }
  })
}

/**
 * 转派任务
 * @param params
 */
export const doDispatchApi = (params: DoDispatchApiProps) => {
  return request('/workflowProcess/doDispatch', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 调整候选人员
 * @param params
 */
export const doAdjustTaskOwnerApi = (params: DoAdjustTaskOwnerApiProps, type: 'modifyOwner' | 'skipTask') => {
  let msg = ''
  switch (type) {
    case 'modifyOwner':
      msg = tr('调整候选人员操作成功')
      break
    case 'skipTask':
      msg = tr('跳过审批任务操作成功')
      break
  }
  return request('/workflowProcess/doAdjustTaskOwner', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: msg
  })
}

/**
 * 根据id获取人员列表
 * @param params
 */
export const findByIdsExcludeIdsApi = (params: FindByIdsExcludeIdsApiProps) => {
  return request('/accountUser/findByIdsExcludeIds', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 取得流程启动时预分配任务信息
 * @param params
 */
export const findPreprocessTaskApi = (params: FindPreprocessTaskApiProps) => {
  return request('/workflowProcess/findPreprocessTask', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 启动流程
 * @param params
 */
export const startProcessApi = (params: StartProcessApiProps) => {
  return request('/workflowProcess/startProcess', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 启动带有预分配信息的流程
 * @param params
 */
export const startProcessPtApi = (params: StartProcessPtApiProps) => {
  return request('/workflowProcess/startProcessPt', {
    method: 'POST',
    data: {
      ...params
    }
  })
}

/**
 * 查询任务待办人模板
 * @param templateKey
 */
export const findTaskUserTemplateApi = (templateKey: string) => {
  return request('/taskUserTemplate/findTaskUserTemplate', {
    method: 'POST',
    data: {
      templateKey
    }
  })
}

/**
 * 保存任务待办人模板
 * @param params
 */
export const saveTaskUserTemplateApi = (params: SaveTaskUserTemplateApiProps) => {
  return request('/taskUserTemplate/saveTaskUserTemplate', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: tr('保存用户模版成功')
  })
}

/**
 * 取得指定流程模版关键字的流程步骤说明内容
 * @param params
 */
export const getStepDescriptionByTemplateKeyApi = (templateKey: string, stepId: string) => {
  return request('/workflowProcess/getStepDescriptionByTemplateKey', {
    method: 'POST',
    data: {
      templateKey: templateKey,
      templateStepId: stepId
    }
  })
}

/**
 * 终止流程实例
 * @param params
 */
export async function doStopProcessApi(params: DoStopProcessApiProps) {
  return request('/workflowProcess/doStopProcess', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: tr("终止流程操作成功"),
  });
}

/**
 * 获取任务代办人模版(多模版模式)
 */
export const findMultiTaskUserTemplateApi = (templateKey: string) => {
  return request('/taskUserTemplate/findMultiTaskUserTemplate', {
    method: 'POST',
    data: {
      templateKey
    }
  })
}

/**
 * 保存任务待办人模板(多模版模式)
 */
export const saveMultiTaskUserTemplateApi = (params: SaveMultiTaskUserTemplateApiProps) => {
  return request('/taskUserTemplate/saveMultiTaskUserTemplate', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: tr('保存用户模版成功')
  })
}

