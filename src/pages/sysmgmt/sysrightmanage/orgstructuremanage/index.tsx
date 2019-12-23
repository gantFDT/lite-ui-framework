import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Row, Col, Button, Tooltip, Modal, Dropdown, Menu } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common';
import { SearchForm, SmartTable, GroupSelector } from '@/components/specific'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, getContentHeight } from '@/utils/utils'
import { smartTableListSchema, searchUISchema } from './schema'
import ListModal from './components/ListModal';
import DetailContent from './components/DetailContent';

import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { ModelProps } from './model'
const { confirm } = Modal;
const { Modal: GroupModal } = GroupSelector;

const schema = { keyWork: { title: tr('组织编码或名称') } };

export interface SelectedItemProps {
  id?: string,
  parentOrgId?: string,
  orgName?: string,
  [propsname: string]: any
}

const OrgStructureManage = (props: any) => {
  const pageKey: string = 'orgStructureManage';
  const {
    MAIN_CONFIG, route, currentUser, treeOrganizations,
    excludeDataSource, orgListTotalCount, orgListParams,
    userList, userTotalCount, userParams,
    fetchTreeOrg, fetchByKeyWork, createOrg, removeOrg,
    updateOrg, moveOrg, relateUsers, resetOrgInfo,
    fetchUserList, createUser, updateUser, removeUser, resetUserlist,
    listLoading, createLoading, updateLoading, moveLoading,
    userListLoading, userCreateLoading, userUpdateLoading, userRelateLoading,
  } = props;
  const { id: userId } = currentUser;
  const { primaryColor } = MAIN_CONFIG;
  const [listVisible, setListVisible] = useState(false);
  const [listModalType, setListModalType] = useState(null);
  const [groupSelectorVisible, setGroupSelectorVisible] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedItem, setItem] = useState<SelectedItemProps>({});
  const [searchFormHei, setSearchFormHei] = useState(0);

  //初始化数据
  useEffect(() => {
    fetch();
    return () => resetOrgInfo()
  }, [])

  const fetch = useCallback(() => {
    if (treeOrganizations.length) return;
    fetchTreeOrg();
  }, [treeOrganizations])

  //过滤
  const handleSearch = useCallback(({ keyWork }) => {
    setRowKeys([]);
    keyWork ? fetchByKeyWork({ filterInfo: { keyWork } }) : fetchTreeOrg()
  }, [])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setItem(selectedRows[0]);
    setRowKeys(selectedRowKeys)
  }, [])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    fetchByKeyWork({ ...orgListParams, pageInfo: { beginIndex, pageSize } })
  }, [orgListParams])

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //弹出list弹窗
  const showListModal = useCallback((type) => {
    setListModalType(type);
    setListVisible(true)
  }, [])

  //关闭list弹窗
  const closeListModal = useCallback(() => {
    setListModalType(null);
    setListVisible(false);
  }, [])

  //弹出移动组织窗口
  const changeSelectorModalState = useCallback((visible: boolean = false) => {
    setGroupSelectorVisible(visible)
  }, [])

  //提升为根组件
  const move2root = useCallback(() => {
    moveOrg({ id: selectedRowKeys[0], targetId: 'ROOT' })
  }, [selectedRowKeys])

  //移动组织
  const moveGroup = useCallback((targetRowKeys: string[]) => {
    let cb = () => setGroupSelectorVisible(false)
    moveOrg({ id: selectedRowKeys[0], targetId: targetRowKeys[0] }, cb)
  }, [selectedRowKeys])

  //执行删除
  const handleremove = useCallback(() => {
    confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的组织')} <span style={{ color: primaryColor }}>{selectedItem && selectedItem.orgName || tr('当前选择项')}</span>?</span>,
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk() {
        return new Promise((resolve, reject) => {
          removeOrg({ id: selectedItem.id }, () => {
            setRowKeys([]);
            setItem({});
            resolve();
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedItem])

  //执行提交(新建+修改)
  const onSubmit = useCallback((values) => {
    let cb = (_values: any) => {
      setListVisible(false)
      _values && setItem(_values)
    };
    if (listModalType === 'update') {
      delete values.children;
      delete values.title;
      delete values.value;
      delete values.key;
      updateOrg(values, cb);
    } else {
      let _values = {
        ...values,
        parentOrgId: listModalType === 'create' ? 'ROOT' : selectedItem.id
      }
      createOrg(_values, cb);
    }
  }, [listModalType, selectedItem])

  const keyWork = useMemo(() => {
    return orgListParams.filterInfo.keyWork || ''
  }, [orgListParams])
  const dataSource = useMemo(() => {
    return keyWork ? excludeDataSource : treeOrganizations
  }, [keyWork, excludeDataSource, treeOrganizations])

  const rowSelected = useMemo(() => selectedRowKeys.length > 0, [selectedRowKeys]);
  const height = getContentHeight(MAIN_CONFIG, 40 + 20 - 3 * CARD_BORDER_HEIGHT);
  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + 40 + 20 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, keyWork ? true : false);

  const mapPropsFn = useMemo(() => {
    return { fetchUserList, resetUserlist, createUser, updateUser, removeUser, relateUsers }
  }, [fetchUserList, resetUserlist, createUser, updateUser, removeUser, relateUsers])

  return (
    <Card
      bodyStyle={{ padding: 5 }}
      className="specialCardHeader"
      title={<Title route={route} />}
    >
      <Row gutter={0}>
        <Col span={8} style={{ minWidth: '250px' }}>
          <div style={{ padding: 5 }}>
            <SearchForm
              searchKey={`${pageKey}:${userId}`}
              schema={schema}
              uiSchema={searchUISchema}
              title={<Title title={tr('组织查询')} showShortLine={true} />}
              onSearch={handleSearch}
              onSizeChange={onSearchFormSizeChange}
              headerProps={{ bottomLine: false }}
              showBottomLine={false}
            />
            <SmartTable
              tableKey={`${pageKey}List:${userId}`}
              title={<Title title={tr('组织机构列表')} showShortLine={true} showSplitLine={true} />}
              schema={smartTableListSchema}
              rowKey='id'
              bodyHeight={bodyHeight}
              dataSource={dataSource}
              pageSize={keyWork && orgListParams.pageInfo.pageSize}
              pageIndex={keyWork && orgListParams.pageInfo.beginIndex}
              totalCount={keyWork && orgListTotalCount}
              onPageChange={keyWork && onPageChange}
              headerRight={<>
                {userId == '-1' ? <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item onClick={showListModal.bind(null, 'create')}>{tr('新增根组织')}</Menu.Item>
                      <Menu.Item disabled={!rowSelected} onClick={showListModal.bind(null, 'createSub')}>{tr('新增子组织')}</Menu.Item>
                    </Menu>
                  }
                  placement="bottomCenter"
                >
                  <Button size="small" icon="plus" />
                </Dropdown> : <Tooltip title={tr("新增")}>
                    <Button
                      size="small"
                      icon="plus"
                      className="marginh5"
                      disabled={!rowSelected}
                      onClick={showListModal.bind(null, 'createSub')}
                    />
                  </Tooltip>}
                <Tooltip title={tr("编辑")}>
                  <Button
                    size="small"
                    icon="edit"
                    className="marginh5"
                    disabled={!rowSelected}
                    onClick={showListModal.bind(null, 'update')}
                  />
                </Tooltip>
                <Tooltip title={tr("删除")}>
                  <Button
                    size="small"
                    icon="delete"
                    type="danger"
                    className="marginh5"
                    disabled={!rowSelected}
                    onClick={handleremove}
                  />
                </Tooltip>
                <Dropdown
                  disabled={!rowSelected}
                  overlay={
                    <Menu>
                      <Menu.Item
                        onClick={move2root}
                        disabled={!rowSelected || rowSelected && selectedItem && selectedItem.parentOrgId === 'ROOT'}
                      >{tr('提升为根组织')}</Menu.Item>
                      <Menu.Item
                        onClick={changeSelectorModalState.bind(null, true)}
                      >{tr('移动组织')}</Menu.Item>
                    </Menu>
                  }
                  placement="bottomCenter"
                >
                  <Button size="small" icon='bars' />
                </Dropdown>
              </>}
              loading={listLoading}
              rowSelection={{
                type: 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: handleSelect
              }}
            />
            <ListModal
              values={selectedItem}
              visible={listVisible}
              type={listModalType}
              loading={createLoading || updateLoading}
              onSubmit={onSubmit}
              onCancel={closeListModal}
            />
            <GroupModal
              title={tr('选择上级组织机构')}
              excludeId={selectedRowKeys[0]}
              visible={groupSelectorVisible}
              loading={moveLoading}
              onOk={moveGroup}
              onCancel={changeSelectorModalState}
            />
          </div>
        </Col>
        <Col span={16} style={{ maxWidth: 'calc(100% - 250px)' }}>
          <div style={{ padding: 5, height, overflow: 'auto' }}>
            <DetailContent
              values={selectedItem}
              pageKey={pageKey}
              userId={userId}
              mapPropsFn={mapPropsFn}
              organizationId={selectedRowKeys.length ? selectedRowKeys[0] : null}
              dataSource={userList}
              params={userParams}
              totalCount={userTotalCount}
              // MAIN_CONFIG={MAIN_CONFIG}
              primaryColor={primaryColor}
              loading={userListLoading}
              modalLoading={userCreateLoading || userUpdateLoading}
              relateLoading={userRelateLoading}
            />
          </div>
        </Col>
      </Row>
    </Card>
  )
}
export default connect(
  ({ orgStructureManage, settings, loading, user }: { orgStructureManage: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    currentUser: user.currentUser,
    ...orgStructureManage,
    listLoading: loading.effects['orgStructureManage/fetchTreeOrg'] || loading.effects['orgStructureManage/fetchByKeyWork'],
    createLoading: loading.effects['orgStructureManage/createOrg'],
    updateLoading: loading.effects['orgStructureManage/updateOrg'],
    moveLoading: loading.effects['orgStructureManage/moveOrg'],
    userListLoading: loading.effects['orgStructureManage/fetchUserList'],
    userCreateLoading: loading.effects['orgStructureManage/createUser'],
    userUpdateLoading: loading.effects['orgStructureManage/updateUser'],
    userRelateLoading: loading.effects['orgStructureManage/relateUsers'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetchTreeOrg', 'createOrg', 'removeOrg', 'updateOrg', 'moveOrg', 'resetOrgInfo',
      'fetchUserList', 'fetchByKeyWork', 'createUser', 'updateUser', 'removeUser', 'relateUsers', 'resetUserlist',
    ].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `orgStructureManage/${method}`,
          payload,
          callback,
          final
        })
      }
    })
    return mapProps
  }
)(OrgStructureManage)
