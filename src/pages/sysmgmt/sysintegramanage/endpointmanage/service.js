
import request from '@/utils/request'

export const findLogAPI = request.post.bind(null,'/integration/findEndpointLog')
//服务列表
export const findEndpointAPI = request.post.bind(null,'/integration/findEndpoint')
// 新增
export const createServiceAPI = request.post.bind(null, '/integration/registerEndpoint')
// 删除
export const removeServiceAPI = request.post.bind(null, '/integration/unregisterEndpoint')
// 编辑
export const updateServiceAPI = request.post.bind(null, '/integration/updateEndpoint')


//客户列表
export const findSystemAPI = request.post.bind(null,'/integration/findSystem')
// 新增
export const createCustomerAPI = request.post.bind(null, '/integration/createSystem')
// 删除
export const removeCustomerAPI = request.post.bind(null, '/integration/deleteSystem')
// 编辑
export const updateCustomerAPI = request.post.bind(null, '/integration/updateSystem')


//开放功能列表
export const findHandleAPI = request.post.bind(null,'/integration/findHandle')
// 新增
export const createOpenAPI = request.post.bind(null, '/integration/createHandle')
// 删除
export const removeOpenAPI = request.post.bind(null, '/integration/deleteHandle')
// 编辑
// export const updateOpenAPI = request.post.bind(null, '/integration/updateEndpoint')