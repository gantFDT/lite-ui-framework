import React from 'react';
import { Icon } from 'antd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import Indata from '../indata'

export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'bizSerialNum',
      title: tr('业务流水号')
    },
    {
      fieldName: 'serverCode',
      title: tr('服务端名称'),
      componentType: 'CodeList',
      props: {
        type: "INTEGRATION_CALL_SERVER"
      }
    },
    {
      fieldName: 'clientCode',
      title: tr('客户端名称'),
      componentType: 'CodeList',
      props: {
        type: "INTEGRATION_CALL_CLIENT"
      }
    },
    {
      fieldName: 'dateFrom',
      title: tr('开始时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD'
      }
    },
    {
      fieldName: 'dateTo',
      title: tr('结束时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD'
      }
    },
    {
      fieldName: 'success',
      title: tr('是否成功'),
      componentType: 'CodeList',
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      }
    }
  ],
  systemViews: [
    {
      viewId: 'taskmanage',
      name: tr("视图设置"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'bizSerialNum'
          },
          {
            fieldName: 'serverCode'
          },
          {
            fieldName: 'clientCode'
          },
          {
            fieldName: 'dateFrom'
          },
          {
            fieldName: 'dateTo'
          },
          {
            fieldName: 'success'
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
    fieldName: 'serverId',
    title: tr('服务端名称'),
    componentType: 'CodeList',
    props: {
      type: "INTEGRATION_CALL_SERVER"
    },
  },
  {
    fieldName: 'clientId',
    title: tr('客户端名称'),
    componentType: 'CodeList',
    props: {
      type: "INTEGRATION_CALL_CLIENT"
    },
  },
  {
    fieldName: 'servicePath',
    title: tr('服务路径'),
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
    componentType: 'CodeList',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    width: 80,
    render:(isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
  {
    fieldName: 'inData',
    title: tr('交互数据'),
    render: (text, record, index) => {
      return <Indata id={record.id} />
    }
  }
]
