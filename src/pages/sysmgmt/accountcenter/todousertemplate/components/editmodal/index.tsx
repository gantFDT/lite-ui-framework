import React, { useState, useRef, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { SmartModal } from '@/components/specific'
import schema from './schema'

interface EditModalProps {
  name: string
  visible: boolean
  onClose: Function
  onOk: (userTemplateName: string) => void
  loading: boolean
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 200
}

/**
 * 修改名称modal
 * @param props
 */
export default (props: EditModalProps) => {
  const {
    name,
    visible,
    onClose,
    onOk,
    loading
  } = props

  if (!visible) return null
  const formSchemaRef = useRef<any>({})
  const [data, setData] = useState<any>({ userTemplateName: name })

  const closeModal = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const onChange = useCallback((value: any, values: any) => {
    setData(values)
  }, [])

  const onOk_ = useCallback(async (e: any) => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!isEmpty(validateRes.errors)) {
      return
    }

    onOk && onOk(data.userTemplateName)
  }, [onOk, data])

  return (
    <SmartModal
      id='todoUserTemplateEditModal'
      title={`${tr('修改待办用户模板')} - ${name}`}
      visible={visible}
      destroyOnClose
      onCancel={closeModal}
      onOk={onOk_}
      confirmLoading={loading}
      itemState={INIT_ITEM_STATE}
      canMaximize={false}
      canResize={false}
      schema={schema}
      values={data}
      formSchemaProps={{
        wrappedComponentRef: formSchemaRef,
        onChange
      }}
    />
  )
}
