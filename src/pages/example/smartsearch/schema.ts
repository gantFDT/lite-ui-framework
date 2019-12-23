import { SmartSearchSchema } from '@/components/specific/smartsearch'

const schema: SmartSearchSchema = {
  supportFilterFields: [
    {
      fieldName: "text",
      type: 'string',
      title: tr('文本'),
    },
    {
      fieldName: "date",
      title: tr('日期'),
      type: 'date',
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
      type: 'codelist',
      componentType: 'CodeList',
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      }
    },
    {
      fieldName: "userName",
      title: tr('用户'),
      type: 'object',
      componentType: 'UserSelector'
    },
    {
      fieldName: "group",
      title: tr('组织'),
      type: 'object',
      componentType: 'GroupSelector'
    },
    {
      fieldName: "number",
      title: tr('数字'),
      type: 'number',
      componentType: 'InputNumber'
    },
    {
      fieldName: "money",
      title: tr('金额'),
      type: 'string',
      componentType: 'InputMoney'
    },
    {
      fieldName: "select",
      title: tr('下拉选择'),
      type: 'string',
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
      type: 'string',
      componentType: 'Custom1'
    },
    {
      fieldName: "custom2",
      title: tr('自定义组件2'),
      type: 'string',
      componentType: 'Custom2'
    },
    {
      fieldName: "role",
      title: tr('角色'),
      type: 'string',
      componentType: 'RoleSelector'
    },
    {
      fieldName: "userGroup",
      title: tr('用户组'),
      type: 'string',
      componentType: 'UserGroupSelector'
    }
  ],
  supportOrderFields: [
    {
      fieldName: "text",
      title: tr('文本')
    },
    {
      fieldName: "date",
      title: tr('日期')
    },
    {
      fieldName: "code",
      title: tr('枚举')
    },
    {
      fieldName: "userName",
      title: tr('用户')
    },
    {
      fieldName: "group",
      title: tr('组织')
    }
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图1"),
      version: '2019-9-6 15:38:22',
      panelConfig: {
        searchFields: [
          {
            fieldName: "text",
            operator: 'IN'
          },
          {
            fieldName: "group",
            operator: 'EQ'
          },
          {
            fieldName: "date",
            operator: 'EQ'
          },
          {
            fieldName: "code",
            operator: 'EQ'
          },
          {
            fieldName: "userName",
            operator: 'EQ'
          },
          {
            fieldName: "number",
            operator: 'EQ'
          },
          {
            fieldName: "money",
            operator: 'EQ'
          },
          {
            fieldName: "select",
            operator: 'EQ'
          },
          {
            fieldName: "role",
            operator: 'EQ'
          },
          {
            fieldName: "userGroup",
            operator: 'EQ'
          }
        ],
        orderFields: [
          {
            fieldName: "text",
            orderType: 'ASC'
          },
          // {
          //   fieldName: "number",
          //   title: '数字',
          //   orderType: 'ASC'
          // },
        ]
      }
    },
    {
      viewId: 'systemView0002',
      name: tr("系统视图2"),
      version: '2019-8-23 10:29:13',
      panelConfig: {
        searchFields: [
          {
            fieldName: "code",
            operator: 'EQ'
          },
          {
            fieldName: "date",
            operator: 'EQ'
          },
          {
            fieldName: "userName",
            operator: 'EQ'
          },
          {
            fieldName: "group",
            operator: 'EQ'
          },
          {
            fieldName: "text",
            operator: 'IN'
          },
        ],
        orderFields: [
          {
            fieldName: "text",
            orderType: 'DESC'
          },
        ]
      }
    },
    {
      viewId: 'systemView0003',
      name: tr("系统视图3(自定义组件)"),
      version: '2019-9-26 17:28:04',
      panelConfig: {
        searchFields: [
          {
            fieldName: "custom1",
            operator: 'EQ'
          },
          {
            fieldName: "custom2",
            operator: 'EQ'
          }
        ],
        orderFields: [
          {
            fieldName: "custom1",
            orderType: 'DESC'
          }
        ]
      }
    }
  ],
  systemFilters: [
    {
      dataName: tr('快速查询1'),
      relateViewId: 'systemView0001',
      relateViewVersion: '2019-9-6 15:38:22',
      filterItems: [
        {
          fieldName: "text",
          operator: 'LIKE',
          value: 'text'
        },
        {
          fieldName: "group",
          operator: 'EQ',
          value: 'RZBCUndEl9sDawbCpiS'
        },
        {
          fieldName: "date",
          operator: 'EQ',
          value: '2017-01-02'
        },
        {
          fieldName: "code",
          operator: 'EQ',
          value: false
        },
        {
          fieldName: "userName",
          operator: 'EQ',
          value: -99
        }
      ]
    },
    {
      dataName: tr('快速查询2'),
      relateViewId: 'systemView0002',
      relateViewVersion: '2019-8-23 10:29:13',
      filterItems: [
        {
          fieldName: "code",
          operator: "EQ",
          value: false
        },
        {
          fieldName: "date",
          operator: "EQ",
          value: '2017-01-01'
        },
        {
          fieldName: "userName",
          operator: "EQ",
          value: -1
        },
        {
          fieldName: "group",
          operator: "EQ",
          value: 'Nf4a5xeIW1OkCo6oeK6'
        },
        {
          fieldName: "text",
          operator: "EQ",
          value: '筛选器2'
        },
      ]
    }
  ]
}

export default schema
