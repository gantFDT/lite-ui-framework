import request from '@/utils/request';


export async function fetchApi(params: object) {
  return request('/workflowProcess/findHistoryProcessTasks', {
    method: 'POST',
    data: {
      pageInfo: {},
      ...params
    }
  });
}

