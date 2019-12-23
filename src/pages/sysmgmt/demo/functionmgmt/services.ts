import request from '@/utils/request';

// 获取列表
export const getFunctionList = request.post.bind(null, '/bizFunction/findFunctionList')

// 发布
export const publistFunction = request.post.bind(null, 'bizFunction/publishFunction')

// 删除模型
export const removeFunction = request.post.bind(null, '/bizFunction/removeFunction')