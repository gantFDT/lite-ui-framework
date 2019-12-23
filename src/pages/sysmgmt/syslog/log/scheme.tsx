import React from 'react'
import { Icon, Modal } from 'antd'
import Types from './types'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { UISchema } from '@/components/form/schema'

// const IsSuccess = new Map([[true, tr('是')], [false, tr('否')]])
// 用于search
const dateSearchScheme = [
  {
    title: tr('开始日期'),
    fieldName: 'createDateFrom',
    type: 'DatePicker',
  },
  {
    title: tr('结束日期'),
    fieldName: 'createDateTo',
    type: 'DatePicker',
  },
]
const dateScheme = [
  {
    fieldName: 'createDateFrom',
    title: tr('开始日期'),
    componentType: 'DatePicker'
  },
  {
    fieldName: 'createDateTo',
    title: tr('结束日期'),
    componentType: 'DatePicker'
  }
]
const dateFields = [
  {
    fieldName: 'createDateFrom'
  },
  {
    fieldName: 'createDateTo'
  }
]

// 用于table
const successScheme = [
  {
    title: tr('成功'),
    fieldName: 'success',
    type: 'CodeList',
    props: {
      type: "COMMON_BOOLEAN_TYPE",
    },
    render: (isActive: boolean) => isActive ? <span className="successColor"><Icon type="check-circle" /></span> : ""
  },
]
const successSearchScheme = [
  {
    fieldName: 'success',
    title: tr('成功'),
    componentType: 'CodeList',
    props: {
      type: "COMMON_BOOLEAN_TYPE",
    }
  }
]
const successSearchFields = [
  {
    fieldName: 'success'
  }
]

export const scheme = {
  [Types.Login]: [
    {
      title: tr("登录名"),
      fieldName: 'field1',
    },
    {
      title: tr("日期"),
      fieldName: 'createDate',
      type: 'DatePicker',
    },
    ...successScheme,
  ],
  [Types.Aclmodify]: [
    {
      title: tr('用户'),
      fieldName: 'field1',
    },
    {
      title: tr('操作'),
      fieldName: 'field2',
    },
    {
      title: tr('角色'),
      fieldName: 'field3',
    },
    {
      title: tr('操作者IP'),
      fieldName: 'field4',
    },
    {
      title: tr('操作者'),
      fieldName: 'createdBy',
    },
    {
      title: tr('日期'),
      fieldName: 'createDate',
      type: 'DatePicker',
    },
  ],
  [Types.DataAcl]: [
    {
      title: tr('业务数据域'),
      fieldName: 'field1',
    },
    {
      title: tr('操作者IP'),
      fieldName: 'field2',
    },
    {
      title: tr('操作者'),
      fieldName: 'createdBy',
    },
    {
      title: tr('日期'),
      fieldName: 'createDate',
      type: 'DatePicker',
    },
  ],
  [Types.File]: [
    {
      title: tr('文件ID'),
      fieldName: 'field1',
    },
    {
      title: tr('操作者类型'),
      fieldName: 'field2',
    },
    {
      title: tr('操作者IP'),
      fieldName: 'field3',
    },
    {
      title: tr('描述'),
      fieldName: 'description',
    },
    {
      title: tr('操作者'),
      fieldName: 'createdBy',
    },
    {
      title: tr('日期'),
      fieldName: 'createDate',
      type: 'DatePicker',
      column: true,
    },
    ...successScheme,
  ],
  [Types.Mail]: [
    {
      title: tr("主题"),
      fieldName: 'field1',
    },
    {
      title: tr("发送地址"),
      fieldName: 'field2',
    },
    {
      title: tr("接收地址"),
      fieldName: 'field3',
    },
    {
      title: tr("抄送地址"),
      fieldName: 'field4',
    },
    {
      title: tr("操作者IP"),
      fieldName: 'field5',
    },
    {
      title: tr("邮件内容"),
      fieldName: 'field6',
    },
    {
      title: tr("操作者"),
      fieldName: 'createdBy',
    },
    {
      title: tr("日期"),
      fieldName: 'createDate',
      column: true,
    },
    ...successScheme,
  ]
}

export const searchSchemaMap = {
  [Types.Login]: {
    supportFilterFields: [
      {
        fieldName: 'field1',
        title: tr('登录名')
      },
      ...dateScheme,
      ...successSearchScheme,
    ],
    systemViews: [
      {
        viewId: 'loginSearch',
        name: tr('初始视图'),
        version: '0.1',
        panelConfig: {
          searchFields: [
            {
              fieldName: 'field1'
            },
            ...dateFields,
            ...successSearchFields,
          ],
        }
      }
    ]
  } as SmartSearchCompatibilityModeSchema,

  [Types.Aclmodify]: {
    supportFilterFields: [
      {
        fieldName: 'field1',
        title: tr('用户')
      },
      {
        fieldName: 'field2',
        title: tr('操作')
      },
      {
        fieldName: 'field3',
        title: tr('角色')
      },
      {
        fieldName: 'field4',
        title: tr('操作者IP')
      },
      {
        fieldName: 'createdBy',
        title: tr('操作者')
      },
      ...dateScheme,
    ],
    systemViews: [
      {
        viewId: 'AclmodifySearch',
        name: tr('初始视图'),
        version: '0.1',
        panelConfig: {
          searchFields: [
            {
              fieldName: 'field1'
            },
            {
              fieldName: 'field2'
            },
            {
              fieldName: 'field3'
            },
            {
              fieldName: 'field4'
            },
            {
              fieldName: 'createdBy'
            },
            ...dateFields,
          ]
        }
      }
    ]
  } as SmartSearchCompatibilityModeSchema,

  [Types.DataAcl]: {
    supportFilterFields: [
      {
        fieldName: 'field1',
        title: tr('业务数据域')
      },
      {
        fieldName: 'field2',
        title: tr('操作者IP')
      },
      {
        fieldName: 'createdBy',
        title: tr('操作者')
      },
      ...dateScheme,
    ],
    systemViews: [
      {
        viewId: 'DataAclSearch',
        name: tr('初始视图'),
        version: '0.1',
        panelConfig: {
          searchFields: [
            {
              fieldName: 'field1'
            },
            {
              fieldName: 'field2'
            },
            {
              fieldName: 'createdBy'
            },
            ...dateFields,
          ]
        }
      }
    ]
  } as SmartSearchCompatibilityModeSchema,

  [Types.File]: {
    supportFilterFields: [
      {
        fieldName: 'field1',
        title: tr('文件ID')
      },
      {
        fieldName: 'field2',
        title: tr('操作者类型')
      },
      {
        fieldName: 'field3',
        title: tr('操作者IP')
      },
      {
        fieldName: 'description',
        title: tr('描述')
      },
      {
        fieldName: 'createdBy',
        title: tr('操作者')
      },
      ...dateScheme,
      ...successSearchScheme,
    ],
    systemViews: [
      {
        viewId: 'FileSearch',
        name: tr('初始视图'),
        version: '0.1',
        panelConfig: {
          searchFields: [
            {
              fieldName: 'field1'
            },
            {
              fieldName: 'field2'
            },
            {
              fieldName: 'field3'
            },
            {
              fieldName: 'description'
            },
            {
              fieldName: 'createdBy'
            },
            ...dateFields,
            ...successSearchFields,
          ]
        }
      }
    ]
  } as SmartSearchCompatibilityModeSchema,

  [Types.Mail]: {
    supportFilterFields: [
      {
        fieldName: 'field1',
        title: tr('主题')
      },
      {
        fieldName: 'field2',
        title: tr('发送地址')
      },
      {
        fieldName: 'field3',
        title: tr('接收地址')
      },
      {
        fieldName: 'field4',
        title: tr('抄送地址')
      },
      {
        fieldName: 'field5',
        title: tr('操作者IP')
      },
      {
        fieldName: 'field6',
        title: tr('邮件内容')
      },
      {
        fieldName: 'createdBy',
        title: tr('操作者')
      },
      ...dateScheme,
      ...successSearchScheme,
    ],
    systemViews: [
      {
        viewId: 'MailSearch',
        name: tr('初始视图'),
        version: '0.1',
        panelConfig: {
          searchFields: [
            {
              fieldName: 'field1'
            },
            {
              fieldName: 'field2'
            },
            {
              fieldName: 'field3'
            },
            {
              fieldName: 'field4'
            },
            {
              fieldName: 'field5'
            },
            {
              fieldName: 'field6'
            },
            {
              fieldName: 'createdBy'
            },
            ...dateFields,
            ...successSearchFields,
          ]
        }
      }
    ]
  } as SmartSearchCompatibilityModeSchema,
}

export const searchUISchema: UISchema = {
  "ui:col": {
    xxl: 6,
    lg: 8,
    md: 12,
    xs: 24,
  },
  "ui:labelCol": {
    xxl: 8,
  },
  "ui:wrapperCol": {
    xxl: 16,
  },
}
