import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { connect } from 'dva'
import { Tooltip, Button, Dropdown, Menu, message, Modal, Popconfirm, Card } from 'antd'
import { Icon } from 'gantd';
import { omit, cloneDeep, get } from 'lodash'
import { useImmer } from 'use-immer'


// import Content from './content.jsx';
import MenuModal from './menuModal.jsx'
import ParentModal from './parentModal.jsx'
import { tr } from '@/components/common/formatmessage';
import { compose, getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { MAP, TYPESMAP, COLUMNS, renderCode } from './menutypes'
import { Title } from '@/components/common'
import { SmartTable } from '@/components/specific'

const btnMargin = {}


const initialModalProps = {
  visible: false,
  title: '',
  withPath: true,  // 是否显示路径设置，影响创建的type
  withParent: false, // 是否使用已选择的节点作为上级菜单
  withCode: false, // true标识显示编码编辑框
  edit: false, // edit为true，会把selected当做编辑的对象
}

const checkwhetherSelect = (selected, action, type) => () => {
  if (!selected) {
    message.warning(tr('请选择上级菜单'), 5)
    return;
  }
  if (selected.type === TYPESMAP[type][1]) {
    message.error(tr('当前选项不能添加子级'), 5);
    return;
  }
  action()
}


// 获取rowkey
const getRowKey = record => record.id

// 创建功能
const getAddOverlay = (selected, setModalProp, type) => {

  // 主菜单
  const showMainCate = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加主菜单分类'), menuType: 0 })))
  const showMainMenu = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加主菜单项'), menuType: 1 })))
  const showSubCate = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加子菜单分类'), menuType: 2 })))
  const showSubMenu = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加子菜单项'), menuType: 3 })))
  // 移动端菜单
  const showMobilePage = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加页面'), menuType: 4 })))
  const showMobileItem = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加操作菜单项'), menuType: 5 })))
  // 上下文菜单
  const showContextPage = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加分类'), menuType: 6 })))
  const showContextItem = useCallback(() => setModalProp(() => ({ visible: true, title: tr('添加操作菜单项'), menuType: 7 })))

  const showSubCateWithCheck = checkwhetherSelect(selected, showSubCate, type)
  const showSubMenuWithCheck = checkwhetherSelect(selected, showSubMenu, type)
  const showMobileItemWithCheck = checkwhetherSelect(selected, showMobileItem, type)
  const showContextItemWithCheck = checkwhetherSelect(selected, showContextItem, type)

  const disabled = !selected || selected.type === TYPESMAP[type][1]

  if (type === 'main') {
    return (
      <Menu>
        <Menu.Item onClick={showMainCate}>
          <Icon type='icon-category' />
          {tr('添加主分类')}
        </Menu.Item>
        <Menu.Item onClick={showMainMenu}>
          <Icon type='icon-caidan-shi' />
          {tr('添加主菜单项')}
        </Menu.Item>
        <Menu.Item onClick={showSubCateWithCheck} disabled={disabled}>
          <Icon type='icon-fenlei' />
          {tr('添加子分类')}
        </Menu.Item>
        <Menu.Item onClick={showSubMenuWithCheck} disabled={disabled}>
          <Icon type='icon-caidan' />
          {tr('添加子菜单项')}
        </Menu.Item>
      </Menu>
    )
  }
  if (type === 'mobile') {
    return (
      <Menu>
        <Menu.Item onClick={showMobilePage}>
          <Icon type='icon-category' />
          {tr('添加页面')}
        </Menu.Item>
        <Menu.Item onClick={showMobileItemWithCheck}>
          <Icon type='icon-fenlei' />
          {tr('添加菜单项')}
        </Menu.Item>
      </Menu>
    )
  }
  if (type === 'context') {
    return (
      <Menu>
        <Menu.Item onClick={showContextPage}>
          <Icon type='icon-category' />
          {tr('添加分类')}
        </Menu.Item>
        <Menu.Item onClick={showContextItemWithCheck}>
          <Icon type='icon-fenlei' />
          {tr('添加菜单项')}
        </Menu.Item>
      </Menu>
    )
  }
  return null


}

// 找到某个节点在当前同级的序号及父级id
const findIndex = (list, item, parentId = 'ROOT') => {
  if (list && list.length && item) {
    const index = list.findIndex(lItem => lItem.id === item.id)
    if (index > -1) return [index, list.length, parentId]
    for (const { children, id } of list) {
      if (children && children.length) {
        const result = findIndex(children, item, id)
        if (result[0] > -1) return result
      }
    }
  }
  return [-1, 0]
}

const menuTypeMap = new Map(
  [
    ['main', [0, 1, 2, 3]],
    ['mobile', [4, 5]],
    ['context', [6, 7]],
  ]
)

// 组件
const MainMenuManage = props => {
  const { MAIN_CONFIG, create, refresh: originRefresh, remove, update, menumanage, move, up, down, moveToParent, type, loading, route } = props
  const moveAction = { up, down }

  const minHeight = getTableHeight(MAIN_CONFIG, TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)
  const [selected, setselected] = useState()
  // 获取当前的数据列表
  const menuList = useMemo(() => get(menumanage, `${type}.menuList`, []), [menumanage, type])
  // 计算操作的实际类型
  const menuType = useMemo(() => {
    if (!selected) return null
    const typeIndex = TYPESMAP[type].findIndex(tp => tp === selected.type)
    return menuTypeMap.get(type)[typeIndex]
  }, [type, selected])

  const [expandKeys, setexpandKeys] = useState([])
  const BasicColumns = useMemo(() => COLUMNS[type], [type])
  const [columns, setcolumns] = useState(() => {
    const cols = [...BasicColumns]
    cols[1].render = renderCode(type)
    return cols
  })
  const [selectedKeys, setselectedKeys] = useState([])
  const [modalProp, setModalProp] = useImmer(initialModalProps)
  // 移动到新分类
  const [parentModalProps, setParentModalProps] = useImmer({ visible: false })

  const refresh = useCallback(initial => originRefresh(type, initial), [type])
  // 初始化加载
  useState(() => {
    refresh(true)
  })
  const onChangeCached = useCallback(
    (rowKeys, rows) => {
      setselectedKeys(rowKeys)
      setselected(rows[0])
    },
  )
  useEffect(() => {
    const cols = cloneDeep(BasicColumns)
    cols[1].render = renderCode(type)
    setcolumns(cloneDeep(cols))
  }, [expandKeys, type, BasicColumns])

  // 关闭创建弹窗
  const onCancel = useCallback(
    () => {
      setModalProp(prop => {
        prop.visible = false;
        prop.edit = false
      })
    },
  )
  // 关闭删除弹窗
  const toggleParentModalVisible = useCallback(visible => setParentModalProps(() => ({ visible })))
  const onClose = useCallback(() => toggleParentModalVisible(false))
  // 打开选择父级弹窗
  const showParentModal = useCallback(() => toggleParentModalVisible(true))

  // 操作之后的公共回调， 刷新和关闭弹窗
  const callback = useCallback(compose(refresh, onCancel, onClose))

  // 给创建操作添加刷新和关闭modal回调
  const createMenu = useCallback(
    (data, final) => {
      create(data, callback, final)
    },
  )

  // 删除节点
  const removeMenu = useCallback(
    () => {
      if (!selected) {
        message.warning(tr('请选择需要删除的菜单节点'))
      }
      else {
        remove(
          {
            id: selected.id
          },
          compose(refresh, () => setselected()) // 刷新，关闭弹窗、重置选中的节点
        )
      }
    },
    [selected]
  )

  // 编辑节点
  const editMenu = useCallback(
    () => {
      setModalProp(() => ({
        visible: true,
        title: `编辑-${selected.name}`,
        menuType,
        edit: true, // edit为true，会把parent当做编辑的对象
      }))
    },
    [menuType, selected]
  )

  // 更新菜单
  const updateMenu = useCallback(
    (data) => {
      update(data, callback)
    }
  )

  const findSelect = useCallback(
    list => {
      for (const item of list) {
        if (item.id === selected.id) {
          setselected(omit(item, 'children'))
          return true
        }
        if (item.children && item.children.length) {
          if (findSelect(item.children)) { // false的时候不要return ，否则循环可能没有完成
            return true
          }
        }
      }
      return false
    }
  )
  // 列表数据发生变化，及时更新已选中数据，主要用于更新操作
  useEffect(() => {
    if (selected) {
      findSelect(menuList)
    }
  }, [menuList])

  const validateMoveToRoot = useCallback(
    () => {
      if (selected.parentResourceId === 'ROOT') {
        message.warning(tr('当前选中的菜单已为主分类/菜单'))
        return
      }
      move({
        resourceId: selected.id
      }, callback)
    },
    [selected],
  )

  const validateMoveUpDown = useCallback(
    (action) => {
      const [index, length, parentResourceId] = findIndex(menuList, selected);
      if (index > -1) {
        if (index === 0 && action === 'up') {
          message.warning(tr('选中的菜单是同级第一个菜单，无法进行上移操作'))
          return;
        }
        if (index === length - 1 && action === 'down') {
          message.warning(tr('选中的菜单是同级最后一个菜单，无法进行下移操作'))
          return;
        }
        moveAction[action]({
          parentResourceId,
          resourceId: selected.id
        }, callback)
      }

    },
    [selected, menuList],
  )

  // 当menuList和selected改变的时候也要更新对validateMoveUpDown的引用
  const upMenu = useCallback(() => { validateMoveUpDown('up') }, [selected, menuList])
  const downMenu = useCallback(() => { validateMoveUpDown('down') }, [selected, menuList])
  const moveToNewParent = useCallback(
    (parent) => {
      moveToParent({
        parentResourceId: parent.id,
        resourceId: selected.id
      }, callback)
    },
    [selected],
  )

  // 移动菜单操作
  const getOverlay = useCallback(
    () => {
      return (
        <Menu>
          {
            type === 'main' ? (
              <Menu.Item onClick={validateMoveToRoot}>
                <Icon type='icon-zuzhijiegou' />
                {tr('提升为主分类/菜单')}
              </Menu.Item>
            ) : null
          }
          {
            type !== 'context' ? (
              <Menu.Item onClick={showParentModal}>
                <Icon type='icon-zuzhijiegou' />
                {type !== 'mobile' ? tr('移动到新分类') : tr("移动到新页面")}
              </Menu.Item>
            ) : null
          }
          <Menu.Item onClick={upMenu}>
            <Icon type='icon-shangyi' />
            {tr('上移')}
          </Menu.Item>
          <Menu.Item onClick={downMenu}>
            <Icon type='icon-xiayi' />
            {tr('下移')}
          </Menu.Item>
        </Menu>
      )
    },
    [selected],
  )

  const rowSelection = useMemo(() => ({
    type: 'radio',
    selectedRowKeys: selectedKeys,
    onChange: onChangeCached
  }), [selectedKeys, onChangeCached])

  return (
    <>
      <Card bodyStyle={{ padding: 0 }}>
        <SmartTable
          title={<Title route={route} showSplitLine />}
          tableKey={`${type}Menun`}
          schema={columns}
          dataSource={menuList}
          loading={loading}
          rowKey={getRowKey}
          onExpandedRowsChange={setexpandKeys}
          bodyHeight={minHeight}
          headerProps={{
            className: 'specialHeader'
          }}
          headerRight={(
            <>
              <Tooltip title={tr('添加')}>
                <Dropdown
                  overlay={getAddOverlay(selected, setModalProp, type)}
                  placement='bottomRight'
                  trigger={['click']}
                >
                  <Button size="small" icon="plus" style={btnMargin} />
                </Dropdown>
              </Tooltip>
              {
                selected ? (
                  <>
                    <Tooltip title={tr('编辑菜单')}>
                      <Button size="small" icon="edit" style={btnMargin} onClick={editMenu} />
                    </Tooltip>
                    <Tooltip title={tr('删除菜单')}>
                      <Popconfirm placement="bottom" title={`${tr('是否确认删除选中节点')}`} onConfirm={removeMenu} okType='danger'>
                        <Button size="small" icon="delete" type="danger" style={btnMargin} />
                      </Popconfirm>
                    </Tooltip>
                  </>
                ) :
                  (
                    <>
                      <Tooltip title={tr('编辑菜单')}>
                        <Button size="small" icon="edit" disabled style={btnMargin} />
                      </Tooltip>
                      <Tooltip title={tr('删除菜单')}>
                        <Button size="small" icon="delete" type='danger' disabled style={btnMargin} />
                      </Tooltip>
                    </>
                  )
              }
              <Tooltip title={tr('移动菜单')}>
                <Dropdown
                  overlay={getOverlay()}
                  placement='bottomRight'
                  trigger={['click']}
                  disabled={!selected}
                >
                  <Button size="small" icon="unordered-list" style={btnMargin} />
                </Dropdown>
              </Tooltip>
              <Tooltip title={tr('刷新菜单列表')}>
                <Button size="small" icon="reload" style={btnMargin} onClick={refresh} />
              </Tooltip>
            </>
          )}
          rowSelection={rowSelection}
        />
      </Card>
      <MenuModal {...modalProp} type={type} selected={selected} update={updateMenu} onCreate={createMenu} onCancel={onCancel} />
      <ParentModal {...parentModalProps} type={type} selected={selected} onClose={onClose} onMove={moveToNewParent} />
    </>
  )
}


const mapDispatchToProps = dispatch => {
  const mapProps = {
    refresh: (type, initial) => {
      const action = {
        type: 'menumanage/queryMenuData',
        menuType: type,
        payload: {
          data: {
            node: 'root',
            pageInfo: {},
            types: TYPESMAP[type]
          }
        },
      }
      if (initial) {
        action.stateName = type
      }
      dispatch(action)
    }
  }
    ; (['create', 'remove', 'update', 'move', 'up', "down", 'moveToParent']).forEach(method => {
      mapProps[method] = (data, cb, final) => {
        dispatch({
          type: `menumanage/${method}Menu`,
          payload: {
            data
          },
          callback: cb,
          final
        })
      }
    })

  return mapProps
}

export default connect(
  ({ menumanage, settings, loading }) => ({
    ...settings,
    menumanage,
    loading: loading.effects['menumanage/queryMenuData']
  }),
  mapDispatchToProps
)(MainMenuManage)
