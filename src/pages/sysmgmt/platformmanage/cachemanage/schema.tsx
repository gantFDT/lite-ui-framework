import React from 'react'
import { Tooltip } from 'antd'

const TextRender = (value: string | string[]) => <Tooltip title={value}><span>{value}</span></Tooltip>

export default [
  {
    title: tr('缓存名称'),
    fieldName: 'name',
    width: 300
  },
  {
    title: tr('缓存数量'),
    fieldName: 'size',
    width: 70
  },
  {
    title: tr('是否为本地'),
    fieldName: 'local',
    width: 80,
    render: (value: boolean) => <span>{tr(value ? '是' : '否')}</span>
  },
  {
    title: tr('初始化类'),
    fieldName: 'initClass',
    render: TextRender
  }
]
