/**
 * 甘棠前端开发框架 v4 use `@ant-design/pro-layout` to handle Layout.
 * You can view component api by:
 * https://github.com/ant-design/ant-design-pro-layout
 */
import RightContent from '@/components/layout/globalheader/RightContent';
import { connect } from 'dva';
import pathToRegexp from 'path-to-regexp';
import { get, filter, isEmpty, map } from 'lodash'
import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import router from 'umi/router'
import { formatMessage, getLocale } from 'umi-plugin-react/locale';
import { BasicLayout as ProLayoutComponents, RouteContext, GridContent } from '@ant-design/pro-layout';
import WithKeyEvent from '@/components/common/withkeyevent';
import Link from 'umi/link';
import { Button, BackTop, Icon, Badge } from 'antd'
import { Exception, Icon as GantIcon } from 'gantd'
import classnames from 'classnames'
import styles from './index.less'
import { Breadcrumb, History, MenuCollection } from '@/components/common'
import { getPathArr } from '@/utils/utils'
import { textBecomeImg } from '@/utils/textToCanvas'
import { getCompanyData } from '@/services/api'
import { IEVersion } from '@/utils/utils'

const ButtonGroup = Button.Group;

const nowDate = moment().format("YYYY-MM-DD")
const locale = getLocale();
getCompanyData({
  dataType: 'REACT_LOCALE',
  dataId: locale
}).then(response => {
  if (response && response.bigData) {
    window.remoteLangulages = {}
    window.remoteLangulages[locale] = JSON.parse(response.bigData).langulage;
  }
});

let initFlag = false;

const fsStyle = {
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 10000,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'var(--body-background)',
  padding: '10px'
}

const noMatchAction = <Button size="small" type='primary' onClick={() => { router.replace('/') }}>{tr('返回首页')}</Button>

const getRenderContent = (props) => {
  const { location: { pathname }, flatroutes, children } = props
  if (!flatroutes) return null

  for (const path of Object.keys(flatroutes)) {
    if (pathToRegexp(path).test(pathname)) {
      return children
    }
  }
  return <Exception type='404' actions={noMatchAction} />
}

const validatePremission = props => {

  const { location: { pathname }, flatmenu, flatroutes } = props

  if (flatroutes) { // 路由系统已经装载完成
    const pathArr = getPathArr(pathname)

    if (pathArr && pathArr.length) {
      const secondPartPath = pathArr[0]
      const currentRoute = flatroutes[secondPartPath]
      if (currentRoute) {
        if (currentRoute.authorized) { // 需要权限验证, 通过flatmenu查询是否存在
          // eslint-disable-next-line no-restricted-syntax
          for (const path of Object.keys(flatmenu)) {
            if (pathToRegexp(path).test(pathname)) {
              return getRenderContent(props)
            }
          }
          return <Exception type='403' actions={noMatchAction} />
        }
        return getRenderContent(props)
      }
      // 当前访问的路径没有存在在路由系统中
      return <Exception type='404' actions={noMatchAction} />
    }
    return getRenderContent(props)
  }
  return null
}
// 全部菜单弹出延迟ms
const MenuDelay = 200

const BasicLayout = props => {
  const { dispatch, settings, route, organization, menuData, collapsed,
    filterDrawerVisible, location, flatmenu, flatroutes, currentUser } = props;
  const { BASE_CONFIG, showBreadcrumb, fullscreen, MAIN_CONFIG, cssVars } = settings;
  const { logoImageWhite, logoImage, logoName } = BASE_CONFIG;
  const { slideWidth, slideCollapsedWidth } = MAIN_CONFIG;
  const { waterFontSize, lightWaterFontColor, darkWaterFontColor,
    waterFontRotate, waterFontAlpha,
    waterHeight,
    waterWidth,
    waterPadding,
    waterStatus,
    waterShowTime,
    waterText, themeType } = MAIN_CONFIG;
  const { userName } = currentUser;
  const data64 = useMemo(() => {
    let renderText = "";
    switch (waterStatus) {
      case "custom":
        renderText = waterText;
        break;
      case "guest":
        renderText = userName;
        break;
      case "company":
        renderText = logoName;
        break;
    }
    renderText = waterShowTime ? renderText + " " + nowDate : renderText;
    const base64 = waterStatus !== "none" ? textBecomeImg(renderText, {
      fontSize: waterFontSize,
      fontColor: themeType === 'dark' ? darkWaterFontColor : lightWaterFontColor,
      alpha: waterFontAlpha,
      rotate: waterFontRotate,
      padding: waterPadding,
    }) : ""
    return base64
  },
    [waterFontSize,
      lightWaterFontColor,
      waterFontRotate,
      waterFontAlpha,
      darkWaterFontColor,
      waterText,
      themeType,
      waterPadding,
      waterStatus,
      userName,
      logoName,
      waterShowTime
    ])
  useEffect(() => {
    if (dispatch) {
      dispatch({ type: 'user/fetchCurrent' });// 获取当前用户信息
      // dispatch({ type: 'user/findPermission' }); // 获取用户可访问权限
      dispatch({ type: 'menu/getMenu', payload: { route } })
      // dispatch({ type: 'login/fetchDelegateInfo' })//获取代理信息
      // dispatch({ type: 'organization/fetchAllOrg' })// 获取公司组织架构
      dispatch({ type: 'settings/getSetting' });// 获取本地配置信息
    }
  }, [])

  // 控制菜单集合的显示
  const [visible, setvisible] = useState(false)
  // 延迟显示timer
  const [timer, settimer] = useState(null)
  const countKeys = useMemo(() => flatmenu ? filter(flatmenu, item => item.countKey) : [], [flatmenu])

  useEffect(() => {
    if (!countKeys.length) return
    dispatch({
      type: 'menu/getSummary',
      payload: countKeys.map(item => ({ id: item.id, topic: item.countKey }))
    })
  }, [countKeys])

  const updateMenuCollapse = _collapsed => {
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: _collapsed
    })
    syncLayout(_collapsed)
  }
  const syncLayout = (collapsed) => {
    const ieVersion = IEVersion();
    if (ieVersion !== 'edge') {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
      }, 400)
      return;
    }
    let finished = false;
    let time = setInterval(() => {
      let sizeElement = document.getElementsByClassName('ant-pro-sider-menu-sider')[0];
      if (finished) {
        clearInterval(time);
      } else {
        if (sizeElement) {
          let width = sizeElement.offsetWidth;
          let targetwidth = collapsed ? slideCollapsedWidth : slideWidth;
          if (width == targetwidth) {
            window.dispatchEvent(new Event('resize'));
            finished = true;
          }
        }
      }
    }, 50);
    setTimeout(() => {
      if (time) {
        clearInterval(time);
        window.dispatchEvent(new Event('resize'));
      }
    }, 5000)
  }
  const toggleMenuCollapse = _collapsed => {
    if (initFlag == false) {
      initFlag = true
      if (_collapsed) {
        updateMenuCollapse(_collapsed)
      }
      return
    }
    updateMenuCollapse(_collapsed)
  }

  const logout = () => {
    dispatch({ type: "login/logout" })
  }

  const toggleFilterDrawer = useCallback(() => {
    dispatch({ type: 'global/setFilterDrawerVisible' })
  }, [])

  const toggleFullScreen = useCallback(() => {
    dispatch({ type: 'settings/togglefullscreen' })
    syncLayout(0)
  }, [])

  const backTopEl = useRef(null);
  const backTop = useCallback(() => {
    backTopEl.current.scrollToTop();
  }, [])
  const backToHome = useCallback(() => {
    router.push('/')
  }, [])

  const children = useMemo(() => getRenderContent(props), [location, flatmenu, flatroutes])

  const local = useMemo(() => getLocale(), [getLocale()])
  const title = useMemo(() => local === 'en-US' ? settings.BASE_CONFIG.logoNameEn : settings.BASE_CONFIG.logoName, [local, settings.BASE_CONFIG])

  const showMenu = useCallback(() => {
    const showTimer = setTimeout(() => {
      setvisible(true)
      clearTimeout(showTimer)
    }, MenuDelay);
    settimer(showTimer)
  }, []);

  const onMouseLeave = useCallback(
    () => {
      if (timer) {
        clearTimeout(timer)
      }
    },
    [timer],
  )
  const hideMenu = useCallback(() => { setvisible(false) }, [])

  const getMenuName = useCallback(
    (item, defaultNode) => {
      let menuItem = null
      const clsName = classnames("custom-menu-item-link", settings.MAIN_CONFIG.navTheme === 'dark' ? 'dark' : '')
      // 全部菜单
      if (item.path === '/all') {
        // menuItem = (<MenuCollection className={clsName} defaultNode={defaultNode} />)
        menuItem = (
          <span className={clsName} style={{ cursor: 'pointer' }}>
            <span style={{ cursor: 'pointer' }} onMouseEnter={showMenu} onMouseLeave={onMouseLeave}>
              {defaultNode}
            </span>
          </span>
        )
      }
      // 菜单项
      else if (defaultNode) {
        // 没有path，不能跳转
        if (!item.path) {
          menuItem = (
            <div className={clsName} to={item.path}>
              {defaultNode}
            </div>
          )
        } else {
          menuItem = (
            <Link className={clsName} to={item.path}>
              {defaultNode}
            </Link>
          )
        }
      } else {
        // 包含子节点的菜单项
        menuItem = (
          <div className={clsName}>
            {item.icon}
            {item.name}
          </div>
        )
      }
      return (
        <div className='custom-menu-item'>
          {menuItem}
          <div className='custom-menu-item-count'>
            <Badge count={item.badge} />
          </div>
        </div>
      )
    },
    [settings.MAIN_CONFIG.navTheme, onMouseLeave]
  )

  const getMenuDataName = useCallback(
    (list = []) => {
      return list.map(item => {
        if (get(item, 'children.length')) {
          const name = getMenuName(item)
          return {
            ...item,
            icon: undefined, // 去掉icon使菜单只显示name
            name,
            children: getMenuDataName(get(item, 'children'))
          }
        }
        return item
      })
    },
    [getMenuName],
  )
  const convertMenuData = useMemo(() => getMenuDataName(menuData), [menuData, getMenuDataName])

  const menuDataRender = useCallback((menuData) => {
    const menu = [
      {
        icon: 'appstore',
        iconType: 'ant',
        name: tr('全部菜单'),
        path: '/all',
        hideInMenu: false,
      },
    ]
    return menu.concat(...convertMenuData)
  }, [convertMenuData])
  const fullscreenStyle = fullscreen ? fsStyle : { width: "100%" }

  return (
    <WithKeyEvent
      logout={logout}
      onCtrlB={() => toggleMenuCollapse(!collapsed)} // 展开|收起 侧边菜单栏
      onAltUp={backTop} // 滚动到顶部
      onAltH={backToHome} // 回到首页
      // onAltS={() => toggleFilterDrawer()} // 展开|收起 侧边菜单栏
      onShiftF={toggleFullScreen}
    >
      <BackTop ref={backTopEl}>
        <div className='backtop'><Icon type="arrow-up" /></div>
      </BackTop>
      <ProLayoutComponents
        title={title}
        // logo={settings.MAIN_CONFIG.navTheme === 'dark' ? logoImageWhite : logoImage}
        onCollapse={() => toggleMenuCollapse(!collapsed)}
        menuItemRender={getMenuName}
        breadcrumbRender={(routers = []) => routers}
        siderWidth={slideWidth}
        // formatMessage={formatMessage}
        rightContentRender={rightProps => <RightContent {...rightProps} />}
        footerRender={false} // 去掉版权信息
        menuDataRender={menuDataRender}
        menuHeaderRender={(logo, title) =>
          <div onClick={backToHome} className={styles.logo} style={{
            paddingLeft: collapsed ? '0px' : '5px',
            justifyContent: collapsed ? 'center' : 'left'
          }}>
            <div className={styles.img} style={{ backgroundImage: `url(${settings.MAIN_CONFIG.navTheme === 'dark' ? logoImageWhite : logoImage})` }}></div>
            <div style={{ display: collapsed ? 'none' : 'inline-block' }}>{title}</div>
          </div>}
        {...props}
        {...settings}
        collapsed={collapsed}
        collapsedWidth={slideCollapsedWidth}
        menuProps={{
          inlineIndent: 10
        }}
      >
        <GridContent>
          <RouteContext.Consumer>
            {
              ({ breadcrumb }) => {
                return (
                  <>
                    {showBreadcrumb && (
                      <div className='page-header-box'>
                        {/* <ButtonGroup className={styles.navigation}>
                          <Button size="small" icon="left" onClick={()=>history.go(-1)}/>
                          <Button size="small" icon="right" onClick={()=>history.go(1)}/>
                        </ButtonGroup> */}
                        <Breadcrumb breadcrumb={breadcrumb} />
                        <History {...props} />
                      </div>
                    )}
                    <div style={{ position: "relative", ...fullscreenStyle }}>
                      <div className={styles.waterMask} style={waterStatus !== "none" ? { background: `url(${data64}) center center repeat` } : {}} />
                      {children}
                    </div>
                  </>
                )
              }
            }
          </RouteContext.Consumer>
        </GridContent>
      </ProLayoutComponents>
      <MenuCollection visible={visible} setvisible={setvisible} />
    </WithKeyEvent>
  );
};

export default connect(({ global, settings, menu, organization, user }) => ({
  collapsed: global.collapsed,
  settings: {
    ...settings,
    ...settings.MAIN_CONFIG
  },
  organization,
  menuData: menu.serveMenu, // 直接在props中注入到ProLayoutComponents // 新版本中失效
  ...menu,
  currentUser: user.currentUser
}))(BasicLayout);
