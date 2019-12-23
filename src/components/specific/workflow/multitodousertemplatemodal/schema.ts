
export const column = [{ dataIndex: 'name', title: tr('名称') }]

export const formSchema = {
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
