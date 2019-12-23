import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { Tabs, Row, Col, Tooltip, Button, Drawer } from 'antd'
import { connect } from 'dva'
import { Card } from 'gantd'
import styles from './index.less';

import { Title } from '@/components/common'

import RoleList from './components/rolelist'
import RelateUser from './components/relateuser'
import RelateResource from './components/relateresource'

const tabList = [
  {
    key: 'relateuser',
    tab: tr('关联员工')
  },
  {
    key: 'relateresource',
    tab: tr('关联资源')
  }
]

const UserKey = 'relateuser';
const ResourceKey = 'relateresource';

const layoutLeft = {
  sm: 24,
  md: 12
}
const layoutRight = {
  sm: 24,
  md: 12,
}

const RoleManage = props => {
  const {
    loadingRelateUser,
    selectedRowKeys,
    selectedRows,
    drawerVisible,
    relateType,
    setRelateType,
    closeDrawer,
    auth,
    route
  } = props;
  const [contentVisible, setContentVisible] = useState(false)

  const handlerClose = useCallback(() => {
    closeDrawer()
    setContentVisible(false)
  }, [])

  const afterVisibleChange = useCallback(() => {
    if (drawerVisible)
      setContentVisible(true)
  }, [drawerVisible])

  return (
    <>
      <Card bodyStyle={{ padding: 10 }} className='specialCardHeader' title={<Title route={route} />}>
        <Row gutter={{ md: 10 }}>
          <Col {...layoutLeft}>
            <RoleList route={route} />
          </Col>
          <Col {...layoutRight}>
            <div>
              <RelateUser contentVisible={contentVisible} />
              <RelateResource contentVisible={contentVisible} />
            </div>
          </Col>
        </Row>
      </Card>
      {/* <Drawer
        title={tr('关联')}
        width={window.innerWidth * .7}
        onClose={handlerClose}
        visible={drawerVisible}
        bodyStyle={{ padding: 0 }}
        afterVisibleChange={afterVisibleChange}
        className="notranslate"
      >
        <Card
          className={styles.card}
          tabList={tabList}
          bordered={false}
          activeTabKey={relateType}
          onTabChange={setRelateType}
          bodyStyle={{ padding: 0 }}
        >
          {
            relateType === UserKey ? <RelateUser contentVisible={contentVisible} /> : <RelateResource contentVisible={contentVisible} />
          }
        </Card>
      </Drawer> */}
    </>
  )
}

export default connect(
  ({ settings, loading, roleManage }) => ({
    ...settings,
    ...roleManage,
    loadingRelateUser: loading.effects['roleRelateUser/listAllUserByRole']
  }),
  (dispatch) => ({
    setRelateType: (relateType) => dispatch({ type: 'roleManage/save', payload: { relateType } }),
    closeDrawer: () => dispatch({ type: 'roleManage/save', payload: { drawerVisible: false } }),
  })
)(RoleManage)