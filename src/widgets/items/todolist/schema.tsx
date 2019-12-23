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
    fieldName: 'createByName',
    title: tr('流程申请人'),
    render: (text: string) => <UserColumn userLoginName={text} />
    // render: (text: string, record: object, index: number) => <UserColumn name={text} />
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




const modalSchema = {
  type: "object",
  required: ["name", "nameEn", "coefficient", "symbol"],

  propertyType: {
    name: {
      title: tr('名称'),
      type: "string",
      componentType: "Input",
    },
    nameEn: {
      title: tr('英文名称'),
      type: "string",
      componentType: "Input",
    },
    domain: {
      title: tr('领域'),
      type: "string",
      // componentType: "Selector",
      // props: {
      //     disabled: true,
      //     selectorId: 'measureunitdomain',
      //     valueProp: 'domain',
      //     labelProp: 'name',
      //     query: findDomain
      // },
    },
    icon: {
      title: tr('图标'),
      type: "string",
      componentType: "IconHouse",
    },
    baseUnitName: {
      title: tr('基础单位'),
      type: "string",
      componentType: "Input",
      props: {
        disabled: true,
      }
    },
    coefficient: {
      title: tr('系数'),
      type: "string",
      componentType: "Input",
    },
    symbol: {
      title: tr('符号'),
      type: "string",
      componentType: "Input",
    },
  }
}

const searchPanelId = 'sysmgmtCurrentProcess|v1'

export {
  smartSearchSchema,
  smartTableSchema,
  smartSearchSchema as searchSchema,
  smartTableSchema as tableSchema,
  modalSchema,
  searchPanelId
}
