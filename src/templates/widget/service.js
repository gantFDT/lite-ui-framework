import request from '@/utils/request'

const apiMode = 'remote' //'remote'


//获取数据
export async function fetchDataApi() {
  if (apiMode == 'locale') {
    return new Promise(function (resolve, reject) {
      resolve(mockData);
    });
  } else {
    return request('', {
      method: 'POST',
      data: {
        dataId: "widget-",
        dataType: "widget",
      }
    });
  }
}