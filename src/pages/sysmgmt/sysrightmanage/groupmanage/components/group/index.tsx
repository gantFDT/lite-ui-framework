import React, { useMemo, useCallback, useEffect, Dispatch, useState } from 'react'
import { connect } from 'dva'
import { Tooltip, Dropdown, Menu, Modal, Button, Icon } from 'antd'
import { SmartTable, SmartModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import { Title } from '@/components/common'
import { TableSchema, modalSchema } from './scheme';
import UserGroupModal from './UserGroupModal';
// import GroupUser from '../groupuser';
import _ from 'lodash'
const { confirm } = Modal;
interface GroupProps {
  [propName: string]: any
}

function Group(props: GroupProps) {
  const {
    MAIN_CONFIG,
    userId,
    isSuperAdmin,
    primaryColor,
    selectedRowKeys,
    selectedRows,
    groupCategory,

    listLoading,
    groupList,
    groupListTotal,
    formModalVisible,

    listGroup,
    createGroup,
    removeGroup,
    updateGroup,
    moveGroupToRoot,
    save,
    createLoading,
    updateLoading,
    contentHeight,
  } = props;
  const [visible, setVisible] = useState(false);
  const [formContent, setFormContent] = useState({});
  const tabletHeight = useMemo(() => `calc(${contentHeight}/2 - 40px - 31px - 3px)`, [contentHeight])
  const refreshList = useCallback((page = 1, pageSize = 20) => listGroup({
    page,
    pageSize
  }), [])
  useEffect(() => {
    refreshList()
  }, [groupCategory.selectedRowKeys])

  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => save({
    selectedRowKeys,
    selectedRows
  }), [])

  //新增
  const handleCreate = useCallback((mode) => {
    save({ createMode: mode })
    setVisible(true)
  }, [setVisible])

  //关闭弹窗
  const closeModal = useCallback(() => {
    setFormContent({});
    setVisible(false);
  }, [setFormContent, setVisible])

  //编辑
  const handlerUpdate = useCallback((val) => {

    setFormContent(selectedRows[0])
    setVisible(true)
  }, [setVisible, setFormContent, selectedRowKeys, selectedRows])

  const handlerSubmit = useCallback((values) => {
    try {
      const params = { ...values }
      let callback = () => {
        closeModal();
      }
      _.isEmpty(formContent) ? createGroup(params, callback) : updateGroup(params, callback)
    } catch (error) {
      console.log(error)
    }
  }, [formContent, createGroup, updateGroup])

  const handlerRemove = useCallback(() => {
    let _confirm = confirm({
      title: tr('提示?'),
      content: tr('确定删除吗?'),
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small',
      },
      cancelButtonProps: {
        size: 'small',
      },
      onOk() {
        return new Promise((resolve, reject) => {
          let callback = () => {
            _confirm.destroy();
          }
          removeGroup('', callback)

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [removeGroup, selectedRowKeys])
  const finalSceme = useMemo(() => {
    let fakeScheme = [...TableSchema];
    fakeScheme[3]['render'] = (count: any) => {
      if (!count) { count = 0 }
      return <>{count > 0 && <Icon type="user" style={{ color: primaryColor }} />}</>

    }
    return fakeScheme;
  }, [TableSchema, primaryColor])

  const headerRight = useMemo(() => (
    <>
      <Dropdown
        disabled={!groupCategory.selectedRowKeys.length}
        overlay={
          <Menu>
            <Menu.Item disabled={!groupCategory.selectedRowKeys.length} onClick={() => handleCreate('root')}>{tr('新增根用户组')}</Menu.Item>
            <Menu.Item disabled={!selectedRowKeys.length} onClick={() => handleCreate('parent')}>{tr('新增子用户组')}</Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
      >
        <Button size="small" icon="plus" />
      </Dropdown>
      <Dropdown
        disabled={!selectedRowKeys.length}
        overlay={
          <Menu>
            <Menu.Item disabled={!selectedRowKeys.length} onClick={moveGroupToRoot}>{tr('提升为根组')}</Menu.Item>
            <Menu.Item disabled={!selectedRowKeys.length} onClick={() => save({ aimModalVisible: true })}>{tr('移动到新组')}</Menu.Item>
          </Menu>
        }
        placement="bottomCenter"
      >
        <Button size="small" icon="bars">{tr('调整')}</Button>
      </Dropdown>
      <Tooltip title={tr("编辑")} placement="bottom"  >
        <Button size="small" onClick={handlerUpdate} icon='edit' disabled={selectedRowKeys.length !== 1} />
      </Tooltip>
      <Tooltip title={tr("删除")} placement="bottom"  >
        <Button size="small" icon='delete' type='danger' onClick={handlerRemove} disabled={selectedRowKeys.length !== 1} />
      </Tooltip>
    </>
  ), [selectedRowKeys])
  return (
    <>
      <SmartTable
        tableKey={`Group:${userId}`}
        title={<Title title={tr('用户组列表')} showShortLine={true} showSplitLine={true} />}
        schema={finalSceme}
        rowKey='id'
        bodyHeight={tabletHeight}
        dataSource={groupList}
        headerRight={isSuperAdmin && headerRight}
        loading={listLoading}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onChange: handlerSelect
        }}
        emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择用户组类别')}</div></>}
        bindKeys={{
          onDelete: handlerRemove,
          onAltE: handlerUpdate,
        }}
      />
      <SmartModal
        id={'group'}
        title={_.isEmpty(formContent) ? tr('新建用户组') : tr('编辑用户组')}
        isModalDialog
        visible={visible}
        schema={modalSchema}
        values={formContent}
        confirmLoading={createLoading || updateLoading}
        onSubmit={handlerSubmit}
        onCancel={closeModal}
      />
      <UserGroupModal />
    </>
  )
}
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  const mapProps = { dispatch };
  ['listGroup', 'createGroup', 'removeGroup', 'updateGroup', 'moveGroupToRoot', 'moveGroupToParent', 'save'].forEach(method => {
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
  ({ group, groupCategory, user, loading, settings }: any) => ({
    ...group,
    userId: user.currentUser.id,
    isSuperAdmin: user.currentUser.isSuperAdmin,
    groupCategory,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    listLoading: loading.effects['group/listGroup'],
    createLoading: loading.effects['group/createGroup'],
    updateLoading: loading.effects['group/updateGroup'],
  }), mapDispatchToProps)(Group)
