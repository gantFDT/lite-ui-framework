import React from 'react'
import { UserColumn } from '@/components/specific'
import ApprovelCommentColumn from '../approvecommentcolumn'
import OwnerColumn, { Owner } from '../ownercolumn'
import KeepTimeColumn from '../keeptimecolumn'

const BASIC_PATH = '/api/static/v4pc/sysmgmt/resources/images/workflow/'

export default [
  {
    title: tr('审批任务名称'),
    width: 150,
    dataIndex: 'taskName',
    render: (value: string, record: any) => {
      const { taskType } = record
      let imgPath = ''
      if (taskType === 'S') {
        imgPath = `kaishi.png`
      } else if (taskType === 'H') {
        imgPath = `duigou.png`
      } else if (taskType === 'C') {
        imgPath = `jiantou.png`
      } else if (taskType === 'F') {
        imgPath = `weilai.png`
      } else if (taskType === 'E') {
        imgPath = `jieshu.png`
      }
      return (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src={`${BASIC_PATH}${imgPath}`} alt='' />
          <span>&nbsp;{value}</span>
        </div>
      )
    },
    fixed: 'left'
  },
  {
    title: tr('审批人'),
    width: 80,
    dataIndex: 'caller',
    render: (userLoginName: string) => userLoginName && <UserColumn userLoginName={userLoginName} />
  },
  {
    title: tr('审批意见'),
    width: 200,
    dataIndex: 'approveComment',
    render: (comment: string, record: any) => {
      const { feedbacks } = record
      return <ApprovelCommentColumn approveComment={comment} feedbacks={feedbacks} />
    }
  },
  {
    title: tr('任务开始时间'),
    width: 150,
    dataIndex: 'startDate'
  },
  {
    title: tr('任务完成时间'),
    width: 150,
    dataIndex: 'finishDate'
  },
  {
    title: tr('任务持续时间'),
    width: 100,
    dataIndex: 'keepTime',
    render: (temp: string, record: any) => {
      const { startDate, finishDate } = record
      return <KeepTimeColumn startTime={startDate} endTime={finishDate} />
    }
  },
  {
    title: tr('审批操作'),
    width: 80,
    dataIndex: 'actionName'
  },
  {
    title: tr('被代理人'),
    width: 80,
    dataIndex: 'agentName'
  },
  {
    title: tr('操作候选人'),
    width: 200,
    dataIndex: 'owners',
    render: (owners: Owner[]) => <OwnerColumn owners={owners} />
  }
]
