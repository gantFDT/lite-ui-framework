import request from '@/utils/request'

// 查询接口
export const getHierarchicalAPI = request.post.bind(null, '/aclHierarchical/find')

// 删除接口
export const removeHierarchicalAPI = request.post.bind(null, '/aclHierarchical/remove')

// 创建接口
export const createHierarchicalAPI = request.post.bind(null, '/aclHierarchical/create')
// 修改分级管理员
export const updateHierarchicalAPI = request.post.bind(null, '/aclHierarchical/modify')

// 查询分配用户列表
export const getHierarchicalRoleAPI = request.post.bind(null, '/aclHierarchical/findHierarchicalRole')

// 查询分配用户组列表
export const getHierarchicalRoleGroupAPI = request.post.bind(null, '/aclHierarchical/findHierarchicalGroup')

// 分配用户列表
export const addHierarchicalRoleApi = request.post.bind(null, '/aclHierarchical/addHierarchicalRole')

// 移除用户列表
export const removeHierarchicalRoleApi = request.post.bind(null, '/aclHierarchical/removeHierarchicalRole')

// 分配用户组
export const addHierarchicalRoleGroupApi = request.post.bind(null, '/aclHierarchical/addHierarchicalGroup')

// 删除用户组
export const removeHierarchicalRoleGroupApi = request.post.bind(null, '/aclHierarchical/removeHierarchicalGroup')
