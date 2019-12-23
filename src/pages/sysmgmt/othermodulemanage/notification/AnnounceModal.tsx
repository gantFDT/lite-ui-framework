import React from 'react'
import { SmartModal } from '@/components/specific';
import { ModalSchema } from './schema'

interface AnnounceModalProps {
    values: object,
    title: string | React.ReactNode,
    onSubmit: (p: object) => void,
    onCancel: () => void,
    visible: boolean,
    loading: boolean,
}

const AnnounceModal = (props: AnnounceModalProps) => {
    const { values, title, onSubmit, onCancel, visible, loading } = props
    return (
        <SmartModal
            title={title}
            id='createnotificationmodal'
            isModalDialog
            itemState={{ width: 450, height: 440 }}
            values={values}
            confirmLoading={loading}
            schema={ModalSchema}
            onSubmit={onSubmit}
            onCancel={onCancel}
            visible={visible}
        />
    )
}

export default AnnounceModal
