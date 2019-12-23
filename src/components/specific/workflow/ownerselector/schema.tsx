import React from 'react'
import { SearchFormSchema } from '@/components/specific/searchform'
import { SearchTableScheme } from '@/components/specific/searchtable/SearchTable'
import { UserColumn, GroupSelector } from '@/components/specific'

export const searchSchema: SearchFormSchema = {
  userLoginName: {
    title: tr('登录名')
  },
  userName: {
    title: tr('姓名')
  },
  organizationId: {
    title: tr('组织机构'),
    componentType: 'GroupSelector'
  }
}

export const tableColumn = [
  {
    dataIndex: 'userLoginName',
    title: tr('登录名')
  },
  {
    dataIndex: 'userName',
    title: tr('姓名'),
    render: (name: string, record: any) => <UserColumn userLoginName={record.userLoginName} />
  },
  {
    dataIndex: 'organizationId',
    title: tr('所属组织'),
    render: (id: string) => <GroupSelector value={id} allowEdit={false} showMode='popover' />
  }
]

const scheme: SearchTableScheme[] = [
  {
    key: 'userLoginName',
    name: tr('登录名'),
    type: 'Input',
    column: true,
    search: true
  },
  {
    key: 'userName',
    name: tr('姓名'),
    type: 'Input',
    column: true,
    search: true,
    render: (name: string, record) => <UserColumn userLoginName={record.userLoginName} />
  },
  {
    key: 'organizationId',
    name: tr('所属组织'),
    column: true,
    render: (id: string) => <GroupSelector value={id} allowEdit={false} showMode='popover' />
  }
]

export default scheme
