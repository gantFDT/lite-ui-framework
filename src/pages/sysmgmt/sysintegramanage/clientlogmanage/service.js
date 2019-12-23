import request from '@/utils/request'

/**
|--------------------------------------------------
| 列表
|--------------------------------------------------
*/
// 获取列表
export const getClientLogListAPI = request.post.bind(null, '/integration/findClientLog')

