
import React, { useCallback, useState, useMemo } from 'react';
import { connect } from 'dva';
import { Loading, RouteComponentProps, RouterTypes } from '@/models/connect';
import { SettingsState } from '@/models/setting';
import { Card, Button, Tooltip, Popconfirm, Modal, message } from 'antd';
import { Title } from '@/components/common';
import AnnounceModal from './AnnounceModal';
import { SmartTable, SmartSearch } from '@/components/specific';
import { searchSchema, tableSchema, searchUISchema } from './schema';
import { compose } from '@/utils/utils';
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils';
import { namespace } from '@/models/notification';
import { Dispatch, AnyAction, DispatchProps, QueryParamsProps, UserListProps } from './interface';

export interface NotificationProps extends SettingsState, DispatchProps, RouteComponentProps, RouterTypes {
  userId: string,
  userName: string,
  listData: UserListProps[],
  listTotal: number,
  listParams: QueryParamsProps,
  loading: boolean,
  createLoading: boolean,
  editLoading: boolean,
}

const key = 'notificationmanage'
const Notification = (props: NotificationProps) => {
  const {
    MAIN_CONFIG,
    route,
    userId,
    userName,
    listData: dataSource,
    listTotal: total,
    listParams: params,
    loading,
    createLoading,
    editLoading,
    save,
    getListData: query,
    createAnnouncement: create,
    editAnnouncement: edit,
    removeNotices: remove,
    markReaded: read,
  } = props


  const [visible, setvisible] = useState(false);
  const [modalType, setModalType] = useState('create');
  const [searchHeight, setSearchHeight] = useState(0);
  const [selectedKeys, setselectedKeys] = useState([] as Array<string>);
  const [selectedRows, setselectedRows] = useState([] as Array<{ status: string, recipientType: string, id: string }>);

  const isiP2Admin = useMemo(() => userName === 'iP2Admin', [userName])
  const minHeight = getTableHeight(MAIN_CONFIG, searchHeight + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT)

  const onModalOpen = useCallback((type = 'create') => {
    setvisible(true);
    setModalType(type)
  }, [])
  const onCancel = useCallback(() => setvisible(false), [])
  const onSearchFormSizeChange = useCallback(({ height }) => { setSearchHeight(height) }, [])

  const load = useCallback(() => {
    query(params)
  }, [params])

  // 搜索
  const onSearch = useCallback(({ filterInfo, pageInfo }, init) => {
    if (init && dataSource.length) return;
    query({ filterInfo: { ...filterInfo, filterModel: true }, pageInfo })
  }, [dataSource, query])

  // 勾选
  const onSelect = useCallback((keys: Array<string> = [], rows = []) => {
    setselectedKeys(keys);
    setselectedRows(rows);
  }, [])

  // 分页变化
  const onPageChange = useCallback((beginIndex: number, pageSize: number) => {
    const newParams = { ...params, pageInfo: { beginIndex, pageSize } }
    save({ listParams: newParams })
  }, [params])

  // 移除通知
  const onRemove = useCallback(() => {
    const selectedIds = selectedRows.filter(row => row.recipientType !== "all").map(row => row.id)
    if (selectedIds.length < selectedRows.length) {
      message.error(`${tr('系统公告无法删除')},${tr('到期后将自动消息')}`)
      return
    }
    remove({ ids: selectedIds }, () => { onSelect() })
  },
    [selectedRows])

  // 标记已读
  const onRead = useCallback(() => {
    const ids = selectedRows.filter(row => row.status === '01').map(row => row.id)
    if (!ids.length) {
      message.warning(tr('没有选中未读的通知'))
      return
    }
    read({ ids }, load)
  }, [selectedRows, load])

  // 创建和编辑通知
  const onSubmit = useCallback(param => {
    let _validPeriod = param.validPeriod;
    let validPeriod = typeof _validPeriod == 'object' ? _validPeriod.format('YYYY-MM-DD') : _validPeriod;
    let payload = {
      content: param.content,
      validPeriod
    };
    if (modalType == 'create') {
      create(payload, compose(load, onCancel))
    } else {
      edit({
        ...payload,
        id: selectedKeys[0],
      }, compose(load, onCancel))
    }
  }, [modalType, load, selectedKeys])

  const headerRight = useMemo(() => {
    const delBtn = selectedRows.length ? (
      <Popconfirm
        title={tr('确认删除所选通知') + '?'}
        okType='danger'
        onConfirm={onRemove}
      >
        <Button icon='delete' type='danger' size='small' />
      </Popconfirm>
    ) : <Button icon='delete' type='danger' size='small' disabled />
    const iP2AdminBtns = isiP2Admin ? (
      <>
        <Tooltip title={tr('发布公告')}>
          <Button icon="notification" size='small' onClick={onModalOpen.bind(null, 'create')} />
        </Tooltip>
        <Tooltip title={tr('编辑公告')}>
          <Button icon="edit" size='small' disabled={selectedKeys.length != 1} onClick={onModalOpen.bind(null, 'edit')} />
        </Tooltip>
      </>) : null

    // 计算未读条数
    const unRead = selectedRows.filter(row => row.status === '01')
    // 标记按钮
    const markBtn = unRead.length ? (
      <Tooltip title={tr('标记已读')}>
        <Button icon="read" size='small' onClick={onRead} />
      </Tooltip>
    ) : <Button icon="read" size='small' disabled />
    const showMark = isiP2Admin ? null : markBtn;

    return <>
      {iP2AdminBtns}
      {showMark}
      <Tooltip title={tr('删除')}>
        {delBtn}
      </Tooltip>
      <Tooltip title={tr('刷新')}>
        <Button icon="reload" size='small' onClick={() => load()} />
      </Tooltip>
    </>
  }, [load, selectedKeys, selectedRows, onRemove, isiP2Admin])

  const showInfoModal = useCallback(
    (e, record) => {
      e.stopPropagation();
      if (record.status == '01') {
        read({ ids: [record.id] }, load)
      }
      Modal.info({
        title: record.title,
        content: record.content,
        okText: tr('知道了'),
        okButtonProps: { size: 'small' }
      })
    }, [load])

  const computedSchema = useMemo(() => {
    tableSchema[0].render = (text: string, record) => {
      return <span style={{ color: 'var(--link-color)', cursor: 'pointer' }} onClick={(e) => showInfoModal(e, record)}>{text}</span>
    }
    return [...tableSchema]
  }, [tableSchema])

  const values = useMemo(() => {
    if (!isiP2Admin) return {};
    let selectedId = selectedKeys[0];
    if (modalType === 'create' || !selectedId) return {}
    let target = dataSource.find((item: any) => item.id == selectedId)
    return target || {}
  }, [isiP2Admin, modalType, dataSource, selectedKeys])

  const modalTitle = useMemo(() => {
    return modalType == 'create' ? tr('发布公告') : tr('编辑公告');
  }, [modalType])

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <SmartSearch
        searchPanelId={key}
        userId={userId}
        title={<Title route={route} />}
        schema={searchSchema}
        uiSchema={searchUISchema}
        onSearch={onSearch}
        onSizeChange={onSearchFormSizeChange}
        pageInfo={params.pageInfo}
        totalCount={total}
        isCompatibilityMode
        showBottomLine
        headerProps={{
          className: 'specialHeader'
        }}
      />
      <SmartTable
        tableKey={key}
        schema={computedSchema}
        bodyHeight={minHeight}
        dataSource={dataSource}
        loading={loading}
        rowSelection={{
          selectedRowKeys: selectedKeys,
          onChange: onSelect
        }}
        headerRight={headerRight}
        pageSize={params.pageInfo.pageSize}
        pageIndex={params.pageInfo.beginIndex}
        totalCount={total}
        onPageChange={onPageChange}
        pageSizeOptions={['50', '100', '150', '200']}
      />
      <AnnounceModal
        values={values}
        title={modalTitle}
        visible={visible}
        onSubmit={onSubmit}
        onCancel={onCancel}
        loading={createLoading || editLoading}
      />
    </Card>
  )
}

export default connect(
  ({ settings, notification, loading, user }: { settings: SettingsState, notification: any, loading: Loading, user: any }) => ({
    ...settings,
    listData: notification.listData,
    listTotal: notification.listTotal,
    listParams: notification.listParams,
    loading: loading.effects[`${namespace}/getListData`],
    createLoading: loading.effects[`${namespace}/createAnnouncement`],
    editLoading: loading.effects[`${namespace}/editAnnouncement`],
    userId: user.currentUser.id,
    userName: user.currentUser.userLoginName
  }),
  (dispatch: Dispatch<AnyAction>) => {
    const mapProps = {};
    ['getListData', 'createAnnouncement', 'editAnnouncement', 'removeNotices', 'markReaded', 'save'].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `${namespace}/${method}`,
          payload,
          callback,
          final
        })
      }
    })
    return mapProps
  }
)(Notification)
