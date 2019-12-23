import Authorized from '@/utils/Authorized';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import React, { useState, useCallback } from 'react';
import { Exception } from 'gantd';
import { Button } from 'antd'
import router from 'umi/router'

const getRouteAuthority = (pathname, flatmenu) => {
  if (flatmenu) {
    // eslint-disable-next-line no-restricted-syntax
    for (const path of Object.keys(flatmenu)) {
      if (pathToRegexp(path).test(pathname)) {
        return 'admin'
      }
    }
  }
  return 'other' // 禁止进入
};

const AuthComponent = ({
  children,
  flatmenu,
  location,
}) => {
  const backToHome = useCallback(
    () => {
      router.replace('/')
    },
  )
  const expection = (
    <Exception
      type="403"
      actions={
        <div>
          <Button size="small"   type="primary" onClick={backToHome}>{tr('返回首页')}</Button>
        </div>
      }
    />
  )
  return (
    <Authorized
      authority={getRouteAuthority(location.pathname, flatmenu)}
      noMatch={expection}
    >
      {children}
    </Authorized>
  );
};

export default connect(({ menu }) => ({
  ...menu,
}))(AuthComponent);
