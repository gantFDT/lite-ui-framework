import React from 'react'
import { Icon } from 'gantd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

// schema
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: "delegateName",
    title: tr('代理用户')
  },
  {
    fieldName: 'status',
    title: tr('状态'),
    componentType: 'CodeList',
    props: {
      type: 'FW_USER_DELEGATION_STATUS'
    },
  },
  {
    fieldName: 'checkDate',
    title: tr('代理时间'),
    componentType: 'DatePicker',
  }],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: "delegateName"
          },
          {
            fieldName: 'status'
          },
          {
            fieldName: 'checkDate'
          },
        ]
      }
    },
  ]
}




export const smartTableSchema = [
  {
    fieldName: 'delegateId',
    title: tr('代理用户'),
    componentType: 'UserSelector',

  },
  {
    fieldName: 'startDate',
    title: tr('代理开始时间'),
  },
  {
    fieldName: 'endDate',
    title: tr('代理结束时间'),
  },
  {
    fieldName: 'status',
    title: tr('状态'),
    componentType: 'CodeList',
    props: {
      type: 'FW_USER_DELEGATION_STATUS'
    },
  },
  {
    fieldName: 'reason',
    title: tr('代理原因'),
  },
];




export const modalSchema = {
  type: "object",
  required: ["name", "nameEn", "coefficient", "symbol"],

  propertyType: {
    delegateId: {
      title: tr('代理用户'),
      type: "string",
      componentType: "UserSelector",
      required: true
    },
    dateRange: {
      title: tr('代理时间'),
      type: "string",
      componentType: "RangePicker",
      required: true
    },
    // startDate: {
    //     title: tr('代理开始时间'),
    //     type: "string",
    //     componentType: "DatePicker",
    //     required: true
    // },
    // endDate: {
    //     title: tr('代理结束时间'),
    //     type: "string",
    //     componentType: "DatePicker",
    //     required: true
    // },
    reason: {
      title: tr('代理原因'),
      type: "string",
      componentType: "TextArea",
      props: {
        autoSize: { minRows: 8, maxRows: 10 }
      }
    }

  }
}


