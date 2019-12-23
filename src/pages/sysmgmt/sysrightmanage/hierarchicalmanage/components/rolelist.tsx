import React, { useState, useMemo, useEffect, useCallback } from 'react'
import { Button, Tooltip, Empty } from 'antd'
import { connect, SubscriptionAPI } from 'dva'
import { useImmer } from 'use-immer'
import { Table } from 'gantd'
import { SearchTable } from '@/components/specific';
import { SearchTableScheme } from '@/components/specific/searchtable/SearchTable'
import { User } from './authlist';
import DistributionsRoles from './distributionsroles'
import { HierarchicalState } from '../model'
import { Loading } from '@/models/connect';
import { Title } from '@/components/common'

const assignrolesin = tr('分配角色')

interface RoleListProps extends SubscriptionAPI {
  user: User,
  searchAuthList: () => void,
  hierarchical: HierarchicalState,
  loading: boolean,
  contentHeight: string,
}

const RoleList = (props: RoleListProps) => {

  const { user, dispatch, hierarchical: { roleList }, loading, searchAuthList, contentHeight } = props;
  const title = useMemo(
    () => {
      if (user) return `${assignrolesin} - ${user.name}`
      return assignrolesin
    },
    [user],
  )
  const [visible, setVisible] = useState(false)
  const query = useCallback(
    () => {
      dispatch({
        type: 'hierarchical/getHierarchicalRoleList',
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
  // 根据参数执行查询
  useEffect(() => {
    if (!user || !user.id || !user.roleCount) return
    query()
    return () => {
      dispatch({
        type: 'hierarchical/clearRoleList',
      })
    }
  }, [user])

  const [scheme] = useState(
    () => {
      const list: object[] = [
        {
          key: 'roleCode',
          dataIndex: 'roleCode',
          title: tr('角色代码1')
        },
        {
          key: 'roleName',
          dataIndex: 'roleName',
          title: tr('角色名称'),
        },
        {
          key: 'roleDesc',
          dataIndex: 'roleDesc',
          title: tr('描述'),

        },
      ]
      return list
    })

  const toggleTransfer = useCallback(
    () => {
      setVisible(vis => !vis)
    },
    [],
  )

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
        <Button size="small" onClick={toggleTransfer}>{assignrolesin}</Button>
        <Tooltip title={tr('刷新')}>
          <Button size="small" icon='reload' onClick={query} />
        </Tooltip>
      </>
    )
  }, [user])
  // table高度
  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 31px)`, [contentHeight])
  // 内容区域高度
  const y = useMemo(() => roleList.length ? tabletHeight : 0, [roleList, tabletHeight])
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
        key='assignedRoleTable'
        title={<Title title={title} showShortLine />}
        columns={scheme}
        loading={loading}
        headerRight={headerRight}
        dataSource={roleList}
        hideVisibleMenu
        bodyMinHeight={10}
        rowKey='id'
        scroll={{ y: tabletHeight }}
        // locale={{ emptyText }}
        emptyDescription={tr('暂无数据') + '，' + tr('请从左侧选择管理员')}
      />
      <DistributionsRoles
        user={user}
        visible={visible}
        onCancel={toggleTransfer}
        queryRoleList={query}
        searchAuthList={searchAuthList}
      />
    </>
  )
}


export default connect(
  ({ hierarchical, loading }: { hierarchical: HierarchicalState, loading: Loading }) => ({
    hierarchical,
    loading: loading.effects['hierarchical/getHierarchicalRoleList'],
  })
)(RoleList)
