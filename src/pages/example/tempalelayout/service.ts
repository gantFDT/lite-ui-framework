import request from '@/utils/request'

const sucMsg = tr('新建成功');
const editMsg = tr('保存成功');
const delMsg = tr('删除成功');

export async function fetchApi(params: object) {
  return request('/aclGroup/findHierarchicalCategory', {
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
  }, { showSuccess: true, successMessage: sucMsg });
}

export async function removeApi(params: object) {
  return request('/measureApi/removeApi', {
    method: 'POST',
    data: {
      ...params
    }
  }, { showSuccess: true, successMessage: delMsg });
}

export async function updateApi(params: object) {
  return request('/measureApi/updateApi', {
    method: 'POST',
    data: {
      ...params
    }
  }, { showSuccess: true, successMessage: editMsg });
}