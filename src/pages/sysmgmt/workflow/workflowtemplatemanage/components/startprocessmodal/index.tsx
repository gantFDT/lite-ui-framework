import React, { useMemo, useState, useCallback } from 'react'
import { TabsProps } from 'antd/lib/tabs'
import { TabPanel } from '@/components/layout'
import SmartModal from '@/components/specific/smartmodal'
import schema from './schema'
import styles from './index.less'

export type TaskType = 'start' | 'started' // 分别对应启动任务、已启动任务

export interface StartProcessModalProps {
  templateKey: string // 流程模版关键字
  visible: boolean
  onClose: () => void
}

const DEFAULT_TAB_PROPS: TabsProps = {
  tabPosition: 'top',
  animated: false,
  // defaultActiveKey: '流程图'
}
const INIT_ITEM_STATE = {
  width: 700,
  height: 470
}
const DEFAULT_PROPS = {
  processDetail: tr('通过界面启动的流程(React)'),
  variables: {
    v1: '111',
    v2: '222',
    mobileFormInfo: 'test01WorkflowMobileFormInfo'
  },
  resourceName: tr('测试任务'),
  controllerName: 'gantang.sysmgmt.workflow.process.controller.TestFormController',
  viewName: 'gantang.sysmgmt.workflow.process.view.TestFormWindow',
  recTypeId: '9999',
  recId: Date.now()
}

/**
 * 流程启动弹框组件
 */
export default (props: StartProcessModalProps) => {
  const {
    templateKey,
    visible,
    onClose
  } = props

  if (!visible) return null
  const [taskType, setTaskType] = useState<TaskType>('start')
  const [processId, setProcessId] = useState('')
  const [modalSize, setModalSize] = useState({ width: 0, height: 0 })
  const [currentWidth, currentHeight] = useMemo(() => {
    const { width, height } = modalSize
    let tempWidth: number | string = width - 20
    let tempHeight: number | string = height
    tempHeight = height - 41 - 36 - 5 - 20
    return [tempWidth, tempHeight]
  }, [modalSize])

  const onStartedSuccess = useCallback((processId: string) => {
    setTaskType('started')
    setProcessId(processId)
  }, [])

  const extraProps = useMemo(() => {
    return {
      templateKey,
      processId,
      taskType,
      width: currentWidth,
      height: currentHeight,
      onStartedSuccess,
      ...DEFAULT_PROPS
    }
  }, [templateKey, processId, taskType, currentWidth, currentHeight])

  const showSchema = useMemo(() => {
    let tempSchema = schema
    if (taskType === 'start') {
      tempSchema = tempSchema.filter(item => item.key !== '审批历史')
    }
    if (taskType === 'started') {
      tempSchema = tempSchema.filter(item => item.key !== '流程操作')
    }
    return tempSchema
  }, [taskType])

  const onModalSizeChagne = useCallback((width: number, height: number) => {
    setModalSize({ width, height })
  }, [])

  return (
    <SmartModal
      id='startProcessModal'
      title={tr('启动审批流程')}
      footer={null}
      visible={visible}
      onCancel={onClose}
      itemState={INIT_ITEM_STATE}
      onSizeChange={onModalSizeChagne}
    >
      <TabPanel
        schema={showSchema}
        tabsProps={DEFAULT_TAB_PROPS}
        extraProps={extraProps}
        className={styles['approve-tab']}
      />
    </SmartModal>
  )
}
