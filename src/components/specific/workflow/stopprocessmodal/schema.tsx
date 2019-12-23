export const modalSchema = {
  type: "object",
  required: [],

  propertyType: {
    reason: {
      title: tr('原因'),
      type: "string",
      componentType: "TextArea",
      props: {
        autosize: { minRows: 17, maxRows: 20 }
      },
      options: {
        rules: [{
          required: true, message: tr('必须填写终止流程原因')
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
