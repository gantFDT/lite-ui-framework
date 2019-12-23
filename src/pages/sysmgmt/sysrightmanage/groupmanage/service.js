import request from '@/utils/request'

/**
|--------------------------------------------------
| 用户组类别
|--------------------------------------------------
*/
// 获取用户组类别列表
export const listGroupCategoryAPI = request.post.bind(null, '/aclGroup/findHierarchicalCategory')
// 创建 {"id":"","categoryCode":"GC_TEST","categoryName":"\u6d4b\u8bd5\u5206\u7c7b","optCounter":0}
export const createGroupCategoryAPI = request.post.bind(null, '/aclGroup/createCategory')
// 修改 {"id":"JgKC0EhAb90MTtq4Gmx","categoryCode":"GC_TEST1","categoryName":"\u6d4b\u8bd5\u5206\u7c7b","optCounter":0}
export const updateGroupCategoryAPI = request.post.bind(null, '/aclGroup/modifyCategory')
// 删除 {"id":"JgKC0EhAb90MTtq4Gmx"}
export const removeGroupCategoryAPI = request.post.bind(null, '/aclGroup/removeCategory')

/**
|--------------------------------------------------
| 用户组
|--------------------------------------------------
*/
// 获取用户组列表
export const listGroupAPI = request.post.bind(null, '/aclGroup/findGroupTree')
// 获取用户组列表
export const listExcludeGroupAPI = request.post.bind(null, '/aclGroup/findGroupTreeByExcludeId')
// 创建用户组 {"id":"","categoryId":"SpfcYPjW6esCIVQZ4eO","parentGroupId":"ROOT","groupCode":"GC02_test","groupName":"\u6d4b\u8bd5\u7ec4","groupDesc":"\u63cf\u8ff0\u4e00\u4e0b","userCount":0,"leaf":false,"optCounter":0,"children":"","parentId":"","index":-1,"depth":0,"expanded":false,"expandable":true,"checked":null,"cls":"","iconCls":"","icon":"","root":false,"isLast":false,"isFirst":false,"allowDrop":true,"allowDrag":true,"loaded":false,"loading":false,"href":"","hrefTarget":"","qtip":"","qtitle":"","qshowDelay":0,"visible":true}
export const createGroupAPI = request.post.bind(null, '/aclGroup/createGroup')
// 编辑用户组 {"id":"NNpf35rFEcLmxl7SbAZ","categoryId":"SpfcYPjW6esCIVQZ4eO","parentGroupId":"bwFGPtULuGdmvMkP5sJ","groupCode":"GC02_test_2","groupName":"\u6d4b\u8bd5\u7684\u5b502","groupDesc":"\u6d4b\u8bd5\u7684\u5b50\u63cf\u8ff02","userCount":0,"leaf":false,"optCounter":0,"children":"","parentId":"","index":-1,"depth":0,"expanded":false,"expandable":true,"checked":null,"cls":"","iconCls":"","icon":"","root":false,"isLast":false,"isFirst":false,"allowDrop":true,"allowDrag":true,"loaded":false,"loading":false,"href":"","hrefTarget":"","qtip":"","qtitle":"","qshowDelay":0,"visible":true}
export const updateGroupAPI = request.post.bind(null, '/aclGroup/modifyGroup')
// 删除用户组 {"id":"NNpf35rFEcLmxl7SbAZ"}
export const removeGroupAPI = request.post.bind(null, '/aclGroup/removeGroup')
// 移动用户组到根 {"id":"NNpf35rFEcLmxl7SbAZ"}
export const moveGroupToRootAPI = request.post.bind(null, '/aclGroup/moveGroupToRoot')
// 移动用户组到另一个用户组之下 {"id":"NNpf35rFEcLmxl7SbAZ","parentGroupId":"bwFGPtULuGdmvMkP5sJ"}
export const moveGroupToParentAPI = request.post.bind(null, '/aclGroup/moveGroupToParent')

/**
|--------------------------------------------------
| 关联用户
|--------------------------------------------------
*/
// 获取已关联资源列表
export const listUserByGroupAPI = request.post.bind(null, '/accountUser/findHierarchicalByGroup')
// 关联用户 {"objectId":"o4U9oRgtNMRlCzKWz6g","users":[33]}
export const addUsersToGroupAPI = request.post.bind(null, '/aclGroup/addUsersToGroup')
// 解除关联用户 {"objectId":"o4U9oRgtNMRlCzKWz6g","users":[33]}
export const removeUsersFromGroupAPI = request.post.bind(null, '/aclGroup/removeUsersFromGroup')

