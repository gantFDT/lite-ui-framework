import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Button, Tooltip, Empty } from 'antd'
import { connect, SubscriptionAPI } from 'dva';
import { useImmer } from 'use-immer'
import { Table } from 'gantd'
import { User } from './authlist'
import { SearchTable } from '@/components/specific'
import { SearchTableScheme } from '@/components/specific/searchtable/SearchTable'
import { HierarchicalState } from '../model'
import { Loading } from '@/models/connect';
import DistributionGroups from './distributionsgroups'
import { Title } from '@/components/common'

export interface GroupItem {
  groupCategoryCode: string,
  groupCategoryId: string,
  groupCategoryName: string,
  hierarchicalId: string,
  id: string,
}

interface GroupListProps extends SubscriptionAPI {
  user: User,
  searchAuthList: () => void,
  hierarchical: HierarchicalState,
  loading: boolean,
  contentHeight: string,
}

const assignrolesin = tr('分配用户组')

const scheme: object[] = [
  {
    key: 'groupCategoryCode',
    dataIndex: 'groupCategoryCode',
    title: tr('用户组类别编码')
  },
  {
    key: 'groupCategoryName',
    dataIndex: 'groupCategoryName',
    title: tr('用户组类别名称')
  },
]

const GroupList = (props: GroupListProps) => {

  const { user, dispatch, hierarchical: { groupList }, loading, searchAuthList, contentHeight } = props

  const [visible, setvisible] = useState(false)
  const toggleVisible = useCallback(() => {
    setvisible(v => !v)
  }, [])

  const title = useMemo(
    () => {
      if (user) return `${assignrolesin} - ${user.name}`
      return assignrolesin
    },
    [user],
  )


  // 查询用户组
  const queryGroup = useCallback(
    () => {
      dispatch({
        type: 'hierarchical/getHierarchicalRoleGroupList',
        payload: {
          pageInfo: {
            beginIndex: 0,
            pageSize: 1000,
          },
          filterInfo: {
            assigned: true,
            hierarchicalId: user.id,
          },
        },
      })
    },
    [user],
  )

  useEffect(() => {
    if (!user || !user.id || !user.groupCount) return
    queryGroup()
    return () => {
      dispatch({
        type: 'hierarchical/clearRoleGroupList',
      })
    }
  }, [user])

  const headerRight = useMemo(() => {
    if (!user) {
      return (
        <>
          <Button size="small" disabled={!user}>{assignrolesin}</Button>
          <Tooltip title={tr('刷新')}>
            <Button size="small" icon='reload' disabled={!user} />
          </Tooltip>
        </>
      )
    }
    return (
      <>
        <Button size="small" onClick={toggleVisible}>{assignrolesin}</Button>
        <Tooltip title={tr('刷新')}>
          <Button size="small" icon='reload' onClick={queryGroup} />
        </Tooltip>
      </>
    )
  }, [user])
  // table高度
  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 31px)`, [contentHeight])
  // 内容区域高度
  const y = useMemo(() => groupList.length ? tabletHeight : 0, [groupList, tabletHeight])
  const emptyText = useMemo(() => {
    return (
      <div className="aligncenter" style={{ height: tabletHeight }}>
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
      </div>
    )
  }, [tabletHeight])
  return (
    <>
      <Table
        key='assignedRoleGroupTable'
        rowKey='id'
        title={<Title title={title} showShortLine />}
        columns={scheme}
        headerRight={headerRight}
        loading={loading}
        dataSource={groupList}
        bodyMinHeight={10}
        hideVisibleMenu
        scroll={{ y: tabletHeight }}
        // locale={{ emptyText }}
        emptyDescription={tr('暂无数据') + '，' + tr('请从左侧选择管理员')}
      />
      <DistributionGroups
        user={user}
        visible={visible}
        onCancel={toggleVisible}
        queryGroup={queryGroup}
        searchAuthList={searchAuthList}
      />
    </>
  )
}

export default connect(
  ({ hierarchical, loading }: { hierarchical: HierarchicalState, loading: Loading }) => ({
    hierarchical,
    loading: loading.effects['hierarchical/getHierarchicalRoleGroupList'],
  }),
)(GroupList)