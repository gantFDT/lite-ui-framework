import request from '@/utils/request'

export function fetchDataApi(params:any) {
  const { widgetKey } = params
  return request('/accountUserSelf/getUserData', {
    method: 'POST',
    data: {
      dataId: widgetKey,
      dataType: "widget",
    }
  });
}

export function modifyDataApi(params:any) {
  const { widgetKey, data } = params
  return request('/accountUserSelf/setUserData', {
    method: 'POST',
    data: {
      dataId: widgetKey,
      dataType: "widget",
      bigData: JSON.stringify(data)
    },
  });
}

