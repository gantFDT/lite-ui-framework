
import React from 'react'
import { Icon, Modal } from 'antd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'userName',
      title: tr('执行用户')
    },
    {
      fieldName: 'serviceName',
      title: tr('执行服务')
    },
    {
      fieldName: 'methodName',
      title: tr('执行方法')
    },
    {
      fieldName: 'dateFrom',
      title: tr('起始执行时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YY-MM-DD'
      }
    },
    {
      fieldName: 'dateTo',
      title: tr('截至执行时间'),
      componentType: 'DatePicker',
      props: {
        format: 'YY-MM-DD'
      }
    },
  ],
  systemViews: [
    {
      viewId: 'asynctaskmanage',
      name: tr("视图设置"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [
          { fieldName: 'userName' },
          { fieldName: 'serviceName' },
          { fieldName: 'methodName' },
          { fieldName: 'dateFrom' },
          { fieldName: 'dateTo' },
        ]
      }
    }
  ]
}

export const smartTableSchema = [
  {
    fieldName: 'userName',
    title: tr('执行用户'),
  },
  {
    fieldName: 'serviceName',
    title: tr('执行服务'),
  },
  {
    fieldName: 'methodName',
    title: tr('执行方法'),
    componentType: 'TextArea',
  },
  {
    fieldName: 'beginTime',
    title: tr('开始时间'),
  },
  {
    fieldName: 'endTime',
    title: tr('结束时间'),
    render: (text: string) => text || tr('正在执行...'),
  },
  {
    fieldName: 'success',
    title: tr('是否成功'),
    width: 60,
    align: 'center',
    render: (isActive: any, record: any) => {
      if (!record.endTime) return;
      return isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
    }
  },
  {
    fieldName: 'content',
    title: tr('执行结果'),
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
