import React, { useCallback, useEffect, Dispatch, useMemo, useState } from 'react'
import { connect } from 'dva'
import { SmartTable, SmartModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import { TableSchema, modalSchema } from './scheme';
import { Title } from '@/components/common';
import { Button, Tooltip, Modal } from 'antd'
import _ from 'lodash'
const { confirm } = Modal;
interface GroupCategoryProps {
  [propName: string]: any
}

function GroupCategory(props: GroupCategoryProps) {
  const {
    MAIN_CONFIG,
    selectedRowKeys,
    selectedRows,
    userId,
    isSuperAdmin,
    listLoading,
    params,
    groupCategoryList,
    groupCategoryListTotal,

    listGroupCategory,
    createGroupCategory,
    removeGroupCategory,
    updateGroupCategory,
    save,
    contentHeight,
    createLoading,
    updateLoading,
  } = props;
  const [visible, setVisible] = useState(false);
  const [formContent, setFormContent] = useState({});
  const tabletHeight = useMemo(() => `calc(${contentHeight} - 40px - 34px)`, [contentHeight])
  const refreshList = useCallback((page = 1, pageSize = 50) => listGroupCategory({
    page,
    pageSize
  }), [])

  useEffect(() => {
    refreshList()
  }, [])

  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => save({
    selectedRowKeys,
    selectedRows
  }), [])

  //新增
  const handleCreate = useCallback(() => {
    setVisible(true)
  }, [setVisible])

  //关闭弹窗
  const closeModal = useCallback(() => {
    setFormContent({});
    setVisible(false);
  }, [setFormContent, setVisible])

  //编辑基地
  const handlerUpdate = useCallback((val) => {
    const currentVal = groupCategoryList.find((item: any) => item.id == selectedRowKeys);
    setFormContent(selectedRows[0])
    setVisible(true)
  }, [setVisible, setFormContent, selectedRowKeys, selectedRows])

  const handlerSubmit = useCallback((values) => {
    try {
      const params = { ...values }
      let callback = () => {
        closeModal();
      }
      _.isEmpty(formContent) ? createGroupCategory(params, callback) : updateGroupCategory(params, callback)
    } catch (error) {
      console.log(error)
    }
  }, [formContent, createGroupCategory, updateGroupCategory])
  const handlerRemove = useCallback(() => {
    let _confirm = confirm({
      title: '提示?',
      content: '确定删除吗?',
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
          removeGroupCategory('', callback)

        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows])
  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("新增")} placement="bottom"  >
        <Button size="small" onClick={handleCreate} icon='plus' />
      </Tooltip>
      <Tooltip title={tr("编辑")} placement="bottom"  >
        <Button size="small" onClick={handlerUpdate} icon='edit' disabled={selectedRowKeys.length !== 1} />
      </Tooltip>
      <Tooltip title={tr("删除")} placement="bottom"  >
        <Button size="small" icon='delete' onClick={handlerRemove} disabled={selectedRowKeys.length !== 1} />
      </Tooltip>
    </>
  ), [selectedRowKeys])
  return (
    <>
      <SmartTable
        tableKey={`groupCategory:${userId}`}
        title={<Title title={tr('用户组类别')} showShortLine={true} showSplitLine={true} />}
        schema={TableSchema}
        rowKey='id'
        bodyHeight={tabletHeight}
        dataSource={groupCategoryList}
        headerRight={isSuperAdmin && headerRight}
        loading={listLoading}
        rowSelection={{
          type: 'radio',
          selectedRowKeys: selectedRowKeys,
          onChange: handlerSelect
        }}
        pagination={{
          total: groupCategoryListTotal,
          pageSize: params.pageInfo.pageSize,
          onChange: refreshList,
          onShowSizeChange: refreshList,
          showSizeChanger: false,
          showQuickJumper: false,
          showTotal: false
        }}
        bindKeys={{
          onDelete: handlerRemove,
          onAltA: handleCreate,
          onAltE: handlerUpdate,
        }}
      />
      <SmartModal
        id={'groupCategory'}
        title={_.isEmpty(formContent) ? tr('新建用户组类别') : tr('编辑用户组类别')}
        isModalDialog
        visible={visible}
        schema={modalSchema}
        values={formContent}
        confirmLoading={createLoading || updateLoading}
        onSubmit={handlerSubmit}
        onCancel={closeModal}
      />
    </>
  )
}
const mapDispatchToProps = (dispatch: Dispatch<any>) => {
  const mapProps = { dispatch };
  ['listGroupCategory', 'createGroupCategory', 'removeGroupCategory', 'updateGroupCategory', 'save'].forEach(method => {
    mapProps[method] = (payload: object, callback: Function, final: Function) => {
      dispatch({
        type: `groupCategory/${method}`,
        payload,
        callback,
        final
      })
    }
  })
  return mapProps
}
export default connect(
  ({ groupCategory, user, loading, settings }: any) => ({
    ...groupCategory,
    userId: user.currentUser.id,
    isSuperAdmin: user.currentUser.isSuperAdmin,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    listLoading: loading.effects['groupCategory/listGroupCategory'],
    createLoading: loading.effects['groupCategory/createGroupCategory'],
    updateLoading: loading.effects['groupCategory/updateGroupCategory'],
  }), mapDispatchToProps)(GroupCategory);