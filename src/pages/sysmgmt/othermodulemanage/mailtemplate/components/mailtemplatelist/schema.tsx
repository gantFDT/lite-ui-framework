import React from 'react';
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import MailColumn from '../mailcolumn'
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'name',
      title: tr('邮件模版名称')
    },
    {
      fieldName: 'key',
      title: tr('邮件模版key')
    },
    {
      fieldName: 'category',
      title: tr('邮件类型'),
      componentType: 'CodeList',
      props: {
        type: "DEMO_MAIL_TYPE"
      }
    }
  ],
  systemViews: [
    {
      viewId: 'mailtempalte',
      name: tr("视图设置"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'name'
          },
          {
            fieldName: 'key'
          },
          {
            fieldName: 'category'
          }
        ]
      }
    }
  ]
}
export const smartTableSchema = [
  {
    fieldName: 'name',
    title: tr('邮件模版名称'),
    render: (text: string, record: any, index: number) => {
      return <MailColumn id={record.id}/>

    }
  },
  {
    fieldName: 'key',
    title: tr('邮件模版key'),
  },
  {
    fieldName: 'version',
    title: tr('版本'),
    width: 80
  },
  {
    fieldName: 'category',
    title: tr('邮件类型'),
    width: 120,
    componentType: 'CodeList',
    props: {
      type: "DEMO_MAIL_TYPE"
    },
  },
  {
    fieldName: 'createDate',
    title: tr('发布时间'),
  },
  {
    fieldName: 'updateDate',
    title: tr('修改时间'),
  },
  {
    fieldName: 'status',
    title: tr('状态'),
  }
]
