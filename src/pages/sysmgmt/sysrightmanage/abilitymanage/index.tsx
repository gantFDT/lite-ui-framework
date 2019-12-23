import React, { useEffect, useMemo, useCallback, Dispatch, useState } from 'react'
import { connect } from 'dva'
import { Tooltip, Button, Dropdown, Menu, Modal, Icon, notification, Card } from 'antd'
import { Title } from '@/components/common'
import { tr, getLocale } from '@/components/common/formatmessage'
import { SmartTable } from '@/components/specific'
import ModalForm from './ModalForm'
import URIForm from './uriform'
import scheme from './scheme'
import { SettingsProps } from '@/models/settings'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
const Locale = getLocale() === 'zh-CN' ? 'zh_CN' : 'en';

function find(dataSource: any[], parentId: string): any {
  if (parentId === 'ROOT') {
    return dataSource;
  }
  for (let i = 0; i < dataSource.length; i++) {
    const { children, id } = dataSource[i];
    if (id === parentId) {
      return children;
    }
    if (children && children.length) {
      const brothers = find(children, parentId);
      if (brothers) return brothers;
    }
  }
}

interface AbilityManageProps extends SettingsProps {
  listLoading: boolean,
  selectedRowKeys: Array<string>,
  selectedRows: Array<{ type: string, parentResourceId: string }>,
  mode: string,
  abilityList: Array<object>,
  confirmLoading: boolean,
}

const AbilityManage = (props: AbilityManageProps) => {
  const {
    listLoading,
    route,
    // selectedRowKeys,
    // selectedRows,

    mode,
    abilityList,
    confirmLoading,
    // abilityListTotal,
    // formModalVisible,

    listAbility,
    createAbilityCategory,
    createAbilityItem,
    removeAbility,
    updateAbility,
    moveAbilityUp,
    moveAbilityDown,
    save,
    MAIN_CONFIG,
  } = props;

  const refreshList = useCallback((page = 1, pageSize = 20) => {
    listAbility({
      page,
      pageSize
    })
  }, [])

  // 初始化请求
  useEffect(() => {
    listAbility({
      page: 1,
      pageSize: 20,
    }, true)
  }, [])


  const [formModalVisible, setformModalVisible] = useState(false)
  const [uriModalVisible, seturiModalVisible] = useState(false)

  const [selectedRowKeys, setselectedRowKeys] = useState([])
  const [selectedRows, setselectedRows] = useState([])

  const openFormModal = useCallback((mode) => {
    const [rowSelected] = selectedRows;
    if (~mode.indexOf('create') && rowSelected && rowSelected.type !== 'FUNCTION_CATEGORY') return notification.warning({ message: tr('只有类型为"功能分类"，才能添加') })
    if (!~mode.indexOf(':')) {
      if (rowSelected.path) {
        mode += ':item'
      } else {
        mode += ':root'
      }
    }
    save({ mode });
    setformModalVisible(true)
  }, [selectedRows])

  // const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => save({ selectedRowKeys, selectedRows }), [])
  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => {
    setselectedRowKeys(selectedRowKeys)
    setselectedRows(selectedRows)
  }, [])

  const handlerRemove = useCallback(() => {
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的功能')}?</span>,
      onOk: () => {
        removeAbility()
      }
    });
  }, [])
  const bodyMinHeight = getTableHeight(MAIN_CONFIG, TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false)

  const closeModal = useCallback(() => setformModalVisible(false), [])
  // 上移
  const handlerUp = useCallback(() => {
    const brothers: any = find(abilityList, selectedRows[0].parentResourceId);
    if (brothers[0].id === selectedRowKeys[0]) return notification.warning({ message: tr('选中的功能是同级第一个功能，无法进行上移操作') })
    moveAbilityUp(null, closeModal)
  }, [selectedRows, abilityList])
  // 下移
  const handlerDown = useCallback(() => {
    const brothers: any = find(abilityList, selectedRows[0].parentResourceId);
    if (brothers[brothers.length - 1].id === selectedRowKeys[0]) return notification.warning({ message: tr('选中的功能是同级最后一个功能，无法进行下移操作') })
    moveAbilityDown(null, closeModal)
  }, [selectedRows, abilityList])

  const handlerSave = useCallback((params) => {
    switch (mode) {
      case 'create:root':
        createAbilityCategory(params, closeModal)
        break;
      case 'create:item':
        createAbilityItem(params, closeModal)
        break;
      case 'update:root':
      case 'update:item':
        updateAbility(params, closeModal)
        break;
      default: break;
    }
  }, [mode])

  const finalScheme = useMemo(() => {
    let fakeScheme = [...scheme];
    fakeScheme[0].render = (text: any, row: any) => (
      <div className="dynamic_action_button_wrap">
        <div className="dynamic_action_text">{text && JSON.parse(text)[Locale]}</div>
        {/* {
          row.type === 'FUNCTION_CATEGORY' && (
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item onClick={() => openFormModal('create:root')}>{tr('添加子分类')}</Menu.Item>
                  <Menu.Item onClick={() => openFormModal('create:item')}>{tr('添加功能点')}</Menu.Item>
                </Menu>
              }
              placement="bottomCenter"
            >
              <Icon type="plus" className="dynamic_action_icon" />
            </Dropdown>
          )
        } */}
        <Icon type="edit" className="dynamic_action_icon" onClick={() => openFormModal('update')} />
        {/* <Icon type="delete" className="dynamic_action_icon" onClick={() => handlerRemove()} /> */}
        <Icon type="arrow-up" className="dynamic_action_icon" onClick={() => handlerUp()} />
        <Icon type="arrow-down" className="dynamic_action_icon" onClick={() => handlerDown()} />
      </div>
    )
    return fakeScheme;
  }, [scheme, openFormModal, handlerUp, handlerDown])

  const modalTitle = useMemo(() => {
    switch (mode) {
      case 'create:root':
        return tr('创建功能分类');
      case 'create:item':
        return tr('创建功能点');
      case 'update:root':
        return tr('编辑功能分类');
      case 'update:item':
        return tr('编辑功能点');
      default: break;
    }
  }, [mode])

  const headerRight = useMemo(() => {
    return (
      <>
        {/* <Dropdown
          overlay={
            <Menu>
              <Menu.Item onClick={() => openFormModal('create:root')}>{tr('添加主分类')}</Menu.Item>
              <Menu.Item disabled={!selectedRowKeys.length} onClick={() => openFormModal('create:root')}>{tr('添加子分类')}</Menu.Item>
              <Menu.Item disabled={!selectedRowKeys.length} onClick={() => openFormModal('create:item')}>{tr('添加功能点')}</Menu.Item>
            </Menu>
          }
          placement="bottomCenter"
        >
          <Button size="small" icon="plus" />
        </Dropdown> */}
        <Tooltip title={tr('编辑功能')}>
          <Button size="small" disabled={!selectedRowKeys.length} icon="edit" className="marginh5" onClick={() => openFormModal('update')} />
        </Tooltip>
        {/* <Tooltip title={tr('删除')}>
          <Button size="small" disabled={!selectedRowKeys.length} icon="delete" className="marginh5" onClick={() => handlerRemove()} />
        </Tooltip> */}
        <Tooltip title={tr('功能URI')}>
          <Button size="small" disabled={!selectedRowKeys.length} icon="api" className="marginh5" onClick={() => seturiModalVisible(true)} />
        </Tooltip>
        <Tooltip title={tr('上移')}>
          <Button size="small" disabled={!selectedRowKeys.length} icon="arrow-up" className="marginh5" onClick={() => handlerUp()} />
        </Tooltip>
        <Tooltip title={tr('下移')}>
          <Button size="small" disabled={!selectedRowKeys.length} icon="arrow-down" className="marginh5" onClick={() => handlerDown()} />
        </Tooltip>
        <Tooltip title={tr("刷新")} placement="bottom"  >
          <Button size="small" onClick={() => refreshList()} icon='reload' />
        </Tooltip>
      </>
    )
  }, [selectedRowKeys])

  return (
    <>
      <Card bodyStyle={{ padding: 0 }} className='specialTableHeader'>
        <SmartTable
          title={<Title route={route} showSplitLine />}
          tableKey='AbilityManageTable'
          schema={finalScheme}
          bodyHeight={bodyMinHeight}
          dataSource={abilityList}
          loading={listLoading}
          rowSelection={{ type: 'radio', selectedRowKeys, onChange: handlerSelect }}
          pagination={false}
          headerRight={headerRight}
          headerProps={{
            className: 'specialHeader'
          }}
        />
      </Card>
      <ModalForm
        visible={formModalVisible}
        title={modalTitle}
        bodyStyle={{ padding: "10px 24px" }}
        onCancel={closeModal}
        mode={mode}
        values={mode.includes('update') ? selectedRows[0] : {}}
        onOK={handlerSave}
        confirmLoading={confirmLoading}
      />
      <URIForm visible={uriModalVisible} nodeId={selectedRowKeys[0]} onCancel={() => seturiModalVisible(false)} />
    </>
  )
}

export default connect(
  ({ abilityManage, loading, settings }: any) => ({
    ...abilityManage,
    ...settings,
    listLoading: loading.effects['abilityManage/listAbility'],
    confirmLoading: loading.effects['abilityManage/updateAbility']
  }),
  (dispatch: Dispatch<any>) => {
    const dispatchMap: { listAbility: (p: any, init: boolean) => void } = {
      listAbility: (payload, init) => {
        dispatch({
          type: `abilityManage/listAbility`,
          payload,
          stateName: init ? "abilityList" : undefined
        })
      }
    }
    return [
      'createAbilityCategory',
      'createAbilityItem',
      'removeAbility',
      'updateAbility',
      'moveAbilityUp',
      'moveAbilityDown',
      'save',
    ].reduce((total, cur) => ({
      ...total,
      [cur]: (payload: any, callback: () => void = () => { }) => dispatch({ type: `abilityManage/${cur}`, payload, callback }),
    }), dispatchMap)
  },
)(AbilityManage)
