import React, { useMemo, useState, useEffect, useCallback, ReactNode } from 'react'
import { Button, Tooltip, message, Input, Modal, Popover } from 'antd'
import { BlockHeader } from 'gantd'
import { getModelData } from '@/utils/utils'
import { findActionsApi, doActionApi, getApproveTaskInfoApi } from '../service'


interface MiniTaskApprovePanelProps {
  taskId: string // 任务id
  processId?: string // 流程id
  title?: string | ReactNode // 标题
  hiddenOnManual?: boolean // 如果hiddenOnManual为true,则只要有一个审批操作存在手动配置(selectOwnerType==='manual')用户则不会显示当前流程该组件，为false的话，则会显示正常显示，但是需手动配置用户的操作是不能进行审批的
  onApproved?: (taskId: string) => void // 审批成功后会触发该回调
  headerProps?: any // 传递至BlockHeader组件的属性
  commentHeight?: number | string // 审批意见输入框高度
}

const MANUAL = 'manual'
const DEFAULT_TITLE = tr('流程审批')
const INIT_ANY_OBJECT: any = {}
const MANUAL_TIP = tr("需要手动输入后续任务候选人,请到流程审批页面操作")
const COMMENT_TIP = tr('审批意见')

/**
 * mini审批组件
 */
export default (props: MiniTaskApprovePanelProps) => {
  const {
    taskId,
    processId,
    title = DEFAULT_TITLE,
    hiddenOnManual = true,
    onApproved,
    headerProps = INIT_ANY_OBJECT,
    commentHeight = 80
  } = props

  const [fetchLoading, setFetchLoading] = useState(false)
  const [actions, setActions] = useState<any[]>([])
  const [comment, setComment] = useState('')
  const [isApproved, setIsApproved] = useState(false)
  const [taskInfo, setTaskInfo] = useState<any>({})
  const { dueDate, owners, startDate, taskName } = taskInfo

  const showPanel = useMemo(() => {
    // 判断是否有手动的
    const isExistMauanl = actions.some((item) => item.selectOwnerType === MANUAL)
    if (isExistMauanl && hiddenOnManual) {
      return false
    }
    return true
  }, [actions, hiddenOnManual])

  // 获取任务操作列表
  const findActions = useCallback(async (taskId: string) => {
    setFetchLoading(true)
    try {
      let res: any[] = await findActionsApi(taskId)
      setActions(res)
      setIsApproved(false)
    } catch (error) {
      setIsApproved(true)
    }
    setFetchLoading(false)
  }, [])

  // 获取审批任务信息
  const getApproveTaskInfo = useCallback(async (taskId: string, processId: string) => {
    const { userLoginName } = getModelData('user.currentUser')
    try {
      let res = await getApproveTaskInfoApi({
        processId,
        taskId,
        userLoginName
      })
      setTaskInfo(res || {})
    } catch (error) {
      console.error('getApproveTaskInfo error\n', error)
      setTaskInfo({})
    }
  }, [])

  useEffect(() => {
    findActions(taskId)
  }, [taskId])

  useEffect(() => {
    if (processId) {
      getApproveTaskInfo(taskId, processId)
    } else {
      setTaskInfo({} as any)
    }
  }, [taskId, processId])

  const handleApprove = useCallback((taskAction: any) => {
    const { mustComment, name, prompt } = taskAction

    // 检查审批意见是否必须填写
    if (mustComment && !comment) {
      message.warning(tr('审批意见必须填写'))
      return
    }

    Modal.confirm({
      title: <span>{tr('是否执行')}<b> {name} </b>{tr('审批操作')}？</span>,
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
            feedbackContent: []
          })
          message.destroy()
          const { result, message: msg } = res
          if (result === 'OK') {
            message.success(tr('表单审批成功'))
            // 刷新数据
            onApproved && onApproved(taskId)
            setIsApproved(true)
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

  }, [comment, taskId, onApproved])

  return (
    (showPanel && !fetchLoading && !isApproved) ? (
      <>
        <BlockHeader
          {...headerProps}
          title={title}
          extra={(
            <>
              {!_.isEmpty(taskInfo) && (
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
              )}
              {actions.map((item: any) => {
                const { name, prompt, selectOwnerType } = item
                const isManual = selectOwnerType === MANUAL
                return (
                  <Tooltip title={isManual ? MANUAL_TIP : prompt}>
                    <Button
                      size='small'
                      disabled={isManual}
                      onClick={handleApprove.bind(null, item)}
                    >{name}</Button>
                  </Tooltip>
                )
              })}
            </>
          )}
        />
        <Input.TextArea
          value={comment}
          onChange={(value: React.ChangeEvent<HTMLTextAreaElement>) => setComment(value.target.value)}
          style={{ resize: 'none', height: commentHeight }}
          placeholder={COMMENT_TIP}
        />
      </>
    ) : null
  )
}
