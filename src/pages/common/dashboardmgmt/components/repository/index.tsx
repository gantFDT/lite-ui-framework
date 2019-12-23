import React, { useState, useCallback } from 'react'
import { Button, Icon, Tooltip, Tag, Row, Col, Popconfirm, Spin } from 'antd'
import MiniDashboard from '@/components/specific/dashboard/components/minidashboard'
import classnames from 'classnames'
import styles from './index.less'

const Page = (props: any) => {
  const {
    repositoryData,
    fetchLoading,
    height, span,
    handleDesignClick, handleEditClick, handleCreateClick, handlerRemove, showCopyModal,
    selectedRows,
    selectedRowKeys,
    setSelectedRows = () => { },
    setSelectedRowKeys = () => { },
    showAddButton = true,
    useMode = false
  } = props

  const onSelectClick = useCallback((dashboard: object) => {
    setSelectedRows([dashboard])
    setSelectedRowKeys([dashboard['id']])
    showCopyModal([dashboard])
  }, [selectedRows,setSelectedRows,setSelectedRowKeys])

  return (<>
    <div
      style={{ padding: '5px' }}
    >
      <Spin spinning={fetchLoading} style={{}}>
        <Row style={{ height }}>
          {repositoryData && repositoryData.map((item: object) =>
            <MiniDashboard
              span={span}
              currentLayout={item['currentLayout']}
              name={<>{item['name']}{item['id'] === 'default' && <Tag className="marginh10">{tr('系统默认')}</Tag>}</>}
              description={item['description']}
              global={global}
              onClick={() => {
                setSelectedRows([item])
                setSelectedRowKeys([item['id']])
              }}
              useMode={useMode}
              onSelectClick={onSelectClick}
              dashboard={item}
              className={_.isArray(selectedRows) && !_.isEmpty(selectedRows) && selectedRows[0]['id'] === item['id'] && styles.active}
              extra={!useMode && _.isArray(selectedRows) && !_.isEmpty(selectedRows) && selectedRows[0]['id'] === item['id'] &&
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
            />
          )}
          {showAddButton && <div className={styles.plus} onClick={handleCreateClick} style={{ width: `calc((100% / ${span}) - 10px)` }}>
            <Tooltip title={tr('新建仪表板')}>
              <Button type="dashed" shape="circle" icon="plus" size='large' />
            </Tooltip>
          </div>
          }
        </Row>
      </Spin>
    </div>
  </>)
}

export default Page