import React, { useState, useCallback } from 'react'
import { Button, Icon, message } from 'antd'
import { SmartTable, EditStatus, SwitchStatus } from 'gantd'

import _ from 'lodash'
import Mock from 'mockjs'
const { Random } = Mock



var editTableColumns = [
  {
    fieldName: 'avatar',
    title: 'A',
    render: (value: string) => <div style={{backgroundImage:`url(${value})`, backgroundSize:'cover',width:16,height:16,borderRadius:'50%'}}/>
    
  },
  {
    fieldName: 'name',
    title: '姓名',
    componentType: 'Input'
  },
  {
    fieldName: 'age',
    title: '年龄',
    componentType: 'InputNumber'
  },
  {
    fieldName: 'cellPhone',
    title: '手机号',
    componentType: 'InputCellPhone'
  },
  {
    fieldName: 'domain',
    title: '个人主页',
    componentType: 'InputUrl'
  },
  {
    fieldName: 'email',
    title: '邮箱',
    componentType: 'InputEmail'
  },
  {
    fieldName: 'bio',
    title: '简介',
    componentType: 'InputLanguage',
    props: {
      localeList: [
        { locale: 'zh-CN', label: '中文' },
        { locale: 'en-US', label: '英文' },
      ]
    }
  },
  {
    fieldName: 'price',
    title: '挂号费',
    componentType: 'InputMoney'
  },
  {
    fieldName: 'address',
    title: '地址',
    componentType: 'LocationSelector'
  },
  {
    fieldName: 'birth',
    title: '生日',
    componentType: 'DatePicker'
  }
]
var editTableSchema = {
  supportColumnFields: editTableColumns,
  systemViews: [
    {
      viewId: 'systemView',
      name: "系统视图",
      version: '2020-02-20 02:20:02',
      panelConfig: {
        wrap: false,
        heightMode: 'auto',
        columnFields: [
          {
          fieldName: 'avatar',
          width: 30
        },
        {
          fieldName: 'name',
          width: 80
        },
        {
          fieldName: 'age',
          width: 70
        },
        {
          fieldName: 'cellPhone',
          width: 230
        },
        {
          fieldName: 'domain',
          width: 200
        },
        {
          fieldName: 'email',
          width: 170
        },
        {
          fieldName: 'bio',
          width: 375
        },
        {
          fieldName: 'price',
          width: 150
        },
        {
          fieldName: 'address',
          width: 195
        },
        {
          fieldName: 'birth',
          width: 160
        }
        ]
      }
    }
  ]
}
var editTableData = Array(150).fill().map(() => ({
  name: Random.cname(),
  avatar: `https://i.picsum.photos/id/${Random.natural(10, 300)}/100/100.jpg`,
  age: Random.natural(20, 70),
  domain: Random.url(),
  email: Random.email(),
  birth: Random.datetime('yyyy-MM-dd'),
  cellPhone: { value: Random.string('number', 11) },
  bio: [{ value: Random.cparagraph(1, 3) }],
  price: { value: Random.float(9, 50, 2, 2) },
  address: ["CHN", "510000", "510100"],
}))
const Page = () => {
  const [stateData, setStateData] = useState(editTableData)
  const [editing, setEditing] = useState(EditStatus.CANCEL);
  const getDifference = useCallback(
    (current, old) => {
      const result = []
      for (let i = 0, len = current.length; i < len; i++) {
        const { children = [], ...currentItem } = current[i]
        const { children: oldChildren = [], ...oldItem } = old[i]
        if (!_.isEqual(currentItem, oldItem)) {
          result.push(currentItem)
        }
        if (children.length && oldChildren.length && !_.isEqual(children, oldChildren)) {
          const diff = getDifference(children, oldChildren)
          result.push.apply(result, diff)
        }
      }
      return result
    },
    [],
  )
  const onSave = useCallback(
    (newStateData) => {
      const diff = getDifference(newStateData, stateData)
      setStateData(newStateData)
      console.log('差异数据：', diff)
    },
    [stateData],
  )
  const handleSave = useCallback(() => {
    setEditing(EditStatus.SAVE)
  }, [])

  return (
    <div style={{ margin: '0 10px 10px' }}>
      <SmartTable
        tableKey="EditInlineUse"
        rowKey="id"
        title={
          <>
            <span className="gant-margin-h-5"><Icon type="global" /></span>
            {tr('他的好友')}
          </>
        }
        schema={editTableSchema}
        dataSource={stateData}
        editable={editing}
        bodyHeight={300}
        bodyWidth={1630}
        onSave={onSave}
        headerRight={
          <>
            <Button
              icon={editing === EditStatus.EDIT ? "roolback" : "edit"}
              size="small"
              onClick={() => { if (editing === EditStatus.CANCEL) { message.info('请单击单元格进行编辑') }; setEditing(SwitchStatus) }}
            >
              {editing === EditStatus.EDIT ? "结束" : "进入"}编辑
            </Button>
            {editing === EditStatus.EDIT && <Button
              icon="save"
              size="small"
              type="primary"
              onClick={handleSave}
            >
              保存
            </Button>}
          </>
        }
      />
    </div>
  )
}

export default Page