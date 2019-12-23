import React, { useEffect, Dispatch, useCallback, useMemo, useState } from 'react'
import { useImmer } from 'use-immer'
import { TableTransferModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import { connect } from 'dva'
import { transferSearchSchema, transferColumns } from './scheme'
import { getUserListByRoleAPI } from '../../service';


const initialPageInfo = {
  pageSize: 20,
  beginIndex: 0
}
interface QueryInfo {
  filterInfo: object,
  pageInfo: typeof initialPageInfo
}

const useTableData: (title: string, key: string, row: { id: string, client: boolean | undefined }) => [Array<{ id: string }>, { title: string }, () => void, React.Dispatch<React.SetStateAction<any>>] = (title, key, row) => {

  const [list, setlist] = useState([])
  const [queryInfo, setQueryInfo] = useImmer({
    pageInfo: initialPageInfo,
    filterInfo: {
      [key]: row.id
    }
  })
  const [data, setData] = useImmer({
    title,
    pagination: {
      total: 0,
      ...initialPageInfo,
    },
    loading: false,
    extraSearchProps: {
      uiSchema: {
        "ui:col": 8
      }
    },
  })
  useEffect(() => setData(d => { d.pagination = { ...d.pagination, ...queryInfo.pageInfo } }), [queryInfo])

  const query = useCallback(
    () => {
      if (!queryInfo.filterInfo[key]) return // 没有id就不查询
      setData(l => { l.loading = true })
      getUserListByRoleAPI({
        data: queryInfo
      }).then(res => {
        setlist(res.content || [])
        setData(l => {
          l.loading = false
          l.pagination.total = res.totalCount
        })
      })
    },
    [queryInfo]
  )

  useEffect(() => {
    if (row.client) return // 客户端手动添加的假数据
    query()
  }, [row, query])

  return [list, data, query, setQueryInfo]
}


function RelateModal(props: any) {
  const {
    roleManage: {
      selectedRows: [selectedRow],
      selectedRowKeys: [selectedKey],
    },
    reload,
    addUsersToRole,
    removeUsersFromRole,
    visible,
    onCancel,
  } = props;

  const [leftDataSource, left, refreshLeft, setLeftQuery] = useTableData(tr('未关联用户'), 'excludeObjectId', selectedRow)
  const [rightDataSource, right, refreshRight, setRightQuery] = useTableData(tr('已关联用户'), 'objectId', selectedRow)

  const dataSource = useMemo(() => [...rightDataSource, ...leftDataSource], [leftDataSource, rightDataSource])
  const targetKeys = useMemo(() => rightDataSource.map(({ id }: { id: string }) => id), [rightDataSource])
  const callback = useCallback(
    () => {
      refreshRight()
      refreshLeft()
      reload()
    },
    [refreshLeft, refreshRight, reload],
  )

  const onChange = useCallback(
    (targetKeys: string[], direction: string, users: string[]) => {
      // 判断是否需要重新加载主列表
      let shouldReloadMainList = false
      if (direction === 'left') shouldReloadMainList = targetKeys.length === 0
      else shouldReloadMainList = targetKeys.length === users.length


      let action = addUsersToRole
      if (direction === 'left') action = removeUsersFromRole
      action({
        objectId: selectedKey,
        users
      }, callback, shouldReloadMainList)
    },
    [selectedKey, callback],
  )
  const onSearch = useCallback(
    (direction: string, filterInfo: any, pageInfo: PageInfo) => {
      let cb = setRightQuery
      if (direction === 'left') {
        cb = setLeftQuery
      }
      cb((p: QueryInfo) => ({ filterInfo: { ...p.filterInfo, ...filterInfo }, pageInfo }))
    },
    [],
  )

  return (
    <TableTransferModal
      title={tr('关联用户') + name}
      visible={visible}
      transKey='rolemanage-relateuser'
      rowKey='id'
      extraModalProps={{
        itemState: {
          width: 900,
          height: 600,
        },
        footer: null
      }}
      schema={transferSearchSchema}
      columns={transferColumns}
      left={left as { title: string }}
      right={right as { title: string }}
      dataSource={dataSource}
      targetKeys={targetKeys}
      onSearch={onSearch}
      onChange={onChange}
      onCancel={onCancel}
    />
  )
}

export default connect(
  ({ roleManage, roleRelateUser, loading, settings, user }: any) => ({
    currentUser: user.currentUser,
    roleManage,
    roleRelateUser,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    listRelateUserLoading: loading.effects['roleRelateUser/listRelateUser'],
    listUnRelateUserLoading: loading.effects['roleRelateUser/listUnRelateUser'],
  }),
  ((dispatch: Dispatch<any>) => ({
    listRelateUser(payload: any) { dispatch({ type: 'roleRelateUser/listRelateUser', payload }) },
    listUnRelateUser(payload: any) { dispatch({ type: 'roleRelateUser/listUnRelateUser', payload }) },
    addUsersToRole(payload: any, cb: () => void, reload: boolean) { dispatch({ type: 'roleRelateUser/addUsersToRole', payload, callback: cb, reload }) },
    removeUsersFromRole(payload: any, cb: () => void, reload: boolean) { dispatch({ type: 'roleRelateUser/removeUsersFromRole', payload, callback: cb, reload }) },
    modifyModel(payload: any) { dispatch({ type: 'roleRelateUser/save', payload }) },
  })),
)(RelateModal);
