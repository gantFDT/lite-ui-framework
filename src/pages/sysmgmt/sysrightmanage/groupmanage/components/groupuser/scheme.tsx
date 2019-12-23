


import React from 'react';
import {Icon} from 'antd'
import { UserColumn, GroupSelector } from '@/components/specific'

export const smartTableSchema = [
  {
    fieldName: 'userLoginName',
    title: tr('登录名'),
  },
  {
    fieldName: 'userName',
    title: tr('姓名'),
    render: function (text: any, record: any) {
      const id = record.id;
      return <UserColumn id={id}></UserColumn>
    }
  },
  {
    fieldName: 'organizationId',
    title: tr('所属组织'),
    render: function (text: any, record: any) {
      const id = record.organizationId;
      return <GroupSelector value={id} allowEdit={false} showMode='popover' />
    }
  },
  {
    title: tr('用户类型'),
    fieldName: 'userType',
    componentType: 'CodeList',
    props: {
      type: "FW_USER_TYPE"
    },
  },
  {
    title: tr('是否有效'),
    fieldName: 'isActive',
    componentType: 'CodeList',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    width: 80,
    render: (isActive: boolean) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  }
]