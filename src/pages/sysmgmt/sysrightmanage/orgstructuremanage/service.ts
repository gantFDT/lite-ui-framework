import request, { sucMessage } from '@/utils/request';
const { createMes, modifyMes, removeMes } = sucMessage;

export async function fetchApi(params: object) {
  return request('/accountOrganization/findHierarchicalTree', {
    method: 'POST',
    data: params
  });
}

export async function findApi(params: object) {
  return request('/accountOrganization/findHierarchicalByCodeOrName', {
    method: 'POST',
    data: params
  });
}

export async function findByIdApi(params: object) {
  return request('/security/getOrgById', {
    method: 'POST',
    data: params
  });
}

export async function createApi(params: object) {
  return request('/accountOrganization/create', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: createMes,
  });
}

export async function removeApi(params: object) {
  return request('/accountOrganization/remove', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: removeMes,
  });
}

export async function updateApi(params: object) {
  return request('/accountOrganization/update', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: modifyMes,
  });
}

export async function moveApi(params: object) {
  return request('/accountOrganization/move', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: tr("移动成功"),
  });
}

export async function userFetchApi(params: object) {
  return request('/accountUser/findHierarchicalByOrganization', {
    method: 'POST',
    data: params
  });
}

export async function userCreateApi(params: object) {
  return request('/accountUser/create', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: createMes,
  });
}

export async function userUpdateApi(params: object) {
  return request('/accountUser/update', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: modifyMes,
  });
}

export async function userRemoveApi(params: object) {
  return request('/accountUser/remove', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: removeMes,
  });
}

export async function userRelatesApi(params: object) {
  return request('/accountUser/updateOrganization', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: tr("关联成功"),
  });
}