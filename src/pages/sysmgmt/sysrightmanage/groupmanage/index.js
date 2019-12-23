import React, { useEffect, memo, useState, useMemo, useCallback } from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { Icon, Card } from 'gantd'
import { Title } from '@/components/common';
import { getContentHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import GroupCategory from './components/groupcategory'
import Group from './components/group'
import GroupUser from './components/groupuser'

import './styles.less';

const GroupManage = props => {
  const {
    MAIN_CONFIG,
    route
  } = props;
  const height = getContentHeight(MAIN_CONFIG, 40 + 20 + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT)

  return (
    <Card
      bodyStyle={{
        padding: 5,
      }}
      className="specialCardHeader"
      title={<Title route={route} />}
    >
      <Row gutter={0}>
        <Col span={8}>
          <div style={{ padding: 5 }}>
            <GroupCategory contentHeight={height} />
          </div>
        </Col>
        <Col span={16}>
          <div style={{ padding: 5 }}>
            <Group contentHeight={height} />
            <GroupUser contentHeight={height} />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default connect(
  ({ groupCategory, settings }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    ...groupCategory
  })
)(GroupManage)
