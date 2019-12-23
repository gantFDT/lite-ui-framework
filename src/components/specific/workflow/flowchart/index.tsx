import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Spin, Alert, Empty } from 'antd'
import classnames from 'classnames'
import request from '@/utils/request'
import FlowDetail from '@/components/specific/workflow/flowdetail'
import styles from './index.less'

interface FlowChartProps {
  contentId?: string // 请求参数模板内容ID
  processId?: string // 请求参数模板过程ID
  templateKey?: string // 请求参数模板key
  templateVersion?: string // 请求参数模板版本
  height: number | string
  width: number | string
  emptyDescription?: string // 无数据描述信息
}

const TEMPLATE_URL = '/workflowDesign/getDeployTemplate'
const START_URL = '/workflowDesign/getStartTemplate'
const PROCESS_URL = '/workflowDesign/getProcessActionContent'

/**
 * 流程图组件
 */
export default (props: FlowChartProps) => {
  const {
    contentId,
    processId,
    templateKey,
    templateVersion,
    height,
    width,
    emptyDescription
  } = props

  const [loading, setLoading] = useState(false)
  const [workflowTemplateData, setWorkflowTemplateData] = useState<any>(null)
  const [workflowStatus, setWorkflowStatus] = useState<any>({})
  const [size, setSize] = useState({ width: 0, height: 0 })
  const wrapperRef = useRef<HTMLDivElement>({ clientHeight: 0, clientWidth: 0 } as HTMLDivElement)

  const fetchData = useCallback(async () => {
    let params: any = {}
    let url = TEMPLATE_URL
    if (contentId) {
      params.contentId = contentId
      templateVersion && (params.templateVersion = templateVersion)
    }
    if (templateKey) {
      params.templateKey = templateKey
      url = START_URL
    }
    if (processId) {
      params.processId = processId
      url = PROCESS_URL
    }

    setLoading(true)
    try {
      let res = await request.post(url, { data: params })
      let workflowData: any
      if (processId) {
        workflowData = res.tempateContent
      } else {
        workflowData = res
      }
      setWorkflowStatus({
        currentStepIds: res.currentStepIds,
        lastActionId: res.lastActionId,
        historyActionIds: res.historyActionIds
      })
      setWorkflowTemplateData(workflowData)
    } catch (error) {
      console.error('fetchData error\n', error)
    }
    setLoading(false)
  }, [contentId, templateKey, processId])

  useEffect(() => {
    if (!contentId && !templateKey && !processId) {
      return
    }
    fetchData()
  }, [contentId, templateKey, processId])

  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = wrapperRef.current
    setSize({
      width, height
    })
  }, [width, height])

  return (
    <div
      className={classnames(styles.wrapperNormal, {
        [styles.wrapper]: !workflowTemplateData || (!contentId && !templateKey && !processId)
      })}
      style={{ width: width || '100%', height }}
      ref={wrapperRef}
    >
      {(!contentId && !templateKey && !processId)
        ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={emptyDescription} />
        : (
          workflowTemplateData
            ? <FlowDetail dataSource={workflowTemplateData} width={size.width} height={size.height} {...workflowStatus} />
            : (loading
              ? <Spin spinning={loading} />
              : <Alert showIcon type='error' message={tr('流程图加载失败')} />)
        )}
    </div>
  )
}
