import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import dynamic from 'umi/dynamic'
import { Card, Icon, SubMenu } from 'gantd'
import { Menu, Modal, Skeleton } from 'antd'
import styles from './index.less'
import { connect } from 'dva'
import { findIndex } from 'lodash'
import event from '@/utils/events'
import { importModel } from '@/utils/utils'
import { Link } from 'umi'
import { useLocalStorage } from '@/utils/hooks'
import { getContextMenuAPI } from './service'
import { getBizSummary } from '@/services/api'
import _ from 'lodash'

const initalOptions = {
  mode: 'inline',
  collapsed: false
}
const staticComponents = {}

function ContextMenu(props) {
  const {
    title,
    category,
    contextMenuKey,
    defaultSelectedKey,
    minHeight,
    menuData,
    menuDataAhead = false,
    menuOptions,
    dynamicCmpProps,
    headerHeight = 40,
    fixedHeader = true,
    isShowFooter = true,
    width = '200px',
    currentUser,
    extra,
    onMenuStateChange,
    onMenuChange,
    ...nextProps
  } = props;

  const initalStorage = { ...initalOptions, ...menuOptions };
  const [dynamicPath, setDynamicPath] = useState(null);
  const [menuDataName, setMenuDataName] = useState(null);
  const [selectedKey, setSelectedKey] = useState(defaultSelectedKey);
  const [cmProps, setCmpProps] = useState(dynamicCmpProps);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [contextmenuData, setContextmenuData] = useState([]);
  const [menuLoading, setMenuLoading] = useState(false);
  const [localData, setLocalStorage] = useLocalStorage(`contextMenu:${currentUser.id}`, initalStorage, contextMenuKey);
  const { mode, collapsed } = localData;
  const menuBarRef = useRef(null);
  // 初始进入上下文菜单遍历每一个所需加载页面的model
  useEffect(() => {
    getContextMenu(category)
  }, [])

  useEffect(() => {
    if (!_.isEqual(dynamicCmpProps, cmProps)) {
      setCmpProps(dynamicCmpProps)
    }
  }, [dynamicCmpProps, cmProps, setCmpProps])

  useEffect(() => {
    onMenuStateChange && onMenuStateChange(mode, collapsed, menuBarRef.current);
  }, [mode, collapsed])

  const importModelsByPath = useCallback((menus) => {
    let activeMenu = menus.find(i => i.name == defaultSelectedKey) || menus[0];
    const { modelPath, name } = activeMenu.path ? staticComponents[activeMenu.path] : activeMenu;
    let others = _.filter(menus, i => i.name != activeMenu.name);
    if (modelPath) {
      import(`@/pages/${modelPath}`).then(m => {
        importModel(m, () => {
          event.emit();
          setComponentPathAndName(activeMenu.path, name);
          setMenuLoading(false)
        })
      });
    } else {
      setComponentPathAndName(activeMenu.path, name);
      setMenuLoading(false)
    };
    others.map(item => {
      const { modelPath: _modelPath } = item.path ? staticComponents[item.path] : item;
      if (_modelPath) {
        import(`@/pages/${_modelPath}`).then(m => {
          importModel(m, () => event.emit())
        })
      }
    });
  }, [])

  const pathParse = useCallback((str) => {
    let arg, strArr = str.split('?');
    if (strArr[1]) {
      try {
        arg = JSON.parse(strArr[1])
      } catch (err) {
        console.log(`${tr('上下文菜单JSON参数解析错误')}=`, err);
        return {};
      }
    }
    return { compPath: strArr[0], ...arg };
  }, [])

  const setComponentPathAndName = useCallback((path, name) => {
    setSelectedKey(name);
    if (path) {
      setMenuDataName(null);
      setDynamicPath(path);
    } else {
      setMenuDataName(name);
      setDynamicPath(null);
    }
  }, [])

  const getContextMenu = useCallback(async (category) => {
    try {
      setMenuLoading(true);
      const data = await getContextMenuAPI(category) || [];
      setStaticComponent(data);
      const actualMenuData = menuDataAhead ? menuData.concat(data) : data.concat(menuData);
      if (!actualMenuData.length) {
        setMenuLoading(false)
        return
      }
      setContextmenuData(actualMenuData);
      importModelsByPath(actualMenuData);
      let topic = [];
      actualMenuData.map((item) => {
        if (item.path) {
          const { countKey } = staticComponents[item.path];
          if (countKey) {
            topic.push({ id: item.id, topic: countKey });
          }
        }
      })
      if (topic.length) {
        const res = await getBizSummary({ data: { topic } });
        actualMenuData.map((item) => {
          res[item.id] && (item.count = res[item.id]);
        })
      }
      setContextmenuData(actualMenuData);
    } catch (err) {
      console.log(err);
      setMenuLoading(false);
    }
  }, [menuDataAhead, menuData])

  const setStaticComponent = useCallback((data) => {
    data.map(item => {
      if (!item.path) return;
      const { compPath, countKey, modelPath } = pathParse(item.path);
      if (compPath) {
        staticComponents[item.path] = {
          compPath,
          countKey,
          modelPath,
          dynamic: dynamic({
            loader: () => import(`@/pages/${compPath}`),
            delay: 200
          }),
        }
      }
    });
  }, [])

  const dynamicComponent = useMemo(() => {
    if (!dynamicPath) return null;
    // console.log(staticComponents)
    let ItemComponent = staticComponents[dynamicPath].dynamic;
    return <ItemComponent menuName={selectedKey} {...cmProps} />
  }, [dynamicPath, selectedKey, cmProps])

  const customComponent = useMemo(() => {
    if (!menuDataName) return null;
    const item = menuData.find(item => item.name == menuDataName);
    if (item) {
      return item.component
    }
  }, [menuDataName, menuData])

  const onSelectedChange = useCallback((_path, name) => {
    let index = contextmenuData.findIndex(item => {
      return _path ? item.name == name && item.path : item.name == name && item.component;
    });
    let targetMenu = contextmenuData[index];
    if (!targetMenu) return;
    setCurrentIndex(index);
    setComponentPathAndName(_path, name);
    onMenuChange && onMenuChange(name, targetMenu);
  }, [contextmenuData])

  //底部页面跳转
  const onFooterChangePage = useCallback((parameter) => {
    const item = parameter == 'before' ? contextmenuData[currentIndex - 1] : contextmenuData[currentIndex + 1]
    item && onSelectedChange(item.path, item.name)
  }, [contextmenuData, currentIndex])

  //上下文menu方向切换
  const onSwitchChange = useCallback((mode) => {
    const fixedEle = document.querySelector('.gant-submenu-wrap'); //定位元素
    if (mode == 'inline') { fixedEle.classList.remove('gant-contextmenu-boxShow') }
    contextMenuKey && setLocalStorage({ mode })
  }, [])

  //submenu是否收起
  const onCollapseChange = useCallback((collapsed) => {
    contextMenuKey && setLocalStorage({ collapsed })
  }, [])

  //切换submenu方向时改变submenu的宽度
  useEffect(() => {
    const fixedEle = document.querySelector('.gant-submenu-wrap'); //定位元素
    const fixedEleParent = document.querySelector('.gant-submenu-menubox'); //定位元素的父级
    const gantAnchorActive = document.querySelector('.gant-gantanchor-activeScroll');
    const anchorBoxId = document.getElementById('anchorBoxId');
    const submenupagecard = document.querySelector('.gant-submenu-pagecard');
    const fixedTopHeight = fixedHeader ? headerHeight : 0;
    if (fixedEleParent) { //上下文菜单切换方向时menu宽度
      fixedEle.style.width = `${fixedEleParent.offsetWidth - (mode == 'inline' ? 1 : 0)}px`;
    }
    if (anchorBoxId) { anchorBoxId.style.width = `${submenupagecard.offsetWidth - 2}px` }
    if (mode == 'inline' && gantAnchorActive) {
      gantAnchorActive.style.top = `${fixedTopHeight}px`
    } else if (mode == 'horizontal' && gantAnchorActive) {
      gantAnchorActive.style.top = `${fixedEle.offsetHeight + fixedTopHeight}px`
    }
    handleAnchorFooter()
  }, [mode, collapsed])


  //切换锚点方向时底部footer宽度的变化
  const handleAnchorFooter = useCallback((e) => {
    const submenupagecard = document.querySelector('.gant-submenu-pagecard');
    const footerbox = document.querySelector('.antd-pro-components-specific-contextmenu-index-footerbox');
    const anchorverticalbox = document.querySelector('.gant-anchor-verticalbox'); //左右布局锚点
    const anchorBottom = document.querySelector('.antd-pro-components-specific-contextmenu-index-anchorBottom');
    if (anchorverticalbox && footerbox) { //锚点切换方向时，下方footer变化
      footerbox.style.width = `${submenupagecard.offsetWidth - anchorverticalbox.offsetWidth}px`
      anchorBottom.style.width = `${anchorverticalbox.offsetWidth - 1}px`
    } else if (!anchorverticalbox && footerbox) {
      footerbox.style.width = `100%`
      anchorBottom.style.width = '0px'
    }
  })

  //监听页面呢滚动事件
  useEffect(() => {
    window.addEventListener('scroll', handleScroll) //监听滚动
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  })

  //页面滚动事件
  const handleScroll = useCallback((e) => {
    const fixedEle = document.querySelector('.gant-submenu-wrap'); //定位元素
    const fixedEleParent = document.querySelector('.gant-submenu-menubox'); //定位元素的父级
    const anchorBoxId = document.getElementById('anchorBoxId');
    const horEle = document.querySelector('.gant-submenu-menuboxhor');
    if (!fixedEle) return;
    //submenu下面的内容
    const parentClientTop = fixedEleParent ? fixedEleParent.getBoundingClientRect().top : 0 //定位元素父级距离浏览器的高度
    const fixedTopHeight = fixedHeader ? headerHeight : 0;
    if (parentClientTop <= fixedTopHeight) {
      fixedEle.classList.add('gantd-contextmenu-submenu-fixed')
      const active = document.querySelector('.gantd-contextmenu-submenu-fixed');
      active.style.top = `${fixedTopHeight}px`;
      active.style.width = `${fixedEleParent.offsetWidth - (mode == 'inline' ? 1 : 0)}px`;
      if (anchorBoxId) {
        anchorBoxId.classList.add('gant-contextmenu-boxShow')
      } else if (!anchorBoxId && horEle) {
        fixedEle.classList.add('gant-contextmenu-boxShow')
      }
    }
    if (parentClientTop > fixedTopHeight) {
      fixedEle.classList.remove('gantd-contextmenu-submenu-fixed')
      if (anchorBoxId) {
        anchorBoxId.classList.remove('gant-contextmenu-boxShow')
      } else if (!anchorBoxId) {
        fixedEle.classList.remove('gant-contextmenu-boxShow')
      }
    }
    if (anchorBoxId) {
      fixedEle.classList.remove('gant-contextmenu-boxShow')
    }
    handleAnchorFooter()
  })

  const contextFooter = useMemo(() => {
    if (!isShowFooter || !contextmenuData.length || contextmenuData.length == 1) return;
    return <div className={styles.contextfooter} style={{ textAlign: 'left' }}>
      <div className={styles.footerbox}>
        <div className={styles.footerdiv}>
          <a
            onClick={onFooterChangePage.bind(null, 'before')}
            style={{ display: currentIndex == 0 ? 'none' : 'block' }}>
            <span>{tr('上一篇')}</span>
            <h6>{currentIndex == 0 ? '' : contextmenuData[currentIndex - 1].name}</h6>
          </a>
        </div>
        <div className={styles.footerdiv} style={{ textAlign: 'right' }}>
          <a
            onClick={onFooterChangePage.bind(null, 'after')}
            style={{ display: currentIndex + 1 == contextmenuData.length ? 'none' : 'block' }}>
            <span>{tr('下一篇')}</span>
            <h6>{currentIndex + 1 == contextmenuData.length ? '' : contextmenuData[currentIndex + 1].name}</h6>
          </a>
        </div>
      </div>
      <div className={styles.anchorBottom}></div>
    </div>
  }, [currentIndex, contextmenuData])

  return (
    <Card
      title={title}
      loading={menuLoading}
      className={styles.wrapCard}
      headStyle={mode === 'inline' ? {} : { border: 0 }}
      bodyStyle={{ padding: 0, minHeight }}
      style={{ border: 0 }}
      extra={extra}
    >
      <SubMenu
        mode={mode}
        collapsed={collapsed}
        menuData={contextmenuData}
        selectedKey={selectedKey}
        setMenuBoxRef={ref => menuBarRef.current = ref}
        onSwitchChange={onSwitchChange}
        onCollapseChange={onCollapseChange}
        onSelectedChange={onSelectedChange}
        subMinHeight={minHeight}
        width={width}
        {...nextProps}
      >
        <div>
          <React.Fragment>
            {dynamicComponent}
            {customComponent}
            {contextFooter}
          </React.Fragment>
        </div>
      </SubMenu>
    </Card>
  )
}

ContextMenu.defaultProps = {
  menuData: [],
  menuOptions: {},
  dynamicCmpProps: {},
  onMenuStateChange: _ => _,
  onMenuChange: _ => _,
}
export default connect(
  ({ user, settings }) => ({
    currentUser: user.currentUser,
    headerHeight: settings.MAIN_CONFIG.headerHeight,
    fixedHeader: settings.MAIN_CONFIG.fixedHeader,
  })
)(ContextMenu)