import request from '@/utils/request'

//获取所有业务领域对象定义
export function getAllDomains(params) {
  return request('/dataAclManager/getAllDomains', {
    method: 'POST',
    data: params
  });
}

//获取约束定义列表
export function getDataAcls(params) {
  const { domainCode } = params;
  return request('/dataAclManager/getDataAcls', {
    method: 'POST',
    data: {
      domainCode,
      pageInfo: { pageSize: 500, beginIndex: 0 }
    }
  });
}

//获取动作列表
export function getDomainActions(params) {
  const { domainCode } = params;
  return request('/dataAclManager/getDomainActions', {
    method: 'POST',
    data: {
      domainCode
    }
  });
}

//保存约束定义列表
export function saveDataAcls(params) {
  return request('/dataAclManager/saveDataAcls', {
    method: 'POST',
    data: params
  }, {
      showSuccess: true,
      successMessage: tr("保存成功"),
    });
}

//刷新授权
export function refreshDataSecurity(params) {
  const { domainCode } = params;
  return request('/dataAclManager/refreshDataSecurity', {
    method: 'POST',
    data: {
      domainCode
    }
  }, {
      showSuccess: true,
      successMessage: tr("刷新成功"),
    });
}

//获取动作列表
export function getDomainFilters(params) {
  const { domainCode } = params;
  return request('/dataAclManager/getDomainFilters', {
    method: 'POST',
    data: {
      domainCode
    }
  });
}

//获取目标列表
export function getDomainTargets(params) {
  const { domainCode } = params;
  return request('/dataAclManager/getDomainTargets', {
    method: 'POST',
    data: {
      domainCode
    }
  });
}



//导出
export function exportDataAcls(params) {
  return new Promise(() => {
    let searchParams = new URLSearchParams({
      ...params
    });
    const exportUrl = proxyTarget + '/dataAclManager/exportDataAcls?' + searchParams.toString()
    window.location.href = exportUrl;
  }, {
    showSuccess: true,
    successMessage: tr("导出成功"),
  })
}

//导入
export function importDataAcls(params) {
  const { domainCode,fileEntityId } = params;
  return request('/dataAclManager/importDataAcls', {
    method: 'POST',
    data: {
      domainCode,
      fileEntityId
    }
  }, {
    showSuccess: true,
    successMessage: tr("导入成功"),
  });
}



