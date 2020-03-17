import request from '@/utils/request';

export async function getUserByUserLoginNameApi(params) {
  return request('/security/getUserByUserLoginName', {
    method: 'POST',
    data: params,
  });
}

export async function getUserByIdApi(params) {
  return request('/security/getUserById', {
    method: 'POST',
    data: params,
  });
}

export async function query() {
  return request('/currentUser');
}

export async function queryCurrent() {
  return request('/currentUser');
}

export async function queryNotices() {
  return request('/notices');
}

export const findPermission = request.post.bind(null, '/security/findPermissions')