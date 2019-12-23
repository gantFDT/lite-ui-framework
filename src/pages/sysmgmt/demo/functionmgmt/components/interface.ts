import { ModalProps } from 'antd/es/modal';
import { FormModalProps } from '@/components/specific/smartmodal'

export interface FuncModalProps extends ModalProps, FormModalProps {
    isModalDialog: boolean,
    itemState: {
        width: number | string,
        height: number | string,
    }
}