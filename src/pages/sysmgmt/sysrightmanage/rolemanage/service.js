import request from '@/utils/request'

/**
|--------------------------------------------------
| 角色列表
|--------------------------------------------------
*/
// 获取角色列表
export const getRoleListAPI = request.post.bind(null, '/aclRole/findHierarchical')

// 新增角色
export const createRoleAPI = request.post.bind(null, '/aclRole/create')

// 检查角色是否有关联
export const checkRoleUsedAPI = request.post.bind(null, '/aclRole/checkUsed')

// 删除角色
export const removeRoleAPI = request.post.bind(null, '/aclRole/remove')

// 编辑角色
export const updateRoleAPI = request.post.bind(null, '/aclRole/update')

/**
|--------------------------------------------------
| 关联用户
|--------------------------------------------------
*/
// 获取关联用户列表
export const getUserListByRoleAPI = request.post.bind(null, '/accountUser/findHierarchicalByRole')
// 解除关联
export const removeUsersFromRoleAPI = request.post.bind(null, '/aclRole/removeUsersFromRole')
// 添加关联
export const addUsersToRoleAPI = request.post.bind(null, '/aclRole/addUsersToRole')

/**
|--------------------------------------------------
| 关联资源
|--------------------------------------------------
*/
// 获取已关联资源列表
export const listResourceAPI = request.post.bind(null, '/aclRole/findLinkResourceTreeByRole')
// 获取资源列表
export const listAllResourceAPI = request.post.bind(null, '/aclRole/findResourceTreeByType')
// 关联资源
export const saveRoleResourceRelationAPI = request.post.bind(null, '/aclRole/saveRoleResourceRelation')

