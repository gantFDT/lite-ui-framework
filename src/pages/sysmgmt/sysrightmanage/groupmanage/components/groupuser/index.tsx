import React, { useCallback, useMemo, Dispatch, useEffect, useState } from 'react'
import { Button, Tooltip, Drawer } from 'antd'
import { cloneDeep } from 'lodash'
import { connect } from 'dva'
import RelateUserModal from './RelateUserModal';
import { tr } from '@/components/common/formatmessage'
import { smartTableSchema } from './scheme';
import { Title } from '@/components/common'
import { SmartTable } from '@/components/specific'

interface GroupUserListProps {
  [propName: string]: any
}

function GroupUserList(props: GroupUserListProps) {
  const {
    primaryColor,
    contentHeight,
    group,
    relateUserList,
    relateUserListTotal,
    listLoading,

    listRelateUser,
    relateUserListPageSize,
    save,
    saveGroup
  } = props;
  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 31px - 1px)`, [contentHeight])
  const y = useMemo(() => relateUserList.length ? tabletHeight : 0, [relateUserList, tabletHeight])

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    listRelateUser({
      page,
      pageSize
    })
  }, [])

  useEffect(() => {
    refreshList()
  }, [group.selectedRowKeys])

  const openRelateUserModal = useCallback(() => save({
    modalVisible: true
  }), [])

  const getSchema = useMemo(() => {
    let newTableSchema = cloneDeep(smartTableSchema);
    return newTableSchema;
  }, [smartTableSchema])

  return (
    <>
      <SmartTable
        tableKey='groupusertable'
        title={<Title title={tr('用户组关联用户列表')} showSplitLine={true} showShortLine={true} />}
        schema={getSchema}
        dataSource={relateUserList}
        rowKey="id"
        loading={listLoading}
        bodyHeight={tabletHeight}
        scroll={{ y }}
        headerRight={
          <>
            <Tooltip title={tr("刷新")} placement="bottom"  >
              <Button size="small" onClick={() => refreshList()} icon='reload' disabled={_.isEmpty(group.selectedRowKeys)}/>
            </Tooltip>
            <Tooltip title={tr("关联用户")} placement="bottom"  >
              <Button size="small" onClick={openRelateUserModal} icon='link' disabled={_.isEmpty(group.selectedRowKeys)} />
            </Tooltip>
          </>
        }
        emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择用户组')}</div></>}

        pagination={{
          total: relateUserListTotal,
          pageSize: relateUserListPageSize,
          onChange: refreshList,
          onShowSizeChange: refreshList,
        }}
      />
      <RelateUserModal {...props}/>
    </>
  )
}

export default connect(
  ({ group, groupuser, loading, settings }: any) => ({
    group,
    ...groupuser,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    listLoading: loading.effects['groupuser/listRelateUser']
  }),
  (dispatch: Dispatch<any>) => (['listRelateUser', 'save'].reduce((total, cur) => ({
    ...total,
    [cur]: (payload: any) => dispatch({ type: `groupuser/${cur}`, payload })
  }), {
    saveGroup: (payload: any) => dispatch({ type: `group/save`, payload })
  }))
)(GroupUserList);
