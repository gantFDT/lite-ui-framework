import React from 'react';
import { Icon } from 'gantd';
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch';

// schema
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: "domain",
    title: tr('领域'),
    componentType: 'Selector',
    props: {
      selectorId: 'measureunitdomain',
      valueProp: 'domain',
      labelProp: 'name',
    },
  },
  {
    fieldName: 'name',
    title: tr('中文名')
  },
  {
    fieldName: 'nameEn',
    title: tr('英文名')
  },
  {
    fieldName: 'symbol',
    title: tr('符号')
  },
  ],
  systemViews: [
    {
      viewId: 'systemView0001',
      name: tr("系统视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "domain"
        }, {
          fieldName: 'name'
        },
        {
          fieldName: 'nameEn'
        },
        {
          fieldName: 'symbol'
        }]
      }
    }
  ]
}

export const smartTableSchema = [
  {
    fieldName: 'name',
    title: tr('名称'),
  },
  {
    fieldName: 'nameEn',
    title: tr('英文名'),
  },
  {
    fieldName: 'domain',
    title: tr('领域'),
  },
  {
    fieldName: 'symbol',
    title: tr('符号'),
  },
  {
    fieldName: 'icon',
    title: tr('图标'),
    render: (value: string, row: object) => {
      if (!value) {
        value = 'icon-shezhi1'
      }
      return <Icon type={value} />
    }
  },
  {
    fieldName: 'isSystemUnit',
    title: tr('系统单位'),
    render: (value: boolean, row: object) => value && <Icon.Ant type="check-circle" />
  },
];

export const modalSchema = {
  type: "object",
  required: ["name", "nameEn", "coefficient", "symbol"],

  propertyType: {
    name: {
      title: tr('名称'),
      type: "string",
      componentType: "Input",
    },
    nameEn: {
      title: tr('英文名称'),
      type: "string",
      componentType: "Input",
    },
    domain: {
      title: tr('领域'),
      type: "string",
      componentType: "Selector",
      props: {
        disabled: true,
        selectorId: 'measureunitdomain',
        valueProp: 'domain',
        labelProp: 'name',
      },
    },
    icon: {
      title: tr('图标'),
      type: "string",
      componentType: "IconSelector",
    },
    baseUnitName: {
      title: tr('基础单位'),
      type: "string",
      componentType: "Input",
      props: {
        disabled: true,
      }
    },
    coefficient: {
      title: tr('系数'),
      type: "string",
      componentType: "Input",
    },
    symbol: {
      title: tr('符号'),
      type: "string",
      componentType: "Input",
    },
  }
}
