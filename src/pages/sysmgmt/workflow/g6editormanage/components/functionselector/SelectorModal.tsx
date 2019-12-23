import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Button, Tooltip, Alert, notification, Radio } from 'antd'
import { Table, EditStatus, Input } from 'gantd'
import { connect } from 'dva'
import { SmartModal } from '@/components/specific'
import { Title } from '@/components/common'
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
    radioOptions,

    onCancel,
    onOk,
    value,
    valueProp,
    serviceName,
    visible
  } = props;

  const [funcsSelected, setFuncsSelected] = useState<InnerFuncItemProps[]>([])
  const [selectType, setSelectType] = useState<string>('')

  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [selectedRows, setSelectedRows] = useState<InnerFuncItemProps[]>([])

  useEffect(() => {
    setSelectedRowKeys([]);
    setSelectedRows([]);
  }, [visible])

  useEffect(() => {
    setFuncsSelected(value.functions)
    setSelectType(value.type)
  }, [value])

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
      functions: funcsSelected
    })
  },[funcsSelected, selectType])

  // 打开待选Modal
  const showModel = useCallback(() => {
    setKeys2add([])
    setRows2add([])
    listCallbackFunctions(serviceName)
    setModalVisible(true)
  },[serviceName])
  
  // 确认添加
  const handlerAddFunc = useCallback(() => {
    if(funcsSelected.some(F => F[valueProp] === rows2add[0][valueProp]))
      return notification.error({message:tr('该函数已添加！')});

    setFuncsSelected([
      ...funcsSelected,
      ...rows2add
    ])
    setModalVisible(false)
  },[funcsSelected, rows2add])

  const handlerRemove = useCallback(() => {
    funcsSelected.splice(funcsSelected.findIndex(F => F[valueProp] === selectedRowKeys[0]),1)
    setFuncsSelected([...funcsSelected])
    setSelectedRowKeys([])
    setSelectedRows([])
  },[funcsSelected, selectedRowKeys])

  const handlerParamValueChange = useCallback((value: string, index: number) => {
    const fsIndex = funcsSelected.findIndex(FS => FS[valueProp] === selectedRowKeys[0]);
    funcsSelected[fsIndex]
    .parameter[index]
    .value = value;
    setFuncsSelected([...funcsSelected]);
    setSelectedRows([funcsSelected[fsIndex]]);
  },[funcsSelected, selectedRowKeys])

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

  const showFuncs = useMemo(() => {
    if(!radioOptions) return true;
    return selectType && radioOptions.find((O: any) => O.value === selectType).showFuncs
  }, [radioOptions, selectType])
  
  return (
    <>
      <SmartModal
        id="FuncSelectorModal"
        title={tr('已选择函数')}
        isModalDialog
        maxZIndex={12}
        itemState={{
          width: 1024,
          height: 768
        }}
        visible={visible}
        onSubmit={handlerConfirm}
        onCancel={onCancel}
      >
        {
          radioOptions &&
          <>
            <div style={{padding: '7px 0 7px 5px'}} >
              <Title title={tr('选择类别')} showShortLine/>
            </div>
            <Radio.Group value={selectType} onChange={(ev) => setSelectType(ev.target.value)}>
              {
                radioOptions.map((O: any) => (
                  <Radio.Button value={O.value}>{O.label}</Radio.Button>
                ))
              }
            </Radio.Group>
          </>
        }
        {
          showFuncs &&
          <>
            <Table
              title={<Title title={tr('函数列表')} showShortLine/>}
              columns={columns}
              dataSource={funcsSelected}
              rowKey={valueProp}
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
              title={<Title title={tr('函数参数')} showShortLine/>}
            />
          </>
        }
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
          title={<Title title={tr('函数列表')} showShortLine/>}
          columns={columns}
          dataSource={callbackFunctions}
          rowKey={valueProp}
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
            style={{margin: '15px 0'}}
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
    MAIN_CONFIG: settings.MAIN_CONFIG,
    ...workFlowDesigner,
    loading: loading.effects[namespace + '/listCallbackFunctions']
  }),
  (dispatch: any) => ({
    listCallbackFunctions: (payload: any) => dispatch({type:namespace + '/listCallbackFunctions', payload}),
  })
)(SelectorModal);

export default ModalWithDva;