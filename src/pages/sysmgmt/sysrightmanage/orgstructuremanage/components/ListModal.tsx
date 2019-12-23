import React, { useMemo } from 'react';
import { SmartModal } from '@/components/specific';
import { listModalSchema } from '../schema';

function ListModal(props: any) {
    const {
        type,
        values,
        visible,
        onSubmit,
        onCancel,
        loading,
    } = props;

    const title = useMemo(() => {
        if (type == 'update') {
            let name = values.orgName ? `-${values.orgName}` : '';
            return tr('编辑组织机构') + name;
        } else if (type == 'create') {
            return tr('新建根组织');
        } else {
            return tr('新建子组织');
        }
    }, [type, values])

    return <SmartModal
        id='orgStructureListModal'
        title={title}
        isModalDialog
        itemState={{ width: 640 }}
        values={type == 'update' ? values : {}}
        confirmLoading={loading}
        visible={visible}
        schema={listModalSchema}
        onSubmit={onSubmit}
        onCancel={onCancel}
    />
}
ListModal.defaultProps = {
    values: {},
    onCancel: () => _,
    onSubmit: () => _
}
export default React.memo(ListModal)