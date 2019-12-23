import React from 'react'
import { Icon } from 'antd'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { getSchemaListApi } from './service'

export const searchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: 'schema',
    title: 'SCHEMA',
    componentType: 'Selector',
    props: {
      selectorId: 'dbmigrationschema',
      valueProp: 'code',
      labelProp: 'name',
      query: getSchemaListApi,
      placeholder: tr('请选择')
    },
    options: {
      rules: [{ required: true, message: '   ' }]
    }
  }],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图1"),
      version: '2019-9-29 16:24:43',
      panelConfig: {
        searchFields: [
          {
            fieldName: "schema"
          }
        ]
      }
    }]
}

const BooleanRender = (isActive: any) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""

export const smartTableSchema = [
  {
    fieldName: 'id',
    title: 'ID',
    width: 30,
    align: 'right'
  },
  {
    fieldName: 'scriptFileName',
    title: tr('脚本文件'),
    width: 300
  },
  // {
  //   fieldName: 'checksum',
  //   title: '校验和',
  //   width: 300
  // },
  {
    fieldName: 'installedOn',
    title: tr('何时运行'),
    width: 90
  },
  {
    title: tr('执行时间'),
    fieldName: 'executionTime',
    width: 80
  },
  {
    title: tr('状态'),
    fieldName: 'state',
    width: 60
  },
  {
    title: tr('是否已执行'),
    fieldName: 'applied',
    render: BooleanRender,
    width: 60
  },
  // {
  //   title: tr('是否失败'),
  //   fieldName: 'failed'
  // },
  // {
  //   title: tr('resolved'),
  //   fieldName: 'resolved'
  // },
  {
    title: tr('是否成功'),
    fieldName: 'success',
    render: BooleanRender,
    width: 60
  }
]
