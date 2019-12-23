import React from 'react'
import { UserColumn } from '@/components/specific'
import OwnerColumn from '../ownercolumn'

export default [
  {
    title: tr('审批任务名称'),
    width: 200,
    dataIndex: 'taskName'
  },
  {
    title: tr('转派前用户'),
    width: 120,
    dataIndex: 'owners',
    render: (owners: any[]) => <OwnerColumn owners={owners} />
  },
  {
    title: tr('转派后用户'),
    width: 140,
    dataIndex: 'dispatchUserLoginName',
    render: (dispatchUserLoginName: string) => <UserColumn userLoginName={dispatchUserLoginName} />
  },
  {
    title: tr('转派说明'),
    width: 250,
    dataIndex: 'dispatchComment'
  },
  {
    title: tr('操作人'),
    width: 140,
    dataIndex: 'userLoginName',
    render: (userLoginName: string) => <UserColumn userLoginName={userLoginName} />
  },
  {
    title: tr('操作时间'),
    width: 150,
    dataIndex: 'operationTime'
  }
]
