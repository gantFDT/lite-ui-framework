import { SearchFormSchema } from '@/components/specific/searchform'

const schema: SearchFormSchema = {
  text: {
    title: '文本',
    options: {
      initialValue: '默认文本',
      rules: [{ required: true, message: tr('文本为必传') }]
    }
  },
  group: {
    title: '组织',
    componentType: 'GroupSelector'
  },
  date: {
    title: '日期',
    componentType: 'DatePicker',
    props: {
      format: 'YY-MM-DD'
    },
    options: {
      initialValue: '08-08-08'
    }
  },
  code: {
    title: '枚举',
    componentType: 'CodeList',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    }
  },
  userName: {
    title: '用户',
    componentType: 'UserSelector'
  },
  number: {
    title: '数字',
    componentType: 'InputNumber'
  },
  money: {
    title: '金额',
    componentType: 'InputMoney'
  },
  select: {
    title: '下拉选择',
    componentType: 'Select',
    props: {
      'dataSource': [
        {
          'label': '选项1',
          'value': '1'
        },
        {
          'label': '选项2',
          'value': '2'
        },
        {
          'label': '选项3',
          'value': '3'
        }
      ]
    },
  },
  custom1: {
    title: '自定义组件1',
    componentType: 'Custom1',
    props: {
      'dataSource': [
        {
          'label': '选项1',
          'value': '1'
        },
        {
          'label': '选项2',
          'value': '2'
        },
        {
          'label': '选项3',
          'value': '3'
        }
      ]
    }
  },
  custom2: {
    title: '自定义组件2',
    componentType: 'Custom2'
  }
}

export default schema
