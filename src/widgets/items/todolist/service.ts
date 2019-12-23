import request from '@/utils/request';

export async function fetchProcessApi(params: object) {
  return request('/workflowProcess/findProcessTasks', {
    method: 'POST',
    data: {
      pageInfo: {},
      ...params
    }
  });
}

export async function transApi(params: object) {
  return request('/workflowProcess/doDispatch', {
    method: 'POST',
    data: {
      ...params
    }
  }, {
    showSuccess: true,
    successMessage: tr("转派成功"),
  });
}

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


export async function doBatchApprovalApi(ids: string[]) {
  return request('/workflowProcess/doBatchApproval', {
    method: 'POST',
    data: {
      ids
    }
  });
}
