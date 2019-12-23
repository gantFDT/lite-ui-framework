import React, { useCallback, useEffect, useState, Dispatch, useMemo } from 'react'
import { Button, Tooltip, Tabs } from 'antd'
import { connect } from 'dva'
import { get } from 'lodash'

import RelateResourceModal from './RelateResourceModal';
import { SmartTable } from '@/components/specific'
import { Title } from '@/components/common'
import { tr } from '@/components/common/formatmessage'
import { getTableHeight } from '@/utils/utils'
import scheme from './scheme';
import './style.less';

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

interface RoleResourceListProps {
  [propName: string]: any
}

function RoleResourceList(props: RoleResourceListProps) {
  const {
    listResourceLoading,
    roleRelateResource,
    MAIN_CONFIG,
    auth,

    listResource,
    modifyModel,
    clear,
    clearSelect,
    selectedRowKeys: [rolekeySelected],
    selectedRows: [roleSelected],
  } = props;
  const {
    webMenuLinkedList,
    modalVisible
  } = roleRelateResource;

  const refreshList = useCallback(() => {
    listResource({ type: 'webMenu', roleId: rolekeySelected })
    listResource({ type: 'mobileMenu', roleId: rolekeySelected })
    listResource({ type: 'contextMenu', roleId: rolekeySelected })
    listResource({ type: 'funcMenu', roleId: rolekeySelected })
  }, [rolekeySelected])

  const [tabKey, setTabKey] = useState('webMenu');

  const name = useMemo(() => {
    const roleName = get(roleSelected, 'roleName', '')
    return roleName ? ' - ' + roleName : ''
  }, [roleSelected])

  useEffect(() => {
    if (!roleSelected || !roleSelected.resourceCount) return
    refreshList()
    return () => {
      clear()
    }
  }, [rolekeySelected])


  const openRelateResourceModal = useCallback(() => {
    modifyModel({ modalVisible: true })
  }, [])

  const contentHeight = getTableHeight(MAIN_CONFIG, 20)
  const bodyHeight = useMemo(() => `calc((${contentHeight} - 51px)/2 - 32px - 40px)`, [contentHeight])

  return (
    <>
      <SmartTable
        title={<Title title={tr('关联资源列表') + name} showShortLine showSplitLine />}
        schema={scheme}
        dataSource={roleRelateResource[`${tabKey}LinkedList`]}
        rowKey="id"
        tableKey='relateresource'
        loading={listResourceLoading}
        bodyHeight={bodyHeight}
        emptyDescription={tr('暂无数据，请选择角色')}
        headerRight={
          <>
            <Tooltip title={tr("刷新")} placement="bottom"  >
              <Button size="small" onClick={() => refreshList()} disabled={!rolekeySelected} icon='reload' />
            </Tooltip>
            <Tooltip title={tr("关联资源")} placement="bottom"  >
              <Button size="small" onClick={openRelateResourceModal} disabled={!rolekeySelected} icon='link' />
            </Tooltip>
          </>
        }
      />
      <Tabs style={{ marginTop: 0 }} activeKey={tabKey} tabPosition="bottom" onChange={setTabKey}>
        {tabList.map(item => (<Tabs.TabPane tab={item.tab} key={item.key} />))}
      </Tabs>
      <RelateResourceModal tab={[tabKey, setTabKey]} />
    </>
  )
}

export default connect(
  ({ user, roleManage, settings, roleRelateResource, loading }: any) => ({
    currentUser: user.currentUser,
    ...roleManage,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    roleRelateResource,
    listResourceLoading: loading.effects['roleRelateResource/listResource']
  }),
  (dispatch: Dispatch<any>) => ({
    listResource: (payload: any) => dispatch({ type: 'roleRelateResource/listResource', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'roleRelateResource/save', payload }),
    clear: () => dispatch({ type: 'roleRelateResource/clear' }),
    clearSelect: () => dispatch({ type: 'roleRelateResource/clearSelect' }),
  })
)(RoleResourceList);
