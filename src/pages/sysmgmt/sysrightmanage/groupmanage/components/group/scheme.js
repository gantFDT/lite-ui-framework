import { tr } from '@/components/common/formatmessage';

const TableSchema = [
  {
    fieldName: 'groupCode',
    title: tr('用户组编码'),
    type: 'string'
  },
  {
    fieldName: 'groupName',
    title: tr('用户组名称'),
    type: 'string'
  },
  {
    fieldName: 'groupDesc',
    title: tr('用户组描述'),
    type: 'string'
  },
  {
    fieldName: 'userCount',
    title: tr('关联用户'),
  }
]
const modalSchema={
  "type": "object",
  "required": ["groupCode","groupName"],
  "propertyType": {
    groupCode: {
      title: tr('用户组编码'),
      type: 'string',
      componentType: 'Input',
      props: {
        placeholder: tr("请输入用户组编码"),
      },
    },
    groupName: {
      title: tr('用户组名称'),
      type: 'string',
      componentType: 'Input',
      props: {
        placeholder: tr("请输入用户组名称"),
      },
    },
    groupDesc: {
      title: tr('用户组描述'),
      type: 'string',
      componentType: 'Input',
      props: {
        placeholder: tr("请输入用户组描述"),
      },
    },
  }
}

export { TableSchema, modalSchema }