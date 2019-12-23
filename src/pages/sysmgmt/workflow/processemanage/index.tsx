import React, { useCallback, useState, useMemo, Dispatch, useEffect } from 'react'
import { Button } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { SmartTable, SmartSearch } from '@/components/specific'
import { formSchema, tableSchema } from './schema'
import StopProcessModal from '@/components/specific/workflow/stopprocessmodal'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'

const pageName: string = 'processManage'
const Page = (props: any) => {
  const {
    MAIN_CONFIG,
    route,
    userId,
    data,
    listFlowProcess,
    listLoading,
    pageInfo,
    total,
    save
  } = props

  const [selectedRowKeys, setRowKeys] = useState([])
  const [selectedRows, setRows] = useState([])
  const [searcherSize, setSearcherSize] = useState({ height: 0, width: 0 })
  const [stopProcessModalVisible, setStopProcessModalVisible] = useState(false)
  const bodyHeight = getTableHeight(MAIN_CONFIG, searcherSize.height + TABLE_HEADER_HEIGHT, true)
  const [selectedRow, operateAble] = useMemo(() => {
    const tempSelectedRow: any = selectedRows[0] || {}
    return [tempSelectedRow, tempSelectedRow.statusCode === 1]
  }, [selectedRows])

  const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  const handlerSearch = useCallback((params, isInit) => {
    if (isInit && data.length > 0) return
    listFlowProcess({
      ...params
    })
  }, [listFlowProcess])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    save({
      pageInfo: { beginIndex, pageSize }
    })
  }, [])

  useEffect(() => {
    return () => {
      setRowKeys([])
      setRows([])
    }
  }, [listLoading])

  return (<Card
    loading={false}
    bodyStyle={{ padding: '0px' }}
  >
    <SmartSearch
      searchPanelId={pageName}
      userId={userId}
      title={<Title route={route} />}
      schema={formSchema}
      onSearch={handlerSearch}
      onSizeChange={setSearcherSize}
      isCompatibilityMode
      headerProps={{
        className: 'specialHeader'
      }}
      pageInfo={pageInfo}
      totalCount={total}
    />
    <SmartTable
      tableKey={`${pageName}:${userId}`}
      rowKey="id"
      schema={tableSchema}
      dataSource={data}
      loading={listLoading}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: handlerSelect
      }}
      bodyHeight={bodyHeight}
      pageSize={pageInfo.pageSize}
      pageIndex={pageInfo.beginIndex}
      totalCount={total}
      onPageChange={onPageChange}
      headerRight={(
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
      // pageSizeOptions={['10', '20', '50', '100']}
      pageSizeOptions={['50', '100', '150']}
    />
    <StopProcessModal
      processId={selectedRow.id}
      title={selectedRow.resourceName}
      visible={stopProcessModalVisible}
      onClose={() => setStopProcessModalVisible(false)}
      onStopSuccess={() => listFlowProcess({})}
    />
  </Card>)
}

export default connect(
  ({ processManage, loading, settings, user }: any) => ({
    ...processManage,
    userId: user.currentUser.id,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    listLoading: loading.effects[`${pageName}/listFlowProcess`],
  }),
  (dispatch: Dispatch<any>) => ([
    'listFlowProcess',
    'save'
  ].reduce((total, cur) => ({
    ...total,
    [cur]: (payload: any) => dispatch({ type: `${pageName}/${cur}`, payload })
  }), {}))
)(Page)
