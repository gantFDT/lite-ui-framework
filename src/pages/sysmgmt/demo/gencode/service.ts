import request from '@/utils/request';


export async function fetchApi(params: object) {
  return request('/measureApi/findApi', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function createApi(params: object) {
  return request('/measureApi/createApi', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage: tr("创建成功"),
  });
}

export async function removeApi(params: object) {
  return request('/measureApi/removeApi', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage: tr("删除成功"),
  });
}

export async function updateApi(params: object) {
  return request('/measureApi/updateApi', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage: tr("保存成功"),
  });
}



