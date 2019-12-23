import request from '@/utils/request'
export function getCodeTypeApi(params) {
  const { beginIndex, pageSize, ...filterInfo } = params;
  return request('/codeList/findCodeType', {
    method: 'POST',
    data: {
      filterInfo: { ...filterInfo, category: filterInfo.category == "ALL" ? null : filterInfo.category },
      pageInfo: { beginIndex, pageSize }
    }
  });
}

export function createCodeTypeApi(data) {
  return request('/codeList/addOrUpdateCodeType', {
    method: 'POST',
    data: data
  }, {
      showSuccess: true,
      successMessage: tr("创建成功"),
    });
}
export function editCodeTypeApi(data) {
  return request('/codeList/addOrUpdateCodeType', {
    method: 'POST',
    data: data
  }, {
      showSuccess: true,
      successMessage: tr("保存成功"),
    });
}

export function deteleCodeTypeApi(data) {
  return request('/codeList/deleteCodeType', {
    method: 'POST',
    data: data
  }, {
      showSuccess: true,
      successMessage: tr("删除成功"),
    });
}

export function syncAllCodeTypeApi() {
  return request('/codeList/syncAll', {
    method: 'POST',
  }, {
      showSuccess: true,
      successMessage: tr("同步成功"),
    });
}

export function getSelectedListApi(params) {
  return request('/codeList/find', {
    method: 'POST',
    data: {
      filterInfo: params,
      pageInfo: { beginIndex: 0, pageSize: 100 }
    }
  });
}
export function codeBatchSaveApi(data) {
  return request('/codeList/batchSave', {
    method: 'POST',
    data
  },{

    showSuccess: true,
    successMessage: tr("保存成功"),
  });

}