import { tr } from '@/components/common/formatmessage';
// import { SchemaProps } from '@/components/specific/smarttable/fieldgenerator'

const ABILITY_MAP = {
  FUNCTION_CATEGORY: tr('功能分类'),
  FUNCTION_CATEGORY_ITEM: tr('功能点'),
}

const scheme = [
  {
    fieldName: 'name',
    title: tr('名称'),
    column: true,

  },
  {
    fieldName: 'type',
    title: tr('类型'),
    column: true,
    render(text) {
      return ABILITY_MAP[text]
    }
  },
  {
    fieldName: 'path',
    title: tr('功能点操作关键字'),
    column: true
  },
  {
    fieldName: 'description',
    title: tr('描述'),
    column: true
  },
]

export default scheme