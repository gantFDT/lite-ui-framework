import React, { ReactElement, useState } from 'react'
import { connect } from 'dva'
import { Row, Col } from 'antd'
import { Card } from 'gantd'
import { RouterTypes } from 'umi'

import AuthList from './components/authlist'
import RoleList from './components/rolelist'
import GroupList from './components/grouplist'
import { Title } from '@/components/common'
import { MainConfigProps } from '@/components/common/card'
import { getTableHeight } from '@/utils/utils'

const layoutLeft = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12
}
const layoutRight = {
  xs: 24,
  sm: 24,
  md: 24,
  lg: 12,
}

interface HierarchicalProps extends RouterTypes {
  MAIN_CONFIG: MainConfigProps
}

const Hierarchical = (props: HierarchicalProps) => {
  const { route } = props
  const [user, setUser] = useState(null)
  const [searchAuthList, setsearchAuthList] = useState(null)
  const height = getTableHeight(props.MAIN_CONFIG, 20, false)
  return (
    <Card bodyStyle={{ padding: 10 }} className="specialCardHeader" title={<Title route={route} />}>
      <Row gutter={{ md: 10 }}>
        <Col {...layoutLeft}>
          <AuthList setUser={setUser} setsearchAuthList={setsearchAuthList} route={route} />
        </Col>
        <Col {...layoutRight}>
          <div style={{ height }}>
            <RoleList user={user} searchAuthList={searchAuthList} contentHeight={height} />
            <GroupList user={user} searchAuthList={searchAuthList} contentHeight={height} />
          </div>
        </Col>
      </Row>
    </Card>
  )
}

export default connect(
  ({ settings }: { settings: { MAIN_CONFIG: MainConfigProps } }) => ({
    ...settings,
  }),
)(Hierarchical)
