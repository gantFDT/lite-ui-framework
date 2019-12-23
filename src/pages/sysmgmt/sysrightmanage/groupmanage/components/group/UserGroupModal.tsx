import React, { useEffect, useCallback, Dispatch, useState } from 'react'
import { Icon } from 'antd'
import { SmartModal } from '@/components/specific'
import { Card, Table } from 'gantd'
import { connect } from 'dva'
import { tr } from '@/components/common/formatmessage'

function UserGroupModal(props: any) {
  const {
    listLoading,
    excludeGroupList,
    excludeGroupSelectedKeys,
    aimModalVisible,
    userId,
    primaryColor,

    listExcludeGroup,
    moveGroupToParent,
    save,
  } = props;
  const [tableheight, setTableHeight] = useState('480px');
  const columns = [{
    title: tr('用户组编码'),
    dataIndex: 'groupCode',
    key: 'groupCode',
  },
  {
    title: tr('用户组名称'),
    dataIndex: 'groupName',
    key: 'groupName',
  },
  {
    title: tr('用户组描述'),
    dataIndex: 'groupDesc',
    key: 'groupDesc',
  },
  {
    title: tr('关联用户'),
    dataIndex: 'userCount',
    key: 'userCount',
    render: (count: any) => {
      if (!count) { count = 0 }
      return (<Icon type="user" style={{ color: count > 0 ? primaryColor : '#333' }} onClick={() => save({ drawerVisible: true })} />
      )
    }
  }]
  useEffect(() => {
    if (aimModalVisible) {
      listExcludeGroup()
    }
  }, [aimModalVisible]);

  const handlerSelect = useCallback((rowKeys: any) => {
    save({
      excludeGroupSelectedKeys: rowKeys,
    })
  }, [])

  const handlerSave = useCallback(() => moveGroupToParent(), [])
  const closeModal = useCallback(() => save({ aimModalVisible: false }), [])
  const onSizeChange = useCallback((width, height) => {
    const currentHeight = (height - 160) + 'px';
    setTableHeight(currentHeight)
  }, [setTableHeight])
  return (
    <SmartModal
      id={`UserGroupSmartModal:${userId}`}
      visible={aimModalVisible}
      title={tr('选择移动目标用户组')}
      onCancel={closeModal}
      onOk={handlerSave}
      itemState={{
        width: 1200,
        height: 480
      }}
      onSizeChange={onSizeChange}
    >
      <Table
        tableKey={`UserGroupModal:${userId}`}
        columns={columns}
        rowKey="id"
        hideVisibleMenu
        dataSource={excludeGroupList}
        loading={listLoading}
        scroll={{ y: tableheight }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: excludeGroupSelectedKeys,
          onChange: handlerSelect,
          clickable: true
        }}
      />
    </SmartModal>
  )
}
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  const mapProps = { dispatch };
  ['listExcludeGroup', 'moveGroupToParent', 'save'].forEach(method => {
    mapProps[method] = (payload: object, callback: Function, final: Function) => {
      dispatch({
        type: `group/${method}`,
        payload,
        callback,
        final
      })
    }
  })
  return mapProps
}
export default connect(
  ({ group, loading, settings, user }: any) => ({
    ...group,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    userId: user.currentUser.id,
    listLoading: loading.effects['group/listExcludeGroup'],
  }), mapDispatchToProps)(UserGroupModal)
