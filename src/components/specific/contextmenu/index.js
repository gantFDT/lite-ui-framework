import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react'
import dynamic from 'umi/dynamic'
import { Card } from 'gantd'
import { SubMenu } from 'gantd'
import styles from './index.less'
import { connect } from 'dva'
import { findIndex } from 'lodash'
import event from '@/utils/events'
import { importModel } from '@/utils/utils'
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
      let actualMenuData = menuDataAhead ? menuData.concat(data) : data.concat(menuData);
      actualMenuData = actualMenuData.map(item => ({ ...item, title: item.name, key: item.name }));
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

  const onSelectedChange = useCallback((name, record) => {
    if (!record) return;
    setComponentPathAndName(record.path, name);
    onMenuChange && onMenuChange(name, record);
  }, [contextmenuData])

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
      {contextmenuData.length > 0 && <SubMenu
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
        showFlipOverFooter
        showMenuMagnet
        {...nextProps}
      >
        <div>
          <React.Fragment>
            {dynamicComponent}
            {customComponent}
          </React.Fragment>
        </div>
      </SubMenu>}
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