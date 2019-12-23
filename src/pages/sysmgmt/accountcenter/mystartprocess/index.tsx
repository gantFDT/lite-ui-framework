import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { Button } from 'antd';
import { Card } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable } from '@/components/specific'
import { smartSearchSchema, smartTableSchema } from './schema'
import _ from 'lodash'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { ModelProps } from './model'
import StopProcessModal from '@/components/specific/workflow/stopprocessmodal'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
import { getWorkflowConfig } from '@/components/specific/workflow/utils'



const Page = (props: any) => {
  const pageKey: string = 'myStartProcess';

  const {
    MAIN_CONFIG, route, userId,
    data, params, totalCount,
    fetch, stop, reload, save,
    listLoading
  } = props;

  const { pageInfo = {} } = params
  const { pageSize = 50, beginIndex = 0 } = pageInfo;
  const searchRef = useRef(null);

  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [stopProcessModalVisible, setStopProcessModalVisible] = useState(false)
  const [selectedRow, operateAble] = useMemo(() => {
    const tempSelectedRow: any = selectedRows[0] || {}
    return [tempSelectedRow, tempSelectedRow.statusCode === 1]
  }, [selectedRows])

  const [searchFormHei, setSearchFormHei] = useState(0);
  const { allowOwnerStopProcess } = useMemo(() => {
    const res = getWorkflowConfig()
    return res
  }, [])

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  //执行终止
  const handleStop = useCallback((params) => {
    stop({
      processId: selectedRows[0]['id'],
      ...params
    })
  }, [selectedRows])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    save({
      params: {
        ...params,
        pageInfo: { beginIndex, pageSize }
      }
    })
  }, [params])

  //过滤
  const handleSearch = useCallback((params, isInit) => {
    if (isInit) {
      return
    }
    reload(params)
  }, [reload])

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
      bodyHeight={bodyHeight}
      headerRight={allowOwnerStopProcess && (
        <Button
          type='primary'
          icon="minus-circle"
          className="marginh5"
          size="small"
          disabled={!operateAble}
          onClick={() => setStopProcessModalVisible(true)}
        >
          {tr('终止流程')}
        </Button>
      )}
      ref={searchRef}
      pageSize={pageSize}
      pageIndex={beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
      pageSizeOptions={['10', '20', '50', '100']}
    />
    <StopProcessModal
      processId={selectedRow.id}
      title={selectedRow.resourceName}
      visible={stopProcessModalVisible}
      onClose={() => setStopProcessModalVisible(false)}
      onStopSuccess={() => reload({})}
    />
  </Card>)
}



export default connect(
  ({ myStartProcess, settings, loading, user }: { myStartProcess: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    userLoginName: user.currentUser.userLoginName,
    ...myStartProcess,
    listLoading: loading.effects['myStartProcess/fetch'] || loading.effects['myStartProcess/reload'],
    stopLoading: loading.effects['myStartProcess/stop'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'stop', 'save'].forEach(method => {
      let stateName = '';
      if (method == 'fetch') {
        stateName = 'data'
      }
      mapProps[method] = (data: object) => {
        dispatch({
          type: `myStartProcess/${method}`,
          payload: data,
          stateName
        })
      }
    })
    return mapProps
  }
)(Page)

