/* eslint-disable prefer-destructuring */

import React from 'react'
import { connect } from 'dva'
import pathToRegexp from 'path-to-regexp'
import { Breadcrumb } from 'antd'
import { Icon } from 'gantd'
import { getLocale } from 'umi/locale'
import Link from 'umi/link';

const locale = getLocale();

const renderbreaditem = (bread, map, last) => {
  let [icon, href, name] = [null, null, '']

  // eslint-disable-next-line no-restricted-syntax
  for (const path in map) {
    if (
      pathToRegexp(path).test(bread.path) &&
      // 处理/dashboard/:id?的特殊情况
      !map[path].hideInBreadcrumb
    ) {
      const route = map[path]
      name = route.name
      icon = route.icon
      if (route.component) href = bread.path
      if (locale === 'en-US' && route.nameEN) {
        name = route.nameEN  // 如果用户自己配置的路由信息，就用用户的
      }
      break;
    }
  }

  let target = (
    <>
      {icon}
      <span>{name}</span>
    </>
  )
  if (href && !last) {
    target = <Link to={href}>{target}</Link>
  }

  return (
    <Breadcrumb.Item key={bread.path}>
      {target}
    </Breadcrumb.Item>
  )
}

const CustomBreadcrumb = ({ breadcrumb, merged: computedObj }) => {
  const breadcrumbRoutes = breadcrumb.routes || []
  return (
    <>
      <Breadcrumb>
        <Breadcrumb.Item key='/'>
          <Link to='/' style={{ color: 'var(--breadcrumb-base-color)' }}>
            <Icon.Ant type="home" style={{ marginRight: '5px' }} />
            {tr('首页')}
          </Link>
        </Breadcrumb.Item>
        {
          breadcrumbRoutes && breadcrumbRoutes.length ?
            // breadcrumb.routes由pro-layout提供，数据来源与flatroutes相同
            // 添加flatmenu是为了获取到icon
            breadcrumbRoutes.map((bread, index) => renderbreaditem(bread, computedObj, index === breadcrumb.routes.length - 1)) :
            null
        }
      </Breadcrumb>
    </>
  )
}

export default connect(({ menu }) => menu)(CustomBreadcrumb)