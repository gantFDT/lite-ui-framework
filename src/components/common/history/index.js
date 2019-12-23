import React from 'react'
import { connect } from 'dva'
import Link from 'umi/link';
import { Dropdown, Button, Menu } from 'antd'




function getMenu(history, MAIN_CONFIG) {
  return (
    <Menu style={{ minWidth: 100 }}>
      {
        history.length ?
          history.map(location => (
            <Menu.Item key={location.key || location.pathname}>
              <Link style={{ color: MAIN_CONFIG.primaryColor }} to={location}>{location.name}</Link>
            </Menu.Item>
          )) :
          <Menu.Item>{tr('暂无浏览历史')}</Menu.Item>
      }
    </Menu>
  )
}

const History = ({ history, MAIN_CONFIG }) => {
  return (
    <Dropdown overlay={getMenu(history, MAIN_CONFIG)} placement="bottomRight">
      <a href="#" onClick={e => e.preventDefault()} style={{ textAlign: 'right', color: 'var(--text-color)' }}>{tr('浏览历史')}</a>
    </Dropdown>
  )
}

export default connect(({ menu, settings }) => ({ ...menu, ...settings }))(History)