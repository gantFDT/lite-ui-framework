import { SearchFormSchema } from '@/components/specific/searchform'

export const searchSchema: SearchFormSchema = {
  text: {
    title: '文本'
  },
  group: {
    title: '组织',
    componentType: 'GroupSelector'
  },
  // date: {
  //   title: '日期',
  //   componentType: 'DatePicker',
  //   props: {
  //     format: 'YY-MM-DD'
  //   }
  // },
  // code: {
  //   title: '枚举',
  //   componentType: 'CodeList',
  //   props: {
  //     type: 'COMMON_BOOLEAN_TYPE'
  //   }
  // },
  // userName: {
  //   title: '用户',
  //   componentType: 'UserSelector'
  // },
  // number: {
  //   title: '数字',
  //   componentType: 'InputNumber'
  // },
  // money: {
  //   title: '金额',
  //   componentType: 'InputMoney'
  // },
  // select: {
  //   title: '下拉选择',
  //   componentType: 'Select',
  //   props: {
  //     'dataSource': [
  //       {
  //         'label': '选项1',
  //         'value': '1'
  //       },
  //       {
  //         'label': '选项2',
  //         'value': '2'
  //       },
  //       {
  //         'label': '选项3',
  //         'value': '3'
  //       }
  //     ]
  //   }
  // }
}

export const tableColumn = [
  {
    dataIndex: 'name',
    title: '姓名'
  },
  {
    dataIndex: 'gender',
    title: '性别'
  },
  {
    dataIndex: 'age',
    title: '年龄'
  }
]
