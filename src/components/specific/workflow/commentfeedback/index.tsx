import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Table, Input, EditStatus } from 'gantd'
import _ from 'lodash'
import { TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, BLOCK_HEADER_TITLE } from '@/utils/utils'
import { findExpectFeedbackApi } from '../service'
import schema from './schema'

export interface CommentFeedback {
  taskId: string
  taskName: string
  callerName: string
  approveComment: string
  feedbackContent: string
  feedbackUser: string
  feedbackUserName: string
  feedbackDate: string
}

export interface CommentFeedbackProps {
  processId: string
  setFeedbacks: Function
  width: number | number
  height: number | number
}

/**
 * 意见反馈组件
 */
export default (props: CommentFeedbackProps) => {
  const {
    processId,
    setFeedbacks,
    width,
    height
  } = props
  const [data, setData] = useState<CommentFeedback[]>([])
  const [loading, setLoading] = useState(false)

  const tableHeight = useMemo(() => {
    let common = TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT
    let tableHeight = typeof height === 'number' ? height - common : `calc(${height} - ${common}px)`
    return tableHeight
  }, [height, data])

  const findExpectFeedback = useCallback(async () => {
    setLoading(true)
    try {
      const res = await findExpectFeedbackApi(processId)
      setData(res)
      setFeedbacks && setFeedbacks(res)
    } catch (error) {
      console.error('findExpectFeedback error\n', error)
    }
    setLoading(false)
  }, [processId])

  useEffect(() => {
    findExpectFeedback()
  }, [])

  const onCommentChange = useCallback((data: CommentFeedback[], value: string, index: number) => {
    let newData = _.cloneDeep(data)
    newData.splice(index, 1, {
      ...newData[index],
      feedbackContent: value
    })
    setData(newData)
    setFeedbacks && setFeedbacks(newData)
  }, [])

  const showSchema = useMemo(() => {
    return schema.map((item: any) => {
      const { dataIndex } = item
      const render = (text: string, record: CommentFeedback, index: number) => {
        return (
          <Input
            onChange={(comment: string) => onCommentChange(data, comment, index)}
          />)
      }
      if (dataIndex === 'feedbackContent') {
        item.editConfig = {
          render
        }
      }
      return item
    })
  }, [data])

  return (
    <div style={{ width: width || '100%' }}>
      <Table
        talbeKey='commentFeedbackTable'
        editable={EditStatus.EDIT}
        dataSource={data}
        loading={loading}
        columns={showSchema}
        rowKey='taskId'
        scroll={{
          y: tableHeight
        }}
        resizeCell
      />
    </div>
  )
}
