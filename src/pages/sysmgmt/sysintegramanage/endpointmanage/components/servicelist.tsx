import React, { useCallback, useState, useEffect, Dispatch, useMemo } from 'react'
import { Button, Tooltip, Modal } from 'antd'
import { cloneDeep } from 'lodash'
import { RouterTypes } from 'umi'
import { connect } from 'dva'
import ServiceFormModal from './ServiceFormModal'
import { Title } from '@/components/common'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { SmartTable, SmartSearch } from '@/components/specific'
import { smartTableSchema as getSchema, smartSearchSchema, searchUISchema } from './serviceschema'

const pageKey = 'servicelist'

const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

interface ServiceListProps extends RouterTypes {
  submitLoading: boolean,
  [propName: string]: any
}

const ServiceList = (props: ServiceListProps) => {
  const {
    MAIN_CONFIG,
    userId,
    route,
    primaryColor,
    selectedServiceRowKeys,
    selectedServiceRows,
    serviceModalType,
    serviceVisible,
    modifyServiceModel,

    loading,
    endpointList,
    getEndPointList,
    endpointListParams,

    createService,
    updateService,
    removeService,
    submitLoading
  } = props

  const handlerSelect = useCallback((_selectedRowKeys: any = [], _selectedRows: any = []) => {
    modifyServiceModel({
      selectedServiceRowKeys: _selectedRowKeys,
      selectedServiceRows: _selectedRows
    })
  }, [])

  const handleSearch = useCallback((searchParams) => {
    // searchParams.filterInfo.filterModel = true
    handlerSelect()
    getEndPointList(searchParams)
  }, [])

  const handlerCreate = useCallback((formValues: any) => {
    if (serviceModalType === 'create') {
      createService(formValues)
    } else {
      updateService({
        ...formValues
      })
    }
  }, [serviceModalType])



  const handlerRemove = useCallback(() => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的服务')} <span style={{ color: primaryColor }}>{selectedServiceRows[0].name}</span></span>,
      onOk: () => {
        return new Promise((resolve, reject) => {
          removeService(resolve)
        }).catch(() => console.log('Oops errors!'));
      },
      okText: tr('确认'),
      cancelText: tr('取消'),
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      }
    });
  }, [selectedServiceRows])

  const openModal = useCallback((serviceModalType) => modifyServiceModel({
    serviceVisible: true,
    serviceModalType: serviceModalType
  }), [])

  const closeFormModal = useCallback(() => modifyServiceModel({
    serviceVisible: false
  }), [])

  const hasRowSelected = useMemo(() => selectedServiceRowKeys && selectedServiceRowKeys.length, [selectedServiceRowKeys])

  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("注册服务")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('create')} icon='plus' />
      </Tooltip>
      <Tooltip title={tr("编辑服务")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('update')} icon='edit' disabled={hasRowSelected !== 1} />
      </Tooltip>
      <Tooltip title={tr("注销服务")} placement="bottom"  >
        <Button size="small" icon='delete' type="danger" onClick={() => handlerRemove()} disabled={hasRowSelected !== 1} />
      </Tooltip>
    </>
  ), [hasRowSelected])

  const [searchFormHei, setSearchFormHei] = useState(0);
  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + 40 + 20 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)


  return (
    <>
      <ServiceFormModal
        visible={serviceVisible}
        dataSource={serviceModalType === 'update' ? selectedServiceRows[0] : {}}
        formType={serviceModalType}
        onCreate={handlerCreate}
        onCancel={closeFormModal}
        submitLoading={submitLoading}
      />
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        title={<Title title={tr('服务查询')} showShortLine={true} />}
        uiSchema={searchUISchema}
        schema={smartSearchSchema}
        isCompatibilityMode
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
        headerProps={{
          bottomLine: false
        }}
        showBottomLine={false}
        pageInfo={endpointListParams.pageInfo}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        title={<Title title={tr('服务列表')} showShortLine={true} showSplitLine={true} />}
        schema={getSchema}
        rowKey='id'
        bodyHeight={bodyHeight}
        dataSource={endpointList}
        headerRight={headerRight}
        loading={loading}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedServiceRowKeys,
          onChange: handlerSelect
        }}
      />
    </>
  )
}

export default connect(
  ({ endpointmanage, settings, loading, user }: any) => ({
    userId: user.currentUser.id,
    ...settings,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    ...endpointmanage,
    loading: loading.effects['endpointmanage/findEndpointList'],
    submitLoading: loading.effects['endpointmanage/createService'] || loading.effects['endpointmanage/updateService']
  }),
  ((dispatch: Dispatch<any>) => ({
    getEndPointList: (payload: any) => dispatch({ type: 'endpointmanage/findEndpointList', payload }),
    modifyServiceModel: (payload: any) => dispatch({ type: 'endpointmanage/save', payload }),
    createService: (payload: any) => dispatch({ type: 'endpointmanage/createService', payload }),
    updateService: (payload: any) => dispatch({ type: 'endpointmanage/updateService', payload }),
    removeService: (payload: any) => dispatch({ type: 'endpointmanage/removeService', payload }),
  }))
)(ServiceList)
