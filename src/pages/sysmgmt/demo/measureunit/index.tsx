import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Button, Tooltip, Dropdown, Menu, message, Modal } from 'antd';
import { Card, EditStatus, SwitchStatus, Input } from 'gantd'
import { connect } from 'dva';
import { Title, IconHouse } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific'
import { smartSearchSchema, smartTableSchema, modalSchemaOperation, modalSchemaNormal } from './schema'
import { generateTree, getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import _ from 'lodash'
import { SettingsProps } from '@/models/settings'

const { confirm } = Modal;

const Page = (props: any) => {
  const pageName: string = 'measureunit';

  const {
    MAIN_CONFIG, route, userId,
    data, flatData,
    fetch, reload, create, remove, update, save,
    listLoading, createLoading, updateLoading, removeLoading,
    modalNormalVisible, modalOperationVisible
  } = props;


  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [formContent, setFormContent] = useState({});
  const [editing, setEditing] = useState(EditStatus.CANCEL);
  const [stateData, setStateData] = useState(data)
  const [stateFaltData, setStateFaltData] = useState(flatData)
  const [searchFormHei, setSearchFormHei] = useState(0);

  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //执行创建
  const handleCreate = useCallback((type, params) => {
    let newParams = {}
    if (type == 'normal') {
      newParams = {
        baseUnit: params.id,
        baseUnitName: params.baseUnitName,
        coefficient: params.coefficient,
        domain: params.domain,
        icon: params.icon,
        id: "",
        name: params.name,
        nameEn: params.nameEn,
        symbol: params.symbol
      }
    }
    if (type == 'operation') {
      newParams = {
        domain: params.domain,
        icon: params.icon,
        id: "",
        name: params.name,
        nameEn: params.nameEn,
        symbol: params.symbol
      }
    }
    create(newParams)
  }, [])

  //关闭窗口
  const handleCloseModal = useCallback(() => {
    save({
      modalNormalVisible: false,
      modalOperationVisible: false
    })
  }, [save])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  //执行删除
  const handleremove = useCallback(() => {
    if (selectedRows && !selectedRows[0]['parentId']) {
      message.info(tr('请选中单位记录'));
      return
    }
    if (selectedRows && selectedRows[0]['isSystemUnit']) {
      message.info(tr('系统单位不能删除'));
      return
    }
    confirm({
      title: tr('提示?'),
      content: tr('确定删除这个单位吗?'),
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        loading: removeLoading,
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      onOk() {
        return new Promise((resolve, reject) => {
          remove({
            id: selectedRows[0]['id']
          })
          setRowKeys([])
          setRows([])
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows, removeLoading])

  //过滤
  const handleSearch = useCallback((params) => {
    reload(params)
  }, [reload])

  //弹出创建窗口
  const handleShowCreate = useCallback((type) => {
    let row: object = selectedRows[0];
    if (selectedRows && !row['parentId']) {
      message.info(tr('请选中单位记录'));
      return
    }
    if (type == 'normal') {
      save({
        modalNormalVisible: true
      })

      setFormContent({
        ...row,
        icon: '',
        name: '',
        nameEn: '',
        symbol: '',
        coefficient: '',
        baseUnitName: row['name']
      })
    }
    if (type == 'operation') {
      save({
        modalOperationVisible: true
      })
      setFormContent({
        ...row,
        icon: '',
        name: '',
        nameEn: '',
        symbol: '',
        coefficient: '',
        baseUnitName: row['name']
      })
    }

  }, [selectedRows])


  //打平数据
  const handleFlatData = (tree: object[]) => {
    let newData = tree;
    function duplicate(n: any) {
      let children = n.children;
      return [n, ...children];
    }
    return _.flatMapDeep(newData, duplicate);
  }

  //单元格编辑
  const cellChange = useCallback((text, record, index, type, stateFaltDataParams) => {
    //更新flatData
    let newData = stateFaltDataParams;
    let row = {}
    newData.map((item: object) => {
      if (item['id'] == record.id) {
        row = item
      }
    })
    newData.map((flatDataItem: object, itemIndex: number, arr: any) => {
      if (flatDataItem['id'] == record.id) {
        let newRecord = {
          ...row,
          [type]: text
        }
        delete newRecord['children']
        arr.splice(itemIndex, 1, newRecord)
      }
    })
    let newDataTemp = generateTree(newData);
    if (_.isEmpty(newDataTemp)) { newDataTemp = newData }
    setStateData(newDataTemp)
    return handleFlatData(newDataTemp)
  }, [])



  //table schema
  const getSchema = useMemo(() => {
    return smartTableSchema.map(item => {
      switch (item.fieldName) {
        case 'name':
          item['editConfig'] = {
            render: (value: string, record: object, index: number) => {
              return <Input type='input' />
            },
          };
          break;

        case 'nameEn':
          item['editConfig'] = {
            render: (value: string, record: object, index: number) => {
              return <Input type='input' />
            },
          };
          break;
        case 'icon':
          item['editConfig'] = {
            render: (value: string, record: object, index: number) => {
              return <IconHouse />
            },
          };
          break;

        default:
          break;
      }
      return item
    })
  }, [cellChange, stateFaltData])

  //执行保存
  const handleSave = useCallback(() => {
    // const newData = _.differenceWith(stateFaltData, flatData, _.isEqual);
    // update(newData);
    setEditing(EditStatus.SAVE)
    setRowKeys([])
    setRows([])
  }, [stateFaltData, flatData])

  const getDifference = useCallback(
    (current, old) => {
      const result: Array<object> = []
      for (let i = 0, len = current.length; i < len; i++) {
        const { children = [], ...currentItem } = current[i]
        const { children: oldChildren = [], ...oldItem } = old[i]
        if (!_.isEqual(currentItem, oldItem)) {
          result.push(currentItem)
        }
        if (children.length && oldChildren.length && !_.isEqual(children, oldChildren)) {
          const diff = getDifference(children, oldChildren)
          result.push.apply(result, diff)
        }
      }
      return result
    },
    [],
  )

  const onSave = useCallback(
    (newStateData) => {
      console.time('查找diff')
      const diff = getDifference(newStateData, stateData)
      console.timeEnd('查找diff')
      setStateData(newStateData)
      update(diff)
    },
    [stateData],
  )


  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  //同步model数据到state
  useEffect(() => {
    setStateData(data);
    setStateFaltData(flatData)
  }, [data, flatData])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)
  return (<Card
    loading={false}
    bodyStyle={{ padding: '0px' }}
  >
    <SmartSearch
      searchPanelId={pageName}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSizeChange={onSearchFormSizeChange}
      headerProps={{
        className: 'specialHeader'
      }}
    />
    <SmartTable
      tableKey={`${pageName}:${userId}`}
      rowKey="id"
      schema={getSchema}
      dataSource={stateData}
      loading={listLoading}
      rowSelection={{
        type: 'radio',
        selectedRowKeys,
        onChange: handleSelect
      }}
      editable={editing}
      bodyHeight={bodyHeight}
      onSave={onSave}
      headerRight={<>
        <Button
          icon={editing === EditStatus.EDIT ? "roolback" : "edit"}
          className="marginh5"
          size="small"
          onClick={() => { if (editing === EditStatus.CANCEL) { message.info(tr('请单击单元格进行编辑')) } setEditing(SwitchStatus) }}
        >
          {editing === EditStatus.EDIT ? tr("结束") : tr("进入")}{tr('编辑')}
        </Button>
        {editing === EditStatus.EDIT && <Button
          icon="save"
          className="marginh5"
          size="small"
          type="primary"
          onClick={handleSave}
          loading={updateLoading}
        >
          {tr('保存')}
        </Button>}

        {editing != EditStatus.EDIT && <>
          <Dropdown
            disabled={_.isEmpty(selectedRows)}
            overlay={
              <Menu>
                <Menu.Item onClick={() => handleShowCreate('normal')}>{tr('创建普通单位')}</Menu.Item>
                <Menu.Item onClick={() => handleShowCreate('operation')}>{tr('创建运算单位')}</Menu.Item>
              </Menu>
            }
            placement="bottomCenter"
          >
            <Button
              size="small"
              icon="plus"
              className="marginh5"
            />
          </Dropdown>

          <Tooltip title={tr("删除")}>
            <Button
              size="small"
              icon="delete"
              type="danger"
              className="marginh5"
              disabled={_.isEmpty(selectedRows)}
              onClick={handleremove}
            />
          </Tooltip>
        </>
        }
      </>}
    />
    <SmartModal
      id={pageName + '_modal_normal'}
      title={tr('创建普通单位')}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 760,
        height: 480
      }}
      values={formContent}
      confirmLoading={createLoading}
      visible={modalNormalVisible}
      schema={modalSchemaNormal}
      onSubmit={(params) => handleCreate('normal', params)}
      onCancel={handleCloseModal}
    />
    <SmartModal
      id={pageName + '_modal_operation'}
      title={tr('创建运算单位')}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 760,
        height: 480
      }}
      values={formContent}
      confirmLoading={createLoading}
      visible={modalOperationVisible}
      schema={modalSchemaOperation}
      onSubmit={(params) => handleCreate('operation', params)}
      onCancel={handleCloseModal}
    />
  </Card>)
}

const mapDispatchToProps = (dispatch: any) => {
  const mapProps = {};
  ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
    let stateName = '';
    if (method == 'fetch') {
      stateName = 'data'
    }
    mapProps[method] = (data: object) => {
      dispatch({
        type: `sysmgmtDemoMeasureunit/${method}`,
        payload: data,
        stateName
      })
    }
  })
  return mapProps
}



export default connect(
  ({ sysmgmtDemoMeasureunit, settings, loading, user }: { sysmgmtDemoMeasureunit: object, settings: SettingsProps, loading: any, user: any }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...sysmgmtDemoMeasureunit,
    listLoading: loading.effects['sysmgmtDemoMeasureunit/fetch'] || loading.effects['sysmgmtDemoMeasureunit/reload'],
    createLoading: loading.effects['sysmgmtDemoMeasureunit/create'],
    updateLoading: loading.effects['sysmgmtDemoMeasureunit/update'],
    removeLoading: loading.effects['sysmgmtDemoMeasureunit/remove'],
  }),
  mapDispatchToProps
)(Page)

