import { get as _get } from 'lodash'
import React, { ReactNode, useEffect, useCallback } from 'react'
import { notification } from 'antd'

export interface MainConfigProps {
  headerHeight: number,
  fullscreen: boolean,
  showBreadcrumb: boolean
}

/* eslint no-useless-escape:0 import/prefer-default-export:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;
export function isUrl(path: string): boolean {
  return reg.test(path);
} // 给官方演示站点用，用于关闭真实开发环境不需要使用的特性

export function isAntDesignProOrDev(): boolean {
  const {
    NODE_ENV
  } = process.env;

  if (ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site') {
    return true;
  }

  if (NODE_ENV === 'development') {
    return true;
  }

  return window.location.hostname === 'preview.pro.ant.design';
}

/**
 * 判断ie版本
 */
export function IEVersion() {
  const { userAgent } = navigator; // 取得浏览器的userAgent字符串
  const isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
  const isEdge = userAgent.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgent.indexOf('Trident') > -1 && userAgent.indexOf("rv:11.0") > -1;
  if (isIE) {
    const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgent);
    const fIEVersion = parseFloat(RegExp.$1);
    if (fIEVersion == 7) {
      return 7;
    } if (fIEVersion == 8) {
      return 8;
    } if (fIEVersion == 9) {
      return 9;
    } if (fIEVersion == 10) {
      return 10;
    }
    return 6; // IE版本<=7

  } if (isEdge) {
    return 'edge'; // edge
  } if (isIE11) {
    return 11; // IE11
  }
  return -1; // 不是ie浏览器

}

// 获取cookie、
export function getCookie(name: string): string | null {
  var arr, reg = new RegExp("(^| )" + name + "=([^;]*)(;|$)");
  if (arr = document.cookie.match(reg)) {
    return unescape(arr[2]);
  } else {
    return null;
  }
}

// 删除cookie
export function delCookie(name: string): void {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1000000);
  // 这里需要判断一下cookie是否存在
  var c = getCookie(name);
  if (c != null) {
    document.cookie = name + "=" + c + ";expires=" + exp.toUTCString() + ";path=/";
  }
}

// 设置cookie,增加到实例方便全局调用
export function setCookie(name: string, value: string, time: any = '', path: string = ''): void {
  if (time && path) {
    var strsec = time * 1000;
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString() + ";path=" + path;
  } else if (time) {
    var strsec = time * 1000;
    var exp = new Date();
    exp.setTime(exp.getTime() + strsec * 1);
    document.cookie = name + "=" + escape(value) + ";expires=" + exp.toUTCString();
  } else if (path) {
    document.cookie = name + "=" + escape(value) + ";path=" + path;
  } else {
    document.cookie = name + "=" + escape(value)
  }
}

//获取用户身份
export function getUserIdentity(): any {
  // 从cookie中导入
  let userIdentity = getCookie('userIdentity')
  if (userIdentity) {
    try {
      userIdentity = JSON.parse(decodeURIComponent(userIdentity))
    } catch {
      // message.error('用户数据被恶意篡改')
    }
  }

  return userIdentity
}

// 获取图片地址
// export function getImageById(pictureId: string): string {
//   const {
//     userToken,
//     userLoginName,
//     userLanguage
//   } = getUserIdentity();
//   return `/api/accountUser/getUserPicture?pictureId=${pictureId}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
// }

export function getImageById(pictureId: string) {
  const domain = 'http://data.yiheyishun.com/'
  const img = domain + '/' + pictureId;
  return img
}

/**
 * 解析url
 * @param {string} urlToken 地址
 */
export function resolveWithUser(urlToken: string): string {
  const {
    userToken,
    userLoginName,
    userLanguage
  } = getUserIdentity();
  let url = urlToken.startsWith('/api') ? urlToken : ('/api' + urlToken);
  if (url.indexOf('?') != -1) {
    url = `${url}&userLanguage=${userLanguage}`;
  } else {
    url = `${url}?userLanguage=${userLanguage}`;
  }
  url = `${url}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`;

  // if (!Ext.isEmpty(gantang.state.SessionHolder.delegateUserLoginName)) {
  //   url = url + '&delegateUserLoginName=' + gantang.state.SessionHolder.delegateUserLoginName;
  // }
  // return proxyTarget + url;
  return url;
}

// 通过id获取图片地址
export function getImageByPreviewId(previewId: string): string {
  if (!previewId) return ``;
  if (~previewId.indexOf('/')) return previewId;
  const {
    userToken,
    userLoginName,
    userLanguage
  } = getUserIdentity();
  const path = `/api/file/previewFile?id=${previewId}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  return path
}

/**
 * 节流函数
 * 只能用于普通函数，不能再class中的方法上使用
 * @param {timestamp} time 延迟毫秒数
 * @returns function wrapper
 */
export function throttle(time: number): (fn: any) => any {
  return function wrapper(fn) {
    let timer: any = null;
    /**
     * @returns 返回替代函数
     */
    return function wrapperInner(this: any, ...params: any) {

      // 不精确，可以改进
      if (!timer) {
        timer = setTimeout(() => {
          timer = null;
          fn.apply(this, params);
        }, time);
      }
    };
  };
}

/**
 * 获取一个随机Key
 */
export function getKey(): string {
  return Math.random().toString(32).slice(2)
}

/*
生成uuid
len:number  长度
radix:number  进制
*/
export function generateUuid(len: number = 32, radix: number = 10): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
  const uuid = []; let i;
  radix = radix || chars.length;

  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
  } else {
    // rfc4122, version 4 form
    let r;

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | Math.random() * 16;
        uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
}

/*
生成随机字符串
len:number  长度
*/
export function randomString(len: number = 48) {
  const chars = 'abcdefhijkmnprstwxyz2345678';
  let pwd = '', i, maxPos = chars.length;
  for (i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}


/*
 * @param hex 例如:"#23ff45"
 * @param opacity 透明度
 * @returns {string}
 */
export function hexToRgba(hex: any, opacity: number): string {
  const convertHex = hex.slice(1)
    .replace(/[0-9a-fA-F]/g, (match: string, index: number, string: string) => string.length <= 3 ? match.repeat(2) : match)
    .padEnd(6, '0').slice(0, 6)
    .match(/[0-9a-fA-F]{1,2}/g)
    .map((n: any) => parseInt(n, 16)).join()

  return `rgba(${convertHex},${opacity})`;
  // return "rgba(" + parseInt("0x" + hex.slice(1, 3)) + "," + parseInt("0x" + hex.slice(3, 5)) + "," + parseInt("0x" + hex.slice(5, 7)) + "," + opacity + ")";
}

/**
 * 判断类型
 */
export const getType = (obj: any) => Object.prototype.toString.call(obj).slice(8, -1);

/**
 * JSON深拷贝
 */
export const deepCopy4JSON: <T>(data: T) => T = (obj) => JSON.parse(JSON.stringify(obj));

/**
 * JSON数据相等
 */
export const JSONisEqual = (a: object, b: object) => JSON.stringify(a) === JSON.stringify(b);

/**
 * 判断参数是不是空的 // {xxxx:undefined} => 空的
 */
export const isParamsEmpty = (value: object) => {
  if (getType(value) !== 'Object') throw '只能判断Object类型';
  const entries = Object.entries(value);
  return !entries.length || Object.entries(value).every(([key, value]) => value === undefined)
};

// 初始格式请求接口参数
export const initParams = {
  pageInfo: {
    pageSize: 50,
    beginIndex: 0
  },
  filterInfo: {
    filterModel: true
  }
}

// 格式化请求接口参数
export const formatParams = ({
  beginIndex,
  pageSize,
  ...restParams
}: any = {}) => {
  const fakeParams: any = {
    filterInfo: {
      filterModel: true,
      ...restParams
    }
  };
  if (beginIndex !== undefined) {
    fakeParams.pageInfo = {
      pageSize,
      beginIndex
    }
  }
  return fakeParams
}

export const compose: <T extends (param: K) => K, K>(...args: Array<T>) => T = (...func: any[]) => func.filter(fun => typeof fun === 'function').reduce((a, b) => (...args: any[]) => a(b(...args)), (args: any) => args)

// 根据后端返回的icon字符串，得到iconfont可识别的id
export const getRealIcon = (icon: string): string => icon ? icon.replace(/^.*(icon-\w+).*$/, '$1') : 'icon-file-text-o'


// 返回第一级路径
export const getRootPath = (path: string) => path && path.replace(/^(\/.*?)\/.*$/, '$1');
export const getPathArr = (path: string = ''): Array<string> => path.match(/(\/\w+)/g) as Array<string>



// 动态加载model
export function importModel(m: any, cb: Function) {
  const hasThisMdoel = _.find(window['g_app']._models, item => item.namespace == m.default.namespace)
  if (hasThisMdoel) { return }
  window['g_app'].model(m.default);
  cb();
}

// 通过key,value查找树节点
export function getTreeNode(Data: any[], childrenKey: string, key: string, value: any): any {
  if (_.isEmpty(Data)) {
    return
  }
  let Deep; let T; let F;
  for (F = Data.length; F;) {
    T = Data[--F]
    if (value === T[key]) {
      return T
    }
    if (T[childrenKey]) {
      Deep = getTreeNode(T[childrenKey], childrenKey, key, value)
      if (Deep) return Deep
    }
  }
}

// 格式化组织数Data
export function formatTreeData(Data: any[], childrenKey: string = 'children', {
  title,
  value = 'id',
  key = 'id'
}: any = {}, cb?: (V: any) => void) {
  let Deep; let V; let L;
  for (L = Data.length; L;) {
    V = Data[--L];
    // 兼容 TreeSelect 组件
    if (title) {
      V.title = V[title];
      V.value = V[value];
      V.key = V[key];
    }
    if (cb) {
      cb(V)
    }
    if (V[childrenKey]) {
      if (V[childrenKey].length)
        Deep = formatTreeData(V[childrenKey], childrenKey, {
          title,
          value,
          key
        }, cb)
      else
        delete V[childrenKey]
    }
  }
}

// 扁平化tree取id数组
export function fromTree2arr(Data: any[], childrenKey: string = 'children', field: string = 'id'): any[] {
  let V; let L; let IDs = [];
  for (L = Data.length; L;) {
    V = Data[--L];
    IDs.push(V[field])
    if (V[childrenKey] && V[childrenKey].length) {
      IDs = [...IDs, ...fromTree2arr(V[childrenKey], childrenKey, field)]
    }
  }
  return IDs;
}

// list转树形结构数据
export function generateTree(data: any[], parentId: string | undefined = undefined, keyName: string = 'key'): any[] {
  const itemArr = [];
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    if (node.parentId === parentId) {
      const children = generateTree(data, node.id, keyName)
      const newNode = {
        ...node,
        [keyName]: node.id,
        children
      };
      if (children.length == 0) {
        delete newNode.children
      }
      itemArr.push(newNode);
    }
  }
  return itemArr;
}
//树形数据扁平化
export const treeDataExpand = (dataSource: any[], childrenKey: string = 'children') => {
  let arr: any[] = [];
  const expanded = (data: any[]) => {
    if (data && data.length > 0) {
      data.forEach(item => {
        arr.push(item);
        expanded(item[childrenKey]);
      })
    }
  };
  expanded(dataSource);
  return arr;
}


/**
 * 根据文件获取大小获取对应带单位的字符串
 * @param {number |} num 文件size
 */
export function getFileUnit(size: number | string): string {
  const num = parseInt(`${size}`, 10)
  const B = 1024
  const KB = B ** 2
  const MB = B ** 3
  const GB = B ** 4
  let res: string | number = 0
  let unit = ''
  if (num < B) {
    res = num
    unit = 'B'
  } else if (num >= B && num < KB) {
    res = num / B
    unit = 'KB'
  } else if (num >= KB && num < MB) {
    res = num / KB
    unit = 'M'
  } else if (num >= MB && num < GB) {
    res = num / MB
    unit = 'G'
  }
  res = parseInt(res.toString(), 10) === res ? res : res.toFixed(2)
  return `${res} ${unit}`
}


/**
 * 根据文件后缀名获取对应的图标名称
 * @param {string} fileName 文件名称
 */
export function getIconNameByFileName(fileName: string) {
  const suffix = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  const map = {
    'file-text': ['txt', 'html', 'htm', 'css', 'js'],
    'file-image': ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'svg'],
    // 'file-audio': ['wav', 'aif', 'aiff', 'au', 'mp3', 'ra', 'rm', 'ram', 'mid', 'rmi', 'aac', 'flac', 'ape'],
    // 'file-video': ['mp4', 'wmv', 'asf', 'asx', '3gp', 'rm', 'rmvb', 'mov', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob'],
    'file': ['wav', 'aif', 'aiff', 'au', 'mp3', 'ra', 'rm', 'ram', 'mid', 'rmi', 'aac', 'flac', 'ape', 'mp4', 'wmv', 'asf', 'asx', '3gp', 'rm', 'rmvb', 'mov', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob'],
    'file-word': ['doc', 'docx', 'docm', 'dotx', 'dotx'],
    'file-excel': ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],
    'file-ppt': ['ppt', 'pptx', 'pptm', 'ppsx', 'potx', 'potm', 'ppam'],
    'file-pdf': ['pdf'],
    'file-zip': ['zip', 'gzip', '7z', 'rar', 'cab', 'ace', 'tar', 'jar', 'gz', 'lzh', 'iso', 'uue', 'arj', 'bz2'],
    'file-md': ['md']
  }

  let iconName = 'file-unknown'

  Object.keys(map).some(key => {
    const isMatch = map[key].indexOf(suffix) !== -1
    if (isMatch) {
      iconName = key
    }
    return isMatch
  })

  return iconName
}

/**
 * 根据文件后缀名获取对应的图标图片
 * @param {string} fileName 文件名称
 */
export function getIconImageByFileName(fileName: string, isFolder = false) {
  let iconName = 'unknow'
  if (isFolder) {
    iconName = 'filedir'
  } else {
    const suffix = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
    const map = {
      'audio': ['wav', 'aif', 'aiff', 'au', 'ra', 'rm', 'ram', 'mid', 'rmi', 'aac', 'flac', 'ape'],
      'css': ['css', 'less', 'scss', 'sass'],
      'excel': ['xls', 'xlsx', 'xlsm', 'xltx', 'xltm', 'xlsb', 'xlam'],
      'exe': ['exe'],
      'file': [],
      'html': ['html', 'htm', 'xml'],
      'image': ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'svg'],
      'js': ['js'],
      'markdown': ['md'],
      'mp3': ['mp3'],
      'mp4': ['mp4'],
      'pdf': ['pdf'],
      'ppt': ['ppt', 'pptx', 'pptm', 'ppsx', 'potx', 'potm', 'ppam'],
      'text': ['txt'],
      'video': ['asf', 'asx', '3gp', 'rm', 'rmvb', 'mov', 'm4v', 'avi', 'dat', 'mkv', 'flv', 'vob'],
      'wmv': ['wmv'],
      'word': ['doc', 'docx', 'docm', 'dotx', 'dotx'],
      'zip': ['zip', 'gzip', '7z', 'rar', 'cab', 'ace', 'tar', 'jar', 'gz', 'lzh', 'iso', 'uue', 'arj', 'bz2']
    }

    Object.keys(map).some(key => {
      const isMatch = map[key].indexOf(suffix) !== -1
      if (isMatch) {
        iconName = key
      }
      return isMatch
    })
  }

  return `/fileicons/${iconName}.png`
}

/**
 * 根据文件名判断文件是否是图片
 * @param fileName
 */
export function isImageByFilename(fileName: string) {
  const suffix = fileName.slice(fileName.lastIndexOf('.') + 1).toLowerCase()
  return ['bmp', 'jpg', 'jpeg', 'png', 'gif', 'svg'].includes(suffix)
}

// 基础reducer
export function reducer(state: any, action: any) {
  switch (action.type) {
    case 'save':
      return {
        ...state, ...action.payload
      }
  }
}

// 根据width换算栅格占位格数
export function spanCalculate(width: number): number {
  if (width < 576) {
    return 24
  } if (width < 768) {
    return 12
  } if (width < 992) {
    return 8
  } if (width < 1200) {
    return 8
  } if (width < 1600) {
    return 6
  }
  return 6

};

// 将css变量格式装换成小驼峰 `--primary-color:blue;--sider-menu-bg:red` => `{primaryColor:'blue',siderMenuBg:'red'}`
export function cssVar2camel(styles: string, keys2format: string[]) {
  function formatCamel(str: string) {
    return str.slice(2).split('-').map((V, I) => (I ? V[0].toUpperCase() : V[0]) + V.slice(1)).join('')
  }
  return Object.entries(styles)
    .filter(([key]) => key.startsWith('--') && keys2format.includes(formatCamel(key)))
    .reduce((prev, curt) => {
      const [key, value] = curt;
      const camelKey = formatCamel(key);
      return {
        ...prev,
        [camelKey]: value,
      }
    }, {})
}

// 将小驼峰转换成css变量格式 `{primaryColor:'blue',siderMenuBg:'red'}` => `--primary-color:blue;--sider-menu-bg:red`
export function camel2cssVar(config: object, keys2format: string[]) {
  return Object.entries(config)
    .filter(([key]) => keys2format.includes(key))
    .reduce((prev, curt) => {
      const [key, value] = curt;
      const cssVar = `--${key.replace(/([A-Z])/g, "-$1").toLowerCase()}`;
      return {
        ...prev,
        [cssVar]: value,
      }
    }, {})
}

// 获取两个时间的间隔描述
export function getTimeInterval(startTimeStr: string, endTimeStr: string): string {
  const startTime: any = new Date(startTimeStr); // 开始时间
  const endTime: any = new Date(endTimeStr); // 结束时间
  let seconds: number | string = Math.floor((endTime - startTime) / 1000); // 秒数
  let minutes: number | string = Math.floor((endTime - startTime) / 1000 / 60); // 分钟
  let hours: number | string = Math.floor((endTime - startTime) / 1000 / 60 / 60); // 小时
  let days: number | string = Math.floor((endTime - startTime) / 1000 / 60 / 60 / 24); // 天数
  if (seconds < 60) {
    return `<1${tr('分钟')}`
  }
  days = days ? (days + tr('天')) : ''
  hours = hours ? (hours + tr('时')) : ''
  minutes = minutes ? (minutes + tr('分')) : ''
  seconds = seconds ? (seconds + tr('秒')) : ''
  return days + hours + minutes + seconds
}

/**
 * 解析路由的查询参数query
 * @param {Object} query
 */
export function resolveLocationQuery(query: any): any {
  const res = {}
  if (typeof query !== 'object') {
    return res
  }
  Object.keys(query).forEach((key) => {
    let tempValue = ''
    const value = query[key]
    try {
      tempValue = JSON.parse(value)
    } catch (error) {
      tempValue = value
    }
    res[key] = tempValue
  })
  return res
}

/**
 * 获取model中的某个属性
 * @param path path可以是modal的namespace，或者state中某个具体的属性
 * 例如path='config'获取到namespace为config的状态
 *     path = 'config.SYSMGMT_CONFIG.workflow'则可以获取到workflow的值
 */
export const getModelData = (path: string) => {
  const store = window['g_app']._store.getState()
  if (typeof store !== 'object') {
    throw new Error(tr(`redux初始异常`))
  }
  return _get(store, path)
}


// 上下margin高度
export const MARGIN_HEIGHT = 10
// 面包屑高度
export const BREAD_CRUMB_HEIGHT = 40
// Card border高度
export const CARD_BORDER_HEIGHT = 2
// Table border 高度
export const TABLE_BORDER_HEIGHT = 0
// Table title 高度
export const TABLE_TITLE_HEIGHT = 40
// Table header 高度
export const TABLE_HEADER_HEIGHT = 29
// Table footer 高度
export const TABLE_FOOTER_HEIGHT = 34
// Modal header 高度
export const MODAL_HEADER_HEIGHT = 41
// Modal 上下单个 padding 高度
export const MODAL_PADDING_HEIGHT = 10
// Modal footer 高度
export const MODAL_FOOTER_HEIGHT = 45
// BlockHeader组件 高度
export const BLOCK_HEADER_HEIGHT = 40

/**
 * 适用于获取内容区域(除header,面包屑以外)的高度
 * @param MAIN_CONFIG
 * @param diff
 */
export const getContentHeight = (MAIN_CONFIG: MainConfigProps, diff?: number) => {
  const { headerHeight, showBreadcrumb, fullscreen } = MAIN_CONFIG;
  const ContentPaddingTop = headerHeight + (showBreadcrumb ? 0 : MARGIN_HEIGHT);
  const BreadcrumbHeight = showBreadcrumb ? BREAD_CRUMB_HEIGHT : 0;
  const tempDiff = typeof diff === 'undefined' ? 0 : diff
  const marginBottom = MARGIN_HEIGHT
  const FinalDiffHeight = (fullscreen ? 0 : (BreadcrumbHeight + ContentPaddingTop + marginBottom)) + tempDiff;
  return `calc(100vh - ${FinalDiffHeight}px)`
}

/**
 * 获取页面内table组件的高度，适用于普通Table和SmartTable
 * @param {object} MAIN_CONFIG
 * @param {number} diff 额外内容高度，例如 SmartSearch 的高度
 * @param {boolean} withFooter 是否有分页条
 * @param {boolean} withTitle 是否有标题栏
 */
export const getTableHeight = (MAIN_CONFIG: MainConfigProps, diff?: number, withFooter?: boolean, withTitle?: boolean) => {
  const { headerHeight, showBreadcrumb, fullscreen } = MAIN_CONFIG;
  const tempDiff = typeof diff === 'undefined' ? 0 : diff;
  const tempWithFooter = typeof withFooter === 'undefined' ? true : withFooter;
  const tempwithTitle = typeof withTitle === 'undefined' ? true : withFooter
  const ContentPaddingTop = headerHeight + (showBreadcrumb ? 0 : MARGIN_HEIGHT)
  const BreadcrumbHeight = showBreadcrumb ? BREAD_CRUMB_HEIGHT : 0;
  const ContentMarginBottom = MARGIN_HEIGHT;
  const TableFooterHeight = tempWithFooter ? TABLE_FOOTER_HEIGHT : 0;
  const tableTitleHeight = tempwithTitle ? TABLE_TITLE_HEIGHT : 0

  const FinalDiffHeight = (fullscreen ? 0 : (BreadcrumbHeight + ContentPaddingTop)) + CARD_BORDER_HEIGHT + TABLE_BORDER_HEIGHT + ContentMarginBottom + tableTitleHeight + TableFooterHeight + tempDiff;

  return `calc(100vh - ${FinalDiffHeight}px)`
}

//通用confirm
import { Modal } from 'antd'
const { confirm } = Modal
interface confirmUtilProps {
  content: string | ReactNode; //提示内容
  onOk: Function;             //确定按钮触发方法
  okLoading?: boolean;        //点击确定时的loading
}
export const confirmUtil = (props: confirmUtilProps) => {
  const { content, onOk, okLoading } = props;
  confirm({
    title: tr('提示'),
    content,
    cancelText: tr('取消'),
    okText: tr('确定'),
    okType: 'danger',
    okButtonProps: {
      size: 'small',
      type: 'danger',
      loading: okLoading,
    },
    cancelButtonProps: {
      size: 'small'
    },
    onOk() {
      return new Promise((resolve, reject) => {
        onOk && onOk()
        resolve()
      }).catch((e) => console.log('confirm errors!', e));
    },
    onCancel() { }
  });
}

/**
 * 用于显示后端返回的提示信息
 * @param msg
 */
export const showInfoMsg = (msg: string, modalProps: any = {}) => {
  Modal.info({
    title: tr('信息'),
    centered: true,
    content: <div dangerouslySetInnerHTML={{ __html: msg }} />,
    okButtonProps: { size: 'small' },
    okText: tr('确定'),
    maskClosable: true,
    ...modalProps
  })
}

/**
 * 令牌桶
 * @param total //桶容量
 * @param currentTokenCount //桶当前、初始令牌数
 * @param interval //多久添加一个令牌，单位s
 *
 */
export class TokenBucket {
  total: number;
  currentTokenCount: number;
  interval: number;
  _timer: any | undefined;
  constructor(total: number, currentTokenCount: number, interval: number) {//constructor是一个构造方法，用来接收参数
    this.total = total
    this.currentTokenCount = currentTokenCount
    this.interval = interval
  }
  start() {
    this._timer = setInterval(() => {
      if (this.currentTokenCount < this.total) {
        this.currentTokenCount++
      }
    }, this.interval)
  }
  use() {
    this.currentTokenCount--
    if (this.currentTokenCount <= 0) {
      this.currentTokenCount = 0
      return new Promise(function (reslove, reject) {
        notification.destroy()
        notification['warning']({
          message: tr('操作过于频繁'),
          description: tr('您的操作过于频繁') + ',' + tr('请慢一点')
        })
        reslove()
      })
    }
  }
  stop() {
    if (this._timer) {
      clearInterval(this._timer)
    }
  }
}





/**
*向上递归冒泡找节点
*
* @param {object} target    //当前节点
* @param {string} className //节点class
* @returns  //找到的节点
*/
export const findDomParentNode = (target: object, className: string) => {
  let result = null;
  const bubble = (_target: object) => {
    if (!_target) { return }
    if (_target['className'].indexOf(className) >= 0) {
      result = _target
    } else {
      _target = _target['parentElement'];
      bubble(_target);
    }
  }
  bubble(target);
  return result;
}

/**
*
*前端性能分析
* @returns 计算后的分析数据
*/
export const getPerformanceTiming = () => {
  var performance = window.performance; if (!performance) { console.log('您的浏览器不支持performance属性'); return; }
  var t = performance.timing;
  var obj = {};
  // 重定向耗时
  obj['redirectTime'] = t.redirectEnd - t.redirectStart;
  // DNS查询耗时
  obj['lookupDomainTime'] = t.domainLookupEnd - t.domainLookupStart;
  // TCP链接耗时
  obj['connectTime'] = t.connectEnd - t.connectStart;
  // HTTP请求耗时
  obj['requestTime'] = t.responseEnd - t.responseStart;
  // 解析dom树耗时
  obj['domReadyTime'] = t.domComplete - t.domInteractive;
  // 白屏时间耗时
  obj['whiteTime'] = t.responseStart - t.navigationStart;
  // DOMready时间
  obj['domLoadTime'] = t.domContentLoadedEventEnd - t.navigationStart;
  // 页面加载完成的时间 即：onload时间
  obj['loadTime'] = t.loadEventEnd - t.navigationStart;
  return obj;
}



/**
*
*
* @param {*} str
*/
export const copy = (str: string) => {
  var save = function (e: any) {
    e.clipboardData.setData('text/plain', str);//下面会说到clipboardData对象
    e.preventDefault();//阻止默认行为
  }
  document.addEventListener('copy', save);
  document.execCommand("copy");//使文档处于可编辑状态，否则无效
}