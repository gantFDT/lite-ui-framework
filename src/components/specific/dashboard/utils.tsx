

import React from 'react'
import { getModelData, generateUuid } from '@/utils/utils'
import { widgets } from '@/widgets'
import { fetch, update } from './service'
import { message, notification, Button } from 'antd'
import Link from 'umi/link'
import { updateApi as modifySmartChartConfig } from '@/widgets/items/smartchart/service'
import { updateApi as modifySmartTableConfig } from '@/widgets/items/smarttable/service'
import router from 'umi/router'
const maxWidgetLength = 20

export const addWidget = async (dashboard: object, type: string, title: string, configParams: any) => {
  if (!dashboard || !type) { return }
  const widget = widgets[type]
  const response = await fetch({ id: dashboard['id'], type: 'user' })
  let currentLayout = []
  if (response && response.bigData) {
    currentLayout = JSON.parse(response.bigData).currentLayout;
  }
  if (currentLayout.length >= maxWidgetLength) {
    message.warning(tr('超过了最大限制数量20') + ',' + tr('不能再添加了'))
  }
  const widgetKey = type + '-' + generateUuid(10, 10);
  const lastItem = currentLayout[currentLayout.length - 1];
  const newLayout = [...currentLayout, {
    "w": widget.rect.defaultWidth,
    "h": widget.rect.defaultHeight,
    "x": 0,
    "y": lastItem ? lastItem.y + lastItem.h : 0,
    "i": widgetKey,
    "minW": widget.rect.minWidth,
    "maxW": widget.rect.maxWidth,
    "minH": widget.rect.minHeight,
    "maxH": widget.rect.maxHeight,
  }]

  await update({
    id: dashboard['id'],
    type: 'user',
    data: {
      currentLayout: newLayout
    }
  })
  if (type === 'SmartChart') {
    await modifySmartChartConfig({
      widgetKey,
      data: {
        title,
        configParams
      }
    })
  }
  if (type === 'SmartTable') {
    await modifySmartTableConfig({
      widgetKey,
      data: {
        title,
        configParams
      }
    })
  }
  notification['success']({
    message: tr('发送成功'),
    description: <div>
      {tr('请到仪表板')}
      [<div
        style={{ color: 'var(--primary-color)', display: 'inline', cursor: 'pointer' }}
        onClick={() => {
          router.push(`/dashboard/${dashboard['id']}`)
          notification.destroy()
        }}
      >
        {dashboard['name']}
      </div>]
        {tr('调整布局')}
    </div>,
    btn: <Button
      type="primary"
      size="small"
      onClick={() => {
        router.push(`/dashboard/${dashboard['id']}`)
        notification.destroy()
      }}
    >
      {tr('立即前往')}
    </Button>
  });
  // message.success(
  //   <>
  //     {tr('添加成功')}，
  //     {tr('请到仪表板')}
  //     [<div style={{ color: 'var(--primary-color)', display: 'inline', cursor: 'pointer' }} onClick={() => {
  //       router.push(`/dashboard/${dashboard['id']}`)
  //     }}>
  //       {dashboard['name']}
  //     </div>]
  //     {tr('调整布局')}
  //   </>
  // )
}


