export const initView = {
  viewId: "test0007",
  name: "测试初始查询参数",
  version: "2019-12-2 13:58:24",
  panelConfig: {
    searchFields: [
      { fieldName: "text", title: "文本", operator: "IN" },
      { fieldName: "userName", title: "用户", operator: "IN" },
      { fieldName: "group", title: "组织", operator: "IN" },
      { fieldName: "code", title: "枚举", operator: "IN" },
      { fieldName: "select", title: "下拉选择", operator: "IN" },
      { fieldName: "role", title: "角色", operator: "IN" },
      { fieldName: "userGroup", title: "用户组", operator: "IN" },
      { fieldName: "number", title: "数字", operator: "IS_NULL" }
    ],
    orderFields: [
      { fieldName: "text", title: "文本", orderType: "ASC" }
    ],
    uiConfig: { earchType: "click", labelAlign: "left" }
  }
}

export const initParams = [
  { fieldName: "text", operator: "IN", value: "小明，小强" },
  { fieldName: "userName", operator: "IN", value: [65] },
  { fieldName: "group", operator: "IN", value: ["sH47bl7MkZcQc9I6OZG"] },
  { fieldName: "code", operator: "IN", value: ["true", "false"] },
  { fieldName: "select", operator: "IN", value: ["1", "2", "3"] },
  { fieldName: "role", operator: "IN", value: ["bIeW2G3ZAxQxlp4X6T3", "zbWeUGq1TXCnhV72UTJ"] },
  { fieldName: "userGroup", operator: "IN", value: ["mC0XzAsAiDZw44wcBVw", "IQsRau7h9JxD1pdMZSk", "naXyOVhBRDG65WmviFJ"] },
  { fieldName: "number", operator: "IS_NULL", value: undefined }
]

// 以下是兼容模式
export const compatibilityModeInitView = {
  viewId: 'testInitView',
  name: tr("测试初始化查询参数"),
  version: '2019-12-2 13:58:19',
  panelConfig: {
    searchFields: [
      {
        fieldName: "text"
      },
      {
        fieldName: "group"
      },
      {
        fieldName: "date"
      },
      {
        fieldName: "code"
      },
      {
        fieldName: "userName"
      },
      {
        fieldName: "number"
      },
      {
        fieldName: "money"
      },
      {
        fieldName: "select"
      },
    ]
  }
}

export const compatibilityModeInitParams = [
  { fieldName: "text", operator: "EMPTY", value: "文本" },
  { fieldName: "group", operator: "EMPTY", value: "sH47bl7MkZcQc9I6OZG" },
  { fieldName: "date", operator: "EMPTY", value: "19-12-02" },
  { fieldName: "code", operator: "EMPTY", value: true },
  { fieldName: "userName", operator: "EMPTY", value: 27 },
  { fieldName: "number", operator: "EMPTY", value: 100 },
  { fieldName: "money", operator: "EMPTY", value: "1,000.00" },
  { fieldName: "select", operator: "EMPTY", value: "2" }
]
