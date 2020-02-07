

import { Tooltip, Icon } from 'antd'
// import Link from 'umi/link'
import actionStyles from '@/components/layout/globalheader/index.less'

const ORDER = 0;

//公用配置信息
const COMMON_CONFIG = {
  // 默认时间字符串格式
  defaultDateFormat: 'YYYY-MM-DD HH:mm:ss',
  //上传文件的大小的最大值(M)
  uploadFileSize: 10,

  //单点登录相关
  //按顺序加载登录链js文件及方法
  loginChain: [],
  //按顺序加载登出链js文件及方法
  logoutChain: [],
  //单点登录令牌名称
  ssoTokenName: undefined,
  //单点登录令牌类型
  ssoTokenType: undefined,
  //显示验证码功能(默认为false隐藏)
  validateCode: false,
  //登录地址
  loginUri: '/authentication/login',
  //登录用户类型
  loginUserType: null,
  //登录用户名
  loginUserName: 'admin',
  //登录密码
  loginPassword: '123456',


  //显示用户帐号编辑功能。在与单点登录系统集成时，往往用户由单点登录系统集中管理，所以需要关闭本系统功能
  showUserEdit: true,
  //显示用户退出功能
  showLogout: true,
  //是否开启个人设置密码功能
  showUpdateSelfPassword: true,
  //是否显示修改个人信息
  showUpdateSelfInfo: true,
  //是否显示用户代理菜单
  showDelegateMenu: true,


  //启动已注册的定时任务，比如30分钟不操作就logout
  startTaskRunner: true,
  //登录超时时间
  loginTimeout: 60 * 60 * 8,
  //显示通知按钮
  showMsgBtn: true,
  //是否显示下载客户端链接
  showDownloadClientLink: true,
  //客户端下载链接地址
  downloadClientUrl: '#',
  //是否显示切换语言的菜单
  showChangeLanguageMenu: true,
  //全局头部额外插槽，一般放置点击跳转的button
  globalHeaderExtra: <Tooltip title={tr('config文档')}>
    <a href="https://gant.yuque.com/fdt/gantreact/config" target="_blank" className={actionStyles.action}>
      <Icon type="question" />
    </a>
  </Tooltip>,
  //是否显示界面设置
  showUIConfig: true,
  //是否显示本地缓存清理
  showStorageClear: true,
  //是否显示全局搜索组件
  showGlobalSearch: true,//是否显示全局搜索
  //全局搜索跳转的路由
  globalSearchPath: "/framework/globalsearch",

}


export default {
  COMMON_CONFIG,
  ORDER
}