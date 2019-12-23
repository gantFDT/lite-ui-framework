import React, { useState } from 'react'
import { Tooltip, Button, Dropdown, Menu, Icon } from 'antd'
import { addWidget } from '@/components/specific/dashboard/utils'
import _ from 'lodash';

interface sendToDashboardProps {
  type: string;
  name: string;
  configParams: any;
  menu: object;
  [propsName: string]: any
}



const Comp = (props: sendToDashboardProps) => {
  const { type, name, configParams, className } = props;

  const { menu } = window['g_app']['_store'].getState()

  const handleSend = (dashboard: object) => {
    addWidget(dashboard, type, name, configParams)
  }

  const addMenu = () => (
    <Menu>
      {_.isArray(menu['dashboards']) && !_.isEmpty(menu['dashboards']) && menu['dashboards'].map((item: object) =>
        <Menu.Item onClick={() => handleSend(item)} >
          {item['name']}
        </Menu.Item>
      )}
    </Menu>
  );
  return (<>
    <Dropdown overlay={addMenu} placement="bottomCenter">
      <Tooltip title={tr('发送到仪表板')}><Button size="small" icon="rocket" type="primary" className={className} /></Tooltip>
    </Dropdown>
  </>)
}

export default Comp