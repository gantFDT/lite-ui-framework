import request from '@/utils/request'

/**
|--------------------------------------------------
| 列表
|--------------------------------------------------
*/
// 获取列表
export const getServerLogListAPI = request.post.bind(null, '/integration/findEndpointLog')

