import React, { useMemo } from 'react';
import { getOrganizationField } from '@/utils/organization';
import { getRoleField } from '@/utils/role';
import { getUserGroupField } from '@/utils/usergroup';
import { getUserField } from '@/utils/user';
import styles from '../styles.less';

export interface TailContentProps {
    ids: string[],
    type: 'group' | 'role' | 'userGroup' | 'user'
}

const TailContent = (props: TailContentProps) => {
    const { type, ids } = props;

    const getFieldFn = useMemo(() => {
        switch (type) {
            case 'role':
                return getRoleField
            case 'userGroup':
                return getUserGroupField
            case 'user':
                return getUserField
            default:
                return getOrganizationField
        }
    }, [type])

    const text = useMemo(() => {
        if (!ids || !Array.isArray(ids)) return;
        let names = ids.map(id => getFieldFn({ id }));
        if (!names.length) return;
        return names.join('、')
    }, [getFieldFn, ids])

    return <div className={styles.tailContent}>{tr('当前选中项')}：{text}</div>
}
TailContent.defaultProps = {
    type: 'group',
    ids: []
}
export default React.memo(TailContent)
