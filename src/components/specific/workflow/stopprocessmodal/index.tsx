import React, { useCallback, useState, useRef } from 'react'
import { Button } from 'antd'
import { SmartModal } from '@/components/specific'
import { modalSchema, modalUISchema } from './schema'
import _ from 'lodash'
import { doStopProcessApi } from '../service'

interface StopProcessModalProps {
  processId: string // 流程id
  title: string // 表单名称
  visible: boolean // 弹框是否可见
  onClose: () => void // 关闭弹框的回调
  onStopSuccess: () => void // 终止成功的回调
}

/**
 * 终止流程弹框组件
 */
export default (props: StopProcessModalProps) => {
  const {
    processId,
    title,
    visible,
    onClose,
    onStopSuccess
  } = props
  if (!visible) return null

  const formSchemaRef = useRef<any>({})
  const [reason, setReason] = useState('')
  const [stopLoading, setStopLoading] = useState(false)

  const onFormChange = useCallback((value: any) => {
    setReason(value.reason)
  }, [])

  const onClose_ = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const onStop = useCallback(async () => {
    setStopLoading(true)
    try {
      await doStopProcessApi({
        processId,
        reason
      })
      onClose_()
      onStopSuccess()
    } catch (error) {
      console.error('doStopProcessApi error', error)
    }
    setStopLoading(false)
  }, [processId, reason, onClose_, onStopSuccess])

  return (
    <SmartModal
      id='stopProcessModal'
      title={`${tr('终止流程')}-${title}`}
      isModalDialog
      maxZIndex={12}
      itemState={{
        width: 760,
        height: 480
      }}
      confirmLoading={stopLoading}
      visible={visible}
      schema={modalSchema}
      uiSchema={modalUISchema}
      formSchemaProps={{
        wrappedComponentRef: formSchemaRef,
        onChange: onFormChange
      }}
      onCancel={onClose_}
      canMaximize={false}
      canResize={false}
      footer={(
        <>
          <Button size='small' onClick={onClose_}>{tr('取消')}</Button>
          <Button
            size='small'
            type='primary'
            disabled={!reason}
            loading={stopLoading}
            onClick={onStop}
          >{tr('终止')}</Button>
        </>
      )}
    />
  )
}
