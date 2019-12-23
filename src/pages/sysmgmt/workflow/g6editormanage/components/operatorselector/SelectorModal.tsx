import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Button, Tooltip, Alert, notification, Tabs } from 'antd'
import { Table, Input, EditStatus } from 'gantd'
import { connect } from 'dva'
import { SmartModal } from '@/components/specific'
import { Title } from '@/components/common'
import OwnerSelectorPanel from '@/components/specific/workflow/ownerselector/Panel'
import { InnerFuncItemProps } from './index';

import { namespace } from '../../model'

const columns = [
  {
    dataIndex: 'callbackName',
    title: tr('函数名称'),
  },
  {
    dataIndex: 'type',
    title: tr('类型'),
  },
]

const paramColumns = [
  {
    dataIndex: 'name',
    title: tr('参数名'),
  },
  {
    dataIndex: 'value',
    title: tr('参数值'),
  },
]

interface SelectorModalProps {
  visible: boolean,
  onCancel: () => void,
  onOk: (data: object) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const {
    callbackFunctions,
    listCallbackFunctions,
    loading,

    onCancel,
    onOk,
    value,
    visible
  } = props;

  const [selectedUsers, setSelectedUsers] = useState([])
  const [selectedUserNames, setSelectedUserNames] = useState([])

  const [funcsSelected, setFuncsSelected] = useState<InnerFuncItemProps[]>([])
  const [selectType, setSelectType] = useState<string>('')

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<InnerFuncItemProps[]>([])

  useEffect(() => {
    const { functions = [], type = 'user', userList = [] } = value;
    setSelectedUsers(userList)
    setSelectedUserNames(userList.map((V: any) => V.userLoginName || V.userName))
    setFuncsSelected(functions)
    setSelectType(type)
  }, [value])

  const handlerChangeUser = useCallback((selectedUsers) => {
    setSelectedUsers(selectedUsers);
    setSelectedUserNames(selectedUsers.map((V: any) => V.userLoginName || V.userName));
  }, [])

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [visible])

  const [keys2add, setKeys2add] = useState<string[]>([])
  const [rows2add, setRows2add] = useState<InnerFuncItemProps[]>([])

  const [modalVisible, setModalVisible] = useState(false)

  const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
    setSelectedRowKeys(selectedRowKeys)
    setSelectedRows(selectedRows)
  }, [setSelectedRowKeys, setSelectedRows])

  const handlerNewSelect = useCallback((keys2add, rows2add) => {
    setKeys2add(keys2add)
    setRows2add(rows2add)
  }, [setKeys2add, setRows2add])

  const handlerConfirm = useCallback(() => {
    onOk({
      type: selectType,
      functions: funcsSelected,
      userList: selectedUsers.map((U: any) => ({
        userId: U.id,
        userLoginName: U.userLoginName || U.userName,
        userName: U.userName
      }))
    })
  }, [funcsSelected, selectType, selectedUsers])

  // 打开待选Modal
  const showModel = useCallback(() => {
    setKeys2add([])
    setRows2add([])
    listCallbackFunctions('User')
    setModalVisible(true)
  }, [])

  // 确认添加
  const handlerAddFunc = useCallback(() => {
    if (funcsSelected.some(F => F['serviceName'] === rows2add[0]['serviceName']))
      return notification.error({ message: tr('该函数已添加！') });

    setFuncsSelected([
      ...funcsSelected,
      ...rows2add
    ])
    setModalVisible(false)
  }, [funcsSelected, rows2add])

  const handlerRemove = useCallback(() => {
    funcsSelected.splice(funcsSelected.findIndex(F => F['serviceName'] === selectedRowKeys[0]), 1)
    setFuncsSelected([...funcsSelected])
    setSelectedRowKeys([])
    setSelectedRows([])
  }, [funcsSelected, selectedRowKeys])

  const handlerParamValueChange = useCallback((value: string, index: number) => {
    const fsIndex = funcsSelected.findIndex(FS => FS['serviceName'] === selectedRowKeys[0]);
    funcsSelected[fsIndex]
      .parameter[index]
      .value = value;
    setFuncsSelected([...funcsSelected]);
    setSelectedRows([funcsSelected[fsIndex]]);
  }, [funcsSelected, selectedRowKeys])

  const fakeColumns = useMemo(() => {
    return paramColumns.map((item: any) => {
      const { dataIndex } = item
      const render = (text: string, record: InnerFuncItemProps, index: number) => {
        return (
          <Input
            onChange={(value: string) => handlerParamValueChange(value, index)}
          />)
      }
      if (dataIndex === 'value') {
        item.editConfig = {
          render
        }
      }
      return item
    })
  }, [paramColumns, handlerParamValueChange, funcsSelected])

  return (
    <>
      <SmartModal
        id="OperatorSelectorModal"
        title={tr('选择人员')}
        isModalDialog
        maxZIndex={12}
        itemState={{
          width: 1024,
          height: 768
        }}
        visible={visible}
        onCancel={onCancel}
        onSubmit={handlerConfirm}
      >
        <Tabs activeKey={selectType} onChange={setSelectType}>
          <Tabs.TabPane tab={tr('固定人员')} key="user">
            <OwnerSelectorPanel
              transKey="OwnerSelector"
              selectedLoginNames={selectedUserNames}
              height={628}
              isAllUser
              onChange={handlerChangeUser}
            />
          </Tabs.TabPane>
          <Tabs.TabPane tab={tr('函数筛选')} key="function">
            <Table
              title={<Title title={tr('函数列表')} showShortLine />}
              columns={columns}
              dataSource={funcsSelected}
              rowKey={'serviceName'}
              headerRight={<>
                <Tooltip title={tr(`新增函数`)}>
                  <Button size="small" icon="plus" className="marginh5" onClick={showModel} />
                </Tooltip>
                <Tooltip title={tr(`删除函数`)}>
                  <Button disabled={!selectedRowKeys.length} size="small" icon="delete" className="marginh5" onClick={handlerRemove} />
                </Tooltip>
              </>}
              rowSelection={{
                clickable: true,
                type: 'radio',
                selectedRowKeys,
                onChange: handlerSelect
              }}
              pagination={false}
            />
            <Table
              editable={EditStatus.EDIT}
              dataSource={selectedRows.length ? selectedRows[0].parameter : []}
              columns={fakeColumns}
              title={<Title title={tr('函数参数')} showShortLine />}
            />
          </Tabs.TabPane>
        </Tabs>
      </SmartModal>
      <SmartModal
        id="AllFuncModal"
        title={tr('选择函数')}
        isModalDialog
        maxZIndex={13}
        itemState={{
          width: 960,
          height: 700
        }}
        visible={modalVisible}
        onSubmit={handlerAddFunc}
        onCancel={() => setModalVisible(false)}
      >
        <Table
          title={<Title title={tr('函数列表')} showShortLine />}
          columns={columns}
          dataSource={callbackFunctions}
          rowKey={'serviceName'}
          bodyHeight={`100%`}

          rowSelection={{
            clickable: true,
            type: 'radio',
            selectedRowKeys: keys2add,
            onChange: handlerNewSelect
          }}

          loading={loading}
          pagination={false}
        />
        {
          rows2add.length ? <Alert
            style={{ margin: '15px 0' }}
            message={tr('函数说明')}
            description={rows2add[0].callbaclDescription}
            type="info"
          /> : <></>
        }
      </SmartModal>
    </>
  )
}

const ModalWithDva = connect(
  ({ loading, settings, workFlowDesigner, user }: any) => ({
    currentUser: user.currentUser,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    ...workFlowDesigner,
    loading: loading.effects[namespace + '/listCallbackFunctions'],
  }),
  (dispatch: any) => ({
    listCallbackFunctions: (payload: any) => dispatch({ type: namespace + '/listCallbackFunctions', payload }),
  })
)(SelectorModal);

export default ModalWithDva;