import React from 'react';
import { Generator } from 'gantd'
import { tr } from '@/components/common/formatmessage';

import yonghu_1 from '@/assets/images/yonghu_1.png';
import yonghu_2 from '@/assets/images/yonghu_2.png';
import zcd_1 from '@/assets/images/zcd_1.png';
import zcd_2 from '@/assets/images/zcd_2.png';

import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'
import { SchemaProps } from '@/components/specific/smarttable/fieldgenerator'

export const searchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [
    {
      fieldName: 'roleCode',
      title: tr('角色代码')
    },
    {
      fieldName: 'roleName',
      title: tr('角色名称')
    }
  ],
  systemViews: [
    {
      viewId: 'initial',
      name: tr('初始视图'),
      version: '0.1',
      panelConfig: {
        searchFields: [
          {
            fieldName: 'roleCode'
          },
          {
            fieldName: 'roleName'
          },
        ]
      }
    }
  ]
}

export const tableScheme: Array<SchemaProps<object>> = [
  {
    fieldName: 'roleCode',
    title: tr('角色代码'),
    editConfig: {
      render: () => <Generator type='input'></Generator>
    }
  },
  {
    fieldName: 'roleName',
    title: tr('角色名称'),
    editConfig: {
      render: () => <Generator type='input'></Generator>
    }
  },
  {
    fieldName: 'roleDesc',
    title: tr('描述'),
    editConfig: {
      render: () => <Generator type='textarea'></Generator>
    }
  },
  {
    fieldName: 'userCount',
    title: tr('关联用户'),
    width: 80,
  },
  {
    fieldName: 'resourceCount',
    title: tr('关联资源'),
    width: 80,
  },
]

export const formuischema = {
  "ui:backgroundColor": "#fff",
  "ui:col": {
    xs: 12,
  },
  "ui:labelCol": {},
  "ui:wrapperCol": {},
}


// [
//   {
//     key: 'roleCode',
//     name: tr('角色代码'),
//     type: 'Input',
//     column: true,
//     search: true,
//     create: true,
//     edit: true,
//     options: {
//       rules: [
//         {
//           required: true,
//           message: tr('角色代码不能为空')
//         }
//       ]
//     }
//   },
//   {
//     key: 'roleName',
//     name: tr('角色名称'),
//     type: 'Input',
//     column: true,
//     search: true,
//     create: true,
//     edit: true,
//     options: {
//       rules: [
//         {
//           required: true,
//           message: tr('角色名称不能为空')
//         }
//       ]
//     }
//   },
//   {
//     key: 'roleDesc',
//     name: tr('描述'),
//     type: 'TextArea',
//     column: true,
//     create: true,
//     edit: true
//   },
//   {
//     key: 'userCount',
//     name: tr('关联用户'),
//     type: 'Switch',
//     column: true,
//   },
//   {
//     key: 'resourceCount',
//     name: tr('关联资源'),
//     type: 'Switch',
//     column: true,
//   }
// ]
