import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { LinkColumn, UserColumn } from '@/components/specific'
import { findTemplateListApi, findProcessStatusTypeListApi } from './service'

export const formSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: "resourceName",
      title: tr('表单')
    },
    {
      fieldName: "moduleName",
      title: tr('业务类型'),
      componentType: 'CodeList',
      props: {
        placeholder: tr('请选择'),
        type: 'FW_WORKFLOW_BUSINESS_TYPE'
      }
    },
    {
      fieldName: "userName",
      title: tr('创建用户')
    },
    {
      fieldName: "dateFrom",
      title: tr('起始创建时间'),
      componentType: 'DatePicker'
    },
    {
      fieldName: "dateTo",
      title: tr('截至创建时间'),
      componentType: 'DatePicker'
    },
    {
      fieldName: 'templateId',
      title: tr('流程模版'),
      componentType: 'Selector',
      props: {
        placeholder: tr('请选择'),
        selectorId: 'processemanagetemplateId',
        valueProp: 'id',
        labelProp: 'name',
        query: findTemplateListApi
      },
    },
    {
      fieldName: 'status',
      title: tr('运行状态'),
      componentType: 'Selector',
      props: {
        placeholder: tr('请选择'),
        selectorId: 'processemanagestatus',
        valueProp: 'id',
        labelProp: 'name',
        query: findProcessStatusTypeListApi
      },
    }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: "默认视图",
      version: '2019-10-29 17:12:24',
      panelConfig: {
        searchFields: [
          {
            fieldName: "resourceName"
          },
          {
            fieldName: "moduleName"
          },
          {
            fieldName: "userName"
          },
          {
            fieldName: "dateFrom"
          },
          {
            fieldName: "dateTo"
          },
          {
            fieldName: 'templateId'
          },
          {
            fieldName: 'status'
          }
        ]
      }
    }
  ]
}

export const tableSchema = [
  {
    fieldName: 'resourceName',
    title: tr('表单'),
    render: (text: string, record: any) => {
      return (
        <LinkColumn
          pathname='/sysmgmt/workflow/approvedetail'
          text={text}
          params={{
            ...record, taskType: 'processManager'
          }}
          paramNames={[['id', 'processId'], 'resourceName', 'moduleName', 'taskType']}
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
    }
  },
  {
    fieldName: 'createBy',
    title: tr('创建人'),
    render: (userLoginName: string) => <UserColumn userLoginName={userLoginName} />
  },
  {
    fieldName: 'createDate',
    title: tr('创建时间'),
  },
  {
    fieldName: 'statusName',
    title: tr('运行状态'),
  },
];

export const modalSchema = {
  "type": "object",
  "required": ["name", "gender"],
  "propertyType": {
    name: {
      title: tr('姓名'),
      "type": "string",
      "componentType": "Input",
    },
    gender: {
      title: tr('性别'),
      "type": "string",
      "componentType": "CodeList",
      props: {
        type: 'FW_USER_GENDER'
      }
    },
    age: {
      title: tr('年龄'),
      type: "number",
      componentType: "InputNumber"
    },
    birth: {
      title: tr('生日'),
      type: "date",
      componentType: "DatePicker"
    },
    contactPersonId: {
      title: tr('联系人'),
      componentType: "UserSelector"
    },
    address: {
      title: tr('家庭住址'),
      type: "string",
    },
    grade: {
      title: tr('年级'),
      type: "string",
      componentType: "Select",
      props: {
        dataSource: [{
          label: tr("一年级"),
          value: "A"
        }, {
          label: tr("二年级"),
          value: "B"
        }, {
          label: tr("三年级"),
          value: "C"
        }],
      }
    },
    classNumber: {
      title: tr('班级'),
      type: "string",
      componentType: "Select",
      props: {
        dataSource: [{
          label: tr("一班"),
          value: "1"
        }, {
          label: tr("二班"),
          value: "2"
        }, {
          label: tr("三班"),
          value: "3"
        }],
      }
    },
    finalExamScore: {
      title: tr('期末得分'),
      type: "number",
      componentType: "InputNumber",
      props: {
        max: 100,
        min: 0
      }
    },
    admissionDate: {
      title: tr('入学时间'),
      type: "date",
      componentType: "DatePicker"
    },
    agreeUpgrade: {
      title: tr('同意升级'),
      type: "number",
      "componentType": "CodeList",
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      }
    },
    teacherComment: {
      title: tr('教师评语'),
      type: "string",
      componentType: "TextArea"
    }
  }
}
