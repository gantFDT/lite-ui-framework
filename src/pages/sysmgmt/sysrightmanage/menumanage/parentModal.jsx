import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { connect } from 'dva'
import { Modal } from 'antd'
import { Icon, Table } from 'gantd'
import { SmartModal } from '@/components/specific'
import { TYPESMAP, MAP, renderCode } from './menutypes'
import { getLocale } from 'umi/locale'

const locale = getLocale()
const localeMap = {
  'zh-CN': 'zh_CN',
  'en-US': 'en',
}
const systemLocale = localeMap[locale]
const renderName = (name, record) => {
  const { leaf } = record
  const icon = <Icon type={leaf ? "icon-file" : "icon-floder"} style={{ margin: '0 3px 0 5px' }} />
  return (
    <>
      {icon}
      {name ? JSON.parse(name)[systemLocale] : name}
    </>
  )
}
// 获取rowkey
const getRowKey = record => record.id

const BasicColumns = [
  {
    title: tr('名称'),
    dataIndex: 'name',
    align: 'left',
    width: 320,
    render: renderName
  },
  {
    title: tr('类型'),
    dataIndex: 'type',
    align: 'left',
    width: 120,
  },
  {
    title: tr('描述'),
    dataIndex: 'description',
    align: 'left'
  },
]

// 去掉菜单项，保留分类
// 注意 没有进行深拷贝 最元素的操作最好在map方法中
const transformList = (list, selected, type) => {
  return list.filter(item => {
    const isCategory = item.type === TYPESMAP[type][0]
    let isSelected = false;
    if (selected) {
      isSelected = item.id === selected.id
    }
    return isCategory && !isSelected
  }).map(({ children, ...item }) => {
    if (children && children.length) {
      const subCate = transformList(children, selected, type)
      if (subCate.length) {
        return { ...item, children: subCate }
      }
    }
    return item
  })
}


const ParentModal = ({ menuList, onClose, onMove, selected, loading, type, ...props }) => {

  const [parent, setparent] = useState(null)

  const [selectedKeys, setselectedKeys] = useState([])
  const onChangeCached = useCallback(
    (rowKeys, rows) => {
      setselectedKeys(rowKeys)
      setparent(rows[0])
    },
  )

  const columns = useMemo(() => {
    const basic = [...BasicColumns]
    basic[1].render = renderCode(type)
    return basic
  }, [type])

  useEffect(() => {
    // setparent(null)
    setselectedKeys([])
  }, [props.visible])


  const rowSelection = {
    type: 'radio',
    clickable: true,
    selectedRowKeys: selectedKeys,
    onChange: onChangeCached
  }

  const dataSource = useMemo(() => transformList([...(menuList || [])], selected, type), [selected, menuList])

  const [modalHeight, setmodalHeight] = useState(500)
  const TableHeight = useMemo(() => modalHeight - 168, [modalHeight])
  const onSizeChange = useCallback(
    (width, height) => {
      setmodalHeight(height)
    },
    [],
  )

  return (
    <SmartModal
      id='parentModal'
      title={tr('选择父菜单分类')}
      itemState={{
        width: 800,
        height: modalHeight,
      }}
      okButtonProps={{
        disabled: !parent,
      }}
      confirmLoading={loading}
      onCancel={onClose}
      onSubmit={() => onMove(parent)}
      onSizeChange={onSizeChange}
      {...props}
    >
      <Table
        hideVisibleMenu
        pagination={{}}
        columns={columns}
        dataSource={dataSource}
        rowSelection={rowSelection}
        rowKey={getRowKey}
        scroll={{ y: TableHeight }}
      />
    </SmartModal>
  )
}

export default connect(
  ({ loading, menumanage }) => ({
    ...menumanage.main,
    loading: loading.effects['mainmenu/moveToParentMenu']
  })
)(ParentModal)