
export const updateFormSchema = {
  type: "object",
  propertyType: {
    fileEntityId: {
      title: tr('文件id'),
      type: "string",
      props: {
        readOnly: true
      }
    },
    templateFileName: {
      title: tr('模板文件名称'),
      type: "string",
      props: {
        allowEdit: false
      }
    },
    templateFileSize: {
      title: tr('模板文件大小'),
      type: "string",
      props: {
        allowEdit: false
      }
    }
  }
}

export const modifyFormSchema = {
  type: "object",
  propertyType: {
    name: {
      title: tr('流程模板名称'),
      type: "string",
      options: {
        rules: [{ required: true, message: tr('该输入项为必填项') }]
      }
    },
    strategy: {
      title: tr('可指定待办人员'),
      type: "boolean",
      componentType: "CustomSwitch"
    }
  }
}

export const deployFormSchema = {
  type: "object",
  propertyType: {
    file: {
      title: tr("模板文件信息"),
      type: "object",
      propertyType: {
        ...updateFormSchema.propertyType
      }
    },
    info: {
      title: tr("模板发布信息"),
      type: "object",
      propertyType: {
        name: modifyFormSchema.propertyType.name,
        key: {
          title: tr('流程模板key'),
          type: "string",
          options: {
            rules: [{ required: true, message: tr('该输入项为必填项') }]
          }
        },
        category: {
          title: tr('流程业务类型'),
          type: "string",
          componentType: "CodeList",
          props: {
            placeholder: tr('请选择'),
            type: 'FW_WORKFLOW_BUSINESS_TYPE'
          },
          options: {
            rules: [{ required: true, message: tr('该输入项为必填项') }]
          }
        },
        strategy: modifyFormSchema.propertyType.strategy
      }
    }
  }
}
