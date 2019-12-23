import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Modal, Button, Tooltip, Dropdown, Menu } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import {
  SmartSearch, GroupSelector, SmartTable,
} from '@/components/specific'

import UserFormModal from './UserFormModal'

import RelateRoleModal from './RelateRoleModal'
import RelateGroupModal from './RelateGroupModal'
import ResetPwdForm from './ResetPwdForm'
import Title from '@/components/common/title'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { userTableSchema } from './tableSchema'
import { searchSchema } from './schema';
import { get } from 'lodash'
export enum FormTypes {
  create = "create",
  modify = "modify"
}
const emptyForm = {}
interface UserListProps {
  [propName: string]: any,
}

function UserList(props: UserListProps) {
  const {
    currentUser,
    primaryColor,
    MAIN_CONFIG,
    params,
    list,
    total,
    loadingList,
    loadingCreate,
    loadingUpdate,
    selectedRowKeys,
    selectedRows,
    visible,
    userModalType,
    passwordVisible,
    //dispath
    listUser,
    modifyModel,
    createUser,
    removeUser,
    updateUser,
    setActive,
    updateOrganization,
    resetPwd,
    unlock,
    //route
    route,
    //
    relateRoleVisible,
    relateGroupVisible,
    orgModalVisible,
    unlockVisible,
    staffNumberFormat
  } = props;
  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => {
    modifyModel({
      selectedRowKeys,
      selectedRows
    })
  }, [modifyModel])

  const onSearch = useCallback(({ filterInfo, pageInfo }) => {
    listUser({ filterInfo: { filterModel: true, ...filterInfo }, pageInfo })
  }, [listUser])
  const onPageChange = useCallback((beginIndex, pageSize) => {
    modifyModel({ params: { filterInfo: params.filterInfo, pageInfo: { beginIndex, pageSize } } })
  }, [params, modifyModel])
  const onRefresh = useCallback(() => {
    listUser(params)
  }, [params, listUser])
  const handlerRemove = useCallback(() => {
    const selectedUser = selectedRows[0];
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的用户')} <span style={{ color: primaryColor }}>{selectedUser.userName}</span>?</span>,
      onOk: () => removeUser(selectedUser.id),
      okType: "danger",
      okText: tr("删除"),
      cancelText: tr("取消"),
      okButtonProps: {
        size: "small"
      },
      cancelButtonProps: {
        size: "small"
      }
    });
  }, [selectedRows, removeUser])
  const openModal = useCallback((modalType) => modifyModel({
    visible: true,
    userModalType: modalType
  }), [modifyModel])
  const closeModal = useCallback(() => modifyModel({
    visible: false,
    userModalType: FormTypes.create
  }), [modifyModel])


  const handlerUserSubmit = useCallback((formValues) => {
    if (userModalType === FormTypes.create) {
      createUser(formValues)
    } else {
      const user = selectedRows[0];
      updateUser({ ...user, ...formValues })
    }
    modifyModel({ userModalVisible: false })
  }, [userModalType, selectedRows])

  const handlerActive = useCallback((active) => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr(`是否${active ? '激活' : '冻结'}选择的用户`)} <span style={{ color: primaryColor }}>{selectedRows.map((v: any) => v.userName).join('、')}</span>?</span>,
      cancelText: tr('取消'),
      okText: tr('确定'),
      onOk: () => {
        setActive({ active, userIds: selectedRowKeys })
      },
      okButtonProps: {
        size: "small"
      },
      cancelButtonProps: {
        size: "small"
      }
    });
  }, [selectedRows, selectedRowKeys])
  const handlerChangeGroup = useCallback(([groupId]) => {
    updateOrganization({ organizationId: groupId, userIds: selectedRowKeys })
  }, [selectedRowKeys])
  const handlerResetPwd = useCallback((values) => {
    resetPwd({ userIds: selectedRowKeys, ...values });
  }, [selectedRowKeys])
  const handlerUnlock = useCallback((values) => {
    unlock({ userIds: selectedRowKeys, ...values });
  }, [selectedRowKeys])
  const disabled = useMemo(() => {
    const selected = selectedRowKeys.length < 1
    const selectedOne = selectedRowKeys.length != 1;
    let active = true, freeze = true, locked = true;
    selectedRows.map((item: any) => {
      if (item.isActive) freeze = false;
      if (!item.isActive) active = false;
      if (item.isLock) locked = false;
    })
    return {
      active,
      freeze,
      locked,
      selectedOne,
      selected
    }
  }, [selectedRowKeys, selectedRows])
  const cancelPswModal = useCallback(() => {
    modifyModel({ passwordVisible: false })
  }, [modifyModel])
  const cancelUnlockModal = useCallback(() => {
    modifyModel({ unlockVisible: false })
  }, [modifyModel])
  const openPswModal = useCallback(() => {
    modifyModel({ passwordVisible: true })
  }, [modifyModel])
  const onCancelRoleModal = useCallback(() => {
    modifyModel({ relateRoleVisible: false })
  }, [modifyModel])
  const onCancelGroupModal = useCallback(() => {
    modifyModel({ relateGroupVisible: false })
  }, [modifyModel])
  const onCancelOrgModal = useCallback(() => {
    modifyModel({ orgModalVisible: false })
  }, [modifyModel])
  const headerRight = useMemo(() => (
    <>
      <Dropdown
        disabled={disabled.selected}
        overlay={
          <Menu>
            <Menu.Item disabled={disabled.active} onClick={() => handlerActive(true)}>{tr('激活账号')}</Menu.Item>
            <Menu.Item disabled={disabled.freeze} onClick={() => handlerActive(false)}>{tr('冻结账号')}</Menu.Item>
            <Menu.Item disabled={disabled.locked} onClick={() => modifyModel({ unlockVisible: true })} >{tr('解除锁定')}</Menu.Item>
            <Menu.Item onClick={openPswModal} >{tr('重置密码')}</Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
      >
        <Button size="small"   >{tr('账号操作')}</Button>
      </Dropdown>
      <Dropdown
        disabled={disabled.selected}
        overlay={
          <Menu>
            <Menu.Item disabled={disabled.selectedOne} onClick={() => modifyModel({ relateRoleVisible: true })}>{tr('关联角色')}</Menu.Item>
            <Menu.Item disabled={disabled.selectedOne} onClick={() => modifyModel({ relateGroupVisible: true })}>{tr('关联用户组')}</Menu.Item>
            <Menu.Item onClick={() => modifyModel({ orgModalVisible: true })}>{tr('关联组织')}</Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
      >
        <Button size="small"   >{tr('关联')}</Button>
      </Dropdown>
      <Tooltip title={tr("新增")} placement="bottom"  >
        <Button size="small" onClick={openModal.bind(null, FormTypes.create)} icon='plus' />
      </Tooltip>
      <Tooltip title={tr("编辑")} placement="bottom"  >
        <Button size="small" onClick={openModal.bind(null, FormTypes.modify)} icon='edit' disabled={disabled.selectedOne} />
      </Tooltip>
      <Tooltip title={tr("删除")} placement="bottom"  >
        <Button size="small" icon='delete' onClick={handlerRemove} disabled={disabled.selectedOne} />
      </Tooltip>
    </>
  ), [disabled]);
  const [formHeight, setFormHeight] = useState(200)
  const bodyHeight = getTableHeight(MAIN_CONFIG, formHeight + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, true)
  return (
    <Card bodyStyle={{ padding: 0 }}  >
      <SmartSearch
        title={<Title route={route} headerProps={{
        }} />}
        userId={currentUser.id}
        schema={searchSchema}
        pageInfo={{
          pageSize: params.pageInfo.pageSize,
          beginIndex: params.pageInfo.beginIndex
        }}
        onSearch={onSearch}
        totalCount={total}
        searchPanelId="usermanage"
        headerProps={{
          className: 'specialHeader'
        }}
        isCompatibilityMode
        onSizeChange={({ width, height }) => setFormHeight(height)}
      />
      <RelateGroupModal
        visible={relateGroupVisible}
        userId={currentUser.id}
        onCancel={onCancelGroupModal}
        selectUser={selectedRows[0]}
        modifyModel={modifyModel}
        list={list}
      />
      <RelateRoleModal
        visible={relateRoleVisible}
        userId={currentUser.id}
        onCancel={onCancelRoleModal}
        selectUser={selectedRows[0]}
        modifyModel={modifyModel}
        list={list}
      />
      <ResetPwdForm
        visible={passwordVisible}
        onCancel={cancelPswModal}
        onSubmit={handlerResetPwd}
        title={`${tr("重置用户密码")}`}
      />
      <ResetPwdForm
        visible={unlockVisible}
        onCancel={cancelUnlockModal}
        onSubmit={handlerUnlock}
        title={`${tr("解锁账号")}`}
      />
      <UserFormModal
        value={userModalType === FormTypes.modify ? selectedRows[0] : emptyForm}
        onSubmit={handlerUserSubmit}
        formType={userModalType}
        onCancel={closeModal}
        confirmLoading={loadingCreate || loadingUpdate}
        staffNumberFormat={staffNumberFormat}
        visible={visible}
      />
      <GroupSelector.Modal
        onCancel={onCancelOrgModal}
        onOk={handlerChangeGroup}
        visible={orgModalVisible}
        selectMode="single"
      // value={get(selectedRows, `[0].organizationId`, null)}
      />
      <SmartTable
        schema={userTableSchema}
        dataSource={list}
        rowKey="id"
        scroll={{ x: '100%' }}
        tableKey="usermanage:users"
        onReload={onRefresh}
        headerRight={headerRight}
        bodyHeight={bodyHeight}
        loading={loadingList}
        rowSelection={{
          columnWidth: 50,
          clickable: true,
          selectedRowKeys,
          onChange: handlerSelect,
          showFooterSelection: false,
        }}
        pageSize={params.pageInfo.pageSize}
        pageIndex={params.pageInfo.beginIndex}
        totalCount={total}
        onPageChange={onPageChange}
      />
    </Card>
  )
}

export default connect(
  ({ user, settings, loading, userManage, config }: any) => ({
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    staffNumberFormat: config.SYSMGMT_CONFIG.user.staffNumberFormat,
    ...userManage,
    currentUser: user.currentUser,
    loadingList: loading.effects['userManage/listUser'],
    loadingCreate: loading.effects['userManage/createUser'],
    loadingUpdate: loading.effects['userManage/updateUser'],
  }),
  (dispatch: Dispatch<any>) => ({
    listUser: (payload: any) => dispatch({ type: 'userManage/listUser', payload }),
    createUser: (payload: any) => dispatch({ type: 'userManage/createUser', payload }),
    updateUser: (payload: any) => dispatch({ type: 'userManage/updateUser', payload }),
    setActive: (payload: any) => dispatch({ type: 'userManage/setActive', payload }),
    updateOrganization: (payload: any) => dispatch({ type: 'userManage/updateOrganization', payload }),
    resetPwd: (payload: any) => dispatch({ type: 'userManage/resetPwd', payload }),
    unlock: (payload: any) => dispatch({ type: 'userManage/unlock', payload }),
    removeUser: (payload: any) => dispatch({ type: 'userManage/removeUser', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'userManage/save', payload }),
  })
)(UserList);
