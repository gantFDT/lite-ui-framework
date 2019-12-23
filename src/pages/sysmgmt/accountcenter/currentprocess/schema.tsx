import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { LinkColumn, UserColumn } from '@/components/specific'

// schema
const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: 'orderName',
    title: tr('表单')
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
    fieldName: 'userName',
    title: tr('流程申请人')
  }],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图1"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "orderName"
        }, {
          fieldName: 'moduleName'
        },
        {
          fieldName: 'userName'
        }]
      }
    },
  ]
}




const smartTableSchema = [
  {
    fieldName: 'resourceName',
    title: tr('表单'),
    render: (text: string, record: any) => {
      return (
        <LinkColumn
          pathname='/sysmgmt/accountcenter/taskdetail'
          text={text}
          params={{ ...record, taskType: 'current' }}
          paramNames={[['id', 'taskId'], 'processId', 'feedback', 'resourceName', 'resourceUri', 'moduleName', 'variables', 'taskType']}
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
    fieldName: 'taskName',
    title: tr('审批任务名称'),
  },
  {
    fieldName: 'startDate',
    title: tr('任务开始时间'),
  },
  {
    fieldName: 'dueDate',
    title: tr('任务截止时间'),
    render: (date: string, record: any) => {
      const { startDate } = record
      if (date === startDate) return null
      if (Date.now() > new Date(date).getTime()) {
        return <div style={{
          background: 'var(--btn-danger-color)',
          padding: 4,
          color: '#fff',
          borderRadius: '3px'
        }}>{date}</div>
      }
      return date
    }
  },
  {
    fieldName: 'createBy',
    title: tr('流程申请人'),
    render: (text: string) => <UserColumn userLoginName={text} />
  },
  {
    fieldName: 'createDate',
    title: tr('申请时间'),
  },
  {
    fieldName: 'processDetail',
    title: tr('审批任务备注'),
  },
];

const searchPanelId = 'sysmgmtCurrentProcess|v1'

export {
  smartSearchSchema,
  smartTableSchema,
  smartSearchSchema as searchSchema,
  smartTableSchema as tableSchema,
  searchPanelId
}
