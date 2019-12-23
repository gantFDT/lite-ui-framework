
import request, { sucMessage } from '@/utils/request'

/**
 * 获取所有任务代办人模版
 */
export const findAllTaskUserTemplateApi = (isSingle: boolean) => {
  let url = isSingle ? '/taskUserTemplate/findAllTaskUserTemplate' : '/taskUserTemplate/findAllMultiTaskUserTemplate'
  return request(url, {
    method: 'POST',
    data: {
    }
  })
}

/**
 * 删除任务待办人模板
 */
export const removeTaskUserTemplateApi = (id: string, isSingle: boolean) => {
  let url = isSingle ? '/taskUserTemplate/removeTaskUserTemplate' : '/taskUserTemplate/removeMultiTaskUserTemplate'
  return request(url, {
    method: 'POST',
    data: {
      id
    }
  }, {
    showSuccess: true,
    successMessage: sucMessage.removeMes
  })
}

interface ModifyMultiTaskUserTemplateApiProps {
  userTemplateId: string
  userTemplateName: string
}

/**
 * 修改任务代办人模版(多模版模式)
 * @param params
 */
export const modifyMultiTaskUserTemplateApi = (params: ModifyMultiTaskUserTemplateApiProps) => {
  return request('/taskUserTemplate/modifyMultiTaskUserTemplate', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: sucMessage.saveMes
  })
}
