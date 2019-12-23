
export default {
  type: "object",
  propertyType: {
    userTemplateName: {
      title: '模板名称',
      type: "string",
      options: {
        rules: [{ required: true, message: tr('模板名称不能为空') }]
      }
    }
  }
}
