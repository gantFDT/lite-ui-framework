import React, { ReactNode } from 'react'
import { Tabs } from 'antd'
import { TabsProps, TabPaneProps } from 'antd/lib/tabs'
import classnames from 'classnames'
import styles from './index.less'

export interface Schema extends TabPaneProps {
  content?: ReactNode // tab内容
  component?: ReactNode // 组件
  props?: { [key: string]: any } // 组件参数
  propsNames?: string[]  // 组件参数名称列表，会从extraProps属性中获取对应的属性值,如果不传入该属性，则默认会将所有extraProps属性传入到该组件
}

export type TabPanelSchema = Schema[]

export interface TabPanelProps {
  schema: TabPanelSchema // 配置
  tabsProps?: TabsProps // Tabs组件tabs的参数
  extraProps?: any // 组件额外的参数
  className?: string // 自定义样式
}

const { TabPane } = Tabs
const INIT_SCHEMA: TabPanelSchema = []
const INIT_TABS_PRPS = {}
const INIT_EXTRA_PROPS = {}

/**
 * TabPanel组件
 * @param props
 */
export default function (props: TabPanelProps) {
  const {
    schema = INIT_SCHEMA,
    tabsProps = INIT_TABS_PRPS,
    extraProps = INIT_EXTRA_PROPS,
    className = ''
  } = props

  return (
    <Tabs  {...tabsProps} className={classnames(styles['tab-panel'], className)}>
      {
        schema.map(item => {
          const { content, component, props: componentProps = {}, key, propsNames, ...res } = item
          let TempComonent = component
          let addedProps = extraProps
          if (Array.isArray(propsNames)) {
            addedProps = propsNames.reduce((resProps: any, propsName: string) => {
              resProps[propsName] = extraProps[propsName]
              return resProps
            }, {})
          }

          return (
            <TabPane
              key={key}
              {...res}
            >
              {TempComonent
                ? (<TempComonent {...componentProps} {...addedProps} />)
                : content}
            </TabPane>
          )
        })
      }
    </Tabs>
  )
}
