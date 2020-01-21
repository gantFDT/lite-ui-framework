import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Card } from 'gantd';
import { connect } from 'dva';
import { Button, Tooltip, Modal } from 'antd';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific';
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { smartSearchSchema, smartTableSchema, modalSchema } from './schema';
import { SettingsState } from '@/models/setting';
import { UserState } from '@/models/user';
import { ModelProps } from './model';
const { confirm } = Modal;

const Page = (props: any) => {
  const pageKey: string = 'exampleSmartTable';

  const {
    MAIN_CONFIG, route, userId,
    dataSource, params, totalCount,
    fetch, reload, create, remove, update, save,
    listLoading, createLoading, updateLoading, removeLoading,
  } = props;

  const { pageInfo = {} } = params;
  const { pageSize = 50, beginIndex = 0 } = pageInfo;
  const searchRef = useRef(null);

  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);

  const [formContent, setFormContent] = useState({});

  const [searchFormHei, setSearchFormHei] = useState(0);

  const [modalCreateVisible, setModalCreateVisible] = useState(false);
  const [modalUpdateVisible, setModalUpdateVisible] = useState(false);

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
    setModalCreateVisible(true)
  }, [])

  //执行创建
  const handleCreate = useCallback((values) => {
    create(values,()=>{
      setModalCreateVisible(false)
    })
  }, [])

  //弹出更新窗口
  const handleShowUpdate = useCallback(() => {
    let row: object = selectedRows[0];
    setFormContent(row);
    setModalUpdateVisible(true);
  }, [selectedRows])

  //执行删除
  const handleremove = useCallback(() => {
    confirm({
      title: `${tr('提示')}?`,
      content: `${tr('确定删除吗')}?`,
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small',
        loading: removeLoading
      },
      cancelButtonProps: { size: 'small' },
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
  const handleUpdate = useCallback((values) => {
    update(values, () => {
      setRowKeys([])
      setRows([])
      setModalUpdateVisible(false)
    });
  }, [])

  //过滤
  const handleSearch = useCallback((params, isInit) => {
    if (isInit) { return }
    reload(params)
  }, [reload])

  //table schema 预留处理schema
  const getSchema = useMemo(() => {
    let newTableSchema = smartTableSchema;
    return newTableSchema
  }, [smartTableSchema])

  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT)
  return (<Card bodyStyle={{ padding: '0px' }}>
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
    />
    <SmartTable
      tableKey={`${pageKey}:${userId}`}
      rowKey="id"
      schema={getSchema}
      dataSource={dataSource}
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
          />
        </Tooltip>
        <Tooltip title={tr("编辑")}>
          <Button
            size="small"
            icon="edit"
            className="marginh5"
            disabled={!selectedRows.length}
            onClick={handleShowUpdate}
          />
        </Tooltip>
        <Tooltip title={tr("删除")}>
          <Button
            size="small"
            icon="delete"
            type="danger"
            className="marginh5"
            disabled={!selectedRows.length}
            onClick={handleremove}
          />
        </Tooltip>
      </>}
      pageSize={pageSize}
      pageIndex={beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
    />
    <SmartModal
      id={pageKey + '_modal_create'}
      title={tr('创建')}
      itemState={{ width: 760, height: 480 }}
      confirmLoading={createLoading}
      visible={modalCreateVisible}
      schema={modalSchema}
      onSubmit={handleCreate}
      onCancel={() => setModalCreateVisible(false)}
    />
    <SmartModal
      id={pageKey + '_modal_update'}
      title={tr('更新')}
      itemState={{ width: 760, height: 480 }}
      values={formContent}
      confirmLoading={updateLoading}
      visible={modalUpdateVisible}
      schema={modalSchema}
      onSubmit={handleUpdate}
      onCancel={() => setModalUpdateVisible(false)}
    />
  </Card>)
}

export default connect(
  ({ exampleSmartTable, settings, loading, user }: { exampleSmartTable: ModelProps, settings: SettingsState, loading: any, user: UserState }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...exampleSmartTable,
    listLoading: loading.effects['exampleSmartTable/fetch'] || loading.effects['exampleSmartTable/reload'],
    createLoading: loading.effects['exampleSmartTable/create'],
    updateLoading: loading.effects['exampleSmartTable/update'],
    removeLoading: loading.effects['exampleSmartTable/remove'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      let stateName = '';
      if (method == 'fetch') {
        stateName = 'dataSource'//stateName == 数据源参数key值
      }
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `exampleSmartTable/${method}`,
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

