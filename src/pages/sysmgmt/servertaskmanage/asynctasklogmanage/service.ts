import request from '@/utils/request'

// 获取列表
export const getAsyncTaskListAPI = request.post.bind(null, '/task/findAsynTaskLog')

