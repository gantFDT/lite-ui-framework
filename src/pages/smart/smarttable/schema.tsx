import React, { useMemo } from 'react';
import { Avatar, Tag } from 'antd'
import { Icon } from 'gantd';
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch';
import { findDomain } from './service'
import moment from 'moment'
import { MiniArea, Pie, Trend } from '@/components/chart'
import { Link } from '@/components/common';

export const avatars = [
  'http://www.duoziwang.com/uploads/1512/1-1512291K2430-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512291K3400-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512292055010-L.jpg',
  'http://www.duoziwang.com/uploads/1512/1-1512291K6240-L.jpg',
  'http://www.duoziwang.com/2016/10/05/2032097569.jpg',
  'http://www.duoziwang.com/2016/10/05/21143213927.jpg',
  'http://www.duoziwang.com/2016/10/05/21135613834.png',
  'http://www.duoziwang.com/2016/10/05/2025046706.jpg',
  'http://www.duoziwang.com/2016/10/05/21102913178.png',
  'http://www.duoziwang.com/uploads/1512/1-1512292051490-L.jpg',
]

export const sexs = [{
  name: tr('男'),
  value: 'male'
}, {
  name: tr('女'),
  value: 'female'
}]


export interface VisitDataType {
  x: string;
  y: number;
}

export const getVisitData = () => {
  const visitData: VisitDataType[] = [];
  const beginDay = new Date().getTime();
  const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
  for (let i = 0; i < fakeY.length; i += 1) {
    visitData.push({
      x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
      y: fakeY[Math.floor(Math.random() * 10 + 1)],
    });
  }
  return visitData
}




// schema
export const smartSearchSchema: SmartSearchCompatibilityModeSchema = {
  supportFilterFields: [{
    fieldName: "domain",
    title: tr('擅长领域'),
    componentType: 'Selector',
    props: {
      selectorId: 'goodatdomain',
      valueProp: 'domain',
      labelProp: 'name',
      query: findDomain
    },
  }, {
    fieldName: "name",
    title: tr('姓名'),
  },
  {
    fieldName: 'age',
    title: tr('年龄'),
    componentType: 'InputNumber',
  },
  {
    fieldName: 'sex',
    title: tr('性别'),
    componentType: 'Selector',
    props: {
      dataSource: sexs,
      valueProp: 'value',
      labelProp: 'name',
    },
  },
  {
    fieldName: 'view',
    title: tr('浏览量')
  },
  ],
  systemViews: [
    {
      viewId: 'all',
      name: tr("全字段视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "domain"
        }, {
          fieldName: "name"
        }, {
          fieldName: 'age'
        },
        {
          fieldName: 'sex'
        },
        {
          fieldName: 'view'
        }]
      }
    },
    {
      viewId: 'simple',
      name: tr("简洁视图"),
      version: '2019-8-23 10:29:03',
      panelConfig: {
        searchFields: [{
          fieldName: "name"
        }]
      }
    }
  ]
}


export const smartTableSchema = {
  supportColumnFields: [
    {
      fieldName: "name",
      title: tr('姓名'),
      render: (value: string, row: object, index: number) => {
        let avatarIndex = index > 9 ? Math.floor(index % 10) : index
        return <Link to={`smartdetail/${row['id']}`}><Avatar size={30} icon="user" src={avatars[avatarIndex]} style={{ marginRight: '10px' }} />{value}</Link>
      },
      locked: 'left'
    },
    {
      fieldName: 'sex',
      title: tr('性别'),
      render: (value: string, row: object) => {
        return <>
          {value === 'male' && <Icon style={{ color: '#1890FF', marginLeft: '5px' }} type="man" />}
          {value === 'female' && <Icon style={{ color: '#EA4C89', marginLeft: '5px' }} type="woman" />}
        </>
      }
    },
    {
      fieldName: 'age',
      title: tr('年龄')
    },

    {
      fieldName: 'domain',
      title: tr('擅长领域')
    },
    {
      fieldName: 'view',
      title: tr('浏览量'),
      render: (value: string, row: object) => {
        const view = Math.ceil(Math.random() * 10000);
        return <>
          {view > 8000 ? <Trend flag="up">
            <span style={{ fontWeight: 'bold', color: view > 5000 ? '#f00' : 'var(--text-color)' }}> {view}</span >
          </Trend> : <Trend flag="down">
              <span style={{ fontWeight: 'bold', color: view > 5000 ? '#f00' : 'var(--text-color)' }}> {view}</span >
            </Trend>}
        </>
      }
    },
    {
      fieldName: 'codeRate',
      title: tr('代码提交频度'),
      render: (value: string, row: object) => {
        return <MiniArea color="#36C66E" data={getVisitData()} height={40} showTooltip={false} />
      }
    },
    {
      fieldName: 'popularIndex',
      title: tr('受欢迎指数'),
      render: (value: string, row: object) => {
        return <Pie
          animate={false}
          inner={0.55}
          tooltip={false}
          margin={[0, 0, 0, 0]}
          percent={Math.random() * 100}
          height={40}
        />
      }
    },
    {
      fieldName: 'hobby',
      title: tr('爱好'),
      render: (value: string[], row: object) => {
        if (!value) { return }
        return value.map((words) => <Tag style={{ marginBottom: 3, marginRight: 3 }}>{words}</Tag>)
      }
    },
    {
      fieldName: 'motto',
      title: tr('座右铭'),
      render: (value: string, row: object) => {
        return value
      }
    }
  ],
  systemViews: [
    {
      viewId: 'all',
      name: "全字段视图",
      version: '2020-02-20 02:20:02',
      wrap: false,
      isZebra: false,
      bordered: false,
      clickable: false,
      footerDirection: 'row',
      heightMode: 'full',
      panelConfig: {
        wrap: false,
        columnFields: [
          {
            fieldName: 'name',
            width: 150
          },
          {
            fieldName: 'sex',
            width: 50
          },
          {
            fieldName: 'age',
            width: 50
          },
          {
            fieldName: 'domain',
            width: 100
          },
          {
            fieldName: 'view',
            width: 120
          },
          {
            fieldName: 'codeRate',
            width: 375
          },
          {
            fieldName: 'popularIndex',
            width: 150
          },
          {
            fieldName: 'hobby',
            width: 200
          },
          {
            fieldName: 'motto',
            width: 260
          }
        ]
      }
    },
    {
      viewId: 'simple',
      name: "简洁视图",
      version: '2020-02-20 02:20:02',
      panelConfig: {
        wrap: false,
        columnFields: [
          {
            fieldName: 'name',
          },
          {
            fieldName: 'sex',

          },
          {
            fieldName: 'motto',
          }
        ]
      }
    }
  ]
}




export const modalSchema = {
  type: "object",
  required: ["name", "age", "sex", "domain"],

  propertyType: {
    name: {
      title: tr('名称'),
      type: "string",
      componentType: "Input",
    },
    age: {
      title: tr('年龄'),
      type: "number",
      componentType: "InputNumber",
      props: {
        placeholder: tr("年龄只能为数字"),
      },
      // options: {
      //   rules: [{
      //     pattern: /^1[3|4|5|7|8|9][0-9]\d{4,11}$/,
      //     message: tr("年龄只能为数字")
      //   }]
      // }
    },
    sex: {
      title: tr('性别'),
      type: "string",
      componentType: "Selector",
      props: {
        dataSource: sexs,
        valueProp: 'value',
        labelProp: 'name',
      },
    },
    domain: {
      title: tr('领域'),
      type: "string",
      componentType: "Selector",
      props: {
        // disabled: true,
        selectorId: 'goodatdomain',
        valueProp: 'domain',
        labelProp: 'name',
        query: findDomain
      },
    },
    hobby: {
      title: tr('爱好'),
      type: "string",
      componentType: "Select",
      props: {
        mode: 'tags'
      }
    },
    motto: {
      title: tr('座右铭'),
      type: "string",
      componentType: "Input",
    },
  }
}
