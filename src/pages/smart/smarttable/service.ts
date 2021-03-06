import request, { sucMessage } from '@/utils/request';
const { createMes, removeMes, saveMes } = sucMessage;

export async function fetchApi(params: object) {
  return request('/smarttable/findApi', {
    method: 'POST',
    data: params
  });
}

export async function createApi(params: object) {
  return request('/smarttable/createApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: createMes,
  });
}

export async function removeApi(params: object) {
  return request('/smarttable/removeApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: removeMes,
  });
}

export async function updateApi(params: object) {
  return request('/smarttable/updateApi', {
    method: 'POST',
    data: params
  }, {
    showSuccess: true,
    successMessage: saveMes,
  });
}



export async function findDomain(params: object) {
  return request('/smarttable/findDomain', {
    method: 'POST'
  });
}
