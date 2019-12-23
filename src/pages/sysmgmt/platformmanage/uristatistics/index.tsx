import React, { useCallback, useState } from 'react'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Tabs } from 'antd'
import { Title } from '@/components/common'
import { daysSmartSearchSchema, daySmartSearchSchema, smartTableSchema } from './schema'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import Content from './Content'
import { ModelProps, pageKey } from './model'

/**
 * 平台管理-业务功能访问统计
 */
export default connect(
  ({ uriStatistics, settings, loading, user }: { uriStatistics: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...uriStatistics,
    daysLoading: loading.effects[`${pageKey}/fetchDays`],
    dayLoading: loading.effects[`${pageKey}/fetchDay`]
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetchDays', 'fetchDay'].forEach(method => {
      mapProps[method] = (payload: Object) => {
        dispatch({
          type: `${pageKey}/${method}`,
          payload
        })
      }
    })
    return mapProps
  }
)((props: any) => {
  const {
    MAIN_CONFIG,
    route,
    userId,
    daysDataSource,
    dayDataSource,
    fetchDays,
    fetchDay,
    daysLoading,
    dayLoading
  } = props

  const [searchFormHei, setSearchFormHei] = useState(0)


  // 多日
  const daysSearch = useCallback((params, isInit) => {
    if (isInit) return
    console.log('params', params)
    fetchDays(params)
  }, [])

  // 单日
  const daySearch = useCallback((params, isInit) => {
    if (isInit) return
    fetchDay(params)
  }, [])

  const onSmartSearchSizeChagne = useCallback(({ height }: any) => {
    setSearchFormHei(height)
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + 40 + 40 + 20 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)

  return (
    <Card
      bodyStyle={{ padding: '10px' }}
      title={<Title route={route} />}
      className='specialCardHeader'
    >
      <Tabs defaultActiveKey="1" animated={false}>
        <Tabs.TabPane tab={tr('多日统计')} key="1">
          <Content
            searchPanelId={`${pageKey}days`}
            userId={userId}
            searchSchema={daysSmartSearchSchema}
            onSearch={daysSearch}
            onSizeChange={onSmartSearchSizeChagne}
            tabbleSchema={smartTableSchema}
            dataSource={daysDataSource}
            loading={daysLoading}
            tableHeight={bodyHeight}
          />
        </Tabs.TabPane>
        <Tabs.TabPane tab={tr('单日统计')} key="2">
          <Content
            searchPanelId={`${pageKey}day`}
            userId={userId}
            searchSchema={daySmartSearchSchema}
            onSearch={daySearch}
            onSizeChange={onSmartSearchSizeChagne}
            tabbleSchema={smartTableSchema}
            dataSource={dayDataSource}
            loading={dayLoading}
            tableHeight={bodyHeight}
          />
        </Tabs.TabPane>
      </Tabs>
    </Card>)
})
