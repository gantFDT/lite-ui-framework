import request from '@/utils/request'

//获取数据
export async function fetchApi(params: any) {
  const { widgetKey } = params
  return request('/accountUserSelf/getUserData', {
    method: 'POST',
    data: {
      dataId: widgetKey,
      dataType: "widget",
    }
  });
}


export function updateApi(params: any) {
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