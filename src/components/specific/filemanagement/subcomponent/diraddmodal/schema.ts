
export default {
  type: "object",
  propertyType: {
    dirName: {
      title: '文件夹名称',
      type: "string",
      options: {
        rules: [{ required: true, message: tr('文件名称不能为空') }]
      }
    }
  }
}
