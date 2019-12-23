import cache from './cache';
import { getImageById } from '@/utils/utils';
import { getOrganizationInfo } from '@/utils/organization';

const { user, userExtra }: any = cache;//userExtra 为 userName做主键的缓存

//缓存用户信息 by Id
export const setUser = ({ id, data }: { id: number, data: any }) => {
    user.set(id, data)
}

//缓存用户信息 by userLoginName
export const setUserExtra = ({ userLoginName, data }: { userLoginName: string, data: any }) => {
    userExtra.set(userLoginName, data)
}

//获取指定用户信息item的指定字段值
export const getUserField = ({ id, field = 'userName' }: { id: number, field: string }) => {
    let userInfo = user.get(id);
    if (!userInfo) return '';
    if (field == 'orgName' && userInfo.organizationId) {
        return getOrganizationInfo(userInfo.organizationId).orgName;
    }
    return userInfo[field] || '';
}

//获取指定用户信息item
export const getUserInfo = (id: string | number, userLoginName?: string) => {
    let userInfo = id ? user.get(id) : userLoginName ? userExtra.get(userLoginName) : {};
    if (userInfo) { userInfo.avatarUrl = getImageById(userInfo.pictureId || 0); }
    if (userInfo && userInfo.organizationId) {
        let orgName = getOrganizationInfo(userInfo.organizationId).orgName;
        orgName && (userInfo.orgName = orgName);
    }
    return userInfo;
}

//更新用户信息缓存
export const updateUserCache = (values: any) => {
    const { id, userLoginName } = values;
    if (!(id && userLoginName)) return;
    let data = { ...values };
    delete data.optCounter;
    delete data.password;
    delete data.updatePasswordDate;
    delete data.isLock;
    data.pictureId = data.pictureId || 0;
    data.avatarUrl = getImageById(data.pictureId);
    setUser({ id, data });
    setUserExtra({ userLoginName, data });
}
