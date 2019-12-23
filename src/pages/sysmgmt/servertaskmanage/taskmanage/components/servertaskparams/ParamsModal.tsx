import React, { useState, useMemo, useReducer, useCallback, useEffect } from 'react'
import { Button } from 'antd'
import _ from 'lodash'
import { Table, EditStatus, Input } from 'gantd'
import { SmartModal } from '@/components/specific'
import { tr, Title } from '@/components/common'

interface ParamsModalProps {
  originValue: string,
  visible: boolean,
  onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  onCancel?: () => void,
  onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  [propName: string]: any
}

export interface Action {
  type: string,
  payload?: any
}

function reducers(state: any, action: Action) {
  const { type, payload } = action
  switch (type) {
    case "save":
      return { ...state, ...payload }
    case "reset":
      return { ...initalState }
  }
}

const initalState = {
  dataSource: [],
  selectedRowKeys: [],
}

function ParamsModal(props: ParamsModalProps) {
  const {
    originValue,
    visible,
    onCancel,
    onOk
  } = props;

  const [modalHei, setModalHei] = useState(0);
  const [state, dispatch] = useReducer(reducers, initalState);
  const { dataSource, selectedRowKeys } = state;

  useEffect(() => {
    if (visible) {
      translateValue()
    } else {
      dispatch({ type: 'reset' })
    }
  }, [visible])

  const translateValue = useCallback(() => {
    if (!originValue) return;
    try {
      let tempObj = JSON.parse(originValue)
      let dataSource = Object.keys(tempObj).map((name, key) => {
        return { name, id: key + 1, value: tempObj[name] }
      })
      dispatch({ type: 'save', payload: { dataSource } })
    } catch (err) { console.log(err) }
  }, [originValue])

  const onSelectChange = useCallback((selectedRowKeys, selectedRows) => {
    dispatch({ type: 'save', payload: { selectedRowKeys, selectedRows } })
  }, [])

  //删除
  const handleRemove = useCallback(() => {
    let newDataSource = dataSource.filter((item: any) => item.id != selectedRowKeys[0]);
    dispatch({ type: 'save', payload: { dataSource: newDataSource, selectedRowKeys: [] } })
  }, [dataSource, selectedRowKeys])

  const addRow = useCallback(() => {
    let newDataSource = [...dataSource, { name: '', value: '', id: dataSource.length + 1 }]
    dispatch({ type: 'save', payload: { dataSource: newDataSource } })
  }, [dataSource])

  const onSizeChange = useCallback((width, height) => {
    setModalHei(height)
  }, [])

  const handlerOk = useCallback(() => {
    let tempStr = _.chain(dataSource).filter((i) => i.name).map(item => `"${item.name}":"${item.value || ''}"`).value();
    let retParams = `{${tempStr.join(',')}}`;
    onOk && onOk(retParams)
  }, [dataSource])

  const changeListItem = useCallback((index, value, key) => {
    const item = dataSource[index];
    if (_.isEmpty(item)) return;
    const newItem = { ...item, [key]: value }
    dispatch({ type: 'save', payload: { dataSource: [...dataSource.slice(0, index), newItem, ...dataSource.slice(index + 1)] } })
  }, [dataSource])

  const columns = useMemo(() => {
    return [{
      title: tr('参数名'),
      dataIndex: 'name',
      editConfig: {
        render: (text: string, record: any, index: number) => {
          return <Input
            onChange={(value: string) => { changeListItem(index, value, 'name') }}
          />
        }
      }
    }, {
      title: tr('参数值'),
      dataIndex: 'value',
      editConfig: {
        render: (text: string, record: any, index: number) => {
          return <Input
            onChange={(value: string) => { changeListItem(index, value, 'value') }}
          />
        }
      }
    }
    ]
  }, [dataSource])

  const tableHeight = useMemo(() => {
    return modalHei - 41 - 40 - 20 - 30 - 45
  }, [modalHei])

  return (
    <SmartModal
      id='taskParamsModal'
      title={tr('任务执行参数编辑器')}
      visible={visible}
      minWidth={400}
      minHeight={400}
      itemState={{ height: 530 }}
      onSizeChange={onSizeChange}
      onCancel={onCancel}
      onOk={handlerOk}
    >
      <Table
        rowKey="id"
        columns={columns}
        headerLeft={<Title title={tr('编辑参数列表')} showShortLine={true} />}
        headerRight={<>
          <Button className="marginh5" size="small" icon="plus" onClick={addRow} />
          <Button className="marginh5" size="small" type='danger' icon="delete" disabled={!selectedRowKeys.length} onClick={handleRemove} />
        </>}
        hideVisibleMenu={true}
        editable={EditStatus.EDIT}
        scroll={{ x: '100%', y: tableHeight }}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: onSelectChange,
          showFooterSelection: false
        }}
        dataSource={dataSource}
        pagination={false}
      />
    </SmartModal>
  )
}
export default ParamsModal