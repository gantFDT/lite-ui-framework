import React, { useState, useCallback, useEffect } from 'react'
import { Card } from 'gantd'
import { Button, Icon, Tooltip, Dropdown, Menu, Row, Col, Popconfirm, Spin, Drawer } from 'antd'
import { connect } from 'dva'
import { ModelProps } from './model'
import { Title } from '@/components/common'
import { SmartModal, Dashboard } from '@/components/specific'
import { getTableHeight, generateUuid, confirmUtil } from '@/utils/utils'
import { modalCreateSchema, modalEditSchema, uiSchema, modalCopySchema } from './schema'
import MiniDashboard from '@/components/specific/dashboard/components/minidashboard'
import classnames from 'classnames'
import styles from './index.less'
import Repository from './components/repository'
import { spanCalculate } from '@/utils/utils';

const Page = (props: any) => {
  const {
    route, MAIN_CONFIG,
    fetch, create, update, remove, copy,
    data, repositoryData,
    fetchLoading, createLoading, removeLoading, updateLoading,
    global, currentUser
  } = props
  const [selectedRows, setSelectedRows] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  const [createVisible, setCreateVisible] = useState(false)
  const [copyVisible, setCopyVisible] = useState(false)
  const [editVisible, setEditVisible] = useState(false)
  const [designVisible, setDesignVisible] = useState(false)
  const [drawerVisible, setDrawerVisible] = useState(false)
  const [repositoryVisible, setRepositoryVisible] = useState(false)
  const [nowType, setNowType] = useState('user')
  const [span, setSpan] = useState(3)

  const [formContent, setFormContent] = useState({})
  const tableHeight = getTableHeight(MAIN_CONFIG, -20);

  const handleCreate = useCallback(
    (params) => {
      create({
        row: {
          ...params,
          id: generateUuid()
        },
        type: nowType
      }, () => {
        setCreateVisible(false)
        setSelectedRows([])
        setSelectedRowKeys([])
        setFormContent({})
      })
    },
    [selectedRows, nowType],
  )

  const handleEdit = useCallback(
    (params) => {
      update({
        row: params,
        type: nowType
      }, () => {
        setEditVisible(false)
        setSelectedRows([])
        setSelectedRowKeys([])
        setFormContent({})
      })
    },
    [update, nowType],
  )



  const handleCreateClick = useCallback(
    () => {
      setCreateVisible(true)
    },
    [selectedRows]
  )

  const handleEditClick = useCallback(
    (row) => {
      setEditVisible(true)
      setFormContent(row)
    },
    [selectedRows]
  )

  const handlerRemove = useCallback(
    (selectedRows) => {
      remove({
        type: nowType,
        row: selectedRows[0],
        id: selectedRows[0]['id']
      })
    },
    [remove, selectedRows, nowType]
  )

  const handleDesignClick = useCallback(
    () => {
      setDesignVisible(true)
    },
    [selectedRows],
  )

  // 弹出删除确认框
  const showRemoveModal = useCallback(() => {
    confirmUtil({
      content: tr('确定删除这个仪表板吗') + tr('删除操作不可恢复'),
      onOk: () => {
        handlerRemove(selectedRows)
        setSelectedRows([])
        setSelectedRowKeys([])
        setFormContent({})
      },
      okLoading: removeLoading
    })
  }, [selectedRows, handlerRemove])

  const showRepository = useCallback(() => {
    setNowType('company')
    setRepositoryVisible(true);
    fetch({ type: 'company' });
  }, [])


  useEffect(() => {
    if (_.isEmpty(data)) {
      fetch({
        type: nowType
      })
    }
  }, [])

  //打开复制弹窗
  const showCopyModal = useCallback((selectedRows) => {

    setNowType('user')
    setCopyVisible(true)
    setFormContent({
      name: selectedRows[0]['name'] + '_' + tr('副本')
    })
  }, [selectedRows])

  //执行复制
  const handleCopy = useCallback((params) => {
    const id = generateUuid()
    let currentLayoutCopy = selectedRows[0]['currentLayoutCopy'];
    _.isArray(currentLayoutCopy) && !_.isEmpty(currentLayoutCopy) ? currentLayoutCopy.map((item: object) => {
      item['i'] = item['i'].split('-')[0] + "-" + generateUuid()
    }) : currentLayoutCopy = []
    copy({
      row: {
        ...params,
        id
      },
      id,
      type: nowType,
      currentLayout: currentLayoutCopy
    }, () => {
      setCopyVisible(false)
      setDrawerVisible(false)
      setSelectedRows([])
      setSelectedRowKeys([])
      setFormContent({})
    })
  }, [selectedRows, nowType])

  const addMenu = (
    <Menu>
      <Menu.Item onClick={handleCreateClick} >
        {tr('新增')}
      </Menu.Item>
      <Menu.Item disabled={_.isEmpty(selectedRows)} onClick={showCopyModal}>
        {tr('从选中复制')}
      </Menu.Item>
      <Menu.Item onClick={() => { setDrawerVisible(true); setNowType('company'); fetch({ type: 'company' }); }}>
        {tr('从公共仓库复制')}
      </Menu.Item>
    </Menu>
  );

  // const span = 24 / spanCalculate(window.innerWidth) -1
  const updateSpan = useCallback(() => {
    setSpan(24 / spanCalculate(window.innerWidth) - 1)
  }, [window.innerWidth])

  useEffect(() => {
    updateSpan()
    window.addEventListener('resize', updateSpan)
    return () => {
      window.removeEventListener('resize', updateSpan)
    };
  }, [])

  return (<>
    <Card
      id="dashboardmgmt"
      className='specialCardHeader'
      bodyStyle={{ padding: '5px', background: 'rgba(0,0,0,0.05)' }}
      title={<><Title route={route} /></>}
      extra={<>
        {currentUser['id'] === '-1' && <Button className="marginh5" size="small" icon="inbox" onClick={() => { showRepository() }}  >{tr('公共仪表板仓库管理')}</Button>}
        <Dropdown overlay={addMenu} placement="bottomCenter">
          <Tooltip title={tr('新增')}><Button size="small" icon="plus" type="primary" className="marginh5" onClick={handleCreateClick} /></Tooltip>
        </Dropdown>
        <Button className="marginh5" size="small" icon="dashboard" onClick={handleDesignClick} disabled={_.isEmpty(selectedRows)} >{tr('设计仪表板')}</Button>
        <Tooltip title={tr('编辑')}><Button className="marginh5" size="small" icon="edit" onClick={() => handleEditClick(selectedRows[0])} disabled={_.isEmpty(selectedRows) || selectedRows[0].id === 'default'} /></Tooltip>
        <Tooltip title={tr('删除')}><Button className="marginh5" type="danger" size="small" icon="delete" onClick={() => showRemoveModal()} disabled={_.isEmpty(selectedRows) || selectedRows[0].id === 'default'} /></Tooltip>
        <Tooltip title={tr('刷新')}><Button className="marginh5" size="small" icon="reload" onClick={() => fetch({ type: nowType })} /></Tooltip>
      </>}
    >
      <Spin spinning={fetchLoading} style={{}}>
        <Row style={{ minHeight: tableHeight }}>
          {data && data.map((item: object, index: number) =>
            <MiniDashboard
              key={index}
              span={span}
              dashboard={item}
              currentLayout={item['currentLayout']}
              global={global}
              onClick={() => {
                setSelectedRows([item])
                setSelectedRowKeys([item['id']])
              }}
              className={_.isArray(selectedRows) && !_.isEmpty(selectedRows) && selectedRows[0]['id'] === item['id'] && styles.active}
              extra={_.isArray(selectedRows) && !_.isEmpty(selectedRows) && selectedRows[0]['id'] === item['id'] &&
                <Row className={styles.extra} style={{ height: '30px' }}>
                  <Tooltip title={tr('设计仪表板')} >
                    <Col
                      span={item['id'] === 'default' ? 24 : 8}
                      className={styles.iconStyle}
                      onClick={handleDesignClick}
                    >
                      <Icon type="dashboard" />
                    </Col>
                  </Tooltip>
                  {item['id'] !== 'default' && <Tooltip title={tr("编辑")}>
                    <Col
                      span={8}
                      className={styles.iconStyle}
                      onClick={() => handleEditClick(item)}
                    >
                      <Icon type="edit" />
                    </Col>
                  </Tooltip>
                  }
                  {item['id'] !== 'default' && <Popconfirm
                    title={`${tr('确定删除')}？`}
                    okText={tr('确定')}
                    cancelText={tr('取消')}
                    onConfirm={() => handlerRemove([item])}
                    okButtonProps={{
                      type: 'danger'
                    }}
                  ><Tooltip title={tr('删除')} >
                      <Col
                        span={8}
                        className={classnames(styles.iconStyle, 'dangerColor')}
                      >
                        <Icon type="delete" className='delete_icon' />
                      </Col>
                    </Tooltip>
                  </Popconfirm>}
                </Row>}
              MAINCONFIG={MAIN_CONFIG}
            />
          )}
          <div className={styles.plus} onClick={handleCreateClick} style={{ width: `calc((100% / ${span}) - 10px)` }}>
            <Tooltip title={tr('新建仪表板')}>
              <Button type="dashed" shape="circle" icon="plus" size='large' />
            </Tooltip>
          </div>
        </Row>
      </Spin>

      <SmartModal
        id="dashboard_create"
        title={<><Icon type="plus" className="marginh5" />{tr("新增仪表板")}</>}
        visible={createVisible}
        onCancel={() => setCreateVisible(false)}
        itemState={{
          width: 450,
          height: 400
        }}
        canMaximize={false} //是否允许手动切换最大化或小屏化状态
        values={formContent}
        confirmLoading={createLoading}
        schema={modalCreateSchema}
        uiSchema={uiSchema}
        onSubmit={(params) => handleCreate(params)}
        zIndex={1002}
      />


      {copyVisible && <SmartModal
        id="dashboard_copy"
        title={<><Icon type="plus" className="marginh5" />{tr("通过") + (!_.isEmpty(selectedRows) && '-' + selectedRows[0]['name']) + '-' + tr('复制创建')}</>}
        visible={copyVisible}
        onCancel={() => setCopyVisible(false)}
        itemState={{
          width: 450,
          height: 400,
        }}
        values={formContent}
        confirmLoading={createLoading}
        schema={modalCopySchema}
        uiSchema={uiSchema}
        onSubmit={(params) => handleCopy(params)}
        zIndex={1002}
      />
      }

      {editVisible && <SmartModal
        id="dashboard_edit"
        title={<><Icon type="edit" className="marginh5" />{tr("编辑仪表板") + (!_.isEmpty(selectedRows) && '-' + selectedRows[0]['name'])}</>}
        visible={editVisible}
        onCancel={() => setEditVisible(false)}
        itemState={{
          width: 450,
          height: 400,
        }}
        values={formContent}
        confirmLoading={updateLoading}
        schema={modalEditSchema}
        uiSchema={uiSchema}
        onSubmit={(params) => handleEdit(params)}
        zIndex={1002}
      />}

      {!_.isEmpty(selectedRows) && <SmartModal
        id="dashboard_design"
        title={<><Icon type="dashboard" className="marginh5" />{tr("设计仪表板") + (!_.isEmpty(selectedRows) && '-' + selectedRows[0]['name'])}</>}
        visible={designVisible}
        onCancel={() => {
          setDesignVisible(false);
          fetch({
            type: nowType
          })
        }}
        canMaximize={false}
        itemState={{
          width: window.innerWidth,
          height: window.innerHeight,
          maximized: true //打开时是否为最大化状态
        }}
        footer={false}
        bodyStyle={{
          background: 'rgba(240,242,245)'
        }}
        zIndex={1001}
      >
        <>{designVisible && <Dashboard
          id={selectedRows[0]['id']}
          type={nowType}
          editMode={true}
          exitEditCallback={() => {
            setDesignVisible(false);
            fetch({
              type: nowType
            })
          }}
        />}</>
      </SmartModal>}


      <SmartModal
        id="dashboard_repository"
        title={<><Icon type="inbox" className="marginh5" />{tr("公共仪表板仓库管理")}</>}
        visible={repositoryVisible}
        onCancel={() => {
          setRepositoryVisible(false);
          setNowType('user')
          setSelectedRows([])
          setSelectedRowKeys([])
        }}
        itemState={{
          width: window.innerWidth,
          height: window.innerHeight,
          maximized: true
        }}
        canMaximize={false}
        // onSizeChange={onSizeChange}
        footer={false}
        bodyStyle={{
          background: 'rgba(0,0,0,0.05)',
          padding: 0
        }}
        zIndex={1000}
      >
        <Repository
          data={data}
          span={3}
          fetchLoading={fetchLoading}
          height={'100%'}
          repositoryData={repositoryData}
          handleDesignClick={handleDesignClick}
          handleEditClick={handleEditClick}
          handleCreateClick={handleCreateClick}
          handlerRemove={handlerRemove}
          setSelectedRows={setSelectedRows}
          selectedRows={selectedRows}
          selectedRowKeys={selectedRowKeys}
          setSelectedRowKeys={setSelectedRowKeys}
        />
      </SmartModal>
    </Card>
    {drawerVisible &&  <Drawer
      title={<><Icon type='inbox' className="marginh5" />{tr("公共仪表板仓库")}</>}
      width={450}
      placement="right"
      closable
      onClose={() => {
        setDrawerVisible(false)
        setSelectedRows([])
        setSelectedRowKeys([])
      }}
      visible={drawerVisible}
      // getContainer={'#dashboardmgmt'}
      style={{ position: 'absolute' }}
      bodyStyle={{ padding: 0 }}
    >
      <Repository
        data={data}
        span={1}
        fetchLoading={fetchLoading}
        height={'100%'}
        repositoryData={repositoryData}
        handleDesignClick={handleDesignClick}
        handleEditClick={handleEditClick}
        handleCreateClick={handleCreateClick}
        handlerRemove={handlerRemove}
        showAddButton={false}
        showCopyModal={showCopyModal}
        useMode
        setSelectedRows={setSelectedRows}
        selectedRows={selectedRows}
        selectedRowKeys={selectedRowKeys}
        setSelectedRowKeys={setSelectedRowKeys}
      />
    </Drawer>
    }
  </>)
}

export default connect(({ dashboardmgmt, loading, settings, global, user }: { dashboardmgmt: ModelProps, loading: any, settings: object, global: object }) => ({
  MAIN_CONFIG: settings['MAIN_CONFIG'],
  ...dashboardmgmt,
  currentUser: user.currentUser,
  fetchLoading: loading.effects['dashboardmgmt/fetch'],
  createLoading: loading.effects['dashboardmgmt/create'],
  updateLoading: loading.effects['dashboardmgmt/update'],
  removeLoading: loading.effects['dashboardmgmt/remove'],
  global
}), (dispatch: any) => {
  const mapProps = {};
  ['fetch', 'create', 'remove', 'update', 'copy', 'save'].forEach(method => {
    mapProps[method] = (payload: object, callback: Function, final: Function) => {
      dispatch({
        type: `dashboardmgmt/${method}`,
        payload,
        callback,
        final
      })
    }
  })
  return mapProps
})(Page)
