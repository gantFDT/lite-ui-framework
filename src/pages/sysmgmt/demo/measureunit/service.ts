import request from '@/utils/request';

export async function findDomain(params: object) {
  return request('/measureUnit/findDomain', {
    method: 'POST'
  });
}

export async function findUnit(params: object) {
  return request('/measureUnit/findUnit', {
    method: 'POST',
    data: {
      node: "root",
      pageInfo: {},
      ...params
    }
  });
}

export async function createUnit(params: object) {
  return request('/measureUnit/createUnit', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage: tr("创建成功"),
  });
}

export async function removeUnit(params: object) {
  return request('/measureUnit/removeUnit', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage:  tr("删除成功"),
  });
}

export async function updateUnit(params: object) {
  return request('/measureUnit/updateUnit', {
    method: 'POST',
    data: {
      ...params
    }
  },{
    showSuccess: true,
    successMessage:  tr("保存成功"),
  });
}



