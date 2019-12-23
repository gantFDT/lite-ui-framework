import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Button, Tooltip, Modal, message, Popconfirm } from 'antd'
import { EditStatus, SwitchStatus, Icon } from 'gantd'
import { connect } from 'dva'
import { isEqual } from 'lodash'

import { getKey, getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { tr } from '@/components/common/formatmessage'
import { Title } from '@/components/common'
import { searchSchema, tableScheme, formuischema } from './scheme';
import { SmartTable, SmartSearch } from '@/components/specific'

interface RoleListProps {
  [propName: string]: any
}

function RoleList(props: RoleListProps) {
  const {
    userId,
    primaryColor,
    MAIN_CONFIG,

    selectedRowKeys,
    selectedRows,

    params: roleListParams,
    roleList,
    roleListTotal,
    visible,
    listRolesLoading,

    listRole,
    modifyModel,
    createRole,
    checkRoleUsed,
    removeRole,
    updateRole,
    saveEditData,
    username
  } = props;

  const finalSceme = useMemo(() => {
    tableScheme[3].render = (count: number) => <Icon.Ant type="user" style={{ color: count > 0 ? primaryColor : 'transparent' }} />
    tableScheme[4].render = (count: number) => <Icon type="icon-bomzycd" style={{ color: count > 0 ? primaryColor : 'transparent' }} />
    return [...tableScheme];
  }, [tableScheme, primaryColor])


  const [editable, seteditable] = useState(EditStatus.CANCEL)
  const [searchHeight, setsearchHeight] = useState(0)
  const tableHeight = getTableHeight(MAIN_CONFIG, searchHeight + 20 + 40 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT)
  const onSearchFormSizeChange = useCallback(({ width, height }) => setsearchHeight(height), [])

  const pageInfo = useMemo(() => {
    const { pageSize, beginIndex } = roleListParams.pageInfo
    return {
      total: roleListTotal,
      pageSize,
      current: beginIndex / pageSize + 1
    }
  }, [roleListParams.pageInfo, roleListTotal])

  const onSearch = useCallback(
    ({ filterInfo, orderInfo, pageInfo }, isFirst) => {
      onRowSelectionChange([], [])
      listRole({
        filterInfo,
        pageInfo
      }, isFirst)
    },
    [],
  )

  const onRowSelectionChange = useCallback((selectedRowKeys: any, selectedRows: any) => {
    modifyModel({
      selectedRowKeys,
      selectedRows
    })
  }, [])
  useEffect(() => {
    modifyModel({
      selectedRowKeys: [],
      selectedRows: [],
    })
  }, [editable])

  const deleteLine = useCallback(
    (setEditList) => {
      setEditList(([...list]) => {
        if (!selectedRowKeys.length) return list
        const index = (list as Array<{ id: string }>).findIndex(item => item.id === selectedRowKeys[0])
        if (!~index) return list
        list.splice(index, 1)
        return list
      })
    },
    [selectedRowKeys],
  )

  const actions = useCallback(
    ([editList, setEditList], selectedRowKeys) => (
      <>
        <Tooltip title={tr("新建")}>
          <Button size="small" icon="plus" className="marginh5" onClick={() => setEditList((list: Array<object>) => [{ id: getKey(), client: true, status: 'add' }, ...list])} />
        </Tooltip>
        <Tooltip title={tr("删除")}>
          {
            selectedRowKeys.length ? (
              <Button size="small" icon="minus" className="marginh5" onClick={() => deleteLine(setEditList)} />
            ) : (
                <Button size="small" icon="minus" className="marginh5" disabled />
              )
          }

        </Tooltip>
        <Popconfirm title={tr('是否确认保存修改') + '？'} cancelText={tr('取消')} okText={tr('确定')} onConfirm={() => save(editList)} placement='bottom' >
          <Button size='small'>{tr('保存')}</Button>
        </Popconfirm>
      </>
    ),
    [deleteLine],
  )

  // diff数据
  const onSave = useCallback((newList: Array<object>, [addList, delList, modifyList]) => {
    if (isEqual(newList, roleList)) {
      // message.warning(tr('数据未发生变化'))
      return
    }
    // 修改表格数据
    modifyModel({
      roleList: newList
    })
    saveEditData([addList, delList, modifyList])
  }, [roleList])

  const save = useCallback((newList) => {
    let noEmpty = true
    for (let i = 0, len = newList.length; i < len; i++) {
      const item = newList[i]
      if (!item.roleCode) {
        noEmpty = false;
        message.error(`${tr('请填写第')}${i + 1}${tr('行数据中的角色代码')}`)
        break;
      }
      if (!item.roleName) {
        noEmpty = false;
        message.error(`${tr('请填写第')}${i + 1}${tr('行数据中的角色名称')}`)
        break;
      }

    }
    if (!noEmpty) return
    seteditable(EditStatus.SAVE)
  }, [])

  const withEdit = useMemo(() => {
    if (username !== "iP2Admin") return
    return (editable !== EditStatus.EDIT) ? (
      <Button size='small' onClick={() => seteditable(SwitchStatus)}>{tr('进入编辑')}</Button>
    ) : (
        <Button size='small' onClick={() => seteditable(SwitchStatus)}>{tr('取消编辑')}</Button>
      )
  }, [username, editable])

  const refresh = useMemo(() => {
    return (editable !== EditStatus.EDIT) ? (
      <Button size='small' onClick={() => listRole()}>{tr('刷新')}</Button>
    ) : (
        <Button size='small' disabled>{tr('刷新')}</Button>
      )
  }, [editable])

  return (
    <>
      <SmartSearch
        searchPanelId='rolemanage-rolelist'
        userId={userId}
        schema={searchSchema}
        uiSchema={formuischema}
        title={<Title title={tr('过滤条件')} showShortLine />}
        onSearch={onSearch}
        onSizeChange={onSearchFormSizeChange}
        pageInfo={roleListParams.pageInfo}
        totalCount={roleListTotal}
        isCompatibilityMode
        showBottomLine={false}
        headerProps={{
          bottomLine: false
        }}
      />
      <SmartTable
        title={<Title title={tr('角色管理')} showShortLine showSplitLine />}
        tableKey='rolemanage-rolelist'
        schema={finalSceme}
        bodyHeight={tableHeight}
        dataSource={roleList}
        loading={listRolesLoading}
        editable={editable}
        editActions={actions}
        onSave={onSave}
        headerRight={
          [
            withEdit,
            refresh
          ]
        }
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: onRowSelectionChange
        }}
        pagination={pageInfo}
      />
    </>
  )
}

export default connect(
  ({ user, roleManage, settings, loading }: any) => ({
    userId: user.currentUser.id,
    username: user.currentUser.userLoginName,
    ...roleManage,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    listRolesLoading: loading.effects['roleManage/getRoleList']
  }),
  (dispatch: Dispatch<any>) => ({
    listRole: (payload: any, isFirst: boolean) => dispatch({ type: 'roleManage/getRoleList', payload, stateName: isFirst ? 'roleList' : undefined }),
    createRole: (payload: any) => dispatch({ type: 'roleManage/createRole', payload }),
    updateRole: (payload: any) => dispatch({ type: 'roleManage/updateRole', payload }),
    removeRole: (payload: any) => dispatch({ type: 'roleManage/removeRole', payload }),
    checkRoleUsed: (payload: any) => dispatch({ type: 'roleManage/checkRoleUsed', payload }),
    modifyModel: (payload: any) => dispatch({ type: 'roleManage/save', payload }),
    saveEditData: (payload: any) => dispatch({ type: 'roleManage/saveEditData', payload }),
  })
)(RoleList);
