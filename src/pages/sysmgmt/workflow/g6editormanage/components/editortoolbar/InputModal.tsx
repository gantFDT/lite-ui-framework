import React, { useState, useCallback, useMemo } from 'react'
import { Button } from 'antd'
import { Title } from '@/components/common'
import { SmartModal } from '@/components/specific'
import SchemaForm from '@/components/form/schema'

interface InputModalProps {
  modalTitle: string;
  visible: boolean;
  onClose: () => void;
  width?: number;
  height?: number;
  schema: any;
  onOk: (data: any) => void;
  formTitle?: string;
}

function InputModal(props: InputModalProps) {
  const { modalTitle, visible, onClose, onOk, schema, formTitle, width, height } = props;

  const [formData, setFormData] = useState({});

  const handlerConfirm = useCallback(() => {
    onOk && onOk(formData)
  }, [formData])

  const handlerFormChange = useCallback((changeValue, allValues) => {
    setFormData(allValues)
  }, [])

  const canConfirm = useMemo(() => {
    if (!schema || !schema.required) return true;
    return !schema.required.some((K: string) => !formData[K])
  }, [formData, schema])

  return (
    <SmartModal
      id="InputModal"
      title={modalTitle}
      isModalDialog
      maxZIndex={12}
      visible={visible}
      onCancel={onClose}
      itemState={{
        width,
        height
      }}
      footer={<div>
        <Button
          disabled={!canConfirm}
          size="small"
          type='primary'
          onClick={handlerConfirm}
        >{tr('确定')}</Button>
      </div>}
    >
      {formTitle ? <Title title={formTitle} showShortLine /> : <></>}
      <SchemaForm
        schema={schema}
        uiSchema={{
          'ui:col': 24,
          'ui:labelCol': 8,
          'ui:wrapperCol': 16,
        }}
        onChange={handlerFormChange}
      />
    </SmartModal>
  )
}

export default InputModal;