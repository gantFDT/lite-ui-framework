import React, { useCallback, useState, useEffect, useRef } from 'react'
import { Card } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable } from '@/components/specific'
import { smartSearchSchema, smartTableSchema, } from './schema'
import _ from 'lodash'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
import { ModelProps } from './model'


const Page = (props: any) => {
  const pageKey: string = 'historyProcess';

  const {
    MAIN_CONFIG, route, userId,
    data, params, totalCount,
    fetch, reload, save,
    listLoading
  } = props;

  const { pageInfo = {} } = params
  const { pageSize = 50, beginIndex = 0 } = pageInfo;

  const searchRef = useRef(null);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);

  // const [stateData, setStateData] = useState(data)

  const [searchFormHei, setSearchFormHei] = useState(0);

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])


  const onPageChange = useCallback((beginIndex, pageSize) => {
    save({
      params: {
        ...params,
        pageInfo: { beginIndex, pageSize }
      }
    })
  }, [params])

  //过滤
  const handleSearch = useCallback((searchParams, isInit) => {
    if (isInit) {
      return
    }
    reload({ ...params, ...searchParams })
  }, [reload, params])

  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)

  return (<Card
    bodyStyle={{ padding: '0px' }}
  >
    <SmartSearch
      searchPanelId={pageKey}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSizeChange={onSearchFormSizeChange}
      pageInfo={pageInfo}
      totalCount={totalCount}
      ref={searchRef}
      headerProps={{
        className: 'specialHeader'
      }}
    />
    <SmartTable
      tableKey={`${pageKey}:${userId}`}
      rowKey="id"
      schema={smartTableSchema}
      dataSource={data}
      loading={listLoading}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: handleSelect
      }}
      ref={searchRef}
      bodyHeight={bodyHeight}
      pageSize={pageSize}
      pageIndex={beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
      pageSizeOptions={['10', '20', '50', '100']}
    />
  </Card>)
}



export default connect(
  ({ historyProcess, settings, loading, user }: { historyProcess: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    userLoginName: user.currentUser.userLoginName,
    ...historyProcess,
    listLoading: loading.effects['historyProcess/fetch'] || loading.effects['historyProcess/reload'],
    createLoading: loading.effects['historyProcess/create'],
    updateLoading: loading.effects['historyProcess/update'],
    removeLoading: loading.effects['historyProcess/remove'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      let stateName = '';
      if (method == 'fetch') {
        stateName = 'data'
      }
      mapProps[method] = (data: object) => {
        dispatch({
          type: `historyProcess/${method}`,
          payload: data,
          stateName
        })
      }
    })
    return mapProps
  }
)(Page)

