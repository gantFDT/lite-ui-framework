import { SmartSearchSchema } from '@/components/specific/smartsearch'
import { tr } from '@/components/common'

const searchSchema: SmartSearchSchema = {
  supportFilterFields: [
    {
      fieldName: "name",
      type: 'string',
      title: tr('姓名')
    },
    {
      fieldName: "gender",
      title: tr('性别'),
      type: "codelist",
      componentType: 'CodeList',
      props: {
        type: 'FW_USER_GENDER'
      }
    },
    {
      fieldName: "age",
      title: tr("年龄"),
      type: "number",
      componentType: "InputNumber"
    },
    {
      fieldName: "birth",
      title: tr("生日"),
      type: "date",
      componentType: "DatePicker"
    },
    {
      fieldName: "contactPersonId",
      title: tr("联系人"),
      type: "object",
      componentType: "UserSelector"
    },
    {
      fieldName: "grade",
      title: tr("年级"),
      type: "string",
      componentType: "Select",
      props: {
        dataSource: [{
          label: tr("一年级"),
          value: "A"
        }, {
          label: tr("二年级"),
          value: "B"
        }, {
          label: tr("三年级"),
          value: "C"
        }],
      }
    },
    {
      fieldName: "classNumber",
      title: tr("班级"),
      type: "string",
      componentType: "Select",
      props: {
        dataSource: [{
          label: tr("一班"),
          value: "1"
        }, {
          label: tr("二班"),
          value: "2"
        }, {
          label: tr("三班"),
          value: "3"
        }],
      }
    },
    {
      fieldName: "finalExamScore",
      title: tr("期末得分"),
      type: "number",
      componentType: "InputNumber"
    },
    {
      fieldName: "agreeUpgrade",
      title: tr("同意升级"),
      type: "boolean",
      componentType: 'CodeList',
      props: {
        type: 'COMMON_BOOLEAN_TYPE'
      }
    }
  ],
  supportOrderFields: [
    {
      fieldName: "age",
      title: tr("年龄")
    },
    {
      fieldName: "birth",
      title: tr("生日")
    },
    {
      fieldName: "finalExamScore",
      title: tr("期末得分")
    }
  ],
  systemViews: [
    {
      viewId: 'systemView1',
      name: tr("系统视图1"),
      version: '2019-9-6 15:39:36',
      panelConfig: {
        searchFields: [{
          fieldName: "name",
          operator: "LIKE"
        }],
        orderFields: [{
          fieldName: 'age',
          orderType: 'ASC'
        }],
        uiConfig: {
          searchType: 'click'
        }
      }
    },
    {
      viewId: 'systemView2',
      name: tr("全字段"),
      version: '2019-9-6 10:12:15',
      panelConfig: {
        searchFields: [
          {
            fieldName: "name",
            operator: "IN"
          },
          {
            fieldName: "gender",
            operator: "EQ"
          },
          {
            fieldName: "age",
            operator: "GT"
          },
          {
            fieldName: "birth",
            operator: "LT"
          },
          {
            fieldName: "contactPersonId",
            operator: "EQ"
          },
          {
            fieldName: "grade",
            operator: "EQ"
          },
          {
            fieldName: "classNumber",
            operator: "IN"
          },
          {
            fieldName: "finalExamScore",
            operator: "GT"
          },
          {
            fieldName: "agreeUpgrade",
            operator: "EQ"
          }
        ],
        orderFields: [{
          fieldName: 'age',
          orderType: 'ASC'
        }]
      }
    }
  ],
  systemFilters: [
    {
      dataName: tr("默认筛选器1"),
      relateViewId: 'systemView1',
      relateViewVersion: '2019-9-6 15:39:36',
      filterItems: [{
        fieldName: "name",
        operator: "LIKE",
        value: "张"
      }],
      pageInfo: {
        beginIndex: 0,
        pageSize: 50
      }
    },
    {
      dataName: tr("默认筛选器1"),
      relateViewId: 'systemView2',
      relateViewVersion: '2019-9-6 10:12:15',
      filterItems: [
        {
          fieldName: "name",
          operator: "IN",
          value: ["张三", "111", "赵云"]
        },
        {
          fieldName: "gender",
          operator: "EQ",
          value: "MALE"
        },
        {
          fieldName: "age",
          operator: "GT",
          value: 10
        },
        {
          fieldName: "birth",
          operator: "LT",
          value: "2019-09-06"
        },
        {
          fieldName: "contactPersonId",
          operator: "EQ",
          value: undefined
        },
        {
          fieldName: "grade",
          operator: "EQ",
          value: "A"
        },
        {
          fieldName: "classNumber",
          operator: "IN",
          value: ['1']
        },
        {
          fieldName: "finalExamScore",
          operator: "GT",
          value: 60
        },
        {
          fieldName: "agreeUpgrade",
          operator: "EQ",
          value: true
        }
      ],
      pageInfo: {
        beginIndex: 0,
        pageSize: 50
      }
    }
  ]
}

export default searchSchema
export {searchSchema}