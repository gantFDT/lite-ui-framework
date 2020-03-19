import { gStatus } from './utils'

export default {
  '/security/getReactStartMenu': [{
    id: "1",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "智能表格",
    path: "/smart/smarttable",
    description: "",
    icon: "table",
    leaf: true,
    children: [],
  }, {
    id: "2",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "智能详情",
    path: "/smart/smartdetail/5",
    description: "",
    icon: "form",
    leaf: true,
    children: [],
  }, {
    id: "3",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    name: "定制主题",
    path: "/sysmgmt/account/uiconfig",
    description: "",
    icon: "skin",
    leaf: true,
    children: [],
  },{
    id: "4",
    parentResourceId: "ROOT",
    type: "REACTMENU_CATEGORY_ITEM",
    path: "/sysrightmanage/customlanguage",
    name: "客制化语言",
    description: "",
    icon: "global",
    leaf: true,
    children: [],
  }]
}