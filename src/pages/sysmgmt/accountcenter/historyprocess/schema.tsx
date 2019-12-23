import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { getTimeInterval } from '@/utils/utils'
import { LinkColumn, UserColumn } from '@/components/specific'

// schema
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: 'resourceName',
    title: tr('表单')
  },
  {
    fieldName: 'moduleName',
    title: tr('业务类型'),
    componentType: 'CodeList',
    props: {
      type: 'FW_WORKFLOW_BUSINESS_TYPE'
    },
  }, {
    fieldName: 'taskName',
    title: tr('任务名称')
  }, {
    fieldName: 'createByName',
    title: tr('流程申请人')
  }, {
    fieldName: 'dateFrom',
    title: tr('起始审批时间'),
    componentType: 'DatePicker'
  }, {
    fieldName: 'dateTo',
    title: tr('截止审批时间'),
    componentType: 'DatePicker'
  }],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: "系统视图1",
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: 'resourceName'
        },
        {
          fieldName: 'moduleName'
        }, {
          fieldName: 'taskName'
        }, {
          fieldName: 'createByName'
        }, {
          fieldName: 'dateFrom'
        }, {
          fieldName: 'dateTo'
        }]
      }
    }
  ]
}




export const smartTableSchema = [
  {
    fieldName: 'resourceName',
    title: tr('表单'),
    width: 150,
    render: (text: string, record: any) => {
      return (
        <LinkColumn
          pathname='/sysmgmt/accountcenter/taskdetail'
          text={text}
          params={{ ...record, taskType: 'history' }}
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
    width: 150,
  },
  {
    fieldName: 'taskName',
    width: 150,
    title: tr('审批任务名称'),
  },
  {
    fieldName: 'createBy',
    title: tr('流程申请人'),
    width: 100,
    render: (text: string) => <UserColumn userLoginName={text} />
  },
  {
    fieldName: 'createDate',
    title: tr('申请时间'),
    width: 150,
  },
  {
    fieldName: 'startDate',
    title: tr('任务开始时间'),
    width: 150,
  },
  {
    fieldName: 'finishDate',
    title: tr('任务完成时间'),
    width: 150,
  },
  {
    fieldName: 'continuedDate',
    title: tr('任务持续时间'),
    width: 150,
    render: (value, record, index) => {
      return getTimeInterval(record.startDate, record.finishDate)
    }
  },
  {
    fieldName: 'dueDate',
    title: tr('任务截止时间'),
    width: 150,
  },
  {
    fieldName: 'actionName',
    title: tr('审批操作'),
    width: 100,
  },
  {
    fieldName: 'approveComment',
    title: tr('审批意见'),
    width: 200,
  },
  {
    fieldName: 'processDetail',
    title: tr('审批任务备注'),
    width: 200,
  },
];





