import request from '@/utils/request';

// 获取CustomView
export async function getCustomViewsApi(tableKey) {
  return request('/accountUserSelf/getUserData', {
    method: 'POST',
    data: {
      dataId: `tableView:${tableKey}`,
      dataType: "tableView",
    },
  })
}

// 修改CustomView
export async function setCustomViewsApi(tableKey, params) {
  return request('/accountUserSelf/setUserData', {
    method: 'POST',
    data: {
      dataId: `tableView:${tableKey}`,
      dataType: "tableView",
      bigData:JSON.stringify(params)
    },
  });
}
