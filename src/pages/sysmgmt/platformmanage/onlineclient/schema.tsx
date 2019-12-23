import React from 'react'
import { UserColumn, GroupSelector } from '@/components/specific'

export default [
  {
    title: tr('序号'),
    fieldName: 'temp',
    render: (data: string, record: any, index: number) => <span>{index + 1}</span>,
    width: 50,
    align: 'right'
  },
  {
    title: tr('用户姓名'),
    fieldName: 'user',
    render: (user: any) => <UserColumn id={user.id} />
  },
  {
    title: tr('所属组织'),
    fieldName: 'organizationId',
    render: (id: string) => <GroupSelector value={id} allowEdit={false} showMode='popover' />
  },
  {
    title: tr('最近活动时间'),
    fieldName: 'lastActivityTime'
  }
]
