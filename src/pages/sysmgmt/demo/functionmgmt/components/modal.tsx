import React from 'react';
import { FuncTypes, FuncTypeKeys } from '@/components/form/functype';
import FormularModal from './formular'

export interface FunctionModalProps {
    visible: boolean,
    type: FuncTypeKeys | string,
    isCreate: boolean,
    value?: object,
    [propname: string]: any,
}
const FunctionModal = (props: FunctionModalProps) => {
    const { type, visible, ...prop } = props;
    return (
        <>
            <FormularModal visible={visible && type === FuncTypeKeys.FORMULAR} />
        </>
    )
}

export default FunctionModal;
