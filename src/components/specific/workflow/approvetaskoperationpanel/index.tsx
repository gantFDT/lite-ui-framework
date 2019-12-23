import React, { useEffect, useCallback, useState, useMemo } from 'react'
import { Select, Button, message, Checkbox, Input, Modal, Row, Col, Radio, Popover } from 'antd'
import { BlockHeader, Table, EditStatus } from 'gantd'
import _ from 'lodash'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { router } from 'umi'
import { TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, BLOCK_HEADER_HEIGHT } from '@/utils/utils'
import { getApproveTaskInfoApi, findActionsApi, findSelectTaskUserApi, doActionApi } from '../service'
import tableSchema from './schema'
import TaskNameColumn from '../tasknamecolumn'
import { CommentFeedback } from '../commentfeedback'
import Ownerselector from '../ownerselector'
import { getWorkflowConfig, resolveLoadOrImportTaskUsers, resoloveTaskUsersByConfig } from '../utils'

export interface BaseApproveTaskOperationPanelProps {
  processId: string // 流程id
  userLoginName: string // 用户登录名
  feedback: number | string // 是否需要反馈
  refresh?: Function
}

export interface ApproveTaskOperationPanelProps extends BaseApproveTaskOperationPanelProps {
  taskId: string // 任务id
  feedbacks: CommentFeedback[]
  height: number | string
}

/**
 * 流程操作(审批流程)组件
 */
export default (props: ApproveTaskOperationPanelProps) => {
  const {
    processId,
    taskId,
    feedback,
    feedbacks,
    height,
    refresh
  } = props
  const [executeColumnVisible, setExecuteColumnVisible] = useState(false)
  const [allowSelectOwner, setAllowSelectOwner] = useState(false)
  const [actions, setActions] = useState([])
  const [taskAction, setTaskAction] = useState<any>({})
  const [taskUsers, setTaskUsers] = useState<any[]>([])
  const [importLoading, setImportLoading] = useState(false)
  const [taskInfo, setTaskInfo] = useState<any>({})
  const [comment, setComment] = useState('')
  const [actionsLoading, setActionsLoading] = useState(false)
  const { dueDate, owners, startDate, taskName } = taskInfo
  const { approveActionView } = useMemo(() => {
    let config = getWorkflowConfig()
    return config
  }, [])

  const tableHeight = useMemo((): number | string => {
    let common = 4 * BLOCK_HEADER_HEIGHT + 34 + 82 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT
    let tempTableHeight = typeof height === 'number' ? height - common : `calc(${height} - ${common}px)`
    return tempTableHeight
  }, [height, taskUsers])

  // 获取审批任务信息
  const getApproveTaskInfo = useCallback(async (params: ApproveTaskOperationPanelProps) => {
    const { processId, taskId, userLoginName } = params
    try {
      let res = await getApproveTaskInfoApi({
        processId,
        taskId,
        userLoginName
      })
      setTaskInfo(res || {})
    } catch (error) {
      console.error('getApproveTaskInfo error\n', error)
    }
  }, [])

  // 获取任务操作列表
  const findActions = useCallback(async (params: ApproveTaskOperationPanelProps) => {
    setActionsLoading(true)
    try {
      let res = await findActionsApi(params.taskId)
      res.map((item: any) => {
        const { name, selectOwnerType } = item
        if (selectOwnerType === 'automatism') {
          item.displayName = `${name}${tr('（系统自动选择后续任务候选人）')}`
        } else {
          item.displayName = `${name}${tr('（需要手动选择后续任务候选人）')}`
        }
        item.firstLoad = true
        return item
      })
      setActions(res)
    } catch (error) {
    }
    setActionsLoading(false)
  }, [])

  // 获取导入候选人列表信息
  const importUser = useCallback(async () => {
    setImportLoading(true)
    try {
      let importTaskUsers = await findSelectTaskUserApi(processId)
      let tempTaskUsers = resolveLoadOrImportTaskUsers(taskUsers, importTaskUsers)
      setTaskUsers(tempTaskUsers)
      message.success(tr('导入历史候选人成功'))
    } catch (error) {
      console.error('importUser error\n', error)
    } finally {
      setImportLoading(false)
    }
  }, [processId, taskUsers])

  useEffect(() => {
    getApproveTaskInfo(props)
    findActions(props)
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
    if (!executeColumnVisible) {
      temp = tableSchema.filter((item: any) => item.dataIndex !== 'execute')
    }
    return temp.map((item: any) => {
      const { dataIndex } = item
      if (dataIndex === 'stepName') {
        item.render = (name: string, record: any) => {
          const { stepId } = record
          return (
            <TaskNameColumn
              name={name}
              type='processId'
              value={processId}
              stepId={stepId}
            />
          )
        }
      } else if (dataIndex === 'displayUserName') {
        item.editConfig = {
          render: (text: string, record: any) => {
            const { selectUserLoginName = [], owners = [], userInfo, stepId } = record
            let allowEdit = !['TASK_OWNER_SKIP', 'TASK_OWNER_AUTOMATISM'].includes(selectUserLoginName[0]) && allowSelectOwner
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
          let allowEdit = !['TASK_OWNER_SKIP', 'TASK_OWNER_AUTOMATISM'].includes(selectUserLoginName[0]) && allowSelectOwner
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
  }, [executeColumnVisible, taskUsers, processId, allowSelectOwner])

  // 操作选择
  const onTaskSelect = useCallback((id: string) => {
    let tempExecuteColumnVisible = false
    let tempAllowSelectOwner = false
    let selectOption = actions.find((item: any) => item.id === id) || {} as any
    selectOption = _.cloneDeep(selectOption)
    let tempTaskUsers = []

    if (!_.isEmpty(selectOption)) {
      const { taskUsers = [], selectOwnerType, firstLoad } = selectOption
      tempTaskUsers = _.cloneDeep(taskUsers)

      if (selectOwnerType === 'automatism') {
        tempAllowSelectOwner = false
      } else {
        tempAllowSelectOwner = true
        tempExecuteColumnVisible = true

        // 判断是否为首次操作
        if (firstLoad) {
          tempTaskUsers = resoloveTaskUsersByConfig(taskUsers, 'approve')
          selectOption.firstLoad = false
        }
      }
    }

    setTaskAction(selectOption)
    setTaskUsers(tempTaskUsers)
    setAllowSelectOwner(tempAllowSelectOwner)
    setExecuteColumnVisible(tempExecuteColumnVisible)
  }, [actions])

  const handleApprove = useCallback(() => {
    // 判断是否选择任务
    if (_.isEmpty(taskAction)) {
      message.warning(tr('请选择审批操作'))
      return
    }
    const { selectOwnerType, mustComment, displayName, prompt } = taskAction

    // 手动选择动作待办用户数据
    if (selectOwnerType === 'manual') {

      // 检查流程步骤的用户列表是否为空
      let taskUserSelectUserLoginNameIsNull = taskUsers.find((item: any) => item.selectUserLoginName.length === 0)
      if (taskUserSelectUserLoginNameIsNull) {
        message.warning(tr(`请选择：【${taskUserSelectUserLoginNameIsNull.stepName}】任务的操作候选人`))
        return
      }

      // 重新设置动作待办用户数据
      taskAction.taskUsers = _.cloneDeep(taskUsers)
    }

    // 检查审批意见是否必须填写
    if (mustComment && !comment) {
      message.warning(tr('审批意见必须填写'))
      return
    }

    // 组装反馈以及内容
    let feedbackContent: CommentFeedback[] = []
    if (feedback === 1) {
      feedbackContent = feedbacks.filter((item) => item.feedbackContent)
    }

    Modal.confirm({
      title: <span>{tr('是否执行')}<b> {displayName}</b>{tr('审批操作')}？</span>,
      content: prompt ? <b>{tr('提示：')}{prompt}</b> : null,
      centered: true,
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      okText: tr('确认'),
      cancelText: tr('取消'),
      onOk: async (): Promise<any> => {
        try {
          message.loading(tr('正在执行,请等待...'), 0)
          let res = await doActionApi({
            taskId,
            action: taskAction,
            approveComment: comment,
            feedbackContent
          })
          message.destroy()
          const { result, message: msg } = res
          if (result === 'OK') {
            message.success(tr('表单审批成功'))
            // 刷新页面，将业务类型更改为历史
            const { pathname, search } = window.location
            let tempSearch = search.replace('taskType=current', 'taskType=current-approved')
            router.replace(`${pathname}${tempSearch}`)
            // 刷新数据
            refresh && refresh()
          } else {
            message.error(msg)
          }
        } catch (error) {
          message.destroy()
          console.log('doActionApi error\n', error)
        } finally {
          return Promise.resolve()
        }
      }
    })

  }, [taskAction, taskUsers, comment, feedback, taskId, feedbacks, refresh])

  return (
    <div style={{ padding: '0 10px' }}>
      <BlockHeader
        type='line'
        title={tr('审批操作')}
      />
      {
        approveActionView === 'select'
          ? (<Select
            placeholder={tr('请选择')}
            style={{ width: '100%' }}
            onSelect={onTaskSelect}
            loading={actionsLoading}
          >
            {actions.map((item: any) => {
              const { id, displayName } = item
              return <Select.Option key={id}>{displayName}</Select.Option>
            })}
          </Select>)
          : (<Radio.Group onChange={(res) => onTaskSelect(res.target.value)} value={taskAction.id}>
            <Row>
              {actions.map((item: any) => {
                const { id, displayName } = item
                return (
                  <Col span={24} key={id}>
                    <Radio value={id}>{displayName}</Radio>
                  </Col>
                )
              })}
            </Row>
          </Radio.Group>)
      }
      <Table
        tableKey='approveTaskTable'
        title={tr('后续任务待办人')}
        headerRight={
          <Button
            loading={importLoading}
            disabled={!allowSelectOwner}
            size='small'
            icon='import'
            onClick={importUser}
          >{tr('导入历史候选人')}</Button>
        }
        rowKey='stepId'
        editable={EditStatus.EDIT}
        dataSource={taskUsers}
        columns={showTableSchema}
        scroll={{
          y: tableHeight
        }}
        hideVisibleMenu
        headerProps={{
          type: 'line'
        }}
        resizeCell
      />
      <BlockHeader
        type='line'
        title={tr('审批意见')}
      />
      <Input.TextArea
        value={comment}
        onChange={(value: React.ChangeEvent<HTMLTextAreaElement>) => setComment(value.target.value)}
        style={{ resize: 'none', height: 82 }}
      />
      <BlockHeader
        title={(
          <span style={{
            fontSize: 12,
            fontWeight: 'normal'
          }}>
            ⚠️{tr('请首先选择需要执行的[审批操作]')}
          </span>
        )}
        extra={(
          <>
            <Popover
              title={tr('任务信息')}
              placement='topRight'
              content={(
                <>
                  <div><b>{tr('任务名称：')}</b>{taskName}</div>
                  <div><b>{tr('任务开始时间：')}</b>{startDate}</div>
                  <div><b>{tr('任务截至时间：')}</b>{dueDate}</div>
                  <div><b>{tr('待办人：')}</b>{owners}</div>
                </>
              )}
            >
              <Button icon='info' size='small' />
            </Popover>
            <Button
              type='primary'
              icon='code'
              size='small'
              onClick={handleApprove}
              disabled={_.isEmpty(taskAction)}
            >{tr('执行操作')}</Button>
          </>
        )}
      />
    </div>
  )
}
