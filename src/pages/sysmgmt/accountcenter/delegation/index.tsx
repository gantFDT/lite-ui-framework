import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { Button, Tooltip, Modal, message, Icon } from 'antd';
import { Card } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific'
import { smartSearchSchema, smartTableSchema, modalSchema } from './schema'
// import _ from 'lodash'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
import { ModelProps } from './model'
import { ColumnAction } from '@/components/list'
import { UserColumn } from '@/components/specific'

const { confirm } = Modal;

const Page = (props: any) => {
  const pageKey: string = 'delegation';

  const {
    config,
    MAIN_CONFIG, route, userId,
    data, params, totalCount,
    fetch, reload, create, remove, update, save,
    listLoading, createLoading, updateLoading, removeLoading,
  } = props;

  const { pageInfo = {} } = params
  const { pageSize = 50, beginIndex = 0 } = pageInfo;
  const searchRef = useRef(null);

  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);

  const [formContent, setFormContent] = useState({});

  const [searchFormHei, setSearchFormHei] = useState(0);

  const [modalCreateVisible, setModalCreateVisible] = useState(false)
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false)

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  //翻页
  const onPageChange = useCallback((beginIndex, pageSize) => {
    save({
      params: {
        ...params,
        pageInfo: { beginIndex, pageSize }
      }
    })
  }, [params])

  //弹出创建窗口
  const handleShowCreate = useCallback(() => {
    // let row: object = selectedRows[0];
    setModalCreateVisible(true)
    setFormContent({
      // ...row,
    })
  }, [selectedRows])

  //弹出更新窗口
  const handleShowUpdate = useCallback(() => {
    let row: object = selectedRows[0];
    if (row['status'] === 'STATUS_ENABLE') {
      message.warning(tr('已生效的代理不能被更改'))
      return
    }
    if (row['status'] === 'STATUS_STOP') {
      message.warning(tr('已关闭的代理不能被更改'))
      return
    }
    setModalUpdateVisible(true)
    setFormContent({
      ...row,
      dateRange: [
        row['startDate'],
        row['endDate']
      ]
    })
  }, [selectedRows])

  //执行创建
  const handleCreate = useCallback((params) => {
    const { dateRange } = params
    const [startDate, endDate] = dateRange
    delete params.dateRange
    create({ ...params, startDate, endDate }, () => {
      setModalCreateVisible(false)
    })
  }, [])

  //执行删除
  const handleRemove = useCallback(() => {
    if (selectedRows[0]['status'] == 'STATUS_STOP') {
      message.warning(tr('用户代理记录已关闭'))
      return
    }
    confirm({
      title: tr('提示?'),
      content: tr('确定移除这条用户代理吗?'),
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small',
        loading: removeLoading
      },
      cancelButtonProps: {
        size: 'small',
      },
      onOk() {
        return new Promise((resolve, reject) => {
          remove({
            id: selectedRows[0]['id']
          }, () => {
            setRowKeys([])
            setRows([])
            resolve()
          })
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows, removeLoading])

  //执行保存
  const handleUpdate = useCallback((params) => {
    params['status'] = ''
    params['endDate'] = params['dateRange'][1]
    params['startDate'] = params['dateRange'][0]
    delete params['dateRange']
    update(params, () => {
      setRowKeys([])
      setRows([])
      setModalUpdateVisible(false)
    });
  }, [])

  //过滤
  const handleSearch = useCallback((params, isInit) => {
    if (isInit) {
      return
    }
    setRowKeys([])
    setRows([])
    reload(params)
  }, [reload])

  //table schema 预留处理schema
  const getSchema = useMemo(() => {
    let smartTableSchemaCopy = _.cloneDeep(smartTableSchema)
    smartTableSchemaCopy.map((item: object) => {
      if (item['fieldName'] === 'delegateId') {
        item['render'] = (value: any) =>
          <ColumnAction
            onEditClick={handleShowUpdate}
            onDeleteClick={handleRemove}
          >
            <UserColumn id={value} />
          </ColumnAction>
      }
    })
    return smartTableSchemaCopy
  }, [smartTableSchema, handleShowUpdate, handleRemove, selectedRows])

  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)

  return (<Card
    bodyStyle={{ padding: '0px' }}
  >
    <SmartSearch
      searchPanelId={pageKey}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSizeChange={onSearchFormSizeChange}
      pageInfo={pageInfo}
      totalCount={totalCount}
      ref={searchRef}
      headerProps={{
        className: 'specialHeader'
      }}
    />
    <SmartTable
      tableKey={`${pageKey}:${userId}`}
      rowKey="id"
      schema={getSchema}
      dataSource={data}
      loading={listLoading}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: handleSelect
      }}
      bodyHeight={bodyHeight}
      headerRight={<>
        <Tooltip title={tr("创建")}>
          <Button
            size="small"
            icon="plus"
            className="marginh5"
            onClick={handleShowCreate}
          >{tr('创建代理')}</Button>
        </Tooltip>
        <Tooltip title={tr("编辑")}>
          <Button
            size="small"
            icon="edit"
            className="marginh5"
            disabled={_.isEmpty(selectedRows)}
            onClick={handleShowUpdate}
          >{tr('编辑代理')}</Button>
        </Tooltip>
        <Tooltip title={tr("关闭代理")}>
          <Button
            size="small"
            icon="delete"
            type='danger'
            className="marginh5"
            disabled={_.isEmpty(selectedRows)}
            onClick={handleRemove}
          >{tr('关闭代理')}</Button>
        </Tooltip>
        <Tooltip title={tr("刷新")}>
          <Button
            size="small"
            icon="reload"
            className="marginh5"
            onClick={() => { reload() }}
          />
        </Tooltip>
      </>}
      ref={searchRef}
      pageSize={pageSize}
      pageIndex={beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
      pageSizeOptions={['10', '20', '50', '100']}
    />
    <SmartModal
      id={pageKey + '_modal_normal'}
      title={tr('创建')}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 520,
        height: 480
      }}
      values={formContent}
      confirmLoading={createLoading}
      visible={modalCreateVisible}
      schema={modalSchema}
      onSubmit={(params) => handleCreate(params)}
      onCancel={() => setModalCreateVisible(false)}
    />

    <SmartModal
      id={pageKey + '_modal_normal'}
      title={tr('更新')}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 520,
        height: 480
      }}
      values={formContent}
      confirmLoading={updateLoading}
      visible={modalUpdateVisible}
      schema={modalSchema}
      onSubmit={(params) => handleUpdate(params)}
      onCancel={() => setModalUpdateVisible(false)}
    />
  </Card>)
}



export default connect(
  ({ delegation, settings, loading, user, config }: { delegation: ModelProps, settings: SettingsProps, loading: any, user: UserProps, config: object }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...delegation,
    config,
    listLoading: loading.effects['delegation/fetch'] || loading.effects['delegation/reload'],
    createLoading: loading.effects['delegation/create'],
    updateLoading: loading.effects['delegation/update'],
    removeLoading: loading.effects['delegation/remove'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      let stateName = '';
      if (method == 'fetch') {
        stateName = 'data'
      }
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `delegation/${method}`,
          payload,
          callback,
          final,
          stateName
        })
      }
    })
    return mapProps
  }
)(Page)

