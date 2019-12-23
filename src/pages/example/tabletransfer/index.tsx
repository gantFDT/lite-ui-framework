import React, { useState } from 'react'
import { connect } from 'dva'
import { Button } from 'antd'
import TableTransfer, { TableTransferInnerProps } from '@/components/specific/tabletransfer'
import { TableTransferModal } from '@/components/specific'
import { Card } from 'gantd'
import { searchSchema, tableColumn } from './schema'

const common = {
  extraSearchProps: {
    uiSchema: {
      'ui:col': 12
    }
  },
  pagination: {
    pageSize: 20,
    beginIndex: 0,
    total: 100
  },
  loading: false
}

const left: TableTransferInnerProps = {
  ...common,
  title: tr('左边的标题')
}
const right: TableTransferInnerProps = {
  ...common,
  title: tr('右边的标题')
}

const dataSource = new Array(10).fill(0).map((item, index) => ({
  name: `姓名${index + 1}`,
  gender: index % 2 === 0 ? '男' : '女',
  age: Math.round(Math.random() * 30)
}))

const itemState = {
  width: 1200,
  height: 700
}

export default connect(({ user }: any) => ({
  userId: user.currentUser.id
}))((props: any) => {
  const { userId } = props
  const [targetKeys, setTargetKeys] = useState(['姓名1', '姓名2'])
  const [visible, setVisible] = useState(false)

  return (
    <Card title={tr('TableTransfer示例')} bodyStyle={{ padding: 10 }}>
      <TableTransfer
        transKey={`tabletransfer-example${userId}`}
        rowKey='name'
        schema={searchSchema}
        columns={tableColumn}
        left={left}
        right={right}
        dataSource={dataSource}
        height='483px'
        width='1150px'
        onSearch={(direction, params, pageInfo) => console.log('onSearch', direction, params, pageInfo)}
        targetKeys={targetKeys}
        onChange={(targetKeys_) => setTargetKeys(targetKeys_)}
      />
      <TableTransferModal
        transKey={`tabletransfer-modal-example${userId}`}
        title='TableTransfer弹框'
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
        extraModalProps={{
          itemState
        }}
        rowKey='name'
        schema={searchSchema}
        columns={tableColumn}
        left={left}
        right={right}
        dataSource={dataSource}
        onSearch={(direction, params, pageInfo) => console.log('onSearch', direction, params, pageInfo)}
        targetKeys={targetKeys}
        onChange={(targetKeys_) => setTargetKeys(targetKeys_)}
      />
      <Button
        size='small'
        type='primary'
        onClick={() => setVisible(true)}>{tr('TableTransfer弹框')}</Button>
    </Card>
  )
})
