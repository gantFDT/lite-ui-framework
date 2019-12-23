import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

const schema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: "text",
      title: tr('文本'),
      options: {
        initialValue: '默认文本',
        rules: [{ required: true, message: '文本不能为空' }]
      }
    },
    {
      fieldName: "date",
      title: tr('日期'),
      componentType: 'DatePicker',
      props: {
        format: 'YY-MM-DD'
      },
      options: {
        initialValue: '08-08-08'
      }
    },
    {
      fieldName: "code",
      title: tr('枚举'),
      componentType: 'CodeList',
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      }
    },
    {
      fieldName: "userName",
      title: tr('用户'),
      componentType: 'UserSelector'
    },
    {
      fieldName: "group",
      title: tr('组织'),
      componentType: 'GroupSelector'
    },
    {
      fieldName: "number",
      title: tr('数字'),
      componentType: 'InputNumber'
    },
    {
      fieldName: "money",
      title: tr('金额'),
      componentType: 'InputMoney'
    },
    {
      fieldName: "select",
      title: tr('下拉选择'),
      componentType: 'Select',
      props: {
        dataSource: [
          {
            label: tr("选项1"),
            value: "1"
          }, {
            label: tr("选项2"),
            value: "2"
          }, {
            label: tr("选项3"),
            value: "3"
          }
        ]
      }
    },
    {
      fieldName: "custom1",
      title: tr('自定义组件1'),
      componentType: 'Custom1',
      props: {
        dataSource: [
          {
            label: tr("选项1"),
            value: "1"
          }, {
            label: tr("选项2"),
            value: "2"
          }, {
            label: tr("选项3"),
            value: "3"
          }
        ]
      }
    },
    {
      fieldName: "custom2",
      title: tr('自定义组件2'),
      componentType: 'Custom2'
    }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图1"),
      version: '2019-11-12 14:49:01',
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
    },
    {
      viewId: 'systemView0002',
      name: tr("系统视图2"),
      version: '2019-11-12 14:49:08',
      panelConfig: {
        searchFields: [
          {
            fieldName: "code"
          },
          {
            fieldName: "date"
          },
          {
            fieldName: "userName"
          },
          {
            fieldName: "group"
          },
          {
            fieldName: "text"
          }
        ]
      }
    },
    {
      viewId: 'systemView0003',
      name: tr("系统视图3(自定义组件)"),
      version: '2019-11-12 14:49:12',
      panelConfig: {
        searchFields: [
          {
            fieldName: "custom1"
          },
          {
            fieldName: "custom2"
          }
        ]
      }
    }
  ],
  systemFilters: [
    {
      dataName: tr('快速查询'),
      relateViewId: 'systemView0001',
      relateViewVersion: '2019-11-12 14:49:01',
      filterItems: [
        {
          fieldName: "text",
          value: 'text'
        },
        {
          fieldName: "group",
          value: 'RZBCUndEl9sDawbCpiS'
        },
        {
          fieldName: "date",
          value: '2017-01-02'
        },
        {
          fieldName: "code",
          value: false
        },
        {
          fieldName: "userName",
          value: -99
        },
        {
          fieldName: "number",
          value: 1000
        },
        {
          fieldName: "money",
          value: 1000
        },
        {
          fieldName: "select",
          value: "2"
        }
      ]
    },
    {
      dataName: tr('快速查询'),
      relateViewId: 'systemView0002',
      relateViewVersion: '2019-11-12 14:49:08',
      filterItems: [
        {
          fieldName: "code",
          value: false
        },
        {
          fieldName: "date",
          value: '2017-01-01'
        },
        {
          fieldName: "userName",
          value: -1
        },
        {
          fieldName: "group",
          value: 'Nf4a5xeIW1OkCo6oeK6'
        },
        {
          fieldName: "text",
          value: '筛选器2'
        }
      ]
    },
    {
      dataName: tr('快速查询'),
      relateViewId: 'systemView0003',
      relateViewVersion: '2019-11-12 14:49:12',
      filterItems: [
        {
          fieldName: "custom1",
          value: '2'
        },
        {
          fieldName: "custom2",
          value: 1000
        }
      ]
    }
  ]
}

export default schema
