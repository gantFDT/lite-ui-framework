import React from 'react';
import { Icon } from 'antd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'bizSerialNum',
      title: tr('业务流水号')
    },
    {
      fieldName: 'serverName',
      title: tr('服务端名称')
    },
    {
      fieldName: 'clientName',
      title: tr('客户端名称')
    },
    {
      fieldName: 'handleName',
      title: tr('功能名称')
    },
    {
      fieldName: 'beginTime',
      title: tr('开始时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YY-MM-DD'
      }
    },
    {
      fieldName: 'endTime',
      title: tr('结束时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YY-MM-DD'
      }
    },
    {
      fieldName: 'duration',
      title: tr('消耗时长')
    }
  ],
  systemViews: [
    {
      viewId: 'taskmanage',
      name: tr("视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'bizSerialNum'
          },
          {
            fieldName: 'serverName'
          },
          {
            fieldName: 'clientName'
          },
          {
            fieldName: 'handleName'
          },
          {
            fieldName: 'beginTime'
          },
          {
            fieldName: 'endTime'
          },
          {
            fieldName: 'duration'
          },
        ]
      }
    }
  ]
}

export const smartTableSchema = [
  {
    fieldName: 'bizSerialNum',
    title: tr('业务流水号'),
  },
  {
    fieldName: 'serverName',
    title: tr('服务端名称'),
  },
  {
    fieldName: 'clientName',
    title: tr('客户端名称'),
  },
  {
    fieldName: 'handleName',
    title: tr('功能名称'),
  },
  {
    fieldName: 'beginTime',
    title: tr('开始时间'),
  },
  {
    fieldName: 'endTime',
    title: tr('结束时间'),
  },
  {
    fieldName: 'duration',
    title: tr('消耗时长'),
  },
  {
    fieldName: 'success',
    title: tr('是否成功'),
    render:(isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
  {
    fieldName: 'inData',
    title: tr('交互数据'),
  }
]
