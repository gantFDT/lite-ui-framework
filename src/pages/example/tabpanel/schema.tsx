import React from 'react'
import { TabPanelSchema } from '@/components/common/tabpanel'

const schema: TabPanelSchema = [
  {
    tab: tr('content1'),
    key: 'content1',
    content: <span>{tr('content示例1')} </span>
  },
  {
    tab: tr('content2'),
    key: 'content2',
    content: <span>{tr('content示例2')} </span>
  },
  {
    tab: tr('自定义组件1'),
    key: 'component1',
    props: {
      text: tr('初始参数')
    },
    component: (props: any) => {
      const { text, outText } = props
      return (
        <div>
          <span>初始参数：{text}</span><br />
          <span>外部参数：{outText}</span>
        </div>
      )
    },
    propsNames: ['outText']
  },
  {
    tab: tr('自定义组件2'),
    key: 'component2',
    props: {
      text: tr('自定义组件示例2')
    },
    component: (props: any) => {
      const { text, outText } = props
      return (
        <div>
          <span>初始参数：{text}</span><br />
          <span>外部参数：{outText}</span>
        </div>
      )
    }
  }
]

export default schema
