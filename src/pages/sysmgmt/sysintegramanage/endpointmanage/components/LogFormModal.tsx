import React, { useCallback, useState, useEffect, Dispatch, useMemo } from 'react'
import { RouterTypes } from 'umi'
import { connect } from 'dva'
import { cloneDeep } from 'lodash'
import { getTableHeight } from '@/utils/utils'
import { SmartTable, SmartSearch, SmartModal } from '@/components/specific'
import { smartTableSchema as getSchema, smartSearchSchema } from './logmodalschema'
const pageKey = 'logmodal'
const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

interface ServiceListProps extends RouterTypes {
  [propName: string]: any
}

const titleMap = {
  systemId: tr('查看客户列表日志'),
  handleId: tr('查看开放功能列表日志')
}

const ServiceList = (props: ServiceListProps) => {
  const {
    userId,
    headerHeight,
    logList,
    loading,
    getLogList,
    logListParams,
    logType,
    logId,
    logVisible,
    MAIN_CONFIG,
    modifyCustomerModel
  } = props

  // const getSchema = useMemo(() => {
  //   let newTableSchema = cloneDeep(smartTableSchema);
  //   return newTableSchema;
  // }, [smartTableSchema])

  const title = useMemo(() => titleMap[logType], [logType])

  const handleSearch = useCallback((searchParams) => {
    searchParams.filterInfo.filterModel = true
    switch (logType) {
      case 'systemId':
        searchParams.filterInfo.systemId = logId
        break;
      case 'handleId':
        searchParams.filterInfo.handleId = logId
        break;

      default:
        break;
    }
    getLogList(searchParams)
  }, [logId, logType])


  const [searchFormHei, setSearchFormHei] = useState(0);

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const [modalHeight, setmodalHeight] = useState(600)

  const onModalSizeChange = useCallback(
    (width, height) => {
      setmodalHeight(height)
    },
    [],
  )

  const bodyHeight = useMemo(() => modalHeight - 41 - 20 - searchFormHei - 40 - 30, [modalHeight, searchFormHei])  // title  padding  search table-title table-header

  const closeLogFormModal = useCallback(() => modifyCustomerModel({
    logVisible: false,
    logType: '',
    logId: ''
  }), [])

  return (
    <SmartModal
      id='logformmodal'
      itemState={{ width: 960, height: modalHeight }}
      visible={logVisible}
      title={title}
      bodyStyle={{ padding: "10px" }}
      onCancel={closeLogFormModal}
      footer={null}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
      destroyOnClose
      onSizeChange={onModalSizeChange}
    >
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        showSplitLine={false}
        schema={smartSearchSchema}
        isCompatibilityMode
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        schema={getSchema}
        rowKey='id'
        loading={loading}
        bodyHeight={bodyHeight}
        dataSource={logList}
        bodyMinHeight={`calc(100vh - ${headerHeight}px - 172px)`}
      />
    </SmartModal>
  )
}

export default connect(
  ({ endpointmanage, settings, user, loading }: any) => ({
    userId: user.currentUser.id,
    ...settings,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    ...endpointmanage,
    loading: loading.effects['endpointmanage/findLogList']
  }),
  ((dispatch: Dispatch<any>, props) => ({
    modifyCustomerModel: (payload: any) => dispatch({ type: 'endpointmanage/save', payload }),
    getLogList: (payload: any) => dispatch({ type: 'endpointmanage/findLogList', payload }),
  }))
)(ServiceList)
