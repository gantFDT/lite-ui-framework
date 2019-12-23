import React, { useCallback, useMemo, useEffect, useState } from 'react';
import { Card, Tooltip, Button, Popconfirm, Dropdown, Menu } from 'antd';
import { connect } from 'dva';
import { Icon } from 'gantd'
import { Dispatch, AnyAction } from 'redux'
import { useImmer } from 'use-immer'
import { keys, zip } from 'lodash'

import { SearchForm, SmartTable } from '@/components/specific';
import { formscheme, tableschema } from './scheme'
import { SettingsProps } from '@/models/settings';
import { Title } from '@/components/common';
import { functionmgmtnamespace, functionmgmtstatename, FunctionmgmtState, FunctionmgmtParamProps } from './model'
import { Loading } from '@/models/connect';
import FuncType, { FuncTypes } from "@/components/form/functype";
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
import FunctionModal, { FunctionModalProps } from './components/modal';

const customFields = [{
  name: 'Functype',
  component: FuncType,
}]

const functypes = zip(keys(FuncTypes), ['icon-jisuanmoxing', 'icon-chazhaomoxing', 'icon-pichulimoxing', 'icon-juhemoxing', 'icon-fuhemoxing'])

interface ListItem {
  id: string,
  activeStatus: string,
}

interface DispatchProps {
  query: (p: FunctionmgmtParamProps, name: string) => void,
  publish: (p: { id: string }) => void,
  remove: (p: { id: string }, cb: () => void) => void,
}

interface FunctionmgmtProps extends SettingsProps, FunctionmgmtState, DispatchProps {
  loading: boolean,
  route: any
}

const key = functionmgmtnamespace
const Functionmgmt = (props: FunctionmgmtProps) => {
  const { MAIN_CONFIG, query, publish, remove, param, total, route } = props
  const [name, setname] = useState(functionmgmtstatename)
  const [pageInfo, setpageInfo] = useImmer(param.pageInfo)
  const [filterInfo, setfilterInfo] = useState(param.filterInfo)
  const currentPage = useMemo(() => pageInfo.beginIndex / pageInfo.pageSize + 1, [pageInfo])
  const [searchFormHeight, setSearchFormHeight] = useState(0)

  const height = getTableHeight(MAIN_CONFIG, searchFormHeight + TABLE_HEADER_HEIGHT, true)
  const onSearch = useCallback((params) => setfilterInfo(info => ({ ...params })), [])
  const load = useCallback(() => query({ pageInfo, filterInfo }, name), [pageInfo, filterInfo, name])
  useEffect(() => {
    load()
    setname('')
  }, [pageInfo, filterInfo])

  const onPageChange = useCallback((page: number, size: number) => { setpageInfo(info => ({ pageSize: size, beginIndex: (page - 1) * size })) }, [])
  const pagination = useMemo(() => ({
    current: currentPage,
    total,
    pageSize: pageInfo.pageSize,
    onChange: onPageChange,
    onShowSizeChange: onPageChange,
  }), [total, pageInfo])

  const [selectedKey, setselectedKey] = useState('')
  const [selectedRow, setselectedRow] = useState({} as ListItem)
  const onSelectionChange = useCallback((keys, rows) => {
    setselectedKey(keys[0])
    setselectedRow(rows[0])
  }, [])
  // 发布操作更新数据
  useEffect(() => {
    if (selectedKey) {
      const row = props[functionmgmtstatename].find((item: ListItem) => item.id === selectedKey)
      setselectedRow(row)
    }
  }, [props[functionmgmtstatename]])
  const rowSelection = useMemo(() => ({
    type: 'radio',
    selectedRowKeys: selectedKey,
    onChange: onSelectionChange,
  }), [selectedKey])

  const onPublish = useCallback(() => publish({ id: selectedKey }), [selectedKey])
  const onRemove = useCallback(() => remove({ id: selectedKey }, () => { onSelectionChange([], []) }), [selectedKey])
  const [modalProps, setmodalProps] = useImmer({ visible: false, type: '', isCreate: false } as FunctionModalProps);
  const onCreateItemClick = useCallback(({ key: type }) => setmodalProps(prop => {
    prop.visible = true;
    prop.type = type;
  }), []);
  const headerRight = useMemo(() => {
    const menu = (
      <Menu onClick={onCreateItemClick}>
        {functypes.map(([value, icon]) => (
          <Menu.Item key={value}><Icon type={icon} /> 新增{FuncTypes[value as string]}</Menu.Item>
        ))}
      </Menu>
    );
    const pubBtn = selectedKey && selectedRow.activeStatus === "DRAFT" ? (
      <Popconfirm
        title={tr('确认发布选中模型') + '?'}
        okType='danger'
        onConfirm={onPublish}
      >
        <Button icon="cloud-upload" size='small' />
      </Popconfirm>
    ) : <Button icon="cloud-upload" size='small' disabled />
    const delBtn = selectedKey ? (
      <Popconfirm
        title={tr('确认删除该模型') + '?'}
        okType='danger'
        onConfirm={onRemove}
      >
        <Button icon="delete" size='small' type='danger' />
      </Popconfirm>
    ) : <Button icon="delete" size='small' disabled />
    return (
      <>
        <Dropdown
          overlay={menu}
        >
          <Tooltip title={tr('刷新')}>
            <Button icon="plus" size='small' />
          </Tooltip>
        </Dropdown>
        <Tooltip title={tr('发布')}>
          {pubBtn}
        </Tooltip>
        <Tooltip title={tr('删除')}>
          {delBtn}
        </Tooltip>
        <Tooltip title={tr('刷新')}>
          <Button icon="reload" size='small' onClick={load} />
        </Tooltip>
      </>
    )
  }, [load, selectedRow, selectedKey])
  return (
    <Card bodyStyle={{ padding: 0 }}>
      <SearchForm
        searchKey={key}
        title={<Title route={route} />}
        schema={formscheme}
        onSearch={onSearch}
        customComponents={customFields}
        headerProps={{
          className: 'specialHeader'
        }}
        onSizeChange={({ height }) => {
          console.log('height', height)
          setSearchFormHeight(height)
        }}
      />
      <SmartTable
        title={tr('查询结果')}
        tableKey={key}
        schema={tableschema}
        bodyHeight={height}
        dataSource={props[functionmgmtstatename]}
        loading={props.loading}
        rowSelection={rowSelection}
        pagination={pagination}
        headerRight={headerRight}
      />
      <FunctionModal {...modalProps} />
    </Card>
  )
}


const mapDispatchToprops: (d: Dispatch<AnyAction>) => DispatchProps = dispatch => {
  return {
    query(param, name) {
      dispatch({
        type: `${functionmgmtnamespace}/getList`,
        payload: param,
        stateName: name,
      })
    },
    publish(param) {
      dispatch({
        type: `${functionmgmtnamespace}/publish`,
        payload: param,
      })
    },
    remove(param, cb) {
      dispatch({
        type: `${functionmgmtnamespace}/remove`,
        payload: param,
        callback: cb,
      })
    },
  }
}
export default connect(
  ({ settings, functionmgmt, loading }: { settings: SettingsProps, loading: Loading, functionmgmt: FunctionmgmtState }) => ({
    ...settings,
    ...functionmgmt,
    loading: loading.effects[`${functionmgmtnamespace}/getList`]
  }),
  mapDispatchToprops,
)(Functionmgmt)
