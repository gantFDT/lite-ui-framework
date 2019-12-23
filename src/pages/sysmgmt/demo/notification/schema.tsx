const normalSchema = {
    "type": "object",
    "required": ["title", "content", "loginUserNames"],
    "propertyType": {
        "title": {
            "type": "string",
            "title": tr('标题'),
        },
        "content": {
            "type": "string",
            "title": tr('内容'),
            "componentType": "TextArea",
            "props": {
                "rows": 4,
            }
        },
        "loginUserNames": {
            "type": "string",
            "title": tr('接受通知用户清单'),
            "componentType": "UserSelector",
            "props": {
                "multiple": true,
                "valueProp": "userLoginName",
                "withAuth": false
            }
        },
    }
}

const withLinkSchema = {
    "type": "object",
    "required": ["title", "content", "linkName", "linkUri", "loginUserNames"],
    "propertyType": {
        "title": {
            "type": "string",
            "title": tr('标题'),
        },
        "content": {
            "type": "string",
            "title": tr('内容'),
            "componentType": "TextArea",
            "props": {
                "rows": 4,
            }
        },
        "linkName": {
            "type": "string",
            "title": tr('链接名称'),
        },
        "linkUri": {
            "type": "string",
            "title": tr('链接URI'),
        },
        "loginUserNames": {
            "type": "string",
            "title": tr('接受通知用户清单'),
            "componentType": "UserSelector",
            "props": {
                "multiple": true,
                "valueProp": "userLoginName",
                "withAuth": false
            }
        },
    }
}

export { normalSchema, withLinkSchema }