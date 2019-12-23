import request from '@/utils/request';

interface payloadProps {
  id: string;
  type: string;
  data?: object;
}

// 获取仪表板信息
export async function fetch(payload: payloadProps) {
  const {type } = payload
  let url = '/accountUserSelf/getUserData';
  if (type == 'company') {
    url = '/companyData/getCompanyData'
  }
  return request(url, {
    method: 'POST',
    data: {
      dataId: "mgmt",
      dataType: "dashboard",
    },
  });
}


// 修改仪表板信息
export async function update(payload: payloadProps) {
  const {  type, data } = payload
  let url = '/accountUserSelf/setUserData';
  if (type == 'company') {
    url = '/companyData/setCompanyData'
  }
  return request(url, {
    method: 'POST',
    data: {
      dataId: "mgmt",
      dataType: "dashboard",
      bigData:JSON.stringify({
        data
      })
    },
  },{
    showSuccess:true,
    successMessage:tr('更新成功')
  });
}

// 删除仪表板信息
export async function remove(payload: payloadProps) {
  const { type } = payload
  let url = '/accountUserSelf/delUserData';
  if (type == 'company') {
    url = '/companyData/delCompanyData'
  }
  return request(url, {
    method: 'POST',
    data: {
      dataId: "mgmt",
      dataType: "dashboard",
    },
  },{
    showSuccess:true,
    successMessage:tr('删除成功')
  });
}



// 获取布局信息
export async function fetchCurrentLayout(payload: payloadProps) {
  const { id,type } = payload
  let url = '/accountUserSelf/getUserData';
  if (type == 'company') {
    url = '/companyData/getCompanyData'
  }
  if(!id){return}
  return request(url, {
    method: 'POST',
    data: {
      dataId: id,
      dataType: "dashboard",
    },
  });
}

// 获取布局信息
export async function updateCurrentLayout(payload: payloadProps) {
  const { id, type, data } = payload
  let url = '/accountUserSelf/setUserData';
  if (type == 'company') {
    url = '/companyData/setCompanyData'
  }
  if(!id){return}
  return request(url, {
    method: 'POST',
    data: {
      dataId: id,
      dataType: "dashboard",
      bigData: JSON.stringify(data)
    },
  });
}

// 删除布局信息
export async function removeCurrentLayout(payload: payloadProps) {
  const { id, type } = payload
  let url = '/accountUserSelf/delUserData';
  if (type == 'company') {
    url = '/companyData/delCompanyData'
  }
  if(!id){return}
  return request(url, {
    method: 'POST',
    data: {
      dataId: id,
      dataType: "dashboard"
    },
  });
}
