import request from '@/utils/request'

// 查询日志列表
export const findLogAPI = request.post.bind(null, '/commonLog/find')
