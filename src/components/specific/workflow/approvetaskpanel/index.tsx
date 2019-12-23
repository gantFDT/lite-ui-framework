import React, { useMemo, useState } from 'react'
import { TabsProps } from 'antd/lib/tabs'
import { TabPanel } from '@/components/layout'
import { BaseApproveTaskOperationPanelProps } from '../approvetaskoperationpanel'
import schema from './schema'
import { CommentFeedback } from '../commentfeedback'
import styles from './index.less'

export type TaskType = 'current' | 'current-approved' | 'history' | 'myStart' | 'processManager'// 分别对应待处理任务、待处理任务已处理、已处理任务、我发起的流程、流程实例管理

export interface BaseApproveTaskPanelProps extends BaseApproveTaskOperationPanelProps {
  taskType: TaskType
}

export interface ApproveTaskPanelProps extends BaseApproveTaskPanelProps {
  tabProps?: TabsProps
  taskId: string
  width: number | string
  height: number | string
}

const DEFAULT_TAB_PROPS: TabsProps = {
  tabPosition: 'left',
  animated: false,
  // defaultActiveKey: '流程图'
}

/**
 * 流程审批(信息)组件
 */
export default (props: ApproveTaskPanelProps) => {
  const {
    processId,
    taskId,
    userLoginName,
    feedback,
    taskType,
    tabProps = DEFAULT_TAB_PROPS,
    width,
    height,
    refresh
  } = props

  const [feedbacks, setFeedbacks] = useState<CommentFeedback[]>([])
  // 控制转派日志是否刷新数据
  const [isRereshDipatchLog, setIsRereshDipatchLog] = useState(Date.now())

  const [currentWidth, currentHeight] = useMemo(() => {
    let tempWidth: number | string = width
    let tempHeight: number | string = height
    if (taskType !== 'processManager') {
      tempWidth = typeof width === 'number' ? width - 100 : width // 100是tab标签的宽度
    }
    return [tempWidth, tempHeight]
  }, [width, height])

  const extraProps = useMemo(() => {
    return {
      processId,
      taskId,
      userLoginName,
      feedback,
      feedbacks,
      setFeedbacks,
      taskType,
      isRereshDipatchLog,
      setIsRereshDipatchLog,
      width: currentWidth,
      height: currentHeight,
      refresh
    }
  }, [processId, taskId, userLoginName, feedback, feedbacks, taskType, isRereshDipatchLog, currentWidth, currentHeight, refresh])

  const showSchema = useMemo(() => {
    let tempSchema = schema
    if (feedback !== 1 || taskType !== 'current') {
      tempSchema = tempSchema.filter(item => item.key !== '意见反馈')
    }
    if (taskType === 'current-approved') {
      tempSchema = tempSchema.filter(item => item.key !== '流程操作')
    }
    if (['history', 'myStart', 'processManager'].includes(taskType)) {
      tempSchema = tempSchema.filter(item => item.key !== '流程操作')
      tempSchema = tempSchema.map(item => {
        let temp = { ...item }
        if (temp.key === '审批历史') {
          temp.key = tr('审批过程')
          temp.tab = tr('审批过程')
        }
        return {
          ...temp
        }
      })
    }
    return tempSchema
  }, [feedback, taskType])

  return (
    <TabPanel
      schema={showSchema}
      tabsProps={tabProps}
      extraProps={extraProps}
      className={styles['approve-tab']}
    />
  )
}
