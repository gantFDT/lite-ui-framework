import React from 'react';
import { connect } from 'dva';
import UIConfig from '@/components/specific/uiconfig'


const Page = props => {
  const { dispatch, settings } = props;
  return (
    <UIConfig settings={settings} tabPosition='top' />
  )
}


export default connect(({ settings }) => ({
  settings
}))(Page)