import React, { useState, useCallback, useRef } from 'react'
import { SmartModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import SelectorView from './SelectorView'
import { nameKeys } from './static';
interface SelectorModalProps {
  visible: boolean,
  onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  onCancel?: () => void,
  onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const pageKey: string = nameKeys.modalEleKey;
  const {
    title,
    itemState,
    valueProp,
    onChange,
    onCancel,
    onOk,
    visible,
    withAuth,
    multiple,
    value,
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
        valueProp={valueProp}
        visible={visible}
        withAuth={withAuth}
        viewRef={viewRef}
      />
    </SmartModal>
  )
}

SelectorModal.defaultProps = {
  value: [],
  title: tr('选择角色'),
  itemState: { width: 800, height: 600 },
  loading: false,
  zIndex:1007
}

export default React.memo(SelectorModal);