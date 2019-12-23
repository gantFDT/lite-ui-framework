const normalSchema = {
    "type": "object",
    "required": ["title", "content"],
    "propertyType": {
        "title": {
            "type": "string",
            "title": tr('标题'),
        },
        "content": {
            "type": "string",
            "title": tr('内容'),
            "componentType": "TextArea",
            "props": { "rows": 8 }
        }
    }
}
const withLinkSchema = {
    "type": "object",
    "required": ["title", "content", "linkName", "linkUri"],
    "propertyType": {
        "title": {
            "type": "string",
            "title": tr('标题'),
        },
        "linkName": {
            "type": "string",
            "title": tr('链接名称'),
        },
        "linkUri": {
            "type": "string",
            "title": tr('链接URI'),
        },
        "content": {
            "type": "string",
            "title": tr('内容'),
            "componentType": "TextArea",
            "props": {
                "rows": 8,
            }
        },
    }
}

export { normalSchema, withLinkSchema }