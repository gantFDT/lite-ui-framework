import request from '@/utils/request';

export async function fetchApi(params: object) {
  return request('/workflowProcess/findProcessTasks', {
    method: 'POST',
    data: {
      pageInfo: {},
      ...params
    }
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



