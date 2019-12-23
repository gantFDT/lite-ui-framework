import request from '@/utils/request';

export function fetchApi(params) {
  return request('/accountUserDelegation/find', {
    method: 'POST',
    data: params
  });
}

export function createApi(params) {
  return request('/accountUserDelegation/create', {
    method: 'POST',
    data: params
  },{
    showSuccess: true,
    successMessage: tr("创建成功"),
  });
}

export function updateApi(params) {
  return request('/accountUserDelegation/update', {
    method: 'POST',
    data: params
  },{
    showSuccess: true,
    successMessage: tr("修改成功"),
  });
}


export function removeApi(params) {
  return request('/accountUserDelegation/remove', {
    method: 'POST',
    data: params
  },{
    showSuccess: true,
    successMessage: tr("移除成功"),
  });
}

