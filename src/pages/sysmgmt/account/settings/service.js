import request from '@/utils/request';

// 修改用户信息
export function editUserInfoApi(params) {
  return request('/accountUserSelf/modifySelfInfo', {
    method: 'POST',
    data: params,
  });
}
// 修改密码
export function resetPwdApi(params) {
  return request('/accountUserSelf/resetSelfPassword', {
    method: 'POST',
    data: params,
  });
}