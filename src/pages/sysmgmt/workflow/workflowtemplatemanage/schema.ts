import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const searchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'name',
      title: tr('流程模板名称'),
    },
    {
      fieldName: 'key',
      title: tr('流程模板Key'),
    },
    {
      fieldName: 'category',
      title: tr('业务类型'),
      componentType: 'CodeList',
      props: {
        placeholder: tr('请选择'),
        type: 'FW_WORKFLOW_BUSINESS_TYPE'
      }
    }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr('系统视图'),
      version: '2019-12-11 13:48:32',
      panelConfig: {
        searchFields: [
          { fieldName: 'name' },
          { fieldName: 'key' },
          { fieldName: 'category' }
        ]
      }
    }
  ]
}

export const tableSchema = [
  {
    fieldName: 'nameVersion',
    title: tr('流程模板名称'),
  },
  {
    fieldName: 'key',
    title: tr('流程模板Key'),
    width: 260
  },
  {
    fieldName: 'version',
    title: tr('版本'),
    width: 150
  },
  {
    fieldName: 'category',
    title: tr('业务类型'),
    componentType: 'CodeList',
    props: {
      type: 'FW_WORKFLOW_BUSINESS_TYPE'
    },
    width: 150
  },
  {
    fieldName: 'deployTime',
    title: tr('发布时间'),
    width: 200
  },
  {
    fieldName: 'status',
    title: tr('状态'),
    width: 150
  },
];
