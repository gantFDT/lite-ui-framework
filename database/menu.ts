import { gStatus } from './utils'

export default {
  '/security/getReactStartMenu': [{
    id: "8Xd6ismZdMPAMqP7GXl",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY",
    name: "系统管理",
    description: "",
    icon: "iconfont icon-xitongguanli",
    seqNum: 2,
    leaf: false,
    children: [],
    optCounter: 1
  }, {
    id: "ViYKC587a1kwTSRXnsA",
    parentResourceId: "8Xd6ismZdMPAMqP7GXl",
    type: "REACTMENU_CATEGORY_ITEM",
    path: "/sysrightmanage/customlanguage",
    name: "客制化语言",
    description: "",
    icon: "iconfont icon-xitongguanli",
    seqNum: 6,
    leaf: true,
    children: [],
    optCounter: 2
  }],


  // '/security/getReactStartMenu': async () => {
  //   const data = await db['menu'].toArray();
  //   return data
  // },
}