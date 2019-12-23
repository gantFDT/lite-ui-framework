import React, { useState, useCallback, useEffect, SetStateAction, Dispatch, useMemo } from 'react'
import { Button, Popconfirm, Tooltip } from 'antd'
import { connect, SubscriptionAPI } from 'dva'
import { useImmer } from 'use-immer';
import { RouterTypes } from 'umi';

import { SmartTable, SmartSearch } from '@/components/specific'
import { Title } from '@/components/common'
import { getUserField } from '@/utils/user'
import { compose, getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { SettingsProps } from '@/models/settings'

import Modal from './createmodal';
import { Loading, UserState } from '@/models/connect';
import { HierarchicalState } from '../model'
import { tableScheme as schema, filterscheme, searchUISchema } from '../schema'

export type User = {
  id: string,
  userId: number,
  name: string,
  roleCount: number,
  groupCount: number
}

type Props = SettingsProps & SubscriptionAPI

interface AuthListProps extends Props, RouterTypes {
  hierarchical: HierarchicalState,
  loading: boolean,
  // 设置选中的user
  setUser: Dispatch<SetStateAction<User | null>>,
  // 设置查询列表的回调
  setsearchAuthList: Dispatch<SetStateAction<() => void>>,
  userId: string,
}

const componentKey = 'hierarchical'

const AuthList = (props: AuthListProps) => {

  const { dispatch, hierarchical: { hierList }, loading, setUser, setsearchAuthList, MAIN_CONFIG, userId, route } = props

  const [searchHeight, setsearchHeight] = useState(0)
  const onSearchFormSizeChange = useCallback(({ width, height }) => setsearchHeight(height), [])
  const minHeight = getTableHeight(MAIN_CONFIG, searchHeight + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT + 20 + 40, false)
  // 作为默认参数
  const [searchParam, setSearchParam] = useImmer({
    pageInfo: {
      beginIndex: 0,
      pageSize: 50,
    },
    filterInfo: {
      filterModel: false,
      userName: undefined,
      orgName: undefined,
    },
  })
  const [selectedKeys, setselectedKeys] = useState([] as Array<string>);
  const [selectedRow, setselectedRow] = useState()
  const onSelect = useCallback(
    (keys: Array<string>, rows) => {
      if (!rows.length) {
        setUser(null)
        setselectedRow(null)
        setselectedKeys([])
        return
      }
      const role = rows[0]
      const key = keys[0]
      const name = getUserField({ id: role.userId })
      const user = { ...role, name }
      // 提供给其他组件
      setUser(user)
      setselectedRow(user)
      setselectedKeys([key])
    },
    [],
  )
  const rowSelection = useMemo(() => ({ type: 'radio', selectedRowKeys: selectedKeys, onChange: onSelect }), [selectedKeys])
  const [formModalVisible, setformModalVisible] = useState(false)
  const showModal = useCallback(() => setformModalVisible(true), [])
  const hideModal = useCallback(() => setformModalVisible(false), [])
  const [create, setCreate] = useState(false)

  const callback = useCallback(
    (params = searchParam, isFirst = false) => {
      dispatch({
        type: 'hierarchical/getHierarchicalList',
        payload: params,
        stateName: isFirst ? 'hierList' : undefined,
      })
      setSearchParam(p => params)
    },
    [searchParam],
  )
  // 初始化查询
  useEffect(() => {
    setsearchAuthList(() => callback)
  }, [callback])

  const onRemove = useCallback(
    () => {
      dispatch({
        type: 'hierarchical/removeHierarchicalList',
        payload: selectedKeys[0],
        callback: compose(callback, () => { setUser(null) }),
      })
    },
    [callback, selectedKeys],
  )

  const onFilter = useCallback(
    ({ filterInfo: { userId: userName, organizationId: orgName } }, isFirst) => {
      setUser(null)
      setselectedRow(null)
      setselectedKeys([])
      callback({
        pageInfo: {
          beginIndex: 0,
          pageSize: 50,
        },
        filterInfo: {
          filterModel: true,
          userName,
          orgName,
        },
      }, isFirst)
    },
    [],
  )
  // 创建和编辑功能
  const onSubmit = useCallback(
    (params) => {
      const cb = compose(callback, hideModal)
      const type = create ? 'hierarchical/createHierarchicalList' : 'hierarchical/updateHierarchicalList';
      dispatch({
        type,
        payload: create ? params : { ...selectedRow, ...params },
        callback: cb,
      })
    },
    [callback, create, selectedRow],
  )

  const onClickCreate = useCallback(
    () => {
      setformModalVisible(true)
      setCreate(true)
    },
    [],
  )
  const onClickEdit = useCallback(
    () => {
      setformModalVisible(true)
      setCreate(false)
    },
    [],
  )

  const headerRight = useMemo(() => {
    const delbtn = selectedKeys.length ? (
      <Popconfirm
        title={tr('确认删除') + '?'}
        okType='danger'
        onConfirm={onRemove}
      >
        <Button icon='delete' type='danger' size='small' />
      </Popconfirm>
    ) : <Button icon='delete' type='danger' size='small' disabled />

    const editbtn = selectedKeys.length ? (
      <Button icon='edit' size='small' onClick={onClickEdit} />
    ) : <Button icon='edit' size='small' disabled />
    return (
      <>
        <Tooltip title={tr("新建")}>
          <Button size="small" icon="plus" className="marginh5" onClick={onClickCreate} />
        </Tooltip>
        <Tooltip title={tr("编辑")}>
          {editbtn}
        </Tooltip>
        <Tooltip title={tr("删除")}>
          {delbtn}
        </Tooltip>
        <Tooltip title={tr("刷新")}>
          <Button size="small" icon="reload" onClick={() => callback()} />
        </Tooltip>
      </>
    )
  }, [selectedKeys, onRemove, callback])

  return (
    <>
      <SmartSearch
        searchPanelId='hierarchicallist'
        userId={userId}
        title={<Title title={tr('过滤条件')} showShortLine />}
        schema={filterscheme}
        uiSchema={searchUISchema}
        onSearch={onFilter}
        onSizeChange={onSearchFormSizeChange}
        pageInfo={searchParam.pageInfo}
        totalCount={hierList.length}
        isCompatibilityMode
        showBottomLine={false}
        headerProps={{
          bottomLine: false
        }}
      />
      <SmartTable
        title={<Title title={tr('分级管理')} showShortLine showSplitLine />}
        tableKey={componentKey}
        schema={schema}
        bodyHeight={minHeight}
        dataSource={hierList}
        loading={loading}
        headerRight={headerRight}
        rowSelection={rowSelection}
      />
      <Modal visible={formModalVisible} isCreate={create} selected={selectedKeys[0]} onCancel={hideModal} onSubmit={onSubmit} />
    </>
  )
}

export default connect(
  ({ hierarchical, loading, settings, user }: { hierarchical: HierarchicalState, loading: Loading, settings: SettingsProps, user: UserState }) => ({
    hierarchical,
    loading: loading.effects['hierarchical/getHierarchicalList'],
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
  }),
)(AuthList)
