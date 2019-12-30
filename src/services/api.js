import request from '@/utils/request';

// 上传文件
export async function uploadFileApi(params) {
  return request('/file/upload', {
    method: 'POST',
    data: params,
  });
}

// 登陆
export async function accountLogin(params) {
  return request('/authentication/login', {
    method: 'POST',
    data: params,
  });
}

// 验证码登录 {"userLoginName":"","password":"","usertype":null,"validateCodeId":"","validateCode":""}
export async function accountLoginWithValidateCode(params) {
  return request('/authentication/login2', {
    method: 'POST',
    data: params,
  });
}

// 根据Cookie内容，设置本地属性
export async function checkToken(params) {
  return request('/authentication/checkToken', {
    method: 'POST',
    data: params,
  });
}
// 验证ssoToken并转换为甘棠Token, 写入到Cookie中
export async function ssoLogin(params) {
  const { ssoTokenType, ssoToken } = params
  return request(`/authentication/ssoLogin?tokenType=${ssoTokenType}&token=${ssoToken}`, {
    method: 'POST',
  });
}
//在检测cookie中是否包含userIdentity信息, 如果有，则跳过登录界面直接进入创建桌面阶段
export async function getProductName(params) {
  const { ssoTokenType, ssoToken } = params
  return request('/gantPlatform/getProductName', {
    method: 'POST',
  });
}

// 获取代理信息
export async function getDelegateInfo(params) {
  return request('/delegateAuth/getDelegateInfo', {
    method: 'POST',
    data: params,
  });
}


// 进入代理
export async function delegateLogin(params) {
  return request('/delegateAuth/delegateLogin', {
    method: 'POST',
    data: params,
  });
}

// 退出代理
export async function delegateLogout(params) {
  return request('/delegateAuth/delegateLogout', {
    method: 'POST',
    data: params,
  });
}


// 获取主菜单
export const getStartMenuAPI = () => request('/security/getStartMenu', { params: { _dc: Date.now() } })
export const getReactStartMenuAPI = () => request('/security/getReactStartMenu', { params: { _dc: Date.now() } })

// 上下文菜单
export const getContextMenuAPI = (payload) => request('/security/getContextMenu', {
  params: {
    contextCategory: payload,
    _dc: Date.now()
  }
})

// 获取概要信息
export const getBizSummary = request.post.bind(null, '/bizSummary/getBizSummary')


//公司定制化数据接口
export async function setCompanyData(params) {
  return request('/companyData/setCompanyData', {
    method: 'POST',
    data: params,
  }, {
    showSuccess: true,
    successMessage: tr('更新成功') + '，' + tr('在下次刷新时生效')
  });
}

//获取公司定制化信息
export async function getCompanyData(params) {
  return request('/companyData/getCompanyData', {
    method: 'POST',
    data: params,
  });
}

//删除公司定制化信息
export async function delCompanyData(params) {
  return request('/companyData/delCompanyData', {
    method: 'POST',
    data: params,
  }, {
    showSuccess: true,
    successMessage: tr('删除成功') + '，' + tr('在下次刷新时生效')
  });
}

//获取当前用户仪表板信息
export async function fetchDashboards() {
  return request('/accountUserSelf/getUserData', {
    method: 'POST',
    data: {
      dataId: "mgmt",
      dataType: "dashboard",
    },
  });
}

//获取系统参数
export async function fetchSystemParameters() {
  return request('/parameter/findAll', {
    method: 'POST',
    data: {},
  });
}