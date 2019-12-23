import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Button, Checkbox, message } from 'antd'
import { BlockHeader, Table, EditStatus } from 'gantd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { findPreprocessTaskApi, startProcessPtApi, findTaskUserTemplateApi, saveTaskUserTemplateApi, startProcessApi, StartProcessApiProps, StartProcessPtApiProps, saveMultiTaskUserTemplateApi } from '../service'
import tableSchema from './schema'
import TaskNameColumn from '../tasknamecolumn'
import Ownerselector from '../ownerselector'
import { resoloveTaskUsersByConfig, resolveLoadOrImportTaskUsers, checkExistUserIsNull, getWorkflowConfig } from '../utils'
import MultiTodoUserTemplateModal from '../multitodousertemplatemodal'

export interface BaseStartProcessOperationPanelProps {
  templateKey: string // 流程模版关键字
  resourceName: string // 流程关联资源名称
  resourceUri: string // 流程关联资源URI
  variables: string // 流程变量
  controllerName: string // Extjs Controller名称
  viewName: string // Extjs 视图名称，例如操作表单的视图
  recTypeId: string //
  recId: string //
  processDetail: string // 流程说明
  onStartedSuccess: (processId: string) => void // 流程启动成功的回调
}

export interface StartProcessOperationPanelProps extends BaseStartProcessOperationPanelProps {
  height: number | string
}

// 预分配业务类型列表
const PREPROCESS_TYPES = ['permanent', 'transient']

type StartFunc = typeof startProcessPtApi | typeof startProcessApi

/**
 * 启动流程组件
 */
export default (props: StartProcessOperationPanelProps) => {
  const {
    height,
    templateKey,
    resourceName,
    variables,
    controllerName,
    viewName,
    recTypeId,
    recId,
    processDetail,
    onStartedSuccess
  } = props
  const [preprocessType, setPreprocessType] = useState('')
  const [findPreprocessTaskLoading, setFindPreprocessTaskLoading] = useState(false)
  const [taskUsers, setTaskUsers] = useState<any[]>([])
  const [startProcessLoading, setStartProcessLoading] = useState(false)
  const [findTaskUserTemplateLoading, setFindTaskUserTemplateLoading] = useState(false)
  const [saveTaskUserTemplateLoading, setSaveTaskUserTemplateLoading] = useState(false)
  const [saveMultiTodoUserTemplateModalVisible, setSaveMultiTodoUserTemplateModalVisible] = useState(false)
  const [saveMultiTaskUserTemplateLoading, setSaveMultiTaskUserTemplateLoading] = useState(false)
  const [loadMultiTodoUserTemplateModalVisible, setLoadMultiTodoUserTemplateModalVisible] = useState(false)

  const isPreprocessType = useMemo(() => {
    return PREPROCESS_TYPES.includes(preprocessType)
  }, [preprocessType])
  const resourceUri = useMemo(() => {
    return `${controllerName}:${viewName}:${recTypeId}:${recId}`
  }, ['controllerName', 'viewName', 'recTypeId', 'recId'])
  const { todoUserTemplate } = useMemo(() => {
    const config = getWorkflowConfig()
    return config
  }, [])

  const tableHeight = useMemo((): number | string => {
    let tempTableHeight = typeof height === 'number' ? height - 40 - 29 - 4 : `calc(${height} - ${40 + 29 + 4}px)`
    return tempTableHeight
  }, [height, taskUsers])

  // 取得流程启动时预分配任务信息
  const findPreprocessTask = useCallback(async (params: StartProcessOperationPanelProps) => {
    setFindPreprocessTaskLoading(true)
    try {
      let res = await findPreprocessTaskApi({
        templateKey,
        resourceName,
        resourceUri,
        variables
      })
      const { preprocessType, preprocessTaskUsers } = res
      setPreprocessType(preprocessType)
      if (PREPROCESS_TYPES.includes(preprocessType)) {
        setTaskUsers(resoloveTaskUsersByConfig(preprocessTaskUsers, 'start'))
      } else {
        setTaskUsers(preprocessTaskUsers)
      }
    } catch (error) {
      console.error('findPreprocessTask error\n', error)
    }
    setFindPreprocessTaskLoading(false)
  }, [resourceUri])

  useEffect(() => {
    findPreprocessTask(props)
  }, [])

  // 后续任务待办人选择或者参与审批过程点击
  const onOwnersOrExecusteChange = useCallback((stepId: string, taskUsers: any[], value: boolean | null | any[], type: 'owndersChange' | 'executeChange') => {
    let tempTaskUsers = _.cloneDeep(taskUsers)
    let index = taskUsers.findIndex((taskUsersItem: any) => taskUsersItem.stepId === stepId)
    let newTaskUser = tempTaskUsers[index]
    let tempSelectUserLoginName: any[] = []
    let tempOwners: any[] = []
    if (type === 'executeChange') {
      if (!value) {
        // 将虚拟用户添加到用户登录名列表
        tempSelectUserLoginName = ['TASK_OWNER_SKIP']
        // 将虚拟用户添加到用户列表
        tempOwners.unshift({
          userLoginName: 'TASK_OWNER_SKIP',
          userName: tr('[本任务不参与审批过程]')
        })
      }
      newTaskUser.owners = tempOwners
    } else if (type === 'owndersChange') {
      let tempData = Array.isArray(value) ? value : []
      tempSelectUserLoginName = tempData.map((item: any) => item.userName)
      tempOwners = tempData.map(({ userName, userLoginName }: any) => ({
        userName, userLoginName
      }))
      newTaskUser.owners = tempOwners
    }
    newTaskUser.selectUserLoginName = tempSelectUserLoginName
    tempTaskUsers.splice(index, 1, newTaskUser)
    setTaskUsers(tempTaskUsers)
  }, [])

  const showTableSchema = useMemo(() => {
    let temp: any[] = tableSchema
    if (!isPreprocessType) {
      temp = temp.filter(item => item.dataIndex !== 'execute')
    }
    return temp.map((item: any) => {
      const { dataIndex } = item
      if (dataIndex === 'stepName') {
        item.render = (name: string, record: any) => {
          const { stepId } = record
          return (
            <TaskNameColumn
              name={name}
              type='templateKey'
              value={templateKey}
              stepId={stepId}
            />
          )
        }
      } else if (dataIndex === 'displayUserName') {
        item.editConfig = {
          render: (text: string, record: any) => {
            const { selectUserLoginName = [], owners = [], userInfo, stepId } = record
            let allowEdit = !['TASK_OWNER_SKIP', 'TASK_OWNER_AUTOMATISM'].includes(selectUserLoginName[0]) && isPreprocessType
            let displayUserName = selectUserLoginName.reduce((res: string, selectUserLoginNameItem: string) => {
              let tempOwner = owners.find((ownersItem: any) => ownersItem.userLoginName === selectUserLoginNameItem)
              if (tempOwner) {
                const { userName } = tempOwner
                res = res.length > 0 ? (res + ',' + userName) : userName
              }
              return res
            }, '')
            return (
              <Ownerselector
                value={allowEdit ? selectUserLoginName : displayUserName}
                ownerList={userInfo}
                allowEdit={allowEdit}
                edit={allowEdit ? EditStatus.EDIT : EditStatus.CANCEL}
                onChange={(userLoginName: string[]) => onOwnersOrExecusteChange(stepId, taskUsers, userLoginName, 'owndersChange')}
              />
            )
          }
        }
        item.render = (text: string, record: any) => {
          const { selectUserLoginName = [], owners = [] } = record
          let displayUserName = selectUserLoginName.reduce((res: string, selectUserLoginNameItem: string) => {
            let tempOwner = owners.find((ownersItem: any) => ownersItem.userLoginName === selectUserLoginNameItem)
            if (tempOwner) {
              const { userName } = tempOwner
              res = res.length > 0 ? (res + ',' + userName) : userName
            }
            return res
          }, '')
          let allowEdit = !['TASK_OWNER_SKIP', 'TASK_OWNER_AUTOMATISM'].includes(selectUserLoginName[0])
          return <div onClick={(e) => !allowEdit && e.stopPropagation()}>{displayUserName}</div>
        }
      } else if (dataIndex === 'execute') {
        item.render = (text: string, record: any) => {
          const { selectUserLoginName = [], skip, stepId } = record
          let isExecute = true
          if (skip && selectUserLoginName.includes('TASK_OWNER_SKIP')) {
            isExecute = false
          }
          return (
            <Checkbox
              disabled={!skip}
              checked={isExecute}
              onChange={(e: CheckboxChangeEvent) => onOwnersOrExecusteChange(stepId, taskUsers, e.target.checked, 'executeChange')}
            />
          )
        }
      }
      return item
    })
  }, [taskUsers, templateKey, isPreprocessType])

  // 启动普通流程带有预分配信息的流程
  const startProcess = useCallback(async () => {
    let params: StartProcessPtApiProps | StartProcessApiProps = {
      templateKey,
      resourceName,
      resourceUri,
      variables,
      processDetail
    }
    let startFunc: StartFunc = startProcessApi
    if (isPreprocessType) {
      // 检查流程步骤的用户列表是否为空
      let checkRes = checkExistUserIsNull(taskUsers, 'start')
      if (checkRes) {
        return
      }
      params = {
        ...params,
        preprocessType,
        taskUsers
      }
      startFunc = startProcessPtApi
    }
    setStartProcessLoading(true)
    try {
      const res = await startFunc(params as any)
      const { result, processId, message: msg } = res
      if (result === 'OK') {
        message.success(tr('审批流程启动成功'))
        onStartedSuccess && onStartedSuccess(processId)
      } else {
        message.error(msg)
      }
    } catch (error) {
      console.error('startProcess error', error)
    }
    setStartProcessLoading(false)
  }, [taskUsers, preprocessType, isPreprocessType])

  // 加载用户模版实现
  const loadTaskUserTemplateImpl = useCallback((templateTaskUsers: any[]) => {
    let tempTaskUsers = resolveLoadOrImportTaskUsers(taskUsers, templateTaskUsers)
    setTaskUsers(tempTaskUsers)
    message.success(tr('加载用户模版成功'))
    setLoadMultiTodoUserTemplateModalVisible(false)
  }, [taskUsers])

  // 加载用户模版
  const findTaskUserTemplate = useCallback(async () => {
    if (todoUserTemplate === 'single') {
      setFindTaskUserTemplateLoading(true)
      try {
        let { taskUsers: templateTaskUsers } = await findTaskUserTemplateApi(templateKey)
        loadTaskUserTemplateImpl(templateTaskUsers)
      } catch (error) {
        console.error('findTaskUserTemplate error', error)
      }
      setFindTaskUserTemplateLoading(false)
    } else {
      setLoadMultiTodoUserTemplateModalVisible(true)
    }
  }, [templateKey, todoUserTemplate, loadTaskUserTemplateImpl])

  // 保存用户模板(多模版模式)
  const saveMultiTaskUserTemplate = useCallback(async (userTemplateName: string) => {
    setSaveMultiTaskUserTemplateLoading(true)
    try {
      await saveMultiTaskUserTemplateApi({
        userTemplateName,
        taskUsers,
        templateKey
      })
      setSaveMultiTodoUserTemplateModalVisible(false)
    } catch (error) {

    }
    setSaveMultiTaskUserTemplateLoading(false)
  }, [taskUsers])

  // 保存用户模版
  const saveTaskUserTemplate = useCallback(async () => {
    // 检查流程步骤的用户列表是否为空
    let checkRes = checkExistUserIsNull(taskUsers, 'start')
    if (checkRes) {
      return
    }
    if (todoUserTemplate === 'single') {
      setSaveTaskUserTemplateLoading(true)
      let params = {
        templateKey,
        taskUsers
      }
      try {
        await saveTaskUserTemplateApi(params)
      } catch (error) {
        console.error('saveTaskUserTemplate error', error)
      }
      setSaveTaskUserTemplateLoading(false)
    } else {
      setSaveMultiTodoUserTemplateModalVisible(true)
    }
  }, [templateKey, taskUsers, todoUserTemplate])

  return (
    <div>
      <Table
        tableKey='startProcessTable'
        rowKey='stepId'
        editable={EditStatus.EDIT}
        dataSource={taskUsers}
        columns={showTableSchema}
        scroll={{
          y: tableHeight
        }}
        loading={findPreprocessTaskLoading}
      />
      <BlockHeader
        extra={
          (<>
            <Button
              type='primary'
              icon='code'
              size='small'
              loading={startProcessLoading}
              onClick={startProcess}
            >{tr('启动审批流程')}</Button>
            {isPreprocessType && (<>
              <Button
                type='primary'
                icon='code'
                size='small'
                loading={findTaskUserTemplateLoading}
                onClick={findTaskUserTemplate}
              >{tr('加载用户模版')}</Button>
              <Button
                type='primary'
                icon='code'
                size='small'
                loading={saveTaskUserTemplateLoading}
                onClick={saveTaskUserTemplate}
              >{tr('保存用户模版')}</Button>
            </>)}
          </>)}
      />
      <MultiTodoUserTemplateModal
        type='save'
        visible={saveMultiTodoUserTemplateModalVisible}
        onClose={() => setSaveMultiTodoUserTemplateModalVisible(false)}
        templateKey={templateKey}
        onSave={saveMultiTaskUserTemplate}
        loading={saveMultiTaskUserTemplateLoading}
      />
      <MultiTodoUserTemplateModal
        type='load'
        visible={loadMultiTodoUserTemplateModalVisible}
        onClose={() => setLoadMultiTodoUserTemplateModalVisible(false)}
        templateKey={templateKey}
        onLoad={loadTaskUserTemplateImpl}
      />
    </div>
  )
}
