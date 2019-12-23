import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer';
import { Draft } from "immer";
import { TransferItem } from 'antd/es/transfer';

import { TableTransferModal } from '@/components/specific'
import { SearchFormSchema } from '@/components/specific/searchform'
import { User } from './authlist'
import { getHierarchicalRoleAPI, addHierarchicalRoleApi, removeHierarchicalRoleApi } from '../services'

interface DistributionRolesProps {
  user: User,
  visible: boolean,
  // 查询回调
  queryRoleList: () => void,
  searchAuthList: () => void,
  [props: string]: any
}

export interface Role extends TransferItem {
  roleCode: string,
  roleId: string,
  roleName: string,
  id?: string,
  hierarchicalId?: string,
  roleDesc?: string,
}

interface QueryParam {
  pageInfo: {
    beginIndex: number,
    pageSize: number,
  },
  filterInfo: {
    assigned: boolean,
    hierarchicalId: string,
  },
}

export interface TableDataShape {
  list: Role[],
  loading: boolean,
  title?: string,
  tableKey?: string,
  onFilter?: (values: any) => void,
  pagination: {
    total: number,
  }
}

const schema: SearchFormSchema = {
  roleCode: {
    title: tr('角色代码1'),
  },
  roleName: {
    title: tr('角色名称'),
  }
}

const columns = [
  {
    dataIndex: 'roleCode',
    title: tr('角色代码1')
  },
  {
    dataIndex: 'roleName',
    title: tr('角色名称'),
  },
  {
    dataIndex: 'roleDesc',
    title: tr('描述'),
  },
]

// 自定义hook类型
type useTableDataShape = (title: string, assigned: boolean, key: string) => [TableDataShape, (F: (draft: Draft<QueryParam>) => void | QueryParam) => void, () => void]
// 自定义hooks
const useTableData: useTableDataShape = (title, assigned, key) => {

  const [param, setParam] = useImmer({
    pageInfo: {
      beginIndex: 0,
      pageSize: 50,
    },
    filterInfo: {
      assigned,
      hierarchicalId: '',
    },
  })
  const [data, setData] = useImmer({
    list: [],
    loading: false,
    title,
    extraSearchProps: {
      uiSchema: {
        "ui:col": 12
      }
    },
    pagination: {
      total: 0,
      ...param.pageInfo
    }
  })

  const query = useCallback(
    () => {
      setData(d => { d.loading = true })
      getHierarchicalRoleAPI({ data: param }).then(res => {
        setData(d => {
          d.loading = false
          d.list = res.content
          d.pagination.total = res.totalCount
        })
      })
    },
    [param],
  )

  useEffect(
    () => {
      if (param.filterInfo.hierarchicalId) {
        query()
      }
    },
    [param]
  )
  useEffect(
    () => {
      setData(d => { d.pagination = { ...d.pagination, ...param.pageInfo } })
    },
    [param.pageInfo]
  )
  return [data, setParam, query]
}

// 组件
const DistributionRoles = (props: DistributionRolesProps) => {
  const { user, queryRoleList, searchAuthList, ...resetProps } = props

  const [left, setLeft, queryLeft] = useTableData(tr('未分配角色'), false, 'noassignedRoleTableTransfer')

  const [right, setRight, queryRight] = useTableData(tr('已分配角色'), true, 'assignedRoleTableTransfer')


  const onTableTransferFilter = useCallback((direction: string, params: any, page: PageInfo) => {
    const setFn = direction === 'left' ? setLeft : setRight

    setFn(data => {
      const { filterInfo: { assigned, hierarchicalId }, pageInfo } = data
      data.filterInfo = { assigned, hierarchicalId, ...params }
      data.pageInfo = { ...pageInfo, ...page }
    })
  }, [])

  const callBack = useCallback(
    () => {
      // 查询未分配
      queryLeft()
      // 查询已分配、可能有所有条件
      queryRight()
      // 查询现存分配
      queryRoleList()
      // 查询分级管理员
      searchAuthList()
    },
    [queryLeft, queryRight, queryRoleList, searchAuthList],
  )

  // const setLoading = useCallback(
  //   loading => {
  //     setLeft(lef => { lef.loading = loading })
  //     setRight(rig => { rig.loading = loading })
  //   },
  //   [],
  // )

  // 相应user的变化来查询
  useEffect(() => {
    if (user && user.id) {
      setLeft(lef => {
        lef.filterInfo.hierarchicalId = user.id
      })
      setRight(rig => {
        rig.filterInfo.hierarchicalId = user.id
      })
    }
  }, [user])

  const dataSource = useMemo(() => ([...left.list, ...right.list].map(item => ({ ...item, key: item.roleId, title: item.roleName }))), [left.list, right.list])
  const targetKeys = useMemo(() => right.list.map(item => item.roleId), [right.list])


  const onChange = useCallback(
    (keys, direction, roleIds) => {
      // 添加
      if (direction === 'right') {
        addHierarchicalRoleApi({
          data: {
            hierarchicalId: user.id,
            roleIds,
          },
        }).then(callBack)//.catch(() => { setLoading(false) })
      } else if (direction === 'left') {
        // 移除
        const ids = right.list.filter(item => roleIds.includes(item.roleId)).map(item => item.id)
        removeHierarchicalRoleApi({
          data: {
            hierarchicalRoleIds: ids,
          },
        }).then(callBack)//.catch(() => { setLoading(false) })
      }
    },
    [user, right.list],
  )

  return (
    <TableTransferModal
      transKey='hiearchical-role'
      title={`${tr('分配系统角色')}${user && ` - ${user.name}`}`}
      rowKey='key'
      extraModalProps={{
        itemState: {
          width: 900,
          height: 600,
        },
        footer: null
      }}
      schema={schema}
      columns={columns}
      left={left as { title: string }}
      right={right as { title: string }}
      dataSource={dataSource}
      targetKeys={targetKeys}
      onSearch={onTableTransferFilter}
      onChange={onChange}
      {...resetProps}
    />
  )
}

export default DistributionRoles
