import React, { useState, useCallback, useEffect, useMemo, useRef } from 'react';
import { connect } from 'dva';
import { Modal, Tooltip, Button, Tabs, Divider, Icon, Badge, Card, Switch } from 'antd';
import { Icon as GantdIcon } from 'gantd';
import moment from 'moment'
import SmartChart from '@/components/specific/smartchart'
import studentSchema from './studentschema';
import { SmartTable, SmartSearch } from '@/components/specific';
import { CardList } from '@/components/list';
import { Title, UpdateTime, Link } from '@/components/common';
import { tableSchema, modalSchema, searchPanelId, gradeObj, classObj } from './schema';
import styles from './index.less'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'
import { addWidget } from '@/components/specific/dashboard/utils'
import { ExportExcel } from '@/components/common'
import { SendToDashboard } from '@/components/specific/dashboard/components'

// 瀑布流随机高度演示
const cardHeights = [];
for (let idx = 0; idx < 100; idx++) {
  cardHeights.push(parseInt((Math.random() * 100 + 220)))
}
const { confirm } = Modal;
const { TabPane } = Tabs;
const TAB_HEIGHT = 36; // tab高度
const format = "hh:mm:ss"
const tabs = {
  excellent: {
    title: tr("期末成绩优秀"),
    badgeColor: '#52c41a',
    condition: [{
      fieldName: "finalExamScore",
      operator: "GT_EQ",
      value: 90
    }]
  },
  good: {
    title: tr("期末成绩良好"),
    badgeColor: '#ccc',
    condition: [{
      fieldName: "finalExamScore",
      operator: "LT",
      value: 90
    },
    {
      fieldName: "finalExamScore",
      operator: "GT_EQ",
      value: 75
    }
    ]
  },
  general: {
    title: tr("期末成绩一般"),
    badgeColor: 'gold',
    condition: [{
      fieldName: "finalExamScore",
      operator: "LT",
      value: 75
    },
    {
      fieldName: "finalExamScore",
      operator: "GT_EQ",
      value: 60
    }]
  },
  fail: {
    title: tr("期末成绩不及格"),
    badgeColor: 'red',
    condition: [{
      fieldName: "finalExamScore",
      operator: "LT",
      value: 60
    }]
  }
}
const listabs = [
  {
    title: "list",
    key: "list"
  },
  {
    title: "chart",
    key: "chart"
  },
  {
    title: "card",
    key: "card"
  },
]
const playUpdate = null;
function DemoUserManage(props) {
  const {
    userList,
    userListTotal,
    route,
    primaryColor,
    MAIN_CONFIG,
    userId,
    user,
    dispatch,
    fetch,
    create,
    update,
    remove,
    listLoading,
    createLoading,
    removeLoading,
    fetchCount,
    count,
    chartData,
    fetchChart,
    fetchMore,
    chartParams,
    menu,
  } = props;
  const [selectedKey, setSelectedKey] = useState(null);
  const [updateTime, setUpdateTime] = useState(moment().format(format))
  const [contentSelectedKey, setContentSelectedKey] = useState('card')
  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [formContent, setFormContent] = useState({});
  const [searchFormHei, setSearchFormHei] = useState(0);
  const [filterInfo, setFilterInfo] = useState([]);
  const [smartTalbeViewConfig, setSmartTalbeViewConfig] = useState({});
  const [pageInfo, setPageInfo] = useState({ pageSize: 10, beginIndex: 0 });
  const [searchView, setSearchView] = useState({})
  const [filterParams, setFilterParams] = useState([])

  const searchRef = useRef(null);
  const query = useCallback((params, init, filterParams) => {
    setFilterInfo(params);
    setPageInfo(params.pageInfo)
    fetch(params)
    const { whereList } = params
    setSelectedKey(null);
    if (!init && contentSelectedKey === "chart") {
      queryChart({ ...chartParams, filterInfo: whereList })
    }
    setFilterParams(filterParams);
  }, [setFilterInfo, setPageInfo, chartParams, contentSelectedKey]);
  const [chartSchema, setChartSchema] = useState([{
    viewId: "systemBar",
    name: tr("柱形图"),
    version: "2019.9.12 12:22:22",
    type: "bar",
    viewType: "system",
    dataConfig: {
      group: "name",
      summary: [
        {
          name: "finalExamScore",
          formula: "SUM"
        },
        { name: "age", formula: "SUM" }
      ]
    }
  }])
  const queryChart = useCallback((params) => {
    fetchChart(params)
  }, [fetchChart])
  const onChartChange = useCallback((params) => {
    queryChart({ ...chartParams, ...params })
  }, [queryChart, chartParams])
  const onRefresh = useCallback(() => {
    queryChart(chartParams)
  }, [queryChart, chartParams])
  const onPageChange = useCallback((beginIndex, pageSize) => {
    setPageInfo({ beginIndex, pageSize });
    fetch({ pageInfo: { beginIndex, pageSize } });
    setSelectedKey(null);
  }, [])

  const onLoadMore = useCallback((beginIndex, pageSize) => {
    setPageInfo({ beginIndex, pageSize });
    fetchMore({ pageInfo: { beginIndex, pageSize } });
  }, [pageInfo])

  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  const handleCreate = useCallback(() => {
    setVisible(true)
  })

  // const handleEdit = useCallback(() => {
  //     setFormContent(userList.find(i => i.id == selectedRowKeys[0]))
  //     setVisible(true);
  // }, [selectedRowKeys, userList])

  const closeModal = useCallback(() => {
    setFormContent({});
    setVisible(false);
  }, [])

  const handleRemove = useCallback(async () => {
    const _confirm = confirm({
      title: tr('请确认'),
      confirmLoading: removeLoading,
      content: <span>{tr('是否删除选择的学生')}<span style={{ color: primaryColor }}>{selectedRows[0].name}</span>?</span>,
      onOk: () => {
        return new Promise((res, rej) => {
          const cb = () => {
            _confirm.destroy();
            setRowKeys([]);
            setRows([]);
          }
          remove(selectedRowKeys, cb)
        }).catch((e) => console.warn(e));
      }
    });
  }, [selectedRowKeys, selectedRows, removeLoading])

  const onSubmit = useCallback((values) => {
    _.isEmpty(formContent) ? create({ values, filterInfo }, closeModal) : update(values, closeModal);
  }, [filterInfo, formContent, selectedRowKeys])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + TAB_HEIGHT)
  const cardHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TAB_HEIGHT, false)
  const chartHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TAB_HEIGHT - 40, false)
  const tabOnchange = useCallback(async (key) => {
    const { condition } = tabs[key];
    setSelectedKey(key)
    const params = { ...filterInfo, whereList: [...condition] }
    await fetch(params);
    searchRef.current.reset();
  }, [filterInfo])

  const handlefetchCount = useCallback(() => {
    Object.keys(tabs).map(name => {
      fetchCount({ name, params: tabs[name].condition })
    })
    setUpdateTime(moment().format(format))
  }, [setUpdateTime])

  const onSearchViewChange = useCallback((searchView) => {
    setSearchView(searchView)
  }, [])

  useEffect(() => {
    handlefetchCount();
  }, [])

  const CardItemRender = (V, I) => {
    return <Card bordered={false} bodyStyle={{ height: cardHeights[I], background: V.selected ? 'rgba(0, 0, 0, .1)' : undefined }}>
      <div>
        <span style={{ fontSize: 16, fontWeight: 'bolder', marginRight: 10 }}>{V.name}</span>
        <span className={styles.genderBox} style={{ backgroundColor: V.gender === 'MALE' ? '#85a5ff' : '#ff85c0' }}>
          <Icon type={V.gender === 'MALE' ? 'man' : 'woman'} className={styles.gender} />
          {V.age && <span className={styles.age}>{V.age}{tr('岁')}</span>}
        </span>
        <span className={styles.score} style={{ color: V.finalExamScore >= 85 ? '#52c41a' : V.finalExamScore >= 60 ? '#faad14' : '#f5222d' }}>{V.finalExamScore}</span>
      </div>
      <div className={styles.grade}>
        <span style={{ marginRight: 5 }}>{gradeObj[V.grade]}</span>
        <span>{classObj[V.classNumber]}</span>
      </div>
      {
        V.address && (
          <div className={styles.position}>
            <Icon type="environment" style={{ marginRight: 5, color: primaryColor }} />
            <span>{V.address}</span>
          </div>
        )
      }
      <Tooltip title={V.teacherComment}>
        <div className="text-overflow-hidden">
          {V.teacherComment}
        </div>
      </Tooltip>
      <Link to={`usermanagement/detail/${V.id}`}><GantdIcon className={styles.toDetail} type="icon-bomzycd" /></Link>
    </Card>
  }

  return <Card bodyStyle={{ padding: 0 }}>
    <SmartSearch
      searchPanelId={searchPanelId}
      userId={userId || -1}
      title={<Title route={route} />}
      schema={studentSchema}
      onSearch={query}
      onSimpleSearch={(params) => console.log('onSimpleSearch params', params)}
      onSizeChange={onSearchFormSizeChange}
      pageInfo={pageInfo}
      totalCount={userListTotal}
      ref={searchRef}
      extra={<Button
        size='small'
        type='warning'
        style={{ paddingLeft: 40, paddingRight: 40 }}
        className="btn-solid marginh5"
      >{tr('新建按钮动态插槽')}
      </Button>}
      headerProps={{
        className: 'specialHeader'
      }}
      onViewChange={onSearchViewChange}

    />
    <div className={styles.tab}>
      <Tabs
        onChange={tabOnchange}
        animated={false}
        tabBarExtraContent={<UpdateTime time={updateTime} refresh={handlefetchCount} />}
        activeKey={selectedKey}
        className={styles.tabs}
      >
        {
          Object.keys(tabs).map(key => {
            const itemTab = tabs[key];
            return <TabPane
              key={key}
              tab={
                <span className={styles.tabcontent}>
                  {itemTab.title}
                  <Badge count={count[key]} className={styles.badge} style={{ backgroundColor: itemTab.badgeColor }} />
                </span>}
            />
          })
        }
      </Tabs>
    </div>
    <Tabs activeKey={contentSelectedKey} className={styles.listTabs}>
      {
        listabs.map(item => <TabPane
          key={item.key}
          tab={null}
        >
          {item.key == "list" ? <SmartTable
            tableKey={`demoUserManage:${userId}`}
            rowKey="id"
            schema={tableSchema}
            dataSource={userList}
            loading={listLoading}
            rowSelection={{
              type: 'radio',
              selectedRowKeys,
              onChange: handlerSelect
            }}
            ref={searchRef}
            pageSize={pageInfo.pageSize}
            pageIndex={pageInfo.beginIndex}
            onPageChange={onPageChange}
            totalCount={userListTotal}
            pageSizeOptions={['10', '20', '50', '100']}
            bodyHeight={bodyHeight}
            orderList={filterInfo.orderList || []}
            hasExport={user.permission && user.permission.includes('演示-学生信息-导出花名册')}
            onViewChange={(config) => setSmartTalbeViewConfig(config)}
            headerRight={<>
              <Tooltip title={tr('图表')}>
                <Button
                  size="small"
                  icon="bar-chart"
                  className="marginh5"
                  size='small'
                  onClick={() => setContentSelectedKey('chart')}
                />
              </Tooltip>
              <Tooltip title={tr('卡片')}>
                <Button
                  icon="appstore"
                  size="small"
                  className="marginh5"
                  size='small'
                  onClick={() => setContentSelectedKey('card')}
                />
              </Tooltip>
              <SendToDashboard
                type='SmartTable'
                name='学生表格'
                configParams={{
                  domain: 'student',
                  searchMode: 'advanced',
                  queryUrl: '/studentHibernate/smartQuery',
                  searchPanelId,
                  searchViewConfig: searchView,
                  initParams: filterParams,
                  searchSchemaPath: 'sysmgmt/demo/usermanage/studentschema',
                  filterInfo,
                  columnsPath: 'sysmgmt/demo/usermanage/schema',
                  tableViewConfig: smartTalbeViewConfig,
                }}
              />
              {
                user.permission.includes('演示-学生信息-创建学生信息') && (
                  <Tooltip title={tr("新建")}>
                    <Button
                      size="small"
                      icon="plus"
                      size='small'
                      className="marginh5"
                      onClick={handleCreate}
                    />
                  </Tooltip>
                )
              }
              {
                // user.permission.includes('演示-学生信息-更新学生信息') && (
                //   <Tooltip title={tr("编辑")}>
                //     <Button
                //       icon="edit"
                //       className="marginh5"
                //       onClick={handleEdit}
                //       disabled={selectedRowKeys.length != 1}
                //     />
                //   </Tooltip>
                // )
              }
              {
                user.permission.includes('演示-学生信息-删除学生信息') && (
                  <Tooltip title={tr("删除")}>
                    <Button
                      size="small"
                      icon="delete"
                      size='small'
                      type='danger'
                      className="marginh5"
                      onClick={handleRemove}
                      disabled={!selectedRowKeys.length}
                    />
                  </Tooltip>
                )
              }
            </>}
          /> : item.key == "chart" ? <SmartChart
            dataSource={chartData}
            smartChartId="test-usedemo"
            userId={userId || -1}
            columns={tableSchema}
            onChange={(newSchema, cb) => {
              setChartSchema(newSchema);
              cb();
            }}
            onRefresh={onRefresh}
            onDataChange={onChartChange}
            height={chartHeight}
            headerRight={(chartView) => <>
              <Tooltip title={tr('表格')}>
                <Button
                  icon="table"
                  size="small"
                  className="marginh5"
                  size='small'
                  onClick={() => setContentSelectedKey('list')}
                />
              </Tooltip>
              <Tooltip title={tr('卡片')}>
                <Button
                  icon="appstore"
                  size="small"
                  className="marginh5"
                  size='small'
                  onClick={() => setContentSelectedKey('card')}
                />
              </Tooltip>
              <SendToDashboard
                type='SmartChart'
                name={chartView.name}
                configParams={{
                  domain: 'student',
                  searchMode: 'advanced',
                  queryUrl: '/studentHibernate/smartChart',
                  searchPanelId,
                  searchViewConfig: searchView,
                  initParams: filterParams,
                  searchSchemaPath: 'sysmgmt/demo/usermanage/studentschema',
                  queryData: chartParams,
                  columnsPath: 'sysmgmt/demo/usermanage/schema',
                  chartViewConfig: chartView,

                }}
              />
            </>}
            schema={chartSchema}
          /> : <CardList
                bodyHeight={cardHeight}
                headerRight={
                  <>
                    <Tooltip title={tr('表格')}>
                      <Button
                        icon="table"
                        size="small"
                        className="marginh5"
                        size='small'
                        onClick={() => setContentSelectedKey('list')}
                      />
                    </Tooltip>
                    <Tooltip title={tr('图表')}>
                      <Button
                        size="small"
                        icon="bar-chart"
                        className="marginh5"
                        size='small'
                        onClick={() => setContentSelectedKey('chart')}
                      />
                    </Tooltip>
                  </>
                }
                rowKey="id"
                selectedRowKeys={selectedRowKeys}
                onSelectChange={handlerSelect}
                // selectedType="single"
                columnNumber={4}
                columnGutter={10}
                itemRender={CardItemRender}
                dataSource={userList}

                waterfallsFlow
                loadType="scroll"
                triggerDistance={50}
                pageSize={pageInfo.pageSize}
                totalCount={userListTotal}
                loading={listLoading}
                pageIndex={pageInfo.beginIndex}
                onLoadMore={onLoadMore}
                bodyStyle={{
                  background: 'rgba(128,128,128,0.1)'
                }}

              // onPageChange={onPageChange}
              // pageSizeOptions={['10', '20', '50', '100']}
              />}
        </TabPane>)
      }
    </Tabs>
  </Card>
}

const mapDispatchToProps = dispatch => {
  const mapProps = { dispatch };
  ['fetch', 'create', 'update', 'remove', 'fetchCount', 'fetchChart', 'fetchMore'].forEach(method => {
    mapProps[method] = (payload, cb, final) => {
      dispatch({
        type: `demoUserManage/${method}`,
        payload,
        cb,
        final
      })
    }
  })
  return mapProps
}

export default connect(
  ({ settings, demoUserManage, user, loading, menu }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    userId: user.currentUser.id,
    user,
    menu,
    ...demoUserManage,
    listLoading: loading.effects['demoUserManage/fetch'] || loading.effects['demoUserManage/fetchMore'],
    removeLoading: loading.effects['demoUserManage/remove'],
    createLoading: loading.effects['demoUserManage/create'] || loading.effects['demoUserManage/update']
  }), mapDispatchToProps)(DemoUserManage)
