import React from 'react'
import { Icon } from 'gantd'

import { SchemaProps } from '@/components/specific/smarttable/fieldgenerator'
import { UISchema, Schema, Types } from '@/components/form/schema';
import { UserSelector, GroupSelector } from '@/components/specific/selectors';
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch';

export const tableScheme: Array<SchemaProps<object>> = [
  {
    fieldName: 'userId',
    title: tr('分级管理员'),
    render: (text: string) => <UserSelector value={text} allowEdit={false} showMode="popover" />
  },
  {
    fieldName: 'organizationId',
    title: tr('分级管理组织'),
    render: (text: string) => <GroupSelector value={text} allowEdit={false} showMode="popover" />
  },
  {
    fieldName: 'roleCount',
    title: tr('分配角色'),
    render: (count: number) => <Icon type="icon-jiaoseguanli" style={{ color: count > 0 ? "rgb(109, 166, 68)" : 'transparent', fontSize: '16px' }} />,//<img src={count > 0 ? jiaose2 : jiaose1} />,
  },
  {
    fieldName: 'groupCount',
    title: tr('分配用户组'),
    render: (count: number) => <Icon type="icon-yonghuzuguanli" style={{ color: count > 0 ? "rgb(109, 166, 68)" : 'transparent', fontSize: '16px' }} />, //<img src={count > 0 ? yhz2 : yhz1} />,
  },
]

export const modalSchema: Schema = {
  type: Types.object,
  required: ['userId', 'organizationId'],
  propertyType: {
    userId: {
      title: tr('分级管理员'),
      type: Types.string,
      componentType: "UserSelector",
    },
    organizationId: {
      title: tr('分级管理组织'),
      type: Types.string,
      componentType: "GroupSelector"
    }
  }
}

export const formuischema = {
  "ui:backgroundColor": "#fff",
  "ui:col": {
    sm: 24,
    xxl: 12,
  },
  "ui:labelCol": {},
  "ui:wrapperCol": {},
}

export const titleconfig = {
  "title:type": "num",
  "title:color": "theme",
}

export const filterscheme: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'userId',
      title: tr('分级管理员')
    },
    {
      fieldName: 'organizationId',
      title: tr('分级管理组织')
    }
  ],
  systemViews: [
    {
      viewId: 'initial',
      name: tr('初始视图'),
      version: '0.1',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'userId'
          },
          {
            fieldName: 'organizationId'
          }
        ]
      }
    }
  ]
}

export const searchUISchema: UISchema = {
  "ui:col": {
    md: 12,
  },
  // "ui:labelCol": {
  //     xxl: 8,
  // },
  // "ui:wrapperCol": {
  //     xxl: 16,
  // },
}
