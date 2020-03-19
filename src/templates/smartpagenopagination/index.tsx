import React, { useCallback, useState, useEffect, useMemo } from 'react';
import { Card } from 'gantd';
import { connect } from 'dva';
import { Button, Tooltip, Modal } from 'antd';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific';
import { smartSearchSchema, smartTableSchema, modalSchema } from './schema';
import { SettingsProps } from '@/models/settings';
import { UserProps } from '@/models/user';
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { ModelProps } from './model';
const { confirm } = Modal;

const Page = (props: any) => {
  const pageKey: string = 'pageName';

  const {
    MAIN_CONFIG, route, userId,
    dataSource,
    fetch, reload, create, remove, update, save,
    listLoading, createLoading, updateLoading, removeLoading,
  } = props;

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

  //弹出创建窗口
  const handleShowCreate = useCallback(() => {
    setModalCreateVisible(true)
  }, [])

  //执行创建
  const handleCreate = useCallback((values) => {
    create(values, () => {
      setModalUpdateVisible(false)
    })
  }, [])

  //弹出更新窗口
  const handleShowUpdate = useCallback(() => {
    let row: object = selectedRows[0];
    setFormContent(row);
    setModalUpdateVisible(true)
  }, [selectedRows])

  //执行保存
  const handleUpdate = useCallback((values) => {
    update(values, () => {
      setRowKeys([])
      setRows([])
      setModalUpdateVisible(false)
    });
  }, [])

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

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)

  return (<Card bodyStyle={{ padding: '0px' }}>
    <SmartSearch
      searchPanelId={pageKey}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSizeChange={onSearchFormSizeChange}
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
            className="gant-margin-h-5"
            onClick={handleShowCreate}
          />
        </Tooltip>
        <Tooltip title={tr("编辑")}>
          <Button
            size="small"
            icon="edit"
            className="gant-margin-h-5"
            disabled={!selectedRows.length}
            onClick={handleShowUpdate}
          />
        </Tooltip>
        <Tooltip title={tr("删除")}>
          <Button
            size="small"
            icon="delete"
            type="danger"
            className="gant-margin-h-5"
            disabled={!selectedRows.length}
            onClick={handleremove}
          />
        </Tooltip>
      </>}
    />
    <SmartModal
      id={pageKey + '_modal_normal'}
      title={tr('创建')}
      itemState={{ width: 760, height: 480 }}
      confirmLoading={createLoading}
      visible={modalCreateVisible}
      schema={modalSchema}
      onSubmit={handleCreate}
      onCancel={() => setModalCreateVisible(false)}
    />
    <SmartModal
      id={pageKey + '_modal_normal'}
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
  ({ pageName, settings, loading, user }: { pageName: ModelProps, settings: SettingsProps, loading: any, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...pageName,
    listLoading: loading.effects['pageName/fetch'] || loading.effects['pageName/reload'],
    createLoading: loading.effects['pageName/create'],
    updateLoading: loading.effects['pageName/update'],
    removeLoading: loading.effects['pageName/remove'],
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      let stateName = '';
      if (method == 'fetch') {
        stateName = 'dataSource'
      }
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `pageName/${method}`,
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
