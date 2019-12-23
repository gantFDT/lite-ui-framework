import request from '@/utils/request'

const apiMode = 'remote' //'remote'


//获取数据
export async function fetchApi(params) {
  if (apiMode == 'locale') {
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  } else {
    const {widgetKey} = params
    return request('/accountUserSelf/getUserData', {
      method: 'POST',
      data: {
        dataId: widgetKey,
        dataType: "widget",
      }
    });
  }
}


export function updateApi(params) {
  const {widgetKey,data} =params
  return request('/accountUserSelf/setUserData', {
    method: 'POST',
    data: {
      dataId: widgetKey,
      dataType: "widget",
      bigData: JSON.stringify(data)
    },
  });
}