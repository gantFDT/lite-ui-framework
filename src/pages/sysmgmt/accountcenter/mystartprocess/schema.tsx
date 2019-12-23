import React from 'react'
import { Icon } from 'gantd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { findProcessStatusTypeListApi } from './service'
import { LinkColumn } from '@/components/specific'

// schema
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: 'resourceName',
    title: tr('表单')
  }, {
    fieldName: 'status',
    title: tr('运行状态'),
    componentType: 'Selector',
    props: {
      selectorId: 'processStatusTypeList',
      valueProp: 'id',
      labelProp: 'name',
      query: findProcessStatusTypeListApi
    },
  },
  {
    fieldName: 'moduleName',
    title: tr('业务类型'),
    componentType: 'CodeList',
    props: {
      type: 'FW_WORKFLOW_BUSINESS_TYPE'
    },
  }, {
    fieldName: 'dateFrom',
    title: tr('起始创建时间'),
    componentType: 'DatePicker',
    props: {
      format: 'YYYY-MM-DD'
    },
  }, {
    fieldName: 'dateTo',
    title: tr('截止审批时间'),
    componentType: 'DatePicker',
    props: {
      format: 'YYYY-MM-DD'
    },
  }],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: "系统视图1",
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "resourceName"
        }, {
          fieldName: 'status'
        }, {
          fieldName: 'moduleName'
        },
        {
          fieldName: 'dateFrom'
        },
        {
          fieldName: 'dateTo'
        },
        ]
      }
    }
  ]
}




export const smartTableSchema = [
  {
    fieldName: 'resourceName',
    title: tr('表单'),
    render: (text: string, record: any) => {
      return (
        <LinkColumn
          pathname='/sysmgmt/accountcenter/taskdetail'
          text={text}
          params={{ ...record, taskType: 'myStart' }}
          paramNames={[['id', 'processId'], 'resourceName', 'resourceUri', 'moduleName', 'variables', 'taskType']}
        />
      )
    }
  },
  {
    fieldName: 'moduleName',
    title: tr('业务类型'),
    componentType: 'CodeList',
    props: {
      type: 'FW_WORKFLOW_BUSINESS_TYPE'
    },
  },
  {
    fieldName: 'createDate',
    title: tr('创建时间'),
  },
  {
    fieldName: 'statusName',
    title: tr('运行状态'),
  }
];
