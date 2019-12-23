import React, { useState, useEffect, useCallback } from 'react';
import { Button, Tooltip, Modal, message, Menu, Row, Col, Popconfirm, Empty } from 'antd';
import { connect } from 'dva';
import { BlockHeader, Icon, Table, Card } from 'gantd';
import classnames from 'classnames'
import styles from './style.less';
import { tr, Title } from '@/components/common'
import { SearchTable, setEditVisible, setCreateVisible, SmartModal } from '@/components/specific'
import UserColumn from '@/components/specific/usercolumn'
import Detail from './components/Detail'
import { getUserIdentity, getTableHeight, getContentHeight } from '@/utils/utils'
import FileUpload from '@/components/form/fileupload'

const { confirm } = Modal;

const Page = props => {
  const { MAIN_CONFIG, data, save, currentUser, loading, modalVisible, activeDataAcl, route,
    registerTarget, registerDomain, registerAction, registerFilter,
    allDomains, getAllDomains, getDataAcls, getDomainActions, saveDataAcls, refreshDataSecurity, dataAcls, exportDataAcls, importDataAcls,
  } = props;
  const minHeight = getTableHeight(MAIN_CONFIG, 40 + 20 + 31 + 3, false);
  const menuMinHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + 40 + 3);
  const [activeDomain, setActiveDomain] = useState()
  const [editVisible, setEditVisible] = useState(false)
  const [selectedRows, setSelectedRows] = useState()
  const [selectedRowKeys, setSelectedRowKeys] = useState()
  const [importModalVisible, setImportModalVisible] = useState(false)
  const [fileEntityId, setFileEntityId] = useState();
  const [createModalVisible, setCreateModalVisible] = useState(false)
  const [formContent, setFormContent] = useState({
    active: true,
    memo: ''
  })

  const handleCreate = useCallback((params) => {
    const data = {
      active: "",
      code: activeDomain.code,
      filters: [],
      id: "",
      memo: "",
      updateTime: "",
      updateUser: "",
    }
    const dataAclsTemp = _.cloneDeep(dataAcls)
    dataAclsTemp.push({ ...data, ...params })
    saveDataAcls({
      domainCode: activeDomain.code,
      dataAcls: dataAclsTemp
    }, () => {
      setCreateModalVisible(false)
    })
  }, [activeDomain, formContent, dataAcls])



  const handlerRemove = useCallback((key, rows) => {
    let dataAclsTemp = _.cloneDeep(dataAcls)
    delete rows[0].placement;
    delete rows[0].showTip;
    dataAclsTemp = _.pullAllBy(dataAclsTemp, rows, 'id')
    saveDataAcls({
      domainCode: activeDomain.code,
      dataAcls: dataAclsTemp
    })
    setSelectedRows([])
    setSelectedRowKeys([])
  }, [dataAcls, activeDomain,selectedRows,selectedRowKeys])

  const showRemoveModal = useCallback((rows) => {
    confirm({
      title: tr('提示?'),
      content: tr('确定删除这条权限约束定义吗?'),
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: {
        size: 'small'
      },
      cancelButtonProps: {
        size: 'small'
      },
      onOk() {
        return new Promise((resolve, reject) => {
          handlerRemove('', selectedRows)
          resolve()
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() { },
    });
  }, [selectedRows, handlerRemove])

  const handlerSelect = useCallback((keys, rows) => {
    setSelectedRows(rows)
    setSelectedRowKeys(keys)
  }, [])


  const handleMenuClick = useCallback((e) => {
    let active = {}
    allDomains.map((item) => {
      if (item.code == e.key) {
        active = item
      }
    })
    setActiveDomain(active);
    getDataAcls({
      domainCode: e.key
    })
  }, [allDomains])

  const handleEditClick = useCallback((record) => {
    const codeFilters = record.filters || [];
    codeFilters.map((item) => {
      registerFilter.map((filter) => {
        if (item.code == filter.code) {
          item.label = filter.label
          item.view = filter.view
        }
      })
    })
    codeFilters.map((item, index) => item.id = index)
    save({
      activeDataAcl: record,
      filters: codeFilters
    })
    setEditVisible(true)
  }, [registerFilter])

  const onEditClose = useCallback((e) => {
    setEditVisible(false)
  }, [])


  const columns = [
    {
      key: 'memo',
      dataIndex: 'memo',
      title: tr('说明'),
      render(text, record, index) {
        return <div className="dynamic_action_button_wrap">
          <div className="dynamic_action_text">{text}</div>
          <Icon.Ant type="edit" className="dynamic_action_icon" onClick={() => handleEditClick(record)} />
          <Popconfirm title={`${tr('确定删除')}？`} okText={tr('确定')} cancelText={tr('取消')} onConfirm={() => handlerRemove(record.id, [record])}>
            <Icon.Ant type="delete" className="dynamic_action_icon" />
          </Popconfirm>
        </div>
      }
    }, {
      key: 'active',
      dataIndex: 'active',
      title: tr('是否生效'),
      render(text, record, index) {
        if (text) {
          return tr('是')
        }
        return tr('否')

      }
    }, {
      key: 'updateTime',
      dataIndex: 'updateTime',
      title: tr('最后更新时间'),
    }, {
      key: 'updateUser',
      dataIndex: 'updateUser',
      title: tr('更新人'),
    }]

  const createSchema = {
    type: "object",
    required: ["memo", "active"],
    propertyType: {
      memo: {
        title: tr('说明'),
        type: "string",
        componentType: "Textarea",
      },
      active: {
        title: tr('是否生效'),
        type: "boolean",
        componentType: "Switch",
        options: {
          valuePropName: 'checked'
        }
      },
    }
  }


  const handleExportDataAcls = useCallback(() => {
    const userIdentity = getUserIdentity()
    const { userLoginName, userToken, userLanguage } = userIdentity;
    let domainName = ''
    allDomains.map((item) => {
      if (item.code == activeDomain.code) {
        domainName = item.label;
      }
    })
    exportDataAcls({
      domainCode: activeDomain.code,
      domainName, userLoginName, userToken, userLanguage
    })
  }, [activeDomain, allDomains, getUserIdentity])

  const handleImportDataAclsClick = useCallback(() => {
    setImportModalVisible(true)
  }, [])

  const importModalClose = useCallback(() => {
    setImportModalVisible(false)
  }, [])

  const handleFileUploadChange = (files) => {
    console.log('files',files)
    setFileEntityId(files[0]['id'])
  }

  const handleImportDataAcls = useCallback(() => {
    importDataAcls({
      domainCode: activeDomain.code,
      fileEntityId
    },setImportModalVisible(false))
  }, [fileEntityId,activeDomain])


  useEffect(() => {
    getAllDomains();
  }, [])


  const selectedKeys = activeDomain ? activeDomain.code : undefined

  return (
    <Card
      className={classnames(styles.datapermission, 'specialCardHeader')}
      title={<Title route={route} />}
      bodyStyle={{ padding: 10 }}
    >
      <Row gutter={10}>
        <Col span={4} style={{ minWidth: '150px' }}>
          <BlockHeader title={tr("业务对象列表")} size="big" type='line' bottomLine={false} />
          <Menu mode="vertical" onClick={handleMenuClick} selectedKeys={[selectedKeys]} style={{ minHeight: menuMinHeight }}>
            {allDomains.map((item, index, arr) =>
              <Menu.Item key={item.code}>
                {item.icon ?
                  <Icon type={item.icon} />
                  :
                  <Icon.Ant type='database' />
                }{item.label}
              </Menu.Item>
            )}
          </Menu>
        </Col>
        <Col span={20} style={{ maxWidth: 'calc(100% - 150px)' }}>
          {/* {!_.isEmpty(activeDomain) ? */}
          <Table
            key={`datapermission:${currentUser.id}`}
            title={`${tr('权限约束定义列表')} ${activeDomain ? `-${activeDomain.label}` : ''}`}
            columns={columns}
            dataSource={dataAcls}
            rowKey="id"
            scroll={{ y: minHeight }}
            loading={loading.effects['datapermission/getDataAcls']}
            isZebra
            hideVisibleMenu
            headerRight={<>
              <Button size="small" icon="plus" onClick={() => { setCreateModalVisible(true) }} disabled={_.isEmpty(activeDomain)} />
              <Button size="small" icon="edit" onClick={() => handleEditClick(selectedRows[0])} disabled={_.isEmpty(activeDomain) || _.isEmpty(selectedRows)} />
              <Button size="small" icon="delete" type='danger' onClick={() => showRemoveModal()} disabled={_.isEmpty(activeDomain) || _.isEmpty(selectedRows)} />
              <Button size="small" onClick={handleImportDataAclsClick} disabled={_.isEmpty(activeDomain)}>{tr('导入')}</Button>
              <Button size="small" onClick={handleExportDataAcls} disabled={_.isEmpty(activeDomain)}>{tr('导出')}</Button>
            </>}
            pagination={false}
            headerProps={{
              type: 'line'
            }}
            rowSelection={{
              type: 'radio',
              selectedRowKeys,
              clickable: true,
              onChange: (keys, rows) => {
                setSelectedRows(rows)
                setSelectedRowKeys(keys)
              },
            }}
            emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择业务对象')}</div></>}
          />
        </Col>

      </Row>
      <Detail onClose={onEditClose} visible={editVisible} {...props} />
      <SmartModal
        title={tr("导入权限约束定义")}
        visible={importModalVisible}
        onCancel={importModalClose}
        footer={<>
          <Button size="small" type="primary" disabled={!fileEntityId} onClick={handleImportDataAcls}>
            {tr('导入权限约束定义')}
          </Button>
        </>}
        itemState={{ height: 200, width: 300 }}
      >
        <FileUpload onChange={handleFileUploadChange} maxLength={1} value={[]} />
      </SmartModal>
      <SmartModal
        title={tr('新增权限约束')}
        visible={createModalVisible}
        itemState={{ height: 300, width: 500 }}
        schema={createSchema}
        isModalDialog
        maxZIndex={12}
        values={formContent}
        confirmLoading={loading.effects['datapermission/saveDataAcls']}
        onSubmit={(params) => handleCreate(params)}
        onCancel={() => { setCreateModalVisible(false) }}
      />

    </Card>
  )
}

const mapDispatchToProps = dispatch => {
  const mapProps = {};
  ['getAllDomains', 'getDataAcls', 'getDomainActions', 'getDomainFilters', 'getDomainTargets', 'saveDataAcls', 'refreshDataSecurity', 'exportDataAcls', 'importDataAcls', 'save'].forEach(method => {
    mapProps[method] = (data, cb = () => { }) => {
      dispatch({
        type: `datapermission/${method}`,
        payload: data,
        cb
      })
    }
  })
  return mapProps
}

export default connect(
  ({ datapermission, settings, user, loading }) => ({
    ...datapermission,
    ...settings,
    loading,
    currentUser: user.currentUser
  }),
  mapDispatchToProps
)(Page)
