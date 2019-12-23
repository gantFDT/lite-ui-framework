import request, { sucMessage } from '@/utils/request';
const { createMes, removeMes, saveMes } = sucMessage;

export async function fetchApi(params: object) {
  return request('/measureApi/findApi', {
    method: 'POST',
    data: params
  });
}

export async function createApi(params: object) {
  return request('/measureApi/createApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: createMes,
  });
}

export async function removeApi(params: object) {
  return request('/measureApi/removeApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: removeMes,
  });
}

export async function updateApi(params: object) {
  return request('/measureApi/updateApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: saveMes,
  });
}



