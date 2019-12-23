import React from 'react';
import { SmartModal } from '@/components/specific';
import { FuncModalProps } from '../interface'


interface FormularModalProps extends FuncModalProps {
}

const FormularModal = (props: FormularModalProps) => {
    return (
        <SmartModal
            id='formularmodal'
            title={tr('新增计算模型')}
            isModalDialog
            itemState={{ width: 760, height: 480 }}
            // values={{}}
            // confirmLoading={loading}
            // schema={ModalSchema}
            // onSubmit={onSubmit}
            // onCancel={onCancel}
            // visible={visible}
            {...props}
        />
    )
}

export default FormularModal;
