import { gStatus } from './utils'

export default {
  '/security/getReactStartMenu': [{
    id: "8Xd6ismZdMPAMqP7GXl",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY",
    name: "系统管理",
    description: "",
    icon: "setting",
    leaf: false,
    children: [],
  }, {
    id: "ViYKC587a1kwTSRXnsA",
    parentResourceId: "8Xd6ismZdMPAMqP7GXl",
    type: "REACTMENU_CATEGORY_ITEM",
    path: "/sysrightmanage/customlanguage",
    name: "客制化语言",
    description: "",
    icon: "global",
    leaf: true,
    children: [],
  },{
    id: "9Xd6ismZdMPAMqtfrwe",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "示例",
    path: "/example",
    description: "",
    icon: "appstore",
    leaf: true,
    children: [],
  },{
    id: "9Xd6ismghyPAMqtfrwe",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "智能表格",
    path: "/list/smarttable",
    description: "",
    icon: "appstore",
    leaf: true,
    children: [],
  },{
    id: "6456ismghyPAMqtfrwe",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "智能详情",
    path: "/detail/detail",
    description: "",
    icon: "appstore",
    leaf: true,
    children: [],
  }],


  // '/security/getReactStartMenu': async () => {
  //   const data = await db['menu'].toArray();
  //   return data
  // },
}