import React from 'react'
import moment from 'moment'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const commonSmartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'userLoginname',
      title: tr('登录名')
    },
    {
      fieldName: 'orderField',
      title: tr('排序字段'),
      componentType: 'CodeList',
      props: {
        placeholder: tr('请选择'),
        type: 'ES_URI_STATISTICS_ORDER_FIELD'
      }
    },
    {
      fieldName: 'order',
      title: tr('排序方式'),
      componentType: 'CodeList',
      props: {
        placeholder: tr('请选择'),
        type: 'ES_URI_STATISTICS_ORDER'
      }
    },
    {
      fieldName: 'size',
      componentType: 'InputNumber',
      title: tr('数据条数'),
      props: { max: 100000 },
      options: {
        initialValue: 10
      }
    }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图"),
      version: '2019-11-14 10:24:21',
      panelConfig: {
        searchFields: [
          {
            fieldName: "dateRange"
          },
          {
            fieldName: 'userLoginname'
          },
          {
            fieldName: 'orderField'
          },
          {
            fieldName: 'order'
          },
          {
            fieldName: 'size'
          }
        ]
      }
    }
  ]
}
// schema
const tempDaysSmartSearchSchema: SmartSearchCompatibilityModeSchema = JSON.parse(JSON.stringify(commonSmartSearchSchema))
tempDaysSmartSearchSchema.supportFilterFields.push({
  fieldName: "dateRange",
  title: tr('日期范围'),
  componentType: 'RangePicker',
  props: {
    disabledDate: (currentDate: any) => {
      const minDate = moment('2019-11-01')
      if (currentDate.isBefore(minDate) || currentDate.isAfter(moment())) {
        return true
      }
      return false
    },
    style: { height: '32px', display: 'inline' }
  },
  options: {
    rules: [{ required: true, message: '  ' }]
  }
})
export const daysSmartSearchSchema = tempDaysSmartSearchSchema
const tempDaySmartSearchSchema: SmartSearchCompatibilityModeSchema = JSON.parse(JSON.stringify(commonSmartSearchSchema))
tempDaySmartSearchSchema.supportFilterFields.push({
  fieldName: "dateRange",
  title: tr('时间范围'),
  componentType: 'RangePicker',
  props: {
    showTime: true,
    format: "YYYY-MM-DD HH:mm:ss",
    disabledDate: (currentDate: any) => {
      if (!currentDate) return false
      const minDate = moment('2019-11-01')
      if (currentDate.isBefore(minDate) || currentDate.isAfter(moment())) {
        return true
      }
      return false
    },
    style: { height: '32px', display: 'inline' }
  },
  options: {
    rules: [
      { required: true, message: '  ' },
      {
        validator: (rule, value, callback) => {
          if (Array.isArray(value) && value.length === 2) {
            const startTime = value[0].format('YYYY-MM-DD')
            const endTime = value[1].format('YYYY-MM-DD')
            if (startTime !== endTime) {
              return callback(tr('开始时间和结束时间必须是同一天'))
            }
          }
          return callback()
        }
      }
    ]
  }
})
export const daySmartSearchSchema = tempDaySmartSearchSchema

export const smartTableSchema = [
  {
    fieldName: 'temp',
    title: tr('序号'),
    width: 50,
    align: 'right',
    render: (text: string, record: any, index: number) => <span>{index + 1}</span>
  },
  {
    fieldName: 'key',
    title: tr('请求路径'),
  },
  {
    fieldName: 'doc_count',
    title: tr('请求总数'),
  },
  {
    fieldName: 'avg_duration.value',
    title: tr('请求平均时间(ms)'),
  }
]
