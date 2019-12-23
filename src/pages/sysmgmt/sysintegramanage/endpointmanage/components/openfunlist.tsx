import React, { useCallback, useState, useEffect, Dispatch, useMemo } from 'react'
import { Button, Tooltip, Modal, Empty } from 'antd'
import { RouterTypes } from 'umi'
import { connect } from 'dva'
import OpenFormModal from './OpenFormModal'
import LogFormModal from './LogFormModal'
import { cloneDeep } from 'lodash'
import { SmartTable } from '@/components/specific'
import { smartTableSchema as getSchema } from './openfunschema'
import { Title } from '@/components/common'

const getPageFromIndex = (pageInfo: any) => {
  if (!pageInfo.beginIndex) return 1;
  return (pageInfo.beginIndex / pageInfo.pageSize) + 1;
}

const pageKey = 'openfunlist'

interface OpenFunListProps extends RouterTypes {
  [propName: string]: any

}

const OpenFunList = (props: OpenFunListProps) => {
  const {
    route,
    userId,
    systemId,

    primaryColor,
    selectedOpenRowKeys,
    selectedOpenRows,
    openVisible,
    modifyOpenModel,

    contentHeight,

    loading,
    openList,
    getOpenList,
    openListParams,

    createOpen,
    removeOpen,
    createLoading
  } = props

  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 29px - 2px)`, [contentHeight])
  const y = useMemo(() => openList.length ? tabletHeight : 0, [openList, tabletHeight])
  const handleId = useMemo(() => selectedOpenRowKeys[0], [selectedOpenRowKeys])

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    if (!systemId || systemId === '0') return
    getOpenList({
      page: page || getPageFromIndex(openListParams.pageInfo),
      pageSize: pageSize || openListParams.pageInfo.pageSize,
      systemId
    })
  }, [systemId])

  useEffect(() => {
    refreshList()
    return () => {
      modifyOpenModel({
        openList: [],
        selectedOpenRowKeys: [],
        selectedOpenRows: []
      })
    }
  }, [refreshList])

  const handlerSelect = useCallback((selectedOpenRowKeys: any, selectedOpenRows: any) => {
    modifyOpenModel({
      selectedOpenRowKeys,
      selectedOpenRows
    })
  }, [])

  const handlerRemove = useCallback(() => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的功能')} <span style={{ color: primaryColor }}>{selectedOpenRows[0].name}</span></span>,
      onOk: () => new Promise(resolve => {
        removeOpen({ id: handleId }, resolve)
      }),
      okText: tr('确定'),
      cancelText: tr('取消'),
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      }
    });
  }, [selectedOpenRows, handleId])

  const openModal = useCallback(() => modifyOpenModel({ openVisible: true }), [])

  const closeFormModal = useCallback(() => modifyOpenModel({
    openVisible: false
  }), [])

  //查看日志
  const handlerSeeLog = useCallback(() => modifyOpenModel({
    logVisible: true,
    logType: 'handleId',
    logId: handleId
  }), [handleId])

  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("开放功能")} placement="bottom"  >
        <Button size="small" onClick={openModal} icon='plus' disabled={!systemId} />
      </Tooltip>
      <Tooltip title={tr("关闭功能")} placement="bottom"  >
        <Button size="small" icon='delete' type='danger' onClick={() => handlerRemove()} disabled={!handleId} />
      </Tooltip>
      <Tooltip title={tr("查看日志")} placement="bottom"  >
        <Button size="small" onClick={handlerSeeLog} icon='read' disabled={!handleId} />
      </Tooltip>
    </>
  ), [handleId, systemId])


  return (
    <>
      <OpenFormModal
        visible={openVisible}
        onCreate={createOpen}
        onCancel={closeFormModal}
        loading={createLoading}
      />
      <SmartTable
        tableKey={`${pageKey}:${userId}`}
        title={<Title title={tr('开放功能列表')} showSplitLine={true} showShortLine={true} />}
        schema={getSchema}
        rowKey='id'

        dataSource={openList}
        headerRight={headerRight}
        loading={loading}
        scroll={{ y }}
        bodyMinHeight='10px'
        bodyHeight={tabletHeight}

        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedOpenRowKeys,
          onChange: handlerSelect
        }}
        emptyDescription={<>
          <div>{tr('暂无数据')}</div>
          <div>{tr('请点击客户列表')}</div>
        </>}
      />
    </>
  )
}

export default connect(
  ({ endpointmanage, settings, user, loading }: any) => ({
    ...settings,
    userId: user.currentUser.id,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    ...endpointmanage,
    loading: loading.effects['endpointmanage/findOpenList'],
    createLoading: loading.effects['endpointmanage/createOpen'],
  }),
  ((dispatch: Dispatch<any>) => ({
    getOpenList: (payload: any) => dispatch({ type: 'endpointmanage/findOpenList', payload }),
    modifyOpenModel: (payload: any) => dispatch({ type: 'endpointmanage/save', payload }),
    createOpen: (payload: any) => dispatch({ type: 'endpointmanage/createOpen', payload }),
    removeOpen: (payload: any, cb: () => void) => dispatch({ type: 'endpointmanage/removeOpen', payload, callback: cb }),
  }))
)(OpenFunList)
