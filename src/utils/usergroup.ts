import cache from './cache';
import { getUserGroupInfoByIdAPI } from '@/services/selectors';
const { userGroup }: any = cache;

export const setUserGroup = ({ id, data }: any) => {
    userGroup.set(id, data)
}

export const getUserGroupField = ({ id, field = 'groupName' }: any) => {
    let roleInfo = userGroup.get(id);
    if (!roleInfo) return '';
    return roleInfo[field] || '';
}

export const getUserGroupInfo = (id: string) => {
    let roleInfo = userGroup.get(id);
    if (!roleInfo) return '';
    return roleInfo;
}

export const getUserGroupSync = async (id: string, field?: string) => {
    let roleInfo = userGroup.get(id);
    if (roleInfo) return field && roleInfo[field] || roleInfo;
    try {
        const res = await getUserGroupInfoByIdAPI({ data: { id } });
        setUserGroup({ id, res });
        return field && res[field] || res;
    } catch (err) {
        console.log(err);
        return ''
    }
}