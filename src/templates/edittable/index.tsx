import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react'
import { Button, Tooltip, Modal } from 'antd';
import { Card, EditStatus, Input, IconSelector } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific'
import { smartSearchSchema, smartTableSchema, modalSchema } from './schema'
import _ from 'lodash'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { ModelProps } from './model'
import { Loading } from '@/models/connect';
import {  ExportExcel } from '@/components/common'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'

const { confirm } = Modal;

const Page = (props: any) => {
  const pageKey: string = 'pageName';

  const {
    MAIN_CONFIG, route, userId,
    data, params, totalCount,
    fetch, reload, create, remove, update, save,
    listLoading, createLoading, updateLoading, removeLoading,
  } = props;

  const { pageInfo = {} } = params
  const { pageSize = 50, beginIndex = 0 } = pageInfo;
  const searchRef = useRef(null);

  const [dataSource, setdataSource] = useState(data)
  useEffect(() => {
    setdataSource(data)
  }, [data])

  const [editable, seteditable] = useState(EditStatus.CANCEL)
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
  const handleShowCreate = useCallback((setDataList) => {
    // let row: object = selectedRows[0];
    // setModalCreateVisible(true)
    // setFormContent({
    //   ...row,
    // })
    setDataList(list => [{ id: Math.random().toString('16').slice(2) }, ...list])
  }, [selectedRows])

  //执行创建
  const handleCreate = useCallback((params) => {
    create(params)
  }, [])

  //弹出更新窗口
  const handleShowUpdate = useCallback((type) => {
    let row: object = selectedRows[0];
    setModalUpdateVisible(true)
    setFormContent({
      ...row,
    })
  }, [selectedRows])

  //执行删除
  const handleremove = useCallback((setDataList) => {
    confirm({
      title: '提示?',
      content: '确定删除吗?',
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

        setDataList(([...list]) => {
          return list.reduce((result, item) => {
            if (item.id !== selectedRowKeys[0]) {
              result.push(item)
            }
            return result
          }, [])
        })
        handleSelect([], [])
        // return new Promise((resolve, reject) => {
        //   remove({
        //     id: selectedRows[0]['id']
        //   }, () => {
        //     setRowKeys([])
        //     setRows([])
        //     resolve()
        //   })
        // }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRowKeys, removeLoading])

  //执行保存
  const handleUpdate = useCallback((params) => {
    update(params, () => {
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

  const onNameChange = useCallback(
    (name, index, key = 'name') => {
      dataSource[index][key] = name;
      setdataSource([...dataSource])
    },
    [dataSource],
  )

  //table schema 预留处理schema
  const getSchema = useMemo(() => {
    // 两种更新的形式
    // onCancel在取消的时候提供原始值
    // 名称
    smartTableSchema[0].editConfig = {
      render: (text, record, index) => {
        return (
          <Input />
        )
      }
    }
    // 英文名
    smartTableSchema[4].editConfig = {
      render: (text, record, index) => {
        return (
          <IconSelector inForm={false} />
        )
      }
    }
    return [...smartTableSchema]
  }, [dataSource])

  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)

  const onSave = useCallback(
    (newData) => {
      setdataSource(newData)
    },
    [],
  )

  const actions = useCallback(
    ([dataList, setDataList]) => {
      return (
        <>
          <Tooltip title={tr("创建")}>
            <Button
              size="small"
              icon="plus"
              className="gant-margin-h-5"
              onClick={() => handleShowCreate(setDataList)}
            />
          </Tooltip>
          <Tooltip title={tr("删除")}>
            <Button
              size="small"
              icon="delete"
              type="danger"
              className="gant-margin-h-5"
              disabled={!selectedRowKeys.length}
              onClick={() => handleremove(setDataList)}
            />
          </Tooltip>
          <Button
            size="small"
            icon="save"
            className="gant-margin-h-5"
            onClick={() => seteditable(EditStatus.SAVE)}
          >{tr('保存')}</Button>
        </>
      )
    },
    [selectedRowKeys],
  )

  return (<Card bodyStyle={{ padding: '0px' }} >
    <SmartSearch
      searchPanelId={pageKey}
      userId={userId}
      title={<Title route={route} className='specialHeader' />}
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
      editable={editable}
      editActions={actions}
      onSave={onSave}
      headerRight={<>
        <ExportExcel
          schema={getSchema}
          dataSource={dataSource}
        >
          <Button
            size="small"
            icon="export"
            className="gant-margin-h-5"
          />
        </ExportExcel>
        {
          editable !== EditStatus.EDIT ? (
            <Button
              size="small"
              className="gant-margin-h-5"
              onClick={() => seteditable(EditStatus.EDIT)}
            >{tr('进入编辑')}</Button>
          ) : (
              <Button
                size="small"
                className="gant-margin-h-5"
                onClick={() => seteditable(EditStatus.CANCEL)}
              >{tr('取消编辑')}</Button>

            )
        }
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
        width: 760,
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
        width: 760,
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
  ({ pageName, settings, loading, user }: { pageName: ModelProps, settings: SettingsProps, loading: Loading, user: UserProps }) => ({
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
        stateName = 'data'
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

