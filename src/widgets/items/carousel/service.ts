import request from '@/utils/request'
import {mockData} from './_mock'
const apiMode = 'remote' //'remote'

export function fetchDataApi(params) {
  const {widgetKey} =params
  if (apiMode == 'locale') {
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  } else {
    return request('/accountUserSelf/getUserData', {
      method: 'POST',
      data: {
        dataId: widgetKey,
        dataType: "widget",
      }
    });
  }
}

export function modifyDataApi(params) {
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

