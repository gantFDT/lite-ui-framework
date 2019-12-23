import React, { useState, useEffect, Dispatch, useCallback, useMemo } from 'react'
import { Tabs } from 'antd'
import { SmartTable, SmartModal } from '@/components/specific'
import { Table } from 'gantd'
import { tr } from '@/components/common/formatmessage'
import { connect } from 'dva'
import scheme from './scheme'

const tabList = [
  {
    key: 'webMenu',
    tab: tr('主菜单')
  },
  {
    key: 'mobileMenu',
    tab: tr('移动菜单')
  },
  {
    key: 'contextMenu',
    tab: tr('上下文菜单')
  },
  {
    key: 'funcMenu',
    tab: tr('功能点')
  },
]

function RelateModal(props: any) {
  const {
    tab,

    currentUser,
    roleRelateResource,

    listAllRelateResource,
    modifyModel,
    saveResourceLoading,
    saveRoleResourceRelation,
    saveRoleResource,
    listAllRelateResourceLoading
  } = props;

  const {
    modalVisible,
  } = roleRelateResource;
  const [tabType, setTabType] = tab

  useEffect(() => {
    if (modalVisible) {
      ['webMenu', 'mobileMenu', 'contextMenu', 'funcMenu'].map(T => listAllRelateResource({ type: T }))
    }
  }, [modalVisible])

  const handlerSelect = useCallback((rowKeys: any) => {
    modifyModel({
      [`${tabType}SelectedKeys`]: rowKeys
    })
  }, [tabType])

  const closeModal = useCallback(() => modifyModel({ modalVisible: false }), [])

  return (
    <SmartModal
      id='relateresource-modal'
      itemState={{ width: 900, height: 600 }}
      visible={modalVisible}
      title={tr('关联资源到角色')}
      onCancel={closeModal}
      onSubmit={saveRoleResource}
      confirmLoading={saveResourceLoading}
    >
      <Tabs style={{ marginTop: 0, marginBottom: 12 }} activeKey={tabType} size="large" onChange={setTabType}>
        {tabList.map(item => (<Tabs.TabPane tab={item.tab} key={item.key} />))}
      </Tabs>
      <Table
        tableKey='relateresource-modal'
        columns={scheme}
        hideVisibleMenu
        dataSource={roleRelateResource[`${tabType}List`]}
        rowKey="id"
        rowSelection={{
          showFooterSelection: false,
          onChange: handlerSelect,
          selectedRowKeys: roleRelateResource[`${tabType}SelectedKeys`],
        }}
        paganation={false}
        loading={listAllRelateResourceLoading}
      />
    </SmartModal>
  )
}

export default connect(
  ({ roleManage, roleRelateResource, loading, settings, user }: any) => ({
    currentUser: user.currentUser,
    roleManage,
    roleRelateResource,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    headerHeight: settings.MAIN_CONFIG.headerHeight,

    listAllRelateResourceLoading: loading.effects['roleRelateResource/listAllResource'],
    saveResourceLoading: loading.effects['roleRelateResource/saveRoleResourceRelation'],
  }),
  ((dispatch: Dispatch<any>) => ({
    listRelateResource(payload: any) { dispatch({ type: 'roleRelateResource/listResource', payload }) },
    listAllRelateResource(payload: any) { dispatch({ type: 'roleRelateResource/listAllResource', payload, stateName: `${payload.type}List` }) },
    saveRoleResourceRelation(payload: any) { dispatch({ type: 'roleRelateResource/saveRoleResourceRelation', payload }) },
    saveRoleResource() { dispatch({ type: 'roleRelateResource/saveRoleResource' }) },
    modifyModel(payload: any) { dispatch({ type: 'roleRelateResource/save', payload }) },
  }))
)(RelateModal);