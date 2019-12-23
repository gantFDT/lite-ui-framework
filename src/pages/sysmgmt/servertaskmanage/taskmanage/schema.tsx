import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { Icon, Modal } from 'antd'

import ServerTaskSelector from './components/servertaskselector'
import ServerTaskParams from './components/servertaskparams'
import ServerTaskRules from './components/servertaskrules'

const customFileds = [{
  type: "ServerTaskSelector",
  component: ServerTaskSelector
}, {
  type: "ServerTaskParams",
  component: ServerTaskParams
}, {
  type: "ServerTaskRules",
  component: ServerTaskRules
}]

const formModalSchema = {
  "type": "object",
  "required": ["serviceName", "cronRule"],
  "propertyType": {
    "serviceName": {
      "type": "string",
      "title": tr('任务执行服务'),
      "componentType": "ServerTaskSelector",
    },
    "cronRule": {
      "type": "string",
      "title": tr('定时规则'),
      "componentType": "ServerTaskRules",
    },
    "parameters": {
      "type": "string",
      "title": tr('任务执行参数'),
      "componentType": "ServerTaskParams",
    },
    "description": {
      "type": "string",
      "title": tr('任务备注'),
      "componentType": "TextArea",
      "props": {
        "rows": 1,
        "autoSize": { "maxRows": 10 }
      }
    },
    "active": {
      "type": "bool",
      "title": tr('是否激活'),
      "componentType": "Switch",
      "options": {
        "valuePropName": 'checked'
      }
    }
  }
}
const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'taskName',
      title: tr('服务名称')
    },
    {
      fieldName: 'description',
      title: tr('服务描述')
    },
    {
      fieldName: 'isActive',
      title: tr('激活状态'),
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
            fieldName: 'taskName'
          },
          {
            fieldName: 'description'
          },
          {
            fieldName: 'isActive'
          }
        ]
      }
    }
  ]
}

const logSearchFormSchema = {
  triggerType: {
    title: tr('触发类型'),
    componentType: 'CodeList',
    props: {
      type: 'FW_TASK_TRIGGER_TYPE'
    },
  },
  dateFrom: {
    title: tr('起始触发时间'),
    componentType: 'DatePicker',
  },
  dateTo: {
    title: tr('截止触发时间'),
    componentType: 'DatePicker',
  },
}

const smartTableSchema = [
  {
    fieldName: 'name',
    title: tr('任务执行服务'),
  },
  {
    fieldName: 'cronRule',
    title: tr('定时规则'),
  },
  {
    fieldName: 'parameters',
    title: tr('任务执行参数'),
  },
  {
    fieldName: 'description',
    title: tr('任务备注'),
  },
  {
    fieldName: 'active',
    title: tr('是否激活'),
    componentType: 'CodeList',
    align: 'center',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    width: 60,
    render: (isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
  {
    fieldName: 'reserve',
    title: tr('系统保留'),
    componentType: 'CodeList',
    align: 'center',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    width: 60,
    render: (isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
  {
    fieldName: 'single',
    title: tr('允许多实例'),
    componentType: 'CodeList',
    align: 'center',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    },
    width: 80,
    render: (isActive: any) => isActive ? "" : <span className="successColor"><Icon type="check-circle" /></span>
  },
  {
    fieldName: 'lastExecuteTime',
    title: tr('最近执行时间'),
    width: 160,
  }
]

const logTableColumns = [
  {
    title: tr('触发用户'),
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: tr('触发类型'),
    dataIndex: 'triggerType',
    key: 'triggerType',
    componentType: 'CodeList',
    props: {
      type: 'FW_TASK_TRIGGER_TYPE'
    },
  },
  {
    title: tr('开始时间'),
    dataIndex: 'beginTime',
    key: 'beginTime',
  },
  {
    title: tr('结束时间'),
    dataIndex: 'endTime',
    key: 'endTime',
    render: (text: string) => text || tr('正在执行...')
  },
  {
    title: tr('是否成功'),
    dataIndex: 'success',
    key: 'success',
    width: 60,
    align: 'center',
    render: (success: any, record: any) => {
      if (!record.endTime) return '';
      return success ? <span className="successColor"><Icon type="check-circle" /></span> : ""
    }
  }, {
    title: tr('执行结果'),
    dataIndex: 'content',
    key: 'content',
    width: 60,
    align: 'center',
    render: (text: string, record: any) => text ? <Icon
      style={{ cursor: 'pointer' }}
      type='file-search'
      onClick={(e: any) => {
        e.stopPropagation()
        Modal.info({
          title: tr('任务执行结果信息'),
          content: record.content,
          okText: tr('知道了'),
          okButtonProps: { size: 'small' }
        })
      }}
    /> : ''
  }
]

export {
  customFileds,
  formModalSchema,
  logSearchFormSchema,
  smartSearchSchema,
  smartTableSchema,
  logTableColumns,
}