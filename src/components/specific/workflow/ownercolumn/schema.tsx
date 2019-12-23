
import React from 'react'
import { UserColumn, GroupSelector } from '@/components/specific'

export default [
  {
    title: tr('姓名'),
    dataIndex: 'userLoginName',
    render: (userLoginName: string) => userLoginName && <UserColumn userLoginName={userLoginName} />
  },
  {
    title: tr('部门'),
    dataIndex: 'organizationId',
    render: (id: string) => id && <GroupSelector value={id} allowEdit={false} showMode='popover' />
  }
]
