import React, { useCallback, useEffect, useMemo } from 'react'
import { useImmer } from 'use-immer'
import { Draft } from 'immer'

import { TableTransferModal } from '@/components/specific'
import TableTransfer from '@/components/common/tabletransfer/ModalTransfer'
import { User } from './authlist'
import { GroupItem } from './grouplist'
import { getHierarchicalRoleGroupAPI, addHierarchicalRoleGroupApi, removeHierarchicalRoleGroupApi } from '../services'

interface DistributionGroupsProps {
  user: User,
  visible: boolean,
  queryGroup: () => void,
  [props: string]: any
}

const columns = [
  {
    dataIndex: 'groupCategoryCode',
    title: tr('用户组类别编码'),
  },
  {
    dataIndex: 'groupCategoryName',
    title: tr('用户组类别名称'),
  },
]

interface TableDataShape {
  list: GroupItem[],
  title: string,
  loading: boolean,
}

interface ParamProps {
  pageInfo: {
    beginIndex: number,
    pageSize: number,
  },
  filterInfo: {
    assigned: boolean,
    hierarchicalId: string,
  },
}


type UseTablePropType = (title: string, assigned: boolean, key: string) => [TableDataShape, (F: (draft: Draft<ParamProps>) => void | ParamProps) => void, () => void]

const useTableProp: UseTablePropType = (title, assigned, key) => {

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
    title: title,
    loading: false,
  })

  const query = useCallback(
    () => {
      setData(d => { d.loading = true })
      getHierarchicalRoleGroupAPI({ data: param }).then(res => {
        setData(d => {
          d.loading = false
          d.list = res
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
  return [data, setParam, query]
}

const DistributionGroups = (props: DistributionGroupsProps) => {

  const { user, queryGroup, searchAuthList, ...resetProps } = props

  const [left, setLeft, queryLeft] = useTableProp(tr('未分配用户组类别'), false, 'noassignedGroupTableTransfer')
  const [right, setRight, queryRight] = useTableProp(tr('已分配用户组类别'), true, 'assignedGroupTableTransfer')

  useEffect(() => {
    if (user && user.id) {
      setLeft(lef => { lef.filterInfo.hierarchicalId = user.id })
      setRight(rig => { rig.filterInfo.hierarchicalId = user.id })
    }
  }, [user])

  const dataSource = useMemo(() => ([...left.list, ...right.list]).map(item => ({ ...item, key: item.groupCategoryId, title: item.groupCategoryName })), [left.list, right.list])
  const targetKeys = useMemo(() => ([...right.list]).map(item => item.groupCategoryId), [right.list])

  const callback = useCallback(
    () => {
      // 查询未分配
      queryLeft();
      // 查询已分配
      queryRight();
      // 查询所有已分配
      queryGroup()
      // 查询管理员列表
      searchAuthList()
    },
    [queryLeft, queryRight, queryGroup, searchAuthList]
  )
  // 切换的时候
  const onChange = useCallback(
    (keys, direction, groupIds) => {
      // 添加用户组
      if (direction === 'right') {
        addHierarchicalRoleGroupApi({
          data: {
            groupIds,
            hierarchicalId: user.id,
          },
        }).then(callback)
      } else if (direction === 'left') {
        const ids = right.list.filter(item => groupIds.includes(item.groupCategoryId)).map(item => item.id)
        removeHierarchicalRoleGroupApi({
          data: {
            hierarchicalGroupIds: ids,
          },
        }).then(callback)
      }
    },
    [user, right.list]
  )

  return (
    <TableTransferModal
      transKey='hiearchical-role'
      title={`${tr('分配用户组')}${user && ` - ${user.name}`}`}
      rowKey='key'
      extraModalProps={{
        itemState: {
          width: 900,
          height: 600,
        },
        footer: null
      }}
      columns={columns}
      left={left as { title: string }}
      right={right as { title: string }}
      dataSource={dataSource}
      targetKeys={targetKeys}
      onChange={onChange}
      {...resetProps}
    />
  )
}


export default DistributionGroups
