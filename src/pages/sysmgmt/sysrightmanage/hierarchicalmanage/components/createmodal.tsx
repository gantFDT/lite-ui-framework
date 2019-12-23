import React, { useCallback, useMemo } from 'react'
import { connect } from 'dva'
import { SmartModal } from '@/components/specific';
import { HierarchicalState } from '../model'
import { modalSchema } from '../schema'

interface CreateModalProps {
    visible: boolean,
    isCreate: boolean,
    selected: string,
    onCancel: () => void,
    onSubmit: () => void,
    hierarchical: HierarchicalState,
    createLoading: boolean,
    updateLoading: boolean,
}
const CreateModal = (props: CreateModalProps) => {
    const { isCreate, selected, onCancel, onSubmit, createLoading, updateLoading, hierarchical: { hierList }, ...prop } = props
    const closeModal = useCallback(() => {
        onCancel()
    }, [])
    const values = useMemo(() => {
        if (!isCreate) {
            return hierList.find((item: { id: string }) => item.id === selected)
        }
        return {}
    }, [isCreate, hierList, selected])
    return (
        <SmartModal
            id='hierachicalmodal'
            title={isCreate ? tr('新建') : tr('编辑')}
            isModalDialog
            maxZIndex={12}
            itemState={{ width: 450, height: 300 }}
            uiSchema={{
                "ui:col": {
                    sm: 24
                },
                "ui:labelCol": {},
                "ui:wrapperCol": {},
            }}
            values={values}
            confirmLoading={createLoading || updateLoading}
            schema={modalSchema}
            onSubmit={onSubmit}
            onCancel={closeModal}
            {...prop}
        />
    )
}

export default connect(
    ({ loading, hierarchical }: { hierarchical: HierarchicalState, loading: { effects: object } }) => ({
        createLoading: loading.effects['hierarchical/createHierarchicalList'],
        updateLoading: loading.effects['hierarchical/updateHierarchicalList'],
        hierarchical,
    })
)(CreateModal)
