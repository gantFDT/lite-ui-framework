import React, { Component } from 'react';
import { connect } from 'dva';

import { Row, Col } from 'antd';
import { Card } from 'gantd';
import SearchPerTree from './searchpretree'
import ListOptPre from './listoptpre'
import { Title } from '@/components/common';
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

const layout = {
  xs: 16,
  sm: 16,
  md: 16,
  lg: 16,
}
const layoutTree = {
  xs: 8,
  sm: 8,
  md: 8,
  lg: 8
}



@connect(({ preferencesmanage, settings, loading }) => ({
  ...preferencesmanage,
  ...settings,
  loading: loading.effects['preferencesmanage/getAllParams'],
}))

class PreferencesManage extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'preferencesmanage/getAllParams'
    })
  }

  render() {
    const bodyHeight = getContentHeight(this.props.MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
    return (
      <Card
        className="specialCardHeader"
        title={<Title route={this.props.route} />}
        bodyStyle={{
          padding: '0px',
          height: bodyHeight
        }}
      >
        <Row gutter={{ md: 8 }}>
          <Col {...layoutTree}>
            <SearchPerTree />
          </Col>
          <Col {...layout}>
            <ListOptPre />
          </Col>
        </Row>
      </Card>
    );
  }
}

export default PreferencesManage;
