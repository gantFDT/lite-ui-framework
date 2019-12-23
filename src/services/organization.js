import request from '@/utils/request'

/**
|--------------------------------------------------
| 用户选择器
|--------------------------------------------------
*/
// 获取所有组织
export const getAllOrgAPI = request.post.bind(null, '/security/findAllOrg')

// 获取所有用户
export const getAllUserAPI = request.post.bind(null, '/security/findAllUser')

// 筛选用户
export const filterUserAPI = request.post.bind(null, '/accountUser/find')
/**
|--------------------------------------------------
| 组织选择器
|--------------------------------------------------
*/

// 获取组织树
export const getTreeOrgAPI = request.post.bind(null, '/accountOrganization/findHierarchicalTree')

// 根据id获取其余组织树
export const getOtherTreeOrgAPI = request.post.bind(null, '/accountOrganization/findHierarchicalTreeByExcludeId')

// 根据id查询其余组织树
export const filterOtherOrgAPI = request.post.bind(null, '/accountOrganization/findHierarchicalByCodeOrNameExcludeId')

// 查询组织
export const filterOrgAPI = request.post.bind(null, '/accountOrganization/findHierarchicalByCodeOrName')

// 编辑组织
export const updateOrgAPI = request.post.bind(null, '/accountOrganization/update')

// 创建组织
export const createOrgAPI = request.post.bind(null, '/accountOrganization/create')

// 删除组织
export const removeOrgAPI = request.post.bind(null, '/accountOrganization/remove')

// 移动组织
export const moveOrgAPI = request.post.bind(null, '/accountOrganization/move')
/**
|--------------------------------------------------
| 角色选择器
|--------------------------------------------------
*/

// 获取角色列表
export const listRoleAPI = request.post.bind(null, '/aclRole/find')
/**
|--------------------------------------------------
| 用户组选择器
|--------------------------------------------------
*/
// 获取所有用户组分类列表
export const getAllUserGroupAPI = request.post.bind(null, '/security/findAllGroup')

// 获取用户组分类列表
export const listCategoryAPI = request.post.bind(null, '/aclGroup/findCategory')

// 获取用户组列表
export const listUserGroupAPI = request.post.bind(null, '/aclGroup/findGroupTree')

//根据组织id获取组织名称
export const getAccountOrganization = request.post.bind(null, '/accountOrganization/getById')
