import React, { useCallback } from 'react';
import { withEditorContext } from '@/components/common/ggeditor';
import FlowTempModal from '../flowtempmodal'
import DesignTempModal from '../designtempmodal'
import InputModal from './InputModal'
import { CustomModalProps } from '@/components/common/ggeditor/common/context/EditorPrivateContext';

interface ModalManagerProps {
  customModalProps: { [modalName: string]: CustomModalProps };
  setCustomModalProps: (modalType: string, customModalProps: CustomModalProps) => void;
}

const ModalManager = (props: ModalManagerProps) => {
  const {
    customModalProps,
    setCustomModalProps
  } = props;

  if (!customModalProps) return null;

  const {
    flowTempModal,
    designTempModal,
    promptModal,
  } = customModalProps;

  const handlerCloseModal = useCallback((modalType: string) => {
    setCustomModalProps(`${modalType}Modal`, { visible: false });
  }, [customModalProps, setCustomModalProps])

  return (
    <>
      <FlowTempModal
        visible={flowTempModal.visible}
        onClose={() => handlerCloseModal('flowTemp')}
        onOk={flowTempModal.onOk}
        onlyRowData={flowTempModal.onlyRowData}
      />
      <DesignTempModal
        visible={designTempModal.visible}
        onClose={() => handlerCloseModal('designTemp')}
        onOk={designTempModal.onOk}
      />
      {
        promptModal.visible && <InputModal
          modalTitle={promptModal.modalTitle}
          formTitle={promptModal.formTitle}
          width={promptModal.width || 650}
          height={promptModal.height || 450}
          visible={promptModal.visible}
          schema={promptModal.schema}
          onClose={() => handlerCloseModal('prompt')}
          onOk={promptModal.onOk}
        />
      }
      
    </>
  );
};

export default withEditorContext(ModalManager);
