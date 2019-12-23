


import React from 'react'
import { Icon } from 'gantd'
import BaseInfo from './baseInfo'
import Contacts from './contacts'
import Purchase from './purchase'

export default [
  {
    name: tr('基本信息'),
    icon: <Icon.Ant type='cloud-upload' />,
    component: <BaseInfo />,
  },
  {
    name: tr('其他信息1'),
    icon: <Icon.Ant type='cloud-upload' />,
    component: <Contacts />,
  },
  {
    name: tr('所属采购组织'),
    icon: <Icon.Ant type='cloud-upload' />,
    component: <Purchase />,
  }
];



