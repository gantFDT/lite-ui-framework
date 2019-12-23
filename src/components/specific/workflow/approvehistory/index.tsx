import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Button, message, Modal } from 'antd'
import { Table, BlockHeader } from 'gantd'
import { TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, BLOCK_HEADER_HEIGHT } from '@/utils/utils'
import { findAllTasksApi, doAdjustTaskOwnerApi } from '../service'
import schema from './schema'
import { TaskType } from '../approvetaskpanel'
import OwnerSelectorModal from '../ownerselector/Modal'
import DispatchLogModal from '../dispatchlogmodal'

export interface ApproveHistoryProps {
  processId: string
  taskType: TaskType
  setIsRereshDipatchLog: Function
  height: number | string
  width: number | string
}
// 可操作的任务类型列表
const OPERATION_TASKS = ['myStart', 'processManager']

/**
 * 审批历史组件
 */
export default (props: ApproveHistoryProps) => {
  const {
    processId,
    taskType,
    setIsRereshDipatchLog,
    width,
    height,
  } = props
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const [selectedIds, setSelectIds] = useState<any[]>([])
  const [dispatchLogModalVisible, setDispatchLogModalVisible] = useState(false)
  const [selectedTask, setSelectedTask] = useState<any>({})
  const [ownerSelectorModalVisible, setOwnerSelectorModalVisible] = useState(false)
  const [selectedLoginNames, setSelectedLoginNames] = useState<any[]>([])
  const [modifyOwnerImplLoading, setModifyOwnerImplLoading] = useState(false)
  const { taskType: operateTaskType } = useMemo(() => {
    let tempRow: any = data.find((item: any) => item.id === selectedIds[0])
    return tempRow || {}
  }, [selectedIds, data])

  const tableHeight = useMemo(() => {
    let tableHeight: string | number = 0
    let common = TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT
    if (OPERATION_TASKS.includes(taskType)) {
      common = common + BLOCK_HEADER_HEIGHT
    }
    tableHeight = typeof height === 'number' ? height - common : `calc(${height} - ${common}px)`
    return tableHeight
  }, [height, taskType, data])

  const findAllTasks = useCallback(async () => {
    setLoading(true)
    try {
      const res = await findAllTasksApi(processId)
      setData(res)
      setSelectIds([])
    } catch (error) {
      console.error('findAllTasks error\n', error)
    }
    setLoading(false)
  }, [processId])

  useEffect(() => {
    findAllTasks()
  }, [taskType, findAllTasks])

  const onRowSelect = useCallback((ids: string[]) => {
    setSelectIds(ids)
  }, [])

  const extraProps = useMemo(() => {
    let tempProps: any = {}
    if (OPERATION_TASKS.includes(taskType)) {
      tempProps.rowSelection = {
        type: 'radio',
        selectedRowKeys: selectedIds,
        clickable: true,
        onChange: onRowSelect
      }
    }
    return tempProps
  }, [taskType, processId, selectedIds])

  const onApproved = useCallback(() => {
    setIsRereshDipatchLog && setIsRereshDipatchLog(Date.now())
    findAllTasks()
  }, [setIsRereshDipatchLog, findAllTasks])

  const modifyOwnerImpl = useCallback(async (selectedUsers: any[]) => {
    if (selectedUsers.length === 0) {
      return message.warning(tr('请选择操作候选人员'))
    }
    const { processId, templateStepId } = selectedTask as any
    let newOwners = selectedUsers.filter((item: any) => item.userLoginName !== 'TASK_OWNER_SKIP')
    setModifyOwnerImplLoading(true)
    try {
      await doAdjustTaskOwnerApi({
        processId,
        templateStepId,
        owners: newOwners
      }, 'modifyOwner')
      findAllTasks()
      setOwnerSelectorModalVisible(false)
    } catch (error) {
      console.error('modifyOwnerImpl error\n', error)
    }
    setModifyOwnerImplLoading(false)
  }, [selectedTask])

  const skipTaskImpl = useCallback((task: any): any => {
    const { owners = [], taskName, processId, templateStepId } = task
    // 检查是否已是跳过状态
    const isSkip = owners.some((item: any) => item.userLoginName === 'TASK_OWNER_SKIP')
    if (isSkip) {
      return message.warning(tr(`${taskName}审批任务已为不参与审批过程`))
    }
    Modal.confirm({
      title: tr(`是否跳过[${taskName}]审批任务？`),
      centered: true,
      okText: tr('是'),
      cancelText: tr('否'),
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk: async () => {
        message.loading(tr('正在执行,请等待...'))
        try {
          await doAdjustTaskOwnerApi({
            processId,
            templateStepId,
            owners: [{
              userLoginName: 'TASK_OWNER_SKIP',
              userName: tr('[本任务不参与审批过程]')
            }]
          }, 'skipTask')
          findAllTasks()
        } catch (error) {
          console.error('skipTaskImpl error\n', error)
        }
        message.destroy()
      }
    })
  }, [])

  const onOperateClick = useCallback((type: 'dispatch' | 'modifyOwner' | 'skipTask'): any => {
    let selectRow: any = data.find((item: any) => item.id === selectedIds[0])
    if (selectedIds.length === 0 || !selectRow) {
      return message.warning(tr('请选择一条审批任务'))
    }
    const { taskType } = selectRow
    const operateMap = {
      dispatch: {
        taskType_: 'C',
        text: '当前待处理任务',
        implFunc: () => setDispatchLogModalVisible(true)
      },
      modifyOwner: {
        taskType_: 'F',
        text: '将来审批任务',
        implFunc: () => {
          const { owners = [] } = selectRow
          let tempSelectedLoginNames = owners.map((item: any) => item.userLoginName)
          setSelectedLoginNames(tempSelectedLoginNames)
          setOwnerSelectorModalVisible(true)
        }
      },
      skipTask: {
        taskType_: 'F',
        text: '将来审批任务',
        implFunc: () => skipTaskImpl(selectRow)
      }
    }
    const currentOperate = operateMap[type]
    const { taskType_, text, implFunc } = currentOperate
    if (taskType !== taskType_) {
      return message.warning(tr(`只有${text}，才能进行转派操作`))
    }
    setSelectedTask(selectRow)
    implFunc()
  }, [selectedIds, data])

  return (
    <div style={{ width: width || '100%' }}>
      <Table
        tableKey='approveHistory'
        dataSource={data}
        loading={loading}
        columns={schema}
        rowKey='id'
        resizeCell
        {...extraProps}
        scroll={{
          y: tableHeight
        }}
      />
      {OPERATION_TASKS.includes(taskType) && (
        <BlockHeader
          title={(
            <span style={{
              fontSize: 12,
              fontWeight: 'normal'
            }}>
              ⚠️{tr('只有当前待处理任务才能执行[转派审批任务]，[调整候选人员]、[跳过审批任务]只能针对将来审批任务')}
            </span>
          )}
          extra={(
            <>
              <Button
                type='primary'
                icon='retweet'
                size='small'
                disabled={operateTaskType !== 'C'}
                onClick={() => onOperateClick('dispatch')}
              >{tr('转派审批任务')}</Button>
              <Button
                icon='usergroup-add'
                type='primary'
                size='small'
                disabled={operateTaskType !== 'F'}
                onClick={() => onOperateClick('modifyOwner')}
              >{tr('调整候选人员')}</Button>
              <Button
                icon='step-forward'
                type='primary'
                size='small'
                disabled={operateTaskType !== 'F'}
                onClick={() => onOperateClick('skipTask')}
              >{tr('跳过审批任务')}</Button>
            </>
          )}
        />
      )}
      <OwnerSelectorModal
        visible={ownerSelectorModalVisible}
        isAllUser
        selectedLoginNames={selectedLoginNames}
        onCancel={() => setOwnerSelectorModalVisible(false)}
        onOk={modifyOwnerImpl}
        confirmLoading={modifyOwnerImplLoading}
      />
      <DispatchLogModal
        processIds={[selectedTask.processId]}
        taskIds={[selectedTask.id]}
        visible={dispatchLogModalVisible}
        onClose={() => setDispatchLogModalVisible(false)}
        onDispatched={onApproved}
        forceDispatch
      />
    </div>
  )
}
