
import React, { useCallback, useState, useEffect, Dispatch, useMemo } from 'react'
import { Button, Tooltip, Modal, Empty } from 'antd'
import { RouterTypes } from 'umi'
import { connect } from 'dva'
import { cloneDeep, isEqual } from 'lodash'
import { Title } from '@/components/common'

import CustomerFormModal from './CustomerFormModal'
import LogFormModal from './LogFormModal'

import { SmartTable } from '@/components/specific'
import { smartTableSchema as getSchema } from './customerschema'
const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

const pageKey = 'customerlist'

interface CustomerListProps extends RouterTypes {
  submitLoading: boolean,
  [propName: string]: any

}

const CustomerList = (props: CustomerListProps) => {
  const {
    endpointId,
    userId,
    route,
    primaryColor,
    selectedCustomerRowKeys,
    selectedCustomerRows,
    customerModalType,
    customerVisible,
    modifyCustomerModel,
    contentHeight,

    loading,
    customerList,
    getCustomerList,
    customerListParams,

    createCustomer,
    updateCustomer,
    removeCustomer,
    submitLoading

  } = props

  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 31px)`, [contentHeight])
  const y = useMemo(() => customerList.length ? tabletHeight : 0, [customerList, tabletHeight])

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    if (!endpointId || endpointId === '0') return
    getCustomerList({
      page: page || getPageFromIndex(customerListParams.pageInfo),
      pageSize: pageSize || customerListParams.pageInfo.pageSize,
      endpointId
    })
  }, [endpointId])

  useEffect(() => {
    refreshList()
    return () => {
      modifyCustomerModel({
        customerList: [],
        selectedCustomerRowKeys: [],
        selectedCustomerRows: []
      })
    }
  }, [refreshList])

  const handlerCreate = useCallback((formValues: any) => {
    if (customerModalType === 'create') {
      createCustomer({
        ...formValues,
        endpointId
      })
    } else {
      updateCustomer({
        ...formValues,
        endpointId
      })
    }
  }, [customerModalType, endpointId])

  const handlerSelect = useCallback((_selectedRowKeys: any, _selectedRows: any) => {
    modifyCustomerModel({
      selectedCustomerRowKeys: _selectedRowKeys,
      selectedCustomerRows: _selectedRows
    })
  }, [])

  useEffect(() => {
    if (endpointId !== '0') {
      modifyCustomerModel({
        selectedCustomerRowKeys: [],
        selectedCustomerRows: []
      })
    }
  }, [endpointId])


  const handlerRemove = useCallback(async () => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的客户')} <span style={{ color: primaryColor }}>{selectedCustomerRows[0].name}</span></span>,
      onOk: () => new Promise((resolve) => {
        removeCustomer({ endpointId }, resolve)
      }),
      okText: tr('确认'),
      cancelText: tr('取消'),
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      }
    });
  }, [selectedCustomerRows, endpointId])

  const openModal = useCallback((customerModalType) => modifyCustomerModel({
    customerVisible: true,
    customerModalType: customerModalType
  }), [])




  const closeFormModal = useCallback(() => modifyCustomerModel({
    customerVisible: false
  }), [])

  const hasRowSelected = useMemo(() => selectedCustomerRowKeys && selectedCustomerRowKeys.length, [selectedCustomerRowKeys])

  //查看日志
  const handlerSeeLog = useCallback(() => modifyCustomerModel({
    logVisible: true,
    logType: 'systemId',
    logId: endpointId
  }), [endpointId])

  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("新增客户")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('create')} icon='plus' disabled={!endpointId} />
      </Tooltip>
      <Tooltip title={tr("编辑客户")} placement="bottom"  >
        <Button size="small" onClick={() => openModal('update')} icon='edit' disabled={hasRowSelected !== 1} />
      </Tooltip>
      <Tooltip title={tr("删除客户")} placement="bottom"  >
        <Button size="small" icon='delete' type='danger' onClick={() => handlerRemove()} disabled={hasRowSelected !== 1} />
      </Tooltip>
      <Tooltip title={tr("查看日志")} placement="bottom"  >
        <Button size="small" icon='read' onClick={handlerSeeLog} disabled={hasRowSelected !== 1} />
      </Tooltip>
    </>
  ), [hasRowSelected, endpointId])


  return (
    <>
      {/* <LogFormModal
        visible={logVisible}
        systemId={systemId}
        dataSource={logVisible ? selectedCustomerRows[0] : {}}
        route={route}
        onCancel={closeLogFormModal}
        destroyOnClose={true}
      /> */}
      <CustomerFormModal
        visible={customerVisible}
        dataSource={customerModalType === 'update' ? selectedCustomerRows[0] : {}}
        formType={customerModalType}
        onCreate={handlerCreate}
        onCancel={closeFormModal}
        submitLoading={submitLoading}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        title={<Title title={tr('客户列表')} showSplitLine={true} showShortLine={true} />}
        schema={getSchema}
        rowKey='id'

        dataSource={customerList}
        headerRight={headerRight}
        loading={loading}
        scroll={{ y }}
        bodyMinHeight='10px'
        bodyHeight={tabletHeight}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedCustomerRowKeys,
          onChange: handlerSelect
        }}
        emptyDescription={<>
          <div>{tr('暂无数据')}</div>
          <div>{tr('请点击服务列表')}</div>
        </>}
      />
    </>
  )
}

export default connect(
  ({ endpointmanage, settings, user, loading }: any) => ({
    userId: user.currentUser.id,
    ...settings,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    ...endpointmanage,
    loading: loading.effects['endpointmanage/findCustomerList'],
    submitLoading: loading.effects['endpointmanage/createCustomer'] || loading.effects['endpointmanage/updateCustomer']
  }),
  ((dispatch: Dispatch<any>) => ({
    getCustomerList: (payload: any) => dispatch({ type: 'endpointmanage/findCustomerList', payload }),
    modifyCustomerModel: (payload: any) => dispatch({ type: 'endpointmanage/save', payload }),
    createCustomer: (payload: any) => dispatch({ type: 'endpointmanage/createCustomer', payload }),
    updateCustomer: (payload: any) => dispatch({ type: 'endpointmanage/updateCustomer', payload }),
    removeCustomer: (payload: any, cb: () => void) => dispatch({ type: 'endpointmanage/removeCustomer', payload, callback: cb }),
  }))
)(CustomerList)
