import request from '@/utils/request';
import { FromDataType } from './index';

export async function fakeAccountLogin(params: FromDataType) {
  return request('/authentication/login', {
    method: 'POST',
    data: params,
  });
}

export async function loginWithValidateCode(params: FromDataType) {
  return request('/authentication/login2', {
    method: 'POST',
    data: params,
  });
}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export function getValidateCodeApi(params = {}) {
  return request('/authentication/getValidateCode', {
    method: 'POST',
    data: params
  })
}