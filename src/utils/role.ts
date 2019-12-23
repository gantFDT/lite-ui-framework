import cache from './cache';


const { role } = cache;//roleExtra 为 roleName做主键的缓存

export const setRole = ({ id, data }: { id: string, data: any }) => {
    role.set(id, data)
}

export const getRoleField = ({ id, field = 'roleName' }: { id: string, field: string }) => {
    let roleInfo = role.get(id);
    if (!roleInfo) return '';
    return roleInfo[field] || '';
}

export const getRoleInfo = (id: string) => {
    let roleInfo = role.get(id);
    if (!roleInfo) return {};
    return roleInfo;
}