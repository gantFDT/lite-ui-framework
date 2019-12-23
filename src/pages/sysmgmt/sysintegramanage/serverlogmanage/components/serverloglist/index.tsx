import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { cloneDeep } from 'lodash'
import { connect } from 'dva'
import { SmartTable, SmartSearch } from '@/components/specific'
import { smartTableSchema, smartSearchSchema } from './schema'
import { tr } from '@/components/common/formatmessage'
import { Title } from '@/components/common'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'

const pageKey = 'serverloglist'
interface ServerLogListProps {
  [propName: string]: any
}

const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

function ServerLogList(props: ServerLogListProps) {
  const {
    userId,
    route,
    MAIN_CONFIG,
    serverLogListParams,

    serverLogList,
    serverLogListTotal,
    listServerLogsLoading,

    listServerLog,
  } = props;
  const [params, setParams] = useState({})

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    listServerLog({
      page: page || getPageFromIndex(serverLogListParams.pageInfo),
      pageSize: pageSize || serverLogListParams.pageInfo.pageSize,
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
        dataSource={serverLogList}
        rowKey="id"

        headerRight={headerRight}

        bodyHeight={bodyHeight}

        loading={listServerLogsLoading}
        wholeRowClick

        pagination={{
          total: serverLogListTotal,
          pageSize: serverLogListParams.pageInfo.pageSize,
          onChange: refreshList,
          onShowSizeChange: refreshList,
        }}
      />
    </>
  )
}

export default connect(
  ({ user, serverLogManage, settings, loading }: any) => ({
    userId: user.currentUser.id,
    currentUser: user.currentUser,
    ...serverLogManage,
    ...settings,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    listServerLogsLoading: loading.effects['serverLogManage/getServerLogList']
  }),
  (dispatch: Dispatch<any>) => ({
    listServerLog: (payload: any) => dispatch({ type: 'serverLogManage/getServerLogList', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'serverLogManage/save', payload }),
  })
)(ServerLogList);
