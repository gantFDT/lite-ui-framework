import request from "@/utils/request"

export const findAllParamsAPI = request.post.bind(null , '/parameter/findAll')

// export const syncParamsAPI = request.post.bind(null , '/parameter/sync')

// export const determineAPI = request.post.bind(null , '/parameter/batchUpdate')

export function syncParamsAPI(params) {
  return request('/parameter/sync', {
    method: 'POST',
  },{
    showSuccess: true,
    successMessage: tr("同步成功"),
  });
}

export function determineAPI(params) {
  return request('/parameter/batchUpdate', {
    method: 'POST',
    data: params
  },{
    showSuccess: true,
    successMessage: tr("保存成功"),
  });
}