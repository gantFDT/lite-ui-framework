import React, { useEffect, useMemo, useState, useCallback } from 'react'
import { Tooltip, Button, Input } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import _ from 'lodash'
import classnames from 'classnames'
import { Title } from '@/components/common'
import { SmartTable } from '@/components/specific'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { OnlineClientInfo } from './model'
import tableSchema from './schema'
import styles from './index.less'

/**
 * 平台管理-在线连接
 */
export default connect(({ settings, onlinemanage, loading, user }: any) => ({
  userId: user.currentUser.id,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  onlineClientInfoList: onlinemanage.onlineClientInfoList,
  fetchLoading: loading.effects['onlinemanage/getOnlineClient']
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    onlineClientInfoList,
    fetchLoading,
    route,
    userId
  } = props
  const height = getTableHeight(MAIN_CONFIG, 40 + 53 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)
  const [keyword, setKeyword] = useState('')
  const [isSimpleInputFocus, setIsSimpleInputFocus] = useState(false)

  const showOnlineClientInfoList = useMemo(() => {
    if (keyword === 'undefined' || keyword.trim() === '') {
      return onlineClientInfoList
    }
    return onlineClientInfoList.filter(({ userName }: OnlineClientInfo) => {
      const upUsername = userName.toUpperCase()
      const upKeyword = keyword.toUpperCase()
      return upUsername.includes(upKeyword) || upKeyword.includes(upUsername)
    })
  }, [keyword, onlineClientInfoList])

  // 获取在线连接列表
  const getOnlineClient = () => {
    dispatch({ type: 'onlinemanage/getOnlineClient' })
  }

  useEffect(() => {
    if (onlineClientInfoList.length > 0) return
    getOnlineClient()
  }, [])

  const setKeywordDebounce = useCallback(_.debounce((value: string) => {
    setKeyword(value)
  }, 300), [])

  const onKeywordChange = useCallback((e) => {
    setKeywordDebounce(e.target.value)
  }, [])

  const simpleSearchInputFocusStatusChange = useCallback((res: boolean) => {
    setIsSimpleInputFocus(res)
  }, [])

  return (
    <Card
      title={<Title route={route} />}
      className='specialCardHeader'
      extra={(
        <span style={{ display: 'inline-block', marginRight: '10px' }}> {`${tr('当前在线连接数量：')}${onlineClientInfoList.length}`}</span>
      )}
      bodyStyle={{ padding: 0 }}
    >
      <div style={{ padding: '10px', borderBottom: 'var(--border-width-base) var(--border-style-base) var(--border-color-split)' }}>
        <Input.Search
          placeholder={tr('过滤用户姓名')}
          onChange={onKeywordChange}
          style={{ width: '50%' }}
          className={classnames([styles['simple-search-input']], {
            [styles['simple-search-input-focus']]: isSimpleInputFocus
          })}
          onFocus={simpleSearchInputFocusStatusChange.bind(null, true)}
          onBlur={simpleSearchInputFocusStatusChange.bind(null, false)}
        />
      </div>
      <SmartTable
        tableKey={`onlinemanage:${userId}`}
        rowKey='id'
        schema={tableSchema}
        loading={fetchLoading}
        dataSource={showOnlineClientInfoList}
        bodyHeight={height}
        headerRight={(
          <Tooltip title={tr('刷新')}>
            <Button size='small' icon='reload' loading={fetchLoading} onClick={getOnlineClient} />
          </Tooltip>
        )}
      />
    </Card>
  )
})
