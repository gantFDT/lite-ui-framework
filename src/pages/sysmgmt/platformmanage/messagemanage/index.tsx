import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Tooltip, Button } from 'antd'
import { Table, Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { getContentHeight, CARD_BORDER_HEIGHT, TABLE_HEADER_HEIGHT, TABLE_TITLE_HEIGHT } from '@/utils/utils'

/**
 * 平台管理-消息管理
 */
export default connect(({ settings, messageManage, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  messageInfoList: messageManage.messageInfoList,
  customMsgList: messageManage.customMsgList,
  fetchLoading: loading.effects['messageManage/getMessageInfo'],
  selectedNames: messageManage.selectedNames
}))((props: any) => {
  const { MAIN_CONFIG,
    dispatch,
    messageInfoList,
    customMsgList,
    fetchLoading,
    route
  } = props
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([])
  const height = getContentHeight(MAIN_CONFIG, 40 + 20 + TABLE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT + 2 * CARD_BORDER_HEIGHT)
  const tableHeight = useMemo(() => {
    return messageInfoList.length === 0 ? 0 : height
  }, [height, messageInfoList.length])

  // 获取消息列表
  const getMessageInfo = () => {
    dispatch({ type: 'messageManage/getMessageInfo' })
  }

  useEffect(() => {
    if (messageInfoList.length > 0) return
    getMessageInfo()
  }, [])

  const handlerExpand = useCallback((expanded: boolean, record: any) => {
    const { name } = record
    if (expanded) {
      setExpandedRowKeys([...expandedRowKeys, name])
    } else {
      setExpandedRowKeys(expandedRowKeys.filter((item: string) => item !== name))
    }
  }, [expandedRowKeys])

  const handerAllExpand = useCallback(() => {
    setExpandedRowKeys(expandedRowKeys.length === 0 ? customMsgList.map((item: any) => item.name) : [])
  }, [customMsgList, expandedRowKeys])

  return (
    <Card
      title={<Title route={route} />}
      className='specialCardHeader'
      bodyStyle={{ padding: '10px' }}
    >
      <Table
        title={tr('消息列表(发布/订阅)')}
        headerProps={{ type: 'line' }}
        hideVisibleMenu
        headerRight={(
          <>
            <Tooltip title={expandedRowKeys.length > 0 ? tr('收缩所有') : tr('展开所有')}>
              <Button size='small' icon={expandedRowKeys.length > 0 ? 'minus-square' : 'plus-square'} onClick={handerAllExpand} />
            </Tooltip>
            <Tooltip title={tr('刷新')}>
              <Button size='small' icon='reload' loading={fetchLoading} onClick={getMessageInfo} />
            </Tooltip>
          </>
        )}
        rowKey='name'
        loading={fetchLoading}
        dataSource={customMsgList}
        columns={Columns}
        scroll={{ y: tableHeight }}
        indentSize={0}
        expandedRowKeys={expandedRowKeys}
        onExpand={handlerExpand}
        expandRowByClick
      />
    </Card>
  )
})

const Columns = [
  {
    title: tr('订阅类'),
    dataIndex: 'name'
  }
]
