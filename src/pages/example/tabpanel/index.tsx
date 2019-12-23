import React, { useState, useMemo } from 'react'
import { Input, Radio } from 'antd'
import { Card } from 'gantd'
import { Title } from '@/components/common'
import { TabPanel } from '@/components/layout'
import schema from './schema'

export default () => {
  const [outText, setOutText] = useState('外部参数示例')
  const [showStatus, setShowStatus] = useState('all')
  const showSchema = useMemo(() => {
    let res = schema
    if (showStatus === 'onlyContent') {
      res = schema.filter((item: any) => item.key.includes('content'))
    } else if (showStatus === 'onlyComponent') {
      res = schema.filter((item: any) => item.key.includes('component'))
    }
    return res
  }, [showStatus])

  return (
    <Card
      bodyStyle={{ padding: 10 }}
      title={<Title title='选项卡面板' />}
      extra={(
        <>
          <Radio.Group onChange={(e: Event) => setShowStatus(e.target.value)} value={showStatus}>
            <Radio value='all'>全显</Radio>
            <Radio value='onlyContent'>只显示content</Radio>
            <Radio value='onlyComponent'>只显示组件</Radio>
          </Radio.Group>
        </>
      )}
    >
      <Input placeholder='在此可动态改变外部参数' value={outText} onChange={(e: Event) => setOutText(e.target.value)} />
      <TabPanel
        schema={showSchema}
        tabsProps={{
          tabPosition: 'top'
        }}
        extraProps={{ outText }}
      />
    </Card>
  )
}
