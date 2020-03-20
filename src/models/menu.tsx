
import React from 'react'
import { Icon } from 'gantd'
import pathToRegexp from 'path-to-regexp'
import { getLocale } from 'umi/locale'
import { groupBy, map, unionBy, take, omitBy, isEmpty } from 'lodash'
import { getBizSummary, getReactStartMenuAPI, fetchDashboards } from '@/services/api'
import { getRealIcon, getPathArr } from '@/utils/utils'
import { Model } from './connect'

type History = Array<Location>
// 菜单数据
interface ServerMenu {
  id: string,
  name: string,
  path: string,
  icon: string | React.ReactNode,
  iconPath: string,
  countKey?: number,
  parentResourceId: string,
  type?: string,
  leaf: boolean,
  children?: ServerMenuList
}
type ServerMenuList = Array<ServerMenu>

interface Flatmenu {
  [path: string]: ServerMenu
}
// 路由数据
interface RouteInterface {
  path: string,
  name?: string,
  nameEn?: string,
  exact?: boolean,
  redirect?: string,
  hideInMenu?: boolean,
  hideInBreadcrumb?: boolean,
  routes?: Array<RouteInterface>
}
interface FlatRouter {
  [path: string]: RouteInterface
}

interface Merged {
  [path: string]: ServerMenu & RouteInterface
}

interface Dashboard {
  id: string,
  name: string,
  description: string
}
type Dashboards = Array<Dashboard>



const locale = getLocale() // 用于确定更新路由的语言
const localeName = locale === 'zh-CN' ? 'name' : 'nameEN'
const historyStage: History = [] as History // 在router装载完成以前的历史记录缓存数组

let initialHistory = []
if (window && window.localStorage) {
  try {
    const username = window.localStorage.getItem('username')
    const storageHistory = window.localStorage.getItem(`history:${username}`)
    if (storageHistory && /^\[.*\]$/.test(storageHistory)) {
      initialHistory = JSON.parse(storageHistory)
    }
  }
  catch{
    window.localStorage.setItem('history', '[]')
  }
}


// 遍历menuData
const deepMap = (data: ServerMenuList, callback: (menu: ServerMenu) => ServerMenu): ServerMenuList => {
  return data.map(route => {
    // 合并子父级中相同路径的路由
    const rOute = callback(route)
    let children = route.children //|| route.routes
    if (children) {
      children = deepMap(children, callback)
    }
    return {
      ...rOute,
      children
    }
  })
}
// 扁平化route
type List = Array<{ children?: ServerMenuList, routes?: Array<RouteInterface>, redirect?: boolean, path: string }>

const getFlatRoutes = (list: Array<ServerMenu | RouteInterface>): Flatmenu | FlatRouter => {
  const pathMap = {}
  const inner = (data: List) => {
    // 扁平化的时候去掉子级
    data.forEach(({ children, routes, redirect, ...route }) => {
      if (redirect) return
      // 合并子父级中相同路径的路由
      if (route.path) {
        pathMap[route.path] = pathMap[route.path] ? { ...pathMap[route.path], ...route } : route
      }
      if (routes) {
        inner(routes as List)
      } else if (children) {
        inner(children)
      }
    })
  }
  inner(list as List)
  return pathMap
}

// 合并历史记录
function updateHistory(needUpdateHistory: History): History {
  const username = window.localStorage.getItem('username')
  const history = JSON.parse(window.localStorage.getItem(`history:${username}` || "[]") as string)
  const unionHistory: History = unionBy(needUpdateHistory, history, 'pathname');
  const finalHistory: History = take(unionHistory, 20).map(his => omitBy(his, isEmpty) as Location)
  if (window && window.localStorage) {
    window.localStorage.setItem(`history:${username}`, JSON.stringify(finalHistory))
  }
  return finalHistory
}

const computedHistory = (newHistory: History, { merged }: MenuState): History => {
  const historyStageAvilable = newHistory.map(({ ...item }) => {
    const key = item.key || Math.random().toString(16).slice(2, 8)
    if (merged && merged[item.pathname]) return ({ ...item, name: merged[item.pathname][localeName], key })
    return { ...item, key }
  }).filter(item => item.name)
  return updateHistory(historyStageAvilable)
}


// 获取最大公有路径path
const getMinCommonPath = (list: ServerMenuList) => {
  const paths = { '': 0 }
  list.forEach(item => {
    if (!item.path) {
      if (item.children && item.children.length) {
        item.path = getMinCommonPath(item.children)
      } else {
        // 创建了分类，但是没有创建子菜单项
        return
        // console.table(item)
        // throw new Error(`请配置在config.json文件配置${item.originPath}的reactPath`)
      }
    }
    const pathArray = getPathArr(item.path) // .match(/(\/\w+)/g)

    if (pathArray.length) {
      // 避免当前子级菜单的ptah进入计算，但又至少保证有一个
      pathArray.slice(0, Math.max(pathArray.length - 1, 1)).reduce((path, curPath) => {
        const computedPath = path + curPath
        if (paths[computedPath]) {
          paths[computedPath] += 1
        } else {
          paths[computedPath] = 1
        }
        return computedPath
      }, '')
    }
  })
  let parentPath = ''
  for (const path in paths) {
    if (paths[path] >= paths[parentPath]) {
      parentPath = path
    }
  }
  return parentPath
}

// 去掉路径上面的参数和hash值
// function getPlainPath(path) {
//   const urlreg = /^#(?:\w+\.)+\w+/
//   const matches = path.match(urlreg)
//   if (matches) {
//     return matches[0]
//   }
//   return path
// }

// 更新路由的名称显示
const getClientRoute = (route: RouteInterface, pathArr: Array<string>, name: string, nameEn: string): RouteInterface => {
  const assignRoute = { ...route }
  let validateArr = [] as Array<boolean>
  // 验证是否有匹配项
  let validate = false
  if (route.redirect || !route.path) { // 有重定向
    return assignRoute
  }

  if (route.path === "/") {
    validate = true
  } else {
    // pathArr [/sys, /sys/right, /sys/right/ment]
    // 是否其中一个与当前route匹配
    validateArr = pathArr.map(path => pathToRegexp(route.path).test(path))
    validate = validateArr.some(Boolean)
  }

  if (validate) {
    // 匹配到根节点
    if (validateArr.length > 0 && validateArr.findIndex(Boolean) === validateArr.length - 1) { // 更新当前路由
      // if (locale === 'zh-CN') { 
      //   assignRoute.name = name
      // } else {
      //   assignRoute.nameEN = nameEN
      // }
      assignRoute.name = name
      assignRoute.nameEn = nameEn
    }
    else if (route.routes && route.routes.length) {
      assignRoute.routes = route.routes.map(subRoute => getClientRoute(subRoute, pathArr, name, nameEn))
    }
  }
  return assignRoute
}

// 格式化导航结构
// 有子节点的菜单项才会进这个方法
interface LeafsGroup {
  [id: string]: ServerMenuList
}
const findChild = (menuItem: ServerMenu, leafsGroup: LeafsGroup, leafHasChild: ServerMenuList): ServerMenu => {

  const childLeafs = leafsGroup[menuItem.id]
  if (!childLeafs || !childLeafs.length) return menuItem

  const children = childLeafs.map(child => {
    const hasChild = leafHasChild.some(item => item.id === child.id)
    if (hasChild) {
      return findChild(child, leafsGroup, leafHasChild)
    }
    return child
  })
  return {
    ...menuItem,
    children,
  }
}

const mergeRoute = (menus: Flatmenu, routes: FlatRouter): Merged => {
  // 转发menu路径为通配符格式
  const computedMenus = {}
  const computedKeys = []
  for (const path of Object.keys(menus)) {
    const menu = menus[path]
    // dashboard的菜单不转化
    if (menu.leaf && !menu.path.startsWith('/dashboard')) { // 叶子节点，一般对应有视图
      const wildPath = `/**${getPathArr(path).slice(-1)}`
      computedMenus[wildPath] = menu
      computedKeys.push(wildPath)
      continue
    }
    computedMenus[path] = menu
    computedKeys.push(path)
  }

  const routesKeys = Object.keys(routes)
  const keys = new Set([...routesKeys, ...computedKeys])

  const merged = {}
  for (const key of keys) {
    if (computedMenus[key]) { // 如果是菜单数据，就以菜单路径为key
      merged[computedMenus[key].path] = computedMenus[key]
    } else {
      merged[key] = routes[key]
    }
  }

  return merged
}

// 菜单数据icon转化
const getMenuIcon = (icon: string | React.ReactNode, type?: string): React.ReactNode => {
  return <Icon type={icon} />
};

// 将面板数据转化为菜单数据
const convertDashboardToMenu = (list: Dashboards): ServerMenuList => {
  let dashboardMenu: ServerMenuList = []
  if (list && list.length) {
    dashboardMenu = list.map(item => {
      if (item.id === 'default') return undefined
      return {
        icon: getMenuIcon("dashboard", 'ant'),
        iconPath: "dashboard",
        name: item.name,
        path: `/dashboard/${item.id}`,
        leaf: true
      }
    }).filter(Boolean) as ServerMenuList
  }
  return dashboardMenu
}

const initialState = {
  history: initialHistory as History,
}


export namespace MenuTypes {
  export type history = History
  export type serveMenu = ServerMenuList
  export type flatMenu = Flatmenu
  export type clientRoute = RouteInterface
  export type flatroutes = FlatRouter
  export type merged = Merged
  export type dashboards = Dashboards
}

export interface MenuState {
  history?: MenuTypes.history,
  serveMenu?: MenuTypes.serveMenu,
  flatmenu?: MenuTypes.flatMenu,
  clientRoute?: MenuTypes.clientRoute,
  flatroutes?: MenuTypes.flatroutes,
  merged?: MenuTypes.merged,
  dashboards?: MenuTypes.dashboards
}


export interface Menu extends Model {
  state: MenuState
}

export default {
  namespace: 'menu',
  state: initialState,
  effects: {
    * getMenu({ payload: { route } }, { call, put }) {
      const menuData: ServerMenuList = yield call(getReactStartMenuAPI)
      const res = yield call(fetchDashboards)
      let dashboardMenu: ServerMenuList = []
      let dashboards: Dashboards = []
      if (res) {
        dashboards = JSON.parse(res.bigData).data
        dashboardMenu = convertDashboardToMenu(dashboards)
      }
      const coverData = menuData.map(item => {
        const menuItem = {
          ...item,
          icon: getMenuIcon(getRealIcon(item.icon as string)),
          iconPath: getRealIcon(item.icon as string)
        }
        // 处理参数
        const match = item.path ? item.path.match(/\?\{.* countKey:(.*?)(,?)\}/) : null
        if (match) {
          const [, countKey] = match
          return {
            ...menuItem,
            countKey: countKey.replace(/[\s']*/g, '')
          }
        }
        return menuItem
      })
      // hack-提供临时的组织机构菜单
      // coverData.unshift({
      //   name: tr('组织机构管理'),
      //   icon: "icon-yonghuzhanghaoguanli",
      //   parentResourceId: username === 'iP2Admin' ? '1' : 'BFnQBXRW6DbuAXxVpOs',
      //   path: '/sysmgmt/sysrightmanage/orgstructuremanage'
      // });
      // hack结束

      const { leaf = [], root = [] } = groupBy(coverData, (item: ServerMenu) => ['ROOT', '0'].includes(item.parentResourceId) ? 'root' : 'leaf') as {
        leaf: ServerMenuList,
        root: ServerMenuList
      }
      // 子菜单分类
      const leafHasChild = leaf.filter(item => !(item as ServerMenu).leaf) // 找到不是叶子节点的子节点，可能二级、可能三级
      // 按照父级分类
      const leafsGroup = groupBy(leaf, 'parentResourceId') as LeafsGroup

      const serveMenu = map(root, (item: ServerMenu) => findChild(item, leafsGroup, leafHasChild)).map(item => {
        if (item.children && item.children.length) {
          return { ...item, path: getMinCommonPath(item.children) }
        }
        return item
      })

      const defaultDashboard = {
        icon: getMenuIcon('dashboard', 'ant'),
        iconPath: 'dashboard',
        name: tr('基础仪表板'),
        path: '/dashboard/default',
        leaf: true
      } as ServerMenu
      const boardmgmtDashboard = {
        icon: getMenuIcon('codepen', 'ant'),
        iconPath: 'dashboard',
        name: tr('仪表板管理'),
        path: '/dashboard/boardmgmt',
        leaf: true
      } as ServerMenu
      serveMenu.unshift({
        icon: getMenuIcon('dashboard', 'ant'),
        name: tr('仪表板'),
        path: '/dashboard',
        children: [defaultDashboard, ...dashboardMenu, boardmgmtDashboard]
      } as ServerMenu)
      const flatmenu = getFlatRoutes(serveMenu) as Flatmenu
      const flatroutes = getFlatRoutes([route]) as FlatRouter
      const merged = mergeRoute(flatmenu, flatroutes)
      yield put({
        type: 'setMenu',
        payload: {
          serveMenu,
          flatmenu,
          clientRoute: route,
          flatroutes,
          merged,
          dashboards
        }
      })
    },


    *updateRouteName({ payload }, { call, put, select }) {
      const { pathname, name, nameEn } = payload
      const { clientRoute, flatmenu } = yield select(store => store.menu)
      const pathArray = getPathArr(pathname)
      const resolvedPathArray = pathArray.map((path, index, arr) => arr.slice(0, index + 1).join(''))
      const route = getClientRoute(clientRoute, resolvedPathArray, name, nameEn)
      const flatroutes = getFlatRoutes([route])
      const merged = mergeRoute(flatmenu, flatroutes)
      yield put({
        type: 'setMenu',
        payload: {
          clientRoute: route,
          flatroutes,
          history: updateHistory([payload]),
          merged
        }
      })
    },

    *getSummary({ payload, callback, final }, { call, put, select }) {
      try {
        const { serveMenu } = yield select(store => store.menu)
        const res = yield call(getBizSummary, { data: { topics: payload } })
        if (!isEmpty(res)) {
          const newServeMenu = deepMap(serveMenu, (item: ServerMenu) => {
            if (res[item.id]) {
              return {
                ...item,
                badge: res[item.id]
              }
            }
            return item
          })
          yield put({
            type: 'setMenu',
            payload: {
              serveMenu: newServeMenu,
            }
          })
        }

        if (callback) { callback() }
      }
      catch{
        // 错误上报
      }
      finally {
        if (final) { final() }
      }
    },
  },

  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    saveDashBoards(state, { payload }) {
      const { dashboards }: { dashboards: Dashboards } = payload
      const { serveMenu } = state
      const dashboardMenu = convertDashboardToMenu(dashboards)
      let originDashboardMenu = serveMenu[0].children
      originDashboardMenu = [originDashboardMenu[0], ...dashboardMenu, originDashboardMenu.slice(-1)[0]]
      serveMenu[0].children = originDashboardMenu
      return {
        ...state,
        dashboards,
        serveMenu: [...serveMenu]
      }
    },
    setMenu(state, { payload }) {
      const computedState = {
        ...state,
        ...payload,
      }
      // 解决初始页面无法被历史记录获取的问题
      if (historyStage.length) {
        const history = computedHistory(historyStage, computedState)
        historyStage.splice(0, historyStage.length)
        return {
          ...computedState,
          history
        }
      }
      return computedState
    },
    // 处理历史记录
    resolveHistory(state, { payload }) {
      const { flatroutes } = state;

      if (!flatroutes) { // 路由系统正在装载
        historyStage.push(payload)
        return state;
      }
      return {
        ...state,
        history: computedHistory([payload], state)
      }
    },
    resetState() {
      return initialState
    }
  },

  subscriptions: {
    listenRouter({ history, dispatch }) {
      history.listen(location => {
        dispatch({
          type: 'resolveHistory',
          payload: location
        })
      })
    },
    // logout({history, dispatch}) {
    //   history.listen(location => {
    //     if (location.pathname === '/login') {
    //       dispatch({
    //         type: 'resetState'
    //       })
    //     }
    //   })
    // }
  }
} as Menu
