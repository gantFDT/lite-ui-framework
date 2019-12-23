import request from '@/utils/request'
import mockData from './_mock'
const apiMode = 'remote' //'remote'


//获取数据
export async function fetchDataApi() {
  if (apiMode == 'locale') {
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  } else {
    return request('/accountUserSelf/getUserData', {
      method: 'POST',
      data: {
        dataId: "widget-Shortcut",
        dataType: "widget",
      }
    });
  }
}

//保存数据
export async function modifyDataApi(params) {
  return request('/accountUserSelf/setUserData', {
    method: 'POST',
    data: {
      dataId: "widget-Shortcut",
      dataType: "widget",
      bigData: JSON.stringify(params)
    },
  });
}


