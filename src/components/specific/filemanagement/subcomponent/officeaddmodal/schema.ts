
const DOCS = [
  { label: tr('Word 文档'), value: 'WORD' },
  { label: tr('Excel 表格'), value: 'EXCEL' },
  { label: tr('Power Point 幻灯片'), value: 'PPT' },
]

export default {
  type: "object",
  propertyType: {
    officeType: {
      title: 'office类型',
      type: "string",
      componentType: 'Select',
      props: {
        'dataSource': DOCS,
        placeholder: tr('请选择')
      },
      options: {
        rules: [{ required: true, message: tr('office类型必填') }]
      }
    },
    fileName: {
      title: '文件名',
      type: "string",
      props: {
        placeholder: tr('请输入文件名')
      },
      options: {
        rules: [{ required: true, message: tr('文件名必填') }]
      }
    },
    fileDescription: {
      title: '文件描述',
      type: "string",
      props: {
        placeholder: tr('请输入文件描述'),
        maxLength: 500
      }
    }
  }
}
