import { SearchFormSchema } from "@/components/specific/searchform"
import { SchemaProps } from "@/components/specific/smarttable/fieldgenerator";
import { FuncTypes } from "@/components/form/functype/interface";

export const formscheme: SearchFormSchema = {
  title: {
    title: tr('模型名称')
  },
  funcType: {
    title: tr('类型'),
    componentType: 'Functype'
  },
  memo: {
    title: tr('备注')
  },
  usage: {
    title: tr('使用说明')
  },
  condition: {
    title: tr('适用条件')
  }
}

const statusMap = {
  "PUBLISHED": "发布",
  "DRAFT": "草稿",
}
export const tableschema: Array<SchemaProps<object>> = [
  {
    title: tr('模型编号'),
    fieldName: 'code',
  },
  {
    title: tr('模型名称'),
    fieldName: 'title',
  },
  {
    title: tr('类型'),
    fieldName: 'funcType',
    render: text => FuncTypes[text]
  },
  {
    title: tr('主要逻辑'),
    fieldName: 'scriptContent',
  },
  {
    title: tr('使用说明'),
    fieldName: 'usage',
  },
  {
    title: tr('适用条件'),
    fieldName: 'condition',
  },
  {
    title: tr('备注'),
    fieldName: 'memo',
  },
  {
    title: tr('输入条件'),
    fieldName: 'inputParams',
  },
  {
    title: tr('输出结果'),
    fieldName: 'outParams',
  },
  {
    title: tr('排序'),
    fieldName: 'sort',
  },
  {
    title: tr('热度'),
    fieldName: 'hot',
  },
  {
    title: tr('精度'),
    fieldName: '123',
  },
  {
    title: tr('版本号'),
    fieldName: 'funcVersion',
  },
  {
    title: tr('状态'),
    fieldName: 'activeStatus',
    render: text => statusMap[text]
  },
  {
    title: tr('责任人'),
    fieldName: 'updatedBy',
    componentType: 'UserSelector',
  },
  {
    title: tr('更新时间'),
    fieldName: 'updatedDate',
  },
]
