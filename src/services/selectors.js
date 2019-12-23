import request from '@/utils/request';

/**
|--------------------------------------------------
| 组织选择器
|--------------------------------------------------
*/
//获取组织机构树
// -all
export const getTreeOrgAPI = request.post.bind(null, '/accountOrganization/findTree')
// -by分级授权
export const getTreeOrgByAuthAPI = request.post.bind(null, '/accountOrganization/findHierarchicalTree')

// 通过编码+名称查询组织列表 (平铺) 
//-all
export const filterOrgAPI = request.post.bind(null, '/accountOrganization/findByCodeOrName')
//-by分级授权
export const filterOrgByAuthAPI = request.post.bind(null, '/accountOrganization/findHierarchicalByCodeOrName')

// 获取过滤后的组织机构树(排除指定组织机构)
// -all
export const getOtherTreeOrgAPI = request.post.bind(null, '/accountOrganization/findTreeByExcludeId')
//-by分级授权
export const getOtherTreeOrgByAuthAPI = request.post.bind(null, '/accountOrganization/findHierarchicalTreeByExcludeId')

// 通过编码+名称查询排除指定组织机构后的组织列表 (平铺) 
// -all
export const filterOtherOrgAPI = request.post.bind(null, '/accountOrganization/findByCodeOrNameByExcludeId')
//-by分级授权
export const filterOtherOrgByAuthAPI = request.post.bind(null, '/accountOrganization/findHierarchicalByCodeOrNameExcludeId')

/**
|--------------------------------------------------
| 用户选择器
|--------------------------------------------------
*/
// 获取用户列表(分页)
// -all
export const getUserListAPI = request.post.bind(null, '/accountUser/find')
//-by分级授权
export const getUserListByAuthAPI = request.post.bind(null, '/accountUser/findHierarchical')

/**
|--------------------------------------------------
| 角色选择器
|--------------------------------------------------
*/
// 获取角色列表(分页)
// -all
export const getRoleListAPI = request.post.bind(null, '/aclRole/find')
//-by分级授权
export const getRoleListByAuthAPI = request.post.bind(null, '/aclRole/findHierarchical')

/**
|--------------------------------------------------
| 用户组选择器
|--------------------------------------------------
*/
// 获取用户组分类列表(平铺)
// -all
export const getUserGroupCategoryAPI = request.post.bind(null, '/aclGroup/findCategory')
//-by分级授权
export const getUserGroupCategoryByAuthAPI = request.post.bind(null, '/aclGroup/findHierarchicalCategory')

// 获取当前分类下用户组列表(树形)
export const getUserGroupListByCategoryIdAPI = request.post.bind(null, '/aclGroup/findGroupTree')

//根据用户组id获取用户组信息
export const getUserGroupInfoByIdAPI = request.post.bind(null, '/security/getGroupById')
