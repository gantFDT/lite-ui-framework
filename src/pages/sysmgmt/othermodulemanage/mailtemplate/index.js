import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'gantd'

import MailTemplateList from './components/mailtemplatelist'

@connect(({ mailtemplate, settings, loading }) => ({
  ...mailtemplate,
  ...settings,

}))
class MailTemplate extends Component {

  render() {
    const {
      route
    } = this.props

    return (
      <Card
        bodyStyle={{
          padding: 0,
        }}
      >
        <MailTemplateList route={route} />
      </Card>
    )
  }
}

export default MailTemplate
