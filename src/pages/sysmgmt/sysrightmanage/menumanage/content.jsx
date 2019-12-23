import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { cloneDeep } from 'lodash'
import { Icon, Table } from 'gantd'
import { connect } from 'dva';
import { SmartTable } from '@/components/specific'
import { tr } from '@/components/common/formatmessage';
import { getRealIcon, getTableHeight } from '@/utils/utils'
import { MAP } from './menutypes'


const renderIcon = iconString => {
  if (!iconString) return null
  const icon = getRealIcon(iconString)
  if (!icon) return null
  return <Icon type={icon} /> // 使用的是图标库的图标
}

const renderName = (expandKeys, name, record) => {
  const { leaf } = record
  let icon = null
  if (leaf) {
    icon = <Icon type="icon-file" style={{ margin: '0 3px 0 5px' }} />
    // icon = <Icon type={leaf ? "icon-file" : "icon-floder"} style={{ margin: '0 3px 0 5px' }} />
  } else {
    const isExpand = expandKeys.length && expandKeys.includes(record.id)
    icon = <Icon.Ant type={isExpand ? "folder-open" : "folder"} theme="filled" style={{ margin: '0 3px 0 5px' }} />
  }
  return (
    <>
      {icon}
      {name}
    </>
  )
}
// 获取rowkey
const getRowKey = record => record.id

// 类型
const renderCode = type => code => MAP[type].get(code)

const BasicColumns = [
  {
    title: tr('名称'),
    fieldName: 'name',
    align: 'left',
  },
  {
    title: tr('类型'),
    fieldName: 'type',
    align: 'left',
  },
  {
    title: tr('菜单项操作地址'),
    fieldName: "path",
    width: 600,
    align: 'left',
  },
  {
    title: tr('图标'),
    fieldName: 'icon',
    align: 'center',
    width: 50,
    render: renderIcon
  },
  {
    title: tr('描述'),
    fieldName: 'description',
    align: 'left',
  },
]

const Content = props => {
  const { refresh, mainmenu: { menuList }, loading, onChange, type, headerHeight, MAIN_CONFIG } = props
  const minHeight = getTableHeight(MAIN_CONFIG, 40, false)

  useState(() => {
    refresh()
  })

  const [selectedKeys, setselectedKeys] = useState([])
  const [expandKeys, setexpandKeys] = useState([])
  const [columns, setcolumns] = useState(BasicColumns)

  useEffect(() => {
    const cols = cloneDeep(BasicColumns)
    cols[0].render = (...args) => renderName(expandKeys, ...args)
    cols[1].render = renderCode(type)
    setcolumns(cloneDeep(cols))
  }, [expandKeys, type])

  const onChangeCached = useCallback(
    (rowKeys, rows) => {
      setselectedKeys(rowKeys)
      onChange(rows[0])
    },
  )


  return (
    // <Table
    //   tableKey={`${type}Menun`}
    //   hideVisibleMenu
    //   columns={columns}
    //   dataSource={menuList}
    //   loading={loading}
    //   rowSelection={{
    //     type: 'radio',
    //     selectedRowKeys: selectedKeys,
    //     onChange: onChangeCached
    //   }}
    //   rowKey={getRowKey}
    //   onExpandedRowsChange={setexpandKeys}
    //   scroll={{ y: 900 }}
    //   bodyStyle={{ minHeight }}
    // />
    <SmartTable
      title={tr('主菜单管理')}
      tableKey={`${type}Menun`}
      schema={columns}
      dataSource={menuList}
      loading={loading}
      rowKey={getRowKey}
      onExpandedRowsChange={setexpandKeys}
      bodyHeight={minHeight}
      rowSelection={{
        type: 'radio',
        selectedRowKeys: selectedKeys,
        onChange: onChangeCached
      }}
    />
  )
}

export default connect(
  ({ mainmenu, loading, settings }) => ({
    mainmenu,
    ...settings,
    loading: loading.effects['mainmenu/queryMenuData']
  }),
)(Content)
