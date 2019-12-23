import React, { useEffect } from 'react'
import { Tooltip, Button, message } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { SmartTable } from '@/components/specific'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import tableSchema from './schema'

/**
 * 平台管理-锁管理
 */
export default connect(({ settings, resourceLockManage, loading, user }: any) => ({
  userId: user.currentUser.id,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  lockInfoList: resourceLockManage.lockInfoList,
  fetchLoading: loading.effects['resourceLockManage/getLockInfo'],
  selectedNames: resourceLockManage.selectedNames
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    lockInfoList,
    fetchLoading,
    selectedNames,
    route,
    userId
  } = props
  const height = getTableHeight(MAIN_CONFIG, TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT * 1.5, false)

  // 获取锁列表
  const getLockInfo = () => {
    dispatch({ type: 'resourceLockManage/getLockInfo' })
  }

  useEffect(() => {
    if (lockInfoList.length > 0) return
    getLockInfo()
  }, [])

  const onSelectChange = (selectedRowKeys: string[]) => {
    dispatch({
      type: 'resourceLockManage/updateState',
      payload: {
        selectedNames: selectedRowKeys
      }
    })
  }

  const killResourceLock = () => {
    if (selectedNames.length === 0) {
      message.warning(tr('请选择需要需要释放的锁'))
      return
    }
    dispatch({
      type: 'resourceLockManage/killResourceLock'
    })
  }

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <SmartTable
        tableKey={`resourcelockmanage:${userId}`}
        rowKey='name'
        schema={tableSchema}
        title={<Title route={route} showSplitLine />}
        loading={fetchLoading}
        dataSource={lockInfoList}
        rowSelection={{
          clickable: true,
          selectedRowKeys: selectedNames,
          onChange: onSelectChange,
          showFooterSelection: false
        }}
        bodyHeight={height}
        headerRight={(
          <>
            <Button size='small' icon='delete' type='danger' onClick={killResourceLock} disabled={selectedNames.length === 0}>{tr('释放选中锁')}</Button>
            <Tooltip title={tr('刷新')}>
              <Button size='small' icon='reload' loading={fetchLoading} onClick={getLockInfo} />
            </Tooltip>
          </>
        )}
        headerProps={{
          className: 'specialHeader'
        }}
      />
    </Card>
  )
})
