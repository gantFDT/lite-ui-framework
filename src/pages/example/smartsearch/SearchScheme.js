
export default [
  {
    key: 'text',
    name: tr('文本'),
    status: 'preshow'
  },
  {
    key: 'date',
    name: tr('日期'),
    type: 'DatePicker'
  },
  {
    key: 'code',
    name: tr('枚举'),
    type: 'CodeList',
    props: {
      type: 'COMMON_BOOLEAN_TYPE'
    }
  },
  {
    key: 'userName',
    name: tr('用户'),
    type: 'UserSelector'
  },
  {
    key: 'group',
    name: tr('组织'),
    type: 'GroupSelector'
  }
]