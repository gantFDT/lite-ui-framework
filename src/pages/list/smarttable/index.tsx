import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Card } from 'gantd';
import { connect } from 'dva';
import { Button, Tooltip, Modal, Checkbox, Avatar, Tag, Icon } from 'antd';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable, SmartModal } from '@/components/specific';
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { smartSearchSchema, smartTableSchema, modalSchema, getVisitData, avatars } from './schema';
import { SettingsState } from '@/models/setting';
import { UserState } from '@/models/user';
import { ModelProps } from './model';
import styles from './index.less'

import { CardList } from '@/components/list';
import { MiniArea, Pie, Trend } from '@/components/chart'
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

  const [continueNext, setContinueNext] = useState(false)

  const [activeViewType, setActiveViewType] = useState('table')

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    // debugger
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
    create(values, () => {
      !continueNext && setModalCreateVisible(false)
    })
  }, [continueNext])

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

  const onSimpleSearch = useCallback((params) => {
    console.log('onSimpleSearch params', params)
    // const { searchKeyword, pageInfo } = params;
    // let filters = {
    //   orderList: [{ fieldName: "name", orderType: "ASC" }],
    //   pageInfo,
    //   whereList: [{ fieldName: 'keyword', operator: 'EMPTY', value: searchKeyword }]
    // };
    // setFilterInfo(filters);
    // setPageInfo(pageInfo)
    // fetch(filters)
  }, [])

  //view改变
  const viewButtonGroup = useMemo(() => {
    return <Button.Group className="marginh5">
      <Button
        icon="table"
        size="small"
        disabled={activeViewType === 'table'}
        onClick={() => {
          setActiveViewType('table')
        }}
      />
      <Button
        icon="appstore"
        size="small"
        disabled={activeViewType === 'card'}
        onClick={() => setActiveViewType('card')}
      />
    </Button.Group>
  }, [activeViewType])

  const onLoadMore = useCallback((beginIndex, pageSize) => {
    // setIsLoadMore(true);
    // setPageInfo({ beginIndex, pageSize });
    // fetchMore({ ...filterInfo, pageInfo: { beginIndex, pageSize } });
  }, [pageInfo])

  //更改继续创建
  const handleContinueNextChange = useCallback((e) => {
    const value = e.target.checked
    if (value) {
      setContinueNext(true)
    } else {
      setContinueNext(false)
    }
  }, [])

  const CardItemRender = (value: object, index: number) => {
    return <Card bordered={false} className={styles.card} style={{ background: value['selected'] ? 'rgba(128,128,128,0.01)' : 'var(--component-background)' }}>
      <div className={styles.top}>
        <div className={styles.left}>{<>
          {value['sex'] === 'male' && <Icon style={{ color: '#1890FF', marginLeft: '5px' }} type="man" />}
          {value['sex'] === 'female' && <Icon style={{ color: '#EA4C89', marginLeft: '5px' }} type="woman" />}
          <span style={{marginLeft:5}}>{value['age']}</span>
        </>}</div>
        <div className={styles.right}>{Math.ceil(Math.random() * 10000)}</div>
      </div>
      <div className={styles.middle}>
        <div>
          <Avatar size={60} icon="user" src={avatars[index > 9 ? Math.floor(index % 10) : index]} />
          <div className={styles.name}>{value['name']}</div>
          <div className={styles.goodat}>
        <span>{value['domain']}</span>
          </div>
          <div className={styles.tags}>
            {value['hobby'] && value['hobby'].map((words: string) => <Tag style={{ marginBottom: 3, marginRight: 3 }}>{words}</Tag>)}
          </div>
          <div className={styles.motto}>
            {value['motto']}
          </div>

        </div>
      </div>
      <div className={styles.bottom}>
        <MiniArea color="#36C66E" data={getVisitData()} height={60} showTooltip={true} className={styles.area}/>

      </div>
    </Card>
  }

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
  const cardHeight = getTableHeight(MAIN_CONFIG, searchFormHei, false)
  console.log('selectedRows', selectedRows)
  return (<Card bodyStyle={{ padding: '0px' }}>
    <SmartSearch
      searchPanelId={pageKey}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSimpleSearch={onSimpleSearch}
      onSizeChange={onSearchFormSizeChange}
      pageInfo={pageInfo}
      totalCount={totalCount}
      ref={searchRef}
    />
    {activeViewType === 'table' && <SmartTable
      tableKey={`${pageKey}:${userId}`}
      rowKey="id"
      schema={getSchema}
      dataSource={dataSource}
      loading={listLoading}
      rowSelection={{
        type: 'checkbox',
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
            disabled={!(selectedRows.length === 1)}
            onClick={handleShowUpdate}
          />
        </Tooltip>
        <Tooltip title={tr("删除")}>
          <Button
            size="small"
            icon="delete"
            type="danger"
            className="marginh5"
            disabled={!(selectedRows.length === 1)}
            onClick={handleremove}
          />
        </Tooltip>
        {viewButtonGroup}
      </>}
      pageSize={pageSize}
      pageIndex={beginIndex}
      onPageChange={onPageChange}
      totalCount={totalCount}
    />}
    {activeViewType === 'card' && <CardList
      bodyHeight={cardHeight}
      headerRight={
        <>
          {viewButtonGroup}
        </>
      }
      rowKey="id"
      selectedRowKeys={selectedRowKeys}
      onSelectChange={handleSelect}
      // selectedType="single"
      columnNumber={4}
      columnGutter={10}
      itemRender={CardItemRender}
      dataSource={dataSource}

      waterfallsFlow
      loadType="scroll"
      triggerDistance={50}
      pageSize={pageInfo.pageSize}
      totalCount={totalCount}
      loading={listLoading}
      pageIndex={pageInfo.beginIndex}
      onLoadMore={onLoadMore}
      bodyStyle={{
        background: 'rgba(128,128,128,0.1)'
      }}
    // onPageChange={onPageChange}
    />}
    <SmartModal
      id={pageKey + '_modal_create'}
      title={tr('创建')}
      itemState={{ width: 760, height: 480 }}
      confirmLoading={createLoading}
      visible={modalCreateVisible}
      schema={modalSchema}
      onSubmit={handleCreate}
      onCancel={() => setModalCreateVisible(false)}
      footerRightExtra={<Checkbox checked={continueNext} onChange={handleContinueNextChange}>{tr('继续创建下一个')}</Checkbox>}
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

