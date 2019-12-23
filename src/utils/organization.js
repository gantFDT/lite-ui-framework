import cache from './cache';
import { getUserByUserLoginNameApi, getUserByIdApi } from '@/services/user';

const fields = [
  'id', 'orgCode', 'orgType', 'orgName',
  'orgSimpleName', 'orgNameEn', 'orgSimpleNameEn',
  'telephone', 'fax', 'email', 'description'
];
const { organization } = cache;

//缓存组织机构item
export const setOrganization = ({ id, data }) => {
  organization.set(id, data)
}

//获取指定组织机构item的指定字段值
export const getOrganizationField = ({ id, field = 'orgName' }) => {
  let organizationInfo = organization.get(id);
  if (!organizationInfo) return '';
  return organizationInfo[field] || '';
}

//获取指定组织机构item
export const getOrganizationInfo = (id) => {
  let organizationInfo = organization.get(id);
  if (!organizationInfo) return {};
  return organizationInfo;
}

//更新新建的组织机构到缓存
export const updateOrganizationCacheByCreate = (values) => {
  const { id, parentOrgId, orgName } = values;
  let data = copyOrganizationByFields(values);
  if (parentOrgId == 'ROOT') {
    setOrganization({ id, data: { ...data, fullOrgId: `ROOT-${id}`, fullOrgName: orgName } });
  } else {
    let parentItem = organization.get(parentOrgId);
    if (!parentItem) return;
    setOrganization({
      id, data: {
        ...data,
        fullOrgId: `${parentItem.fullOrgId}-${id}`,
        fullOrgName: `${parentItem.fullOrgName} - ${orgName}`
      }
    });
  }
}

//更新组织机构缓存
export const updateOrganizationCacheByUpdate = (values) => {
  let organizationInfo = organization.get(values.id);
  setOrganization({ id, data: { ...organizationInfo, ...values } })
}

//移除组织机构对应缓存
export const removeOrganization = ({ key, removeAll = false }) => {
  if (removeAll) {
    organization.remove();
    return;
  }
  key && organization.remove(key);
}

const copyOrganizationByFields = (org = {}) => {
  let obj = {};
  for (let i = 0; i < fields.length; i++) {
    let target = org[fields[i]];
    if (target) {
      obj[fields[i]] = target;
    }
  }
  return obj;
}

