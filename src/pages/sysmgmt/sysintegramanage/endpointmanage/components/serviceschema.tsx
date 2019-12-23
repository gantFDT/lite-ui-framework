import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import FormSchema, { UISchema, titleSchema, Schema, Types } from '@/components/form/schema';
import { Icon } from 'antd'

export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'name',
      title: tr('服务名称')
    },
    {
      fieldName: 'type',
      title: tr('绑定协议'),
      componentType: 'CodeList',
      props: {
        type: 'FW_INTEGRATION_ENDPOINT_TYPE'
      },
    },
  ],
  systemViews: [
    {
      viewId: 'servicelist',
      name: tr("视图设置"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'name'
          },
          {
            fieldName: 'type'
          },
        ]
      }
    },
  ]
}


export const smartTableSchema = [
  {
    fieldName: 'name',
    title: tr('服务名称'),
    width: 150,
    search: true,
    fixed: 'left'

  },
  {
    fieldName: 'type',
    title: tr('绑定协议'),
    componentType: 'CodeList',
    props: {
      type: 'FW_INTEGRATION_ENDPOINT_TYPE'
    },
  },
  {
    fieldName: 'reserve',
    title: tr('系统保留'),
    type: 'boolean',
    componentType: 'CodeList',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    render: (isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  }
]


export const searchUISchema: UISchema = {
  "ui:col": {
    xs: 12,//578
    // sm: 24,//578
    // md: 24,//786
    // lg: 24,//992
    // xl: 24,//1200
    // xxl: 12,//1600
  }
}
