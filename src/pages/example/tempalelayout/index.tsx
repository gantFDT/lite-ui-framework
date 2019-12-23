import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import { Icon, Card } from 'gantd';
import { Row, Col, Empty, Button, Tooltip, Modal } from 'antd';
import { Title } from '@/components/common';
import { SmartModal, SmartTable } from '@/components/specific';
import { getContentHeight } from '@/utils/utils'
import { modalSchema, detailSchema, uiSchema } from './schema';
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { ModelProps } from './model'
import DetailContent from './detail';
import styles from './styles.less';
const { confirm } = Modal;

const Page = (props: any): React.ReactElement => {
  const pageKey: string = 'PAGE_NAME';
  const {
    userId,
    MAIN_CONFIG,
    data,
    save,
    fetch,
    create,
    update,
    remove,
    fetchLoading,
    createLoading,
    updateLoading,

    totalCount,
    params
  } = props;

  const [visible, setVisible] = useState(false);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const height = getContentHeight(MAIN_CONFIG, 2 + 40 + 20 + 35)
  const tabletHeight = useMemo(() => `calc(${height} - 40px - 34px)`, [height])
  //左侧listscheme
  const TableSchema = [
    {
      fieldName: 'categoryName',
      title: tr('名称'),
      type: 'string'
    },
    {
      fieldName: 'operation',
      title: tr('操作'),
      type: 'string',
      width: 40,
      render: (text, record: any) => <div
        className={styles.optionsWrapper}
        onClick={(e) => { e.stopPropagation() }}
      >
        <Tooltip title={tr('删除')}>
          <Icon.Ant type='delete' onClick={handleRemove.bind(null, record)} />
        </Tooltip>
      </div>
    },
  ]
  const refreshList = useCallback((beginIndex = 1, pageSize = 50) => {
    save({
      params: {
        ...params,
        pageInfo: { beginIndex, pageSize }
      }
    })
    fetch()
  }, [fetch, save])

  useEffect(() => {
    refreshList()
  }, [])

  //单选左侧list
  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => {
    if (!selectedRows.length) return;
    setSelectedRowKeys(selectedRowKeys);
    setSelectedRows(selectedRows);
  }, [setSelectedRows, selectedRows, selectedRowKeys, setSelectedRowKeys])

  //新增提交
  const onCreate = useCallback((values) => {
    create(values)
  }, [create])

  //编辑提交
  const onSubmit = useCallback((values) => {
    update(values)
  }, [update])

  //删除
  const handleRemove = useCallback((record) => {
    const ids = record.id ? [record.id] : selectedRowKeys
    let _confirm = confirm({
      title: tr('请确认'),
      content: tr('是否删除所选数据'),
      okText: tr('确认'),
      cancelText: tr('取消'),
      okButtonProps: { size: 'small', className: "btn-solid" },
      cancelButtonProps: { size: 'small' },
      onOk: () => {
        return new Promise((res, rej) => {
          let cb = (err: any) => {
            _confirm.destroy();
            if (!err) {
              setSelectedRows([]);
              setSelectedRowKeys([]);
            }
          }
          remove({ ids }, cb)
        }).catch((e) => console.warn(e));
      }
    })
  }, [selectedRows, selectedRowKeys, setSelectedRowKeys])
  const headerRight = useMemo(() => (
    <>
      <Button icon='plus' className='margin5' size='small' onClick={() => { setVisible(true); }} />
      <Button icon='delete' type='danger' disabled={!selectedRows.length} className='margin5' size='small' onClick={handleRemove} />
      <Button icon='reload' className='margin5' size='small' onClick={fetch} />
    </>
  ), [selectedRowKeys])

  const formContent = useMemo(() => {
    return selectedRows.length ? selectedRows[0] : {}
  }, [selectedRows])
  return <Card
    bodyStyle={{
      padding: 5,
      minHeight: height,
    }}
    className="specialCardHeader"
    title={<Title title={tr('模版页面')} />}
  >
    <Row gutter={0}>
      <Col span={7}>
        <div style={{ padding: '5px' }}>
          <SmartTable
            tableKey={`PAGE_NAME:${userId}`}
            title={<Title title={tr('模版页面')} showShortLine={true} showSplitLine={true} />}
            schema={TableSchema}
            rowKey='id'
            bodyHeight={tabletHeight}
            dataSource={data}
            headerRight={headerRight}
            loading={fetchLoading}
            rowSelection={{
              type: 'radio',
              selectedRowKeys: selectedRowKeys,
              onChange: handlerSelect
            }}
            pagination={{
              total: totalCount,
              pageSize: params.pageInfo.pageSize,
              onChange: refreshList,
              onShowSizeChange: refreshList,
            }}
          />
        </div>
      </Col>
      <Col span={17}>
        <div style={{ padding: '5px' }}>
          {!selectedRowKeys.length ?
            <div className="emptyContent" style={{ minHeight: tabletHeight }}>
              <Empty
                description={
                  <span>{tr('请从左侧选择')}</span>
                }
              />
            </div>
            : <DetailContent
              values={formContent}
              schema={detailSchema}
              loading={updateLoading}
              onSubmit={onSubmit}
              uiSchema={uiSchema}
            />
          }
        </div>
      </Col>
    </Row>
    <SmartModal
      id={pageKey}
      title={tr('新建')}
      isModalDialog
      visible={visible}
      schema={modalSchema}
      confirmLoading={createLoading}
      onSubmit={onCreate}
      onCancel={() => {
        setVisible(false);
      }}
    />
  </Card>
}

export default connect(
  ({ PAGE_NAME, settings, user, menu, loading }: { PAGE_NAME: ModelProps, settings: SettingsProps, loading: any, menu: UserProps, user: UserProps }) => ({
    menu: menu,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    ...PAGE_NAME,
    fetchLoading: loading.effects['PAGE_NAME/fetch'],
    createLoading: loading.effects['PAGE_NAME/create'],
    updateLoading: loading.effects['PAGE_NAME/update'],
  }), (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload', 'create', 'remove', 'update', 'save'].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `PAGE_NAME/${method}`,
          payload,
          callback,
          final,
        })
      }
    })
    return mapProps
  }
)(Page);

