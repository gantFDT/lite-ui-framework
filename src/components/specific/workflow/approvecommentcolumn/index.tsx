import React from 'react'
import { Popover } from 'antd'
import { Table } from 'gantd'
import Link from 'umi/link'
import schema from './schema'
import { CommentFeedback } from '../commentfeedback'

export interface ApproveCommentColumnProps {
  approveComment: string
  feedbacks: CommentFeedback[]
}

const INIT_FEEDBACKS: CommentFeedback[] = []

/**
 * 审批意见 列组件
 */
export default (props: ApproveCommentColumnProps) => {
  const {
    approveComment,
    feedbacks = INIT_FEEDBACKS
  } = props

  return (
    feedbacks.length > 0
      ? (
        <Popover
          title={`${tr('审批意见')} - ${approveComment}`}
          placement='right'
          overlayStyle={{ width: '650px' }}
          content={(
            <Table
              dataSource={feedbacks}
              columns={schema}
              rowKey='taskId'
              resizeCell={false}
            />
          )}
          trigger='click'
        >
          <Link to='#'>{approveComment}</Link>
        </Popover>
      )
      : <span>{approveComment}</span>
  )
}
