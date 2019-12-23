import React, { useState, useCallback, useEffect } from 'react'
import { Radio } from 'antd'
import { Table } from 'gantd'
import Title from '@/components/common/title'
import { SmartModal } from '@/components/specific'

const columns: any[] = [
  {
    dataIndex: 'stepId',
    title: tr('步骤编号'),
  },
  {
    dataIndex: 'stepName',
    title: tr('步骤名称'),
  }
]

interface SelectorModalProps {
  visible: boolean,
  onCancel: () => void,
  onOk: (data: object) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const {
    onCancel,
    onOk,
    value,
    visible,
    dataSource = []
  } = props;

  const [selectType, setSelectType] = useState('')
  const [steps, setSteps] = useState<any[]>([])
  const [defaultStepId, setDefaultStepId] = useState<string>('')

  useEffect(() => {
    const { type = 'automatism', steps: _steps } = value;
    setSelectType(type)
    setDefaultStepId(dataSource.length ? dataSource[0].stepId : [])
    if (_steps && _steps.length) setSteps(_steps)
    else setSteps(dataSource.slice(0,1))
  }, [value, dataSource, visible])

  const handlerConfirm = useCallback(() => {
    if (selectType === 'automatism') {
      return onOk({
        type: selectType,
        steps: []
      })
    }
    onOk({
      type: selectType,
      steps
    })
  }, [selectType, steps])

  const handlerStepChange = useCallback((rowIds, rows) => {
    if (rows.length) {
      if (rows.some((V: any) => V.stepId === defaultStepId)) {
        setSteps(rows)
      } else {
        setSteps(steps)
      }
    } else {
      if (steps.length) {
        setSteps(steps)
      } else {
        setSteps(dataSource.slice(0,1))
      }
    }
  },[defaultStepId, dataSource, steps])

  const handlerSelectAll = useCallback((selected) => {
    if (selected) {
      setSteps(dataSource)
    } else {
      setSteps(dataSource.slice(0,1))
    }
  },[dataSource])

  return (
    <SmartModal
      id="AccepterSelectorModal"
      title={tr('流程步骤范围')}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 800,
        height: 500
      }}
      visible={visible}
      onSubmit={handlerConfirm}
      onCancel={onCancel}
    >
      <div style={{ padding: '7px 0 7px 5px' }} >
        <Title title={tr('选择方式')} showShortLine />
      </div>
      <Radio.Group value={selectType} onChange={(ev) => setSelectType(ev.target.value)}>
        <Radio.Button value="automatism">{'自动选择'}</Radio.Button>
        <Radio.Button value="manual">{'手动选择'}</Radio.Button>
      </Radio.Group>
      {
        selectType === 'manual' ?
          <Table
            title={
              <Title
                title={tr('流程步骤顺序')}
                showShortLine
              />
            }
            columns={columns}
            dataSource={dataSource}
            rowKey="stepId"
            rowSelection={{
              showFooterSelection: false,
              clickable: true,
              type: 'checkbox',
              selectedRowKeys: steps.map((V: any) => V.stepId),
              onChange: handlerStepChange,
              onSelectAll: handlerSelectAll
            }}

            pagination={false}
          /> : <></>
      }
    </SmartModal>
  )
}

export default SelectorModal;