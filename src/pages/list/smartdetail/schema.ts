export const sexs = [{
  name: tr('男'),
  value: 'male'
}, {
  name: tr('女'),
  value: 'female'
}]

export const booleanList = [{
  name: tr('是'),
  value: true
}, {
  name: tr('否'),
  value: false
}]


export const formSchema = {
  type: "object",
  propertyType: {
    base: {
      title: tr("个人信息"),
      type: "object",
      propertyType: {
        name: {
          title: tr('姓名'),
          "type": "string",
          "componentType": "Input",
        },
        gender: {
          title: tr('性别'),
          "type": "string",
          componentType: 'Selector',
          props: {
            defaultList: sexs,
            valueProp: 'value',
            labelProp: 'name',
          },
        },
        age: {
          title: tr('年龄'),
          type: "number",
          componentType: "InputNumber",
        },
      }
    },
    code: {
      title: "代码",
      type: "object",
      propertyType: {
        domain: {
          title: tr('擅长领域'),
          componentType: "input",
        },
        view: {
          title: tr('浏览量'),
          type: "string",
        },
        popularIndex: {
          title: tr('受欢迎指数'),
          type: "number",
        }
      }
    },
    more: {
      title: "其他",
      type: "object",
      propertyType: {
        hobby: {
          title: tr('爱好'),
          componentType: "input",
        },
        motto: {
          title: tr('座右铭'),
          type: "string",
          "ui:col": 24
        }
      }
    }

  }
}

export const formUISchema = {
  'ui:backgroundColor': '#fff',
  "ui:col": {
    span: 24,
    sm: 12,
    xl: 12,
    xxl: 12,
  },
  "ui:labelCol": {
    // span: 24,
    // sm: 6
  },
  "ui:wrapperCol": {
    // span: 24,
    // sm: 18
  },
  more: {
    hobby: {
      "ui:col": 24
    },
    motto: {
      "ui:col": 24
    }
  }
};