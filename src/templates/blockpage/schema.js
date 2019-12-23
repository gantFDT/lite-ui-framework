const modalSchema = {
    "type": "object",
    required: ["categoryCode", "categoryName"],
    "propertyType": {
        categoryCode: {
            title: tr('类别编码'),
            type: "string",
            componentType: "Input",
            props: {
                maxLength: 100
            }
        },
        categoryName: {
            title: tr('类别名称'),
            type: "string",
            componentType: "Input",
            props: {
                maxLength: 200
            }
        },
        remark: {
            title: tr('备注'),
            type: "string",
            componentType: "TextArea",
            props: {
                maxLength: 2000,
            }
        },
    }
}
const detailSchema = {
    "type": "object",
    required: ["categoryCode", "categoryName"],
    "propertyType": {
        categoryCode: {
            title: tr('类别编码'),
            type: "string",
            componentType: "Input",
            props: {
                maxLength: 100
            }
        },
        categoryName: {
            title: tr('类别名称'),
            type: "string",
            componentType: "Input",
            props: {
                maxLength: 200
            }
        },
        optCounter: {
            title: tr('组织数'),
            type: "string",
            componentType: "Input",
            props: {
                maxLength: 200
            }
        },
        remark: {
            title: tr('备注'),
            type: "string",
            componentType: "TextArea",
            props: {
                maxLength: 2000,
            }
        },
    }
}
const uiSchema = {
    "ui:col": {
        span: 24,
        sm: 12,
        xl: 8,
        xxl: 8,
    },
    remark: {
        "ui:col": {
            span: 24,
            sm: 24,
            xl: 24,
            xxl: 24,
        }
    }
};
export { modalSchema, detailSchema, uiSchema }