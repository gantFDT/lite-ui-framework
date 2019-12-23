
import React from 'react'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'

export const smartTableSchema = [
  {
    "fieldName": "id",
    "title": tr("序号")
  },
  {
    "fieldName": "userName",
    "title": tr("用户姓名")
  },
  {
    "fieldName": "content",
    "title": tr("日志内容")
  },
  {
    "fieldName": "createDate",
    "title": tr("创建时间")
  }
]



export const modalSchema = {
  "type": "object",
  "required": [
    "id",
    "userName",
    "content",
    "createDate"
  ],
  "propertyType": {
    "id": {
      "type": "number",
      "title": tr("序号"),
      "componentType": "input"
    },
    "userName": {
      "type": "string",
      "title": tr("用户姓名"),
      "componentType": "input"
    },
    "content": {
      "type": "string",
      "title": tr("日志内容"),
      "componentType": "input"
    },
    "createDate": {
      "type": "string",
      "title": tr("创建时间"),
      "componentType": "input"
    }
  }
}



export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  "supportFilterFields": [
    {
      "fieldName": "code",
      "title": tr("用户姓名")
    }
  ],
  "systemViews": [
    {
      "viewId": "systemView0001",
      "name": tr("系统视图"),
      "version": "2019-10-17T17:48:45+08:00",
      "panelConfig": {
        "searchFields": [
          {
            "fieldName": "code",
          }
        ]
      }
    }
  ]
}
