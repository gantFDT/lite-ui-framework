import React, { useState, useCallback, useRef } from 'react';
import { tr } from '@/components/common/formatmessage';
import { SmartModal } from '@/components/specific';
import SelectorView from './SelectorView';
import { nameKeys } from './static';
interface SelectorModalProps {
  visible: boolean,
  title?: string,
  itemState?: object,
  excludeId?: string,
  multiple?: boolean,
  loading?: boolean,
  onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  onCancel?: () => void,
  onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
  [propName: string]: any
}

function SelectorModal(props: SelectorModalProps) {
  const pageKey: string = nameKeys.modalEleKey;
  const {
    visible,
    title,
    value,
    itemState,
    multiple,
    excludeId,
    withAuth,
    loading,
    onChange,
    onCancel,
    onOk,
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

  return (<SmartModal
    id={pageKey}
    wrapClassName={pageKey}
    title={title}
    itemState={itemState}
    visible={visible}
    confirmLoading={loading}
    onSizeChange={onModalSizeChange}
    onCancel={handlerCancel}
    onSubmit={handlerOk}
    {...restProps}
  >
    <SelectorView
      viewRef={viewRef}
      multiple={multiple}
      excludeId={excludeId}
      value={value}
      visible={visible}
      withAuth={withAuth}
      modalHei={modalHei}
      onChange={onChange}
    />
  </SmartModal>)
}

SelectorModal.defaultProps = {
  title: tr('选择组织'),
  itemState: { width: 640 },
  loading: false,
  zIndex:1007
}
export default React.memo(SelectorModal)