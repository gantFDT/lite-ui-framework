import { get, isEmpty } from 'lodash'

export const smartSearchSchema = {
  supportFilterFields: [{
    fieldName: "type",
    title: tr('类型')
  },
  {
    fieldName: 'name',
    title: tr('名称')
  },
  {
    fieldName: 'category',
    title: tr('类别'),
    componentType: "Select",
    props: {
      dataSource: [{
        label: tr("全部编码"),
        value: "ALL"
      }, {
        label: tr("系统编码"),
        value: "SYSTEM"
      },
      {
        label: tr("自定义编码"),
        value: "CUSTOM"
      }
      ]
    }
  }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("初始视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "type"
        }, {
          fieldName: 'name'
        },
        {
          fieldName: 'category'
        }
        ]
      }
    }
  ]
}

export const searchSchema = [{
  key: 'type',
  name: tr("类型"),
  status: 'preshow'
},
{
  key: 'name',
  name: tr("名称"),
  status: 'preshow'
},
{
  key: 'category',
  name: tr("类别"),
  type: 'Select',
  status: 'preshow'
}]

export const codeTypeSchema = {
  type: "object",
  required: ["type"],
  propertyType: {
    type: {
      title: tr("类型"),
      props: {
        allowEdit: false,
        placeholder: " "
      }
    },
    name: {
      title: tr("名称"),
      props: {
        allowEdit: false,
        placeholder: " "
      }
    },
    desc: {
      title: tr("描述"),
      type: "TextArea",
      props: {
        allowEdit: false,
        placeholder: " "
      }
    }
  }
}
export const _codeTypeSchema = {
  type: "object",
  required: ["type"],
  propertyType: {
    type: {
      title: tr("类型"),
    },
    name: {
      title: tr("名称"),
    },
    desc: {
      title: tr("描述"),
      type: "TextArea",
    }
  }
}

export const codeListSchema = {
  type: "object",
  required: ["name"],
  propertyType: {
    name: {
      title: tr("编码名称"),
      componentType: "NameInput",
      type: "string",
      options: {
        rules: [{
          validator: (rule, value, callback) => {
            if (!value) return callback(tr("编码名称不能为空"))
            const objt = JSON.parse(value);
            const zh = get(objt, "zh_CN", "");
            const en = get(objt, "en", "");
            if (isEmpty(zh) && isEmpty(en)) return callback(tr("编码名称不能为空"))
            if (isEmpty(zh)) return callback(tr("中文编码名称不能为空"))
            if (isEmpty(en)) return callback(tr("English编码名称不能为空"))
            return callback()
          }
        }]
      }
    },
    value: {
      title: tr("值"),
      type: "string"
    },
    desc: {
      title: tr("描述"),
      componentType: "TextArea",
      type: "string"
    }
  }
}
