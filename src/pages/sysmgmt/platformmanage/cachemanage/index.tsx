import React, { useEffect, useCallback } from 'react'
import { Tooltip, Button, message } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { SmartTable } from '@/components/specific'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import tableSchema from './schema'

/**
 * 平台管理-缓存管理
 */
export default connect(({ settings, cacheManage, loading, user }: any) => ({
  userId: user.currentUser.id,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  cacheInfoList: cacheManage.cacheInfoList,
  fetchLoading: loading.effects['cacheManage/getCacheInfo'],
  selectedNames: cacheManage.selectedNames
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    cacheInfoList,
    fetchLoading,
    selectedNames,
    route,
    userId
  } = props
  const height = getTableHeight(MAIN_CONFIG, TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT * 1.5, false)

  // 获取缓存列表
  const getCacheInfo = () => {
    dispatch({ type: 'cacheManage/getCacheInfo' })
  }

  useEffect(() => {
    if (cacheInfoList.length > 0) return
    getCacheInfo()
  }, [])

  const onSelectChange = useCallback((selectedRowKeys: string[]) => {
    dispatch({
      type: 'cacheManage/updateState',
      payload: {
        selectedNames: selectedRowKeys
      }
    })
  }, [])

  const clearCache = useCallback(() => {
    if (selectedNames.length === 0) {
      message.warning(tr('请选择需要清除的缓存'))
      return
    }
    dispatch({
      type: 'cacheManage/clearCache'
    })
  }, [selectedNames])

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <SmartTable
        tableKey={`cachemanage:${userId}`}
        rowKey='name'
        schema={tableSchema}
        title={<Title route={route} showSplitLine />}
        loading={fetchLoading}
        dataSource={cacheInfoList}
        rowSelection={{
          clickable: true,
          selectedRowKeys: selectedNames,
          onChange: onSelectChange,
          showFooterSelection: false
        }}
        bodyHeight={height}
        headerProps={{
          className: 'specialHeader'
        }}
        headerRight={(
          <>
            <Button size='small' icon='delete' type='danger' onClick={clearCache} disabled={selectedNames.length === 0}>{tr('清空选中缓存')}</Button>
            <Tooltip title={tr('刷新')}>
              <Button size='small' icon='reload' loading={fetchLoading} onClick={getCacheInfo} />
            </Tooltip>
          </>
        )}
      />
    </Card>
  )
})
