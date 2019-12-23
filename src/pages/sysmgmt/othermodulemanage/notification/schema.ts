import { SchemaProps } from '@/components/specific/smarttable/fieldgenerator'
import { Schema, Types, UISchema } from '@/components/form/schema'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const searchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'title',
      title: tr('通知标题')
    },
    {
      fieldName: 'content',
      title: tr('通知内容')
    },
  ],
  systemViews: [
    {
      viewId: 'initial',
      name: tr('初始视图'),
      version: '0.1',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'title'
          },
          {
            fieldName: 'content'
          },
        ]
      }
    }
  ]
}

const statusMap = new Map(
  [
    ['01', tr('未读')],
    ['00', tr('已读')],
  ]
)


export const tableSchema: Array<SchemaProps<object>> = [
  {
    fieldName: 'title',
    title: tr('通知标题'),
  },
  {
    fieldName: 'content',
    title: tr('通知内容'),
  },
  {
    fieldName: 'status',
    title: tr('通知状态'),
    render: text => statusMap.has(text) ? statusMap.get(text) : tr('未知状态')
  },
  {
    fieldName: 'senderName',
    title: tr('发送者'),
  },
  {
    fieldName: 'senderTime',
    title: tr('发送时间'),
  },
]

export const ModalSchema: Schema = {
  type: Types.object,
  required: ['content', 'validPeriod'],
  propertyType: {
    content: {
      title: tr('通知内容'),
      type: Types.string,
      componentType: 'TextArea',
      props: {
        autoSize: { minRows: 10, maxRows: 20 }
      }
    },
    validPeriod: {
      title: tr('截止日期'),
      type: Types.date,
      componentType: 'DatePicker',
      props: {
        format: 'YYYY-MM-DD'
      },
    },

  }
}

export const searchUISchema: UISchema = {
  "ui:col": {
    xxl: 6,
    lg: 8,
    md: 12,
    xs: 24,
  },
  "ui:labelCol": {
    // xxl: 8,
  },
  "ui:wrapperCol": {
    // xxl: 16,
  },
}
