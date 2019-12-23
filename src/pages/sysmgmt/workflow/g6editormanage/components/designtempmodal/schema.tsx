import React from 'react'
import { Icon } from 'gantd'
import { SmartSearchSchema } from '@/components/specific/smartsearch'

export const smartSearchSchema: SmartSearchSchema = {
  supportFilterFields: [
    {
      fieldName: 'name',
      title: tr('模板名称'),
      suppOperator: ['LIKE'],
      type: 'string'
    }
  ],
  supportOrderFields: [],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图"),
      version: '2019-10-21 10:00:00',
      panelConfig: {
        searchFields: [{
          fieldName: 'name',
          title: tr('模板名称'),
          operator: 'LIKE'
        }],
        orderFields: []
      }
    },
  ],
  systemFilters: []
}

export const tableColumns = [
  {
    dataIndex: 'designName',
    title: tr('模板名称'),
  },
  {
    dataIndex: 'modifyUser',
    title: tr('更新人'),
  },
  {
    dataIndex: 'modifyDate',
    title: tr('更新时间'),
  },
  {
    dataIndex: 'deployName',
    title: tr('发布模板名称'),
  },
  {
    dataIndex: 'deployDate',
    title: tr('发布时间'),
  },
];

export const modalSchema = {
  type: "object",
  required: ["name"],

  propertyType: {
    name: {
      title: tr('流程模板名称'),
      type: "string",
      componentType: "Input",
    }
  }
}

export const importFileModalSchema = {
  type: "object",
  required: [],

  propertyType: {
    templateFileName: {
      title: tr('模板文件名称'),
      type: "string",
      componentType: "Input",
      props: {
        disabled: true,
      }
    },
    templateFileSize: {
      title: tr('模板文件大小'),
      type: "string",
      componentType: "Input",
      props: {
        disabled: true,
      }
    },
  }
}

export const importInfoModalSchema = {
  type: "object",
  required: ["name"],

  propertyType: {
    name: {
      title: tr('流程模板名称'),
      type: "string",
      componentType: "Input",
    }
  }
}