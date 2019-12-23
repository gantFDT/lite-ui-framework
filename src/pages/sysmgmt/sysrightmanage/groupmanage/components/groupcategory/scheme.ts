import { tr } from '@/components/common/formatmessage';
const TableSchema = [
  {
    fieldName: 'categoryCode',
    title: tr('类别编码'),
    type: 'string'
  },
  {
    fieldName: 'categoryName',
    title: tr('类别名称'),
    type: 'string'
  },
]
const modalSchema={
  "type": "object",
  "required": ["categoryCode","categoryName"],
  "propertyType": {
    categoryCode: {
      title: tr('类别编码'),
      type: 'string',
      componentType: 'Input',
      props: {
        placeholder: tr("请输入类别编码"),
      },
    },
    categoryName: {
      title: tr('类别名称'),
      type: 'string',
      componentType: 'Input',
      props: {
        placeholder: tr("请输入类别名称"),
      },
    },
  }
}

export { TableSchema, modalSchema }