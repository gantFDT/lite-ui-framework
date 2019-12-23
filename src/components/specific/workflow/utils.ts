import { message } from 'antd'
import { cloneDeep } from 'lodash'
import { getModelData } from '@/utils/utils'

/**
 * 获取工作流的配置
 */
export const getWorkflowConfig = () => {
  return getModelData('config.SYSMGMT_CONFIG.workflow')
}

/**
 * 根据配置解析流程待办人员信息
 * @param taskUsers
 * @param type
 */
export const resoloveTaskUsersByConfig = (taskUsers: any[], type: 'start' | 'approve') => {
  const config = getWorkflowConfig()
  const { onApproveAutoSelectOwner, onApproveAutoSelectSkipStep, onStartAutoSelectOwner, onStartAutoSelectSkipStep } = config
  const tempTaskUsers = JSON.parse(JSON.stringify(taskUsers))
  const tempAutoSelectOwner = type === 'start' ? onStartAutoSelectOwner : onApproveAutoSelectOwner
  const tempAutoSelectSkipStep = type === 'start' ? onStartAutoSelectSkipStep : onApproveAutoSelectSkipStep
  // 判断是否自动全选所有代办用户
  if (tempAutoSelectOwner === false) {
    tempTaskUsers.forEach((item: any) => {
      const { selectUserLoginName = [], owners = [] } = item
      // 在默认情况下所有代办用户都是选中状态
      // 如果当前操作模式为“不自动全选所有代办用户”，系统将清除所有选中的用户（虚拟用户"TASK_OWNER_AUTOMATISM"除外）
      let tempSelectUserLoginNames = selectUserLoginName.filter((selectUserLoginNameItem: string) => selectUserLoginNameItem === 'TASK_OWNER_AUTOMATISM')
      // 如果没有系统自动选择用户,添加默认选中用户
      if (tempSelectUserLoginNames.length === 0) {
        tempSelectUserLoginNames = owners.filter((item: any) => item.selected ? item.userLoginName : false)
      }

      item.selectUserLoginName = tempSelectUserLoginNames
    })
  }

  // 判断是否自动全选可忽略流程步骤
  if (tempAutoSelectSkipStep === false) {
    tempTaskUsers.forEach((item: any) => {
      const { owners = [], skip } = item
      if (skip) {
        item.selectUserLoginName = ['TASK_OWNER_SKIP']
        owners.unshift({
          userLoginName: 'TASK_OWNER_SKIP',
          userName: tr('[本任务不参与审批过程]')
        })
      }
    })
  }

  return tempTaskUsers
}

/**
 * 解析加载用户模板或者导入候选人列表信息
 * @param taskUsers 待替换人员
 * @param resolveTaskUsers 待解析(加载或导入)人员
 */
export const resolveLoadOrImportTaskUsers = (taskUsers: any[], resolveTaskUsers: any[]) => {
  let tempTaskUsers = cloneDeep(taskUsers)
  tempTaskUsers.forEach((taskUser: any) => {
    const { userInfo = [], stepId } = taskUser
    const tempSelectUserLoginName: any[] = []
    const tempOwners: any[] = []
    const isAllUser = userInfo[0].userLoginName === 'WF_TASK_OWNER_ALL'
    const resolveTaskUser = resolveTaskUsers.find((resolveTaskUserItem: any) => resolveTaskUserItem.stepId === stepId)
    if (resolveTaskUser) {
      const { owners: resolveTaskUserOwners } = resolveTaskUser
      if (isAllUser) {
        // 审批任务的候选用户为代表全部用户的虚拟用户
        // 直接重新设置选中用户列表信息
        resolveTaskUserOwners.forEach((resolveTaskUserOwnersItem: any) => {
          const { userLoginName, userName } = resolveTaskUserOwnersItem
          tempSelectUserLoginName.push(userLoginName)
          tempOwners.push({
            userLoginName,
            userName
          })
        })
      } else {
        // 审批任务的候选用户不是代表全部用户的虚拟用户
        // 需要结合userInfo信息设置选中用户列表信息
        resolveTaskUserOwners.forEach((resolveTaskUserOwnersItem: any) => {
          const { userLoginName, userName } = resolveTaskUserOwnersItem
          // 如果模版存储的是虚拟用户
          if (userLoginName === 'TASK_OWNER_SKIP') {
            tempSelectUserLoginName.push(userLoginName)
            tempOwners.unshift({
              userLoginName: 'TASK_OWNER_SKIP',
              userName: tr('[本任务不参与审批过程]')
            })
          } else if (userInfo.some((userInfoItem: any) => userInfoItem.userLoginName === userLoginName)) {
            // 如果模版存储的不是虚拟用户，需要查看userInfo是否存在该用户
            tempSelectUserLoginName.push(userLoginName)
            tempOwners.unshift({
              userLoginName,
              userName
            })
          }
        })
      }

      taskUser.selectUserLoginName = tempSelectUserLoginName
      taskUser.owners = tempOwners
    }
  })

  return tempTaskUsers
}

/**
 * 检查流程步骤的用户列表是否为空
 * @param taskUsers
 * @param type
 */
export const checkExistUserIsNull = (taskUsers: any[], type: 'start' | 'current'): boolean => {
  const taskUserSelectUserLoginNameIsNull = taskUsers.find((item: any) => item.selectUserLoginName.length === 0)
  if (taskUserSelectUserLoginNameIsNull) {
    const msg = type === 'start' ? tr(`请分配：【${taskUserSelectUserLoginNameIsNull.stepName}】任务的操作候选人`) : tr(`请选择：【${taskUserSelectUserLoginNameIsNull.stepName}】任务的操作候选人`)
    message.warning(msg)
    return true
  }
  return false
}
