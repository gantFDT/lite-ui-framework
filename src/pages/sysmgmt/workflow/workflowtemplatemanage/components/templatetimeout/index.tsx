import React, { useCallback, useState, useMemo, useEffect } from 'react'
import { InputNumber } from 'antd'
import { Table, EditStatus } from 'gantd'
import SmartModal from '@/components/specific/smartmodal'
import { findTemplateTimeoutApi } from '../../service'
import columns from './schema'

export interface TemplateTimeoutProps {
  id: string
  title: string
  visible: boolean
  btnLoading: boolean
  values?: {
    name: string
    strategy: boolean
  }
  onSubmit: (params: any[]) => void
  onClose: (e?: any) => void
}

const INIT_ITEM_STATE = {
  width: 650,
  height: 410
}

const Number = (props: any) => {
  return <InputNumber min={0} max={100000} {...props} style={{ width: '100%' }} />
}

/**
 * 设置时间阈值组件
 */
export default (props: TemplateTimeoutProps) => {
  const {
    id,
    title,
    visible,
    onClose,
    onSubmit,
    btnLoading
  } = props

  if (visible === false) {
    return null
  }

  const [info, setInfo] = useState<any>({})
  const [listInfo, setListInfo] = useState<any[]>([])
  const [findLoading, setFindLoading] = useState(false)
  const { modifyBy, modifyDate } = info
  const [modalHeight, setModalHeight] = useState(0)

  const tableHeight = useMemo(() => {
    return modalHeight - 41 - 20 - 44 - 31 - 45
  }, [modalHeight])

  const findTemplateTimeout = useCallback(async () => {
    setFindLoading(true)
    try {
      let res = await findTemplateTimeoutApi(id)
      const { modifyBy, modifyDate, thresholds } = res
      setInfo({ modifyBy, modifyDate })
      setListInfo(thresholds)
    } catch (error) {
      console.error('cfindTemplateTimeout error', error)
    }
    setFindLoading(false)
  }, [])

  useEffect(() => {
    findTemplateTimeout()
  }, [])

  const onInputChange = useCallback((index: number, name: string, value: number) => {
    let newListInfo: any[] = JSON.parse(JSON.stringify(listInfo))
    let current = newListInfo[index]
    current[name] = value
    newListInfo.splice(index, 1, current)
    setListInfo(newListInfo)
  }, [listInfo])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalHeight(height)
  }, [])

  const showColumns = useMemo(() => {
    return columns.map((item: any) => {
      const { dataIndex } = item
      if (['thresholdValue01', 'thresholdValue02'].includes(dataIndex)) {
        item.editConfig = {
          render: (text: string, record: any, index: number) => <Number onChange={onInputChange.bind(null, index, dataIndex)} />
        }
      }
      return item
    })
  }, [onInputChange])

  const onOk = useCallback(() => {
    onSubmit && onSubmit(listInfo)
  }, [listInfo])

  return (
    <SmartModal
      visible={visible}
      id={`templateTimeout`}
      title={`设置超值阈值-${title}`}
      itemState={INIT_ITEM_STATE}
      okText={tr('保存设置')}
      onCancel={onClose}
      onSizeChange={onModalSizeChange}
      onOk={onOk}
      confirmLoading={btnLoading}
    >
      <Table
        tableKey='templateTimeout'
        headerLeft={<span style={{ lineHeight: '40px' }}><b>{tr('维护人：')}</b>{modifyBy || ''}</span>}
        headerRight={<span style={{ lineHeight: '40px' }}><b>{tr('维护时间：')}</b>{modifyDate}</span>}
        hideVisibleMenu
        rowKey='templateStepName'
        columns={showColumns}
        loading={findLoading}
        dataSource={listInfo}
        scroll={{
          y: tableHeight
        }}
        editable={EditStatus.EDIT}
      />
    </SmartModal>)
}
