import React, { useState } from 'react'
import { List, Button } from 'antd'
import { connect } from 'dva'
import { Card, BlockHeader } from 'gantd'
import Link from 'umi/link'
import styles from './index.less'
import ChartConfig from '@/components/specific/smartchart/config'
import SmartTable, { TableConfig } from '@/components/specific/smarttable'
import { exampleList } from './data'
import { getContentHeight } from '@/utils/utils'

const Demo = props => {
  const { MAIN_CONFIG } = props
  const minHeight = getContentHeight(MAIN_CONFIG)

  return (
    <>
      <Card
        bodyStyle={{ padding: 10 }}
        title="实验室"
        style={{ minHeight }}
      >
        {exampleList.map((example, index) =>
          <div key={index}>
            <BlockHeader title={example.title} type="num" num={index} />
            <List
              bordered={false}
              dataSource={example.items}
              renderItem={item => (
                <List.Item className={styles.exmpleItem} key={item.route}>
                  <Link to={item.route}>{item.name}</Link>
                </List.Item>
              )}
            />
          </div>
        )}
      </Card>
    </>
  )
}

export default connect(
  ({ settings }) => ({
    ...settings
  })
)(Demo)
