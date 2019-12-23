import React, { useState, useCallback, ReactNode, useRef } from 'react'
import { SmartModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import SelectorView from './SelectorView'
import { nameKeys } from './static'

interface SelectorModalProps {
  title?: string | ReactNode,
  visible: boolean,
  confirmLoading?: boolean,
  onChange?: (selectedRowKeys: string[], selectedRows: any[]) => void,
  onCancel?: () => void,
  onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const pageKey: string = nameKeys.modalEleKey;
  const {
    onChange,
    onCancel,
    onOk,
    visible,
    title,
    itemState,
    value,
    withAuth,
    multiple,
    valueProp,
    loading,
    ...restProps
  } = props;

  const [modalHei, setModalHei] = useState(0);
  const viewRef = useRef<any>({} as any);

  const handlerOk = useCallback(() => {
    const { selectedRowKeys, selectedRows } = viewRef.current.getValues();
    onOk && onOk(selectedRowKeys, selectedRows)
  }, [onOk])

  const handlerCancel = useCallback(() => {
    onCancel && onCancel()
  }, [onCancel])

  const onModalSizeChange = useCallback((width, height) => {
    setModalHei(height)
  }, [])

  return (
    <SmartModal
      id={pageKey}
      wrapClassName={pageKey}
      title={title}
      visible={visible}
      itemState={itemState}
      confirmLoading={loading}
      onCancel={handlerCancel}
      onOk={handlerOk}
      onSizeChange={onModalSizeChange}
      {...restProps}
    >
      <SelectorView
        multiple={multiple}
        modalHei={modalHei}
        onChange={onChange}
        value={value}
        visible={visible}
        withAuth={withAuth}
        valueProp={valueProp}
        viewRef={viewRef}
      />
    </SmartModal>
  )
}

SelectorModal.defaultProps = {
  value: [],
  title: tr('选择用户'),
  itemState: { width: 1200, height: 600 },
  loading: false,
  zIndex:1007
}

export default React.memo(SelectorModal);
