import React from 'react'
import { Icon } from 'antd'
import { tr } from '@/components/common/formatmessage';
import UserColumn from '@/components/specific/usercolumn';
import { GroupSelector, UserSelector, RoleSelector, UserGroupSelector } from '@/components/specific'
import { FileUpload, ImageUpload, CodeList } from '@/components/form'

import active1 from '@/assets/images/active_1.png'
import active2 from '@/assets/images/active_2.png'


export const transferSearchSchema = {
  userLoginName: {
    title: tr('登录名'),
  },
  userName: {
    title: tr('姓名'),
  },
  organizationId: {
    title: tr('所属组织'),
    componentType: 'GroupSelector',
  },
}

export const transferColumns = [
  {
    dataIndex: 'userLoginName',
    title: tr('登录名'),
  },
  {
    dataIndex: 'id',
    title: tr('姓名'),
    render: text => <UserColumn id={text} />
  },
  {
    dataIndex: 'organizationId',
    title: tr('所属组织'),
    render: id => <GroupSelector value={id} allowEdit={false} />
  },
  {
    dataIndex: 'userType',
    title: tr('用户类型'),
    width: 80,
    render: id => <CodeList value={id} type='FW_USER_TYPE' allowEdit={false} />,
  },
]

export default [
  {
    fieldName: 'userLoginName',
    title: tr('登录名'),
  },
  {
    fieldName: 'id',
    title: tr('姓名'),
    render: text => <UserColumn id={text} />
  },
  {
    fieldName: 'organizationId',
    title: tr('所属组织'),
    render: text => <GroupSelector value={text} allowEdit={false} showMode="popover" />
  },
  {
    fieldName: 'userType',
    title: tr('用户类型'),
    width: 120,
    componentType: 'CodeList',
    props: {
      type: 'FW_USER_TYPE'
    },
  },
  {
    fieldName: 'isActive',
    title: tr('是否有效'),
    componentType: 'Switch',
    width: 80,
    render: (isActive) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
]