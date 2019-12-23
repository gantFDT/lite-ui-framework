import request from '@/utils/request';


export async function fetchApi(params: object) {
  return request('/workflowProcess/findMyStartProcesses', {
    method: 'POST',
    data: {
      ...params
    }
  });
}

export async function findProcessStatusTypeListApi() {
  return request('/workflowProcess/findProcessStatusTypeList', {
    method: 'POST'
  });
}
