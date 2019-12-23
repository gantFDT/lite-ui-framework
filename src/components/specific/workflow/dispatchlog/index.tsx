import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Table } from 'gantd'
import { TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { findDispatchApi } from '../service'
import schema from './schema'
import { TaskType } from '../approvetaskpanel'
import { getWorkflowConfig } from '../utils'

export interface ApproveHistoryProps {
  processId: string
  isRereshDipatchLog: string
  width: number | string
  height: number | string
  taskType: TaskType
}

/**
 * 转派日志组件
 */
export default (props: ApproveHistoryProps) => {
  const {
    processId,
    isRereshDipatchLog,
    width,
    height,
    taskType
  } = props
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)
  const { dispatchComment } = useMemo(() => {
    let config = getWorkflowConfig() || {}
    return config
  }, [])

  const tableHeight = useMemo(() => {
    let common = TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT
    let tableHeight: number | string = typeof height === 'number' ? height - common : `calc(${height} - ${common}px)`
    return tableHeight
  }, [height, data])

  const findDispatch = useCallback(async () => {
    setLoading(true)
    try {
      const res = await findDispatchApi(processId)
      setData(res)
    } catch (error) {
      console.error('findDispatch error\n', error)
    }
    setLoading(false)
  }, [processId, isRereshDipatchLog, taskType])

  const showColumn = useMemo(() => {
    let column = schema
    if (!dispatchComment) {
      column = schema.filter((item) => item.dataIndex !== 'dispatchComment')
    }
    return column
  }, [dispatchComment])

  useEffect(() => {
    findDispatch()
  }, [findDispatch])

  return (
    <div style={{ width: width || '100%' }}>
      <Table
        tableKey='dispatchLog'
        dataSource={data}
        loading={loading}
        columns={showColumn}
        rowKey='id'
        scroll={{
          y: tableHeight
        }}
        resizeCell
      />
    </div>
  )
}
