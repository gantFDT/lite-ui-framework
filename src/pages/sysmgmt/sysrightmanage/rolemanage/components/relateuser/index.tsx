import React, { useMemo, useCallback, useEffect, Dispatch, useState } from 'react'
import { Button, Tooltip, Empty } from 'antd'
import { Icon } from 'gantd'
import { connect } from 'dva'
import { get } from 'lodash'
import RelateUserModal from './RelateUserModal';
import { SmartTable } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import scheme from './scheme';
import { Title } from '@/components/common'
import { getTableHeight } from '@/utils/utils'
import { usePageData } from '../../hooks'

interface RoleUserListProps {
  [propName: string]: any
}

function RoleUserList(props: RoleUserListProps) {
  const {
    currentUser,
    primaryColor,
    MAIN_CONFIG,

    listRelateUserLoading,
    roleRelateUser: { relateUserList, relateUserListTotal },

    selectedRowKeys: [rolekeySelected],
    selectedRows: [roleSelected],
    auth,

    listUser,
    modifyModel,
  } = props;

  const [pageInfo, queryPage, setpageInfo, setInitial] = usePageData()
  const filterInfo = useMemo(() => ({ objectId: rolekeySelected }), [rolekeySelected])
  // 当没有选中，或者是假数据的时候禁用查询和按钮
  const disabledControll = useMemo(() => !(roleSelected && !roleSelected.client), [roleSelected])
  const [modalVisible, setmodalVisible] = useState(false)

  const name = useMemo(() => {
    const roleName = get(roleSelected, 'roleName', '')
    return roleName ? ' - ' + roleName : ''
  }, [roleSelected])

  // 实际的请求方法
  const query = useCallback(
    () => {
      listUser({
        pageInfo: queryPage,
        filterInfo
      })
    },
    [queryPage, filterInfo],
  )

  // 验证数据是否有效
  const refreshList = useCallback(() => {
    // 不是模拟添加的假数据，并且userCount不为0
    if (!disabledControll && roleSelected.userCount) query()
  }, [query, roleSelected, disabledControll])

  useEffect(() => {
    refreshList()
    return () => {
      modifyModel({
        relateUserList: [],
        relateUserListTotal: 0,
      })
    }
  }, [refreshList])

  useEffect(() => {
    setInitial()
  }, [rolekeySelected])


  const toggleRelateUserModal = useCallback(() => setmodalVisible(visible => !visible), [])

  const fakeSchema = useMemo(() => {
    scheme[4].render = (isActive: boolean) => isActive ? <span className="successColor"><Icon.Ant type="check-circle" /></span> : ""
    return [...scheme]
  }, [scheme, primaryColor])


  const contentHeight = getTableHeight(MAIN_CONFIG, 20)
  const bodyHeight = useMemo(() => `calc((${contentHeight} - 51px)/2 - 32px - 40px)`, [contentHeight])

  const onPageChange = useCallback((current, pageSize) => setpageInfo(p => ({ ...p, current, pageSize })), [])
  return (
    <>
      <SmartTable
        title={<Title title={tr('角色关联用户') + name} showShortLine showSplitLine />}
        schema={fakeSchema}
        dataSource={relateUserList}
        loading={listRelateUserLoading}
        bodyHeight={bodyHeight}
        emptyDescription={tr('暂无数据，请选择角色')}
        headerRight={
          <>
            <Tooltip title={tr("刷新")} placement="bottom"  >
              <Button size="small" onClick={() => refreshList()} disabled={disabledControll} icon='reload' />
            </Tooltip>
            <Tooltip title={tr("关联用户")} placement="bottom"  >
              <Button size="small" onClick={toggleRelateUserModal} icon='link' disabled={disabledControll} />
            </Tooltip>
          </>
        }
        pagination={{
          ...pageInfo,
          total: relateUserListTotal,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
        }}
      />
      {!disabledControll ? <RelateUserModal visible={modalVisible} onCancel={toggleRelateUserModal} reload={query} /> : null}
    </>
  )
}

export default connect(
  ({ user, roleManage, settings, roleRelateUser, loading }: any) => ({
    currentUser: user.currentUser,
    ...roleManage,
    roleRelateUser,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    listRelateUserLoading: loading.effects['roleRelateUser/listRelateUser']
  }),
  (dispatch: Dispatch<any>) => ({
    listUser: (payload: any) => dispatch({ type: 'roleRelateUser/listRelateUser', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'roleRelateUser/save', payload }),
  })
)(RoleUserList);
