import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { cloneDeep } from 'lodash'
import { connect } from 'dva'
import { SmartTable, SmartSearch } from '@/components/specific'
import { smartTableSchema, smartSearchSchema } from './schema'
import { Title } from '@/components/common'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
const pageKey = 'clientloglist'
interface ClientLogListProps {
  [propName: string]: any
}

const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

function ClientLogList(props: ClientLogListProps) {
  const {
    userId,
    MAIN_CONFIG,
    route,
    clientLogListParams,

    clientLogList,
    clientLogListTotal,
    listClientLogsLoading,

    listClientLog,
  } = props;
  const [params, setParams] = useState({})

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    listClientLog({
      page: page || getPageFromIndex(clientLogListParams.pageInfo),
      pageSize: pageSize || clientLogListParams.pageInfo.pageSize,
      ...params
    })
  }, [params])

  useEffect(() => {
    refreshList()
  }, [params])


  const handleSearch = useCallback((searchParams) => {
    searchParams.filterInfo.filterModel = true
    setParams({ filterInfo: searchParams.filterInfo })
  }, [])

  const headerRight = useMemo(() => (
    <>
    </>
  ), [])

  const getSchema = useMemo(() => {
    let newTableSchema = cloneDeep(smartTableSchema);
    return newTableSchema;
  }, [smartTableSchema])

  const [searchFormHei, setSearchFormHei] = useState(0);

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)


  return (
    <>
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        title={<Title route={route} />}
        schema={smartSearchSchema}
        isCompatibilityMode
        headerProps={{
          className: 'specialHeader'
        }}
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        schema={getSchema}
        dataSource={clientLogList}
        rowKey="id"
        headerRight={headerRight}
        bodyHeight={bodyHeight}
        loading={listClientLogsLoading}
        wholeRowClick

        pagination={{
          total: clientLogListTotal,
          pageSize: clientLogListParams.pageInfo.pageSize,
          onChange: refreshList,
          onShowSizeChange: refreshList,
        }}
      />
    </>
  )
}

export default connect(
  ({ user, clientLogManage, settings, loading }: any) => ({
    userId: user.currentUser.id,
    ...settings,
    ...clientLogManage,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    listClientLogsLoading: loading.effects['clientLogManage/getClientLogList']
  }),
  (dispatch: Dispatch<any>) => ({
    listClientLog: (payload: any) => dispatch({ type: 'clientLogManage/getClientLogList', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'clientLogManage/save', payload }),
  })
)(ClientLogList);
