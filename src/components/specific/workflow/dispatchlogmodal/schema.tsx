export const modalSchema = {
  type: "object",
  required: [],
  propertyType: {
    dispatchComment: {
      title: tr('转派说明'),
      type: "string",
      options: {
        rules: [{
          required: true, message: tr('必须填写转派说明')
        }]
      }
    },
    userId: {
      title: tr('转派用户'),
      type: "string",
      componentType: "UserSelector",
      options: {
        rules: [{
          required: true, message: tr('必须填写转派用户')
        }]
      }
    }
  }
}

export const modalUISchema = {
  "ui:labelCol": 24,
  "ui:col": 24,
  "ui:wrapperCol": 24,
}
