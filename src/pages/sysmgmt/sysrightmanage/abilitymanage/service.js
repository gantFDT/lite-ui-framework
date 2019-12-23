import request from '@/utils/request'
/**
|--------------------------------------------------
| 功能点
|--------------------------------------------------
*/
// 获取功能点列表
export const listAbilityAPI = request.post.bind(null, '/aclResource/findTreeByType')
// 创建 {"id":"","parentResourceId":"ROOT","type":"FUNCTION_CATEGORY","name":"{\"zh_CN\":\"TEST\",\"en\":\"TEST\"}","path":"","description":"test"}
// 创建点 {"id":"","parentResourceId":"r8O3fnbRMsh3JUgoQfQ","type":"FUNCTION_CATEGORY_ITEM","name":"{\"zh_CN\":\"\u6253\u6ef4\u6ef4\",\"en\":\"\"}","path":"DDD","description":"dddd"}
export const createAbilityAPI = request.post.bind(null, '/aclResource/create')
// 创建点之前检查 {"parentResourceId":"r8O3fnbRMsh3JUgoQfQ","excludeResourceId":null,"type":"FUNCTION_CATEGORY_ITEM","path":"DDD","isBrother":false}
export const checkAbilityAPI = request.post.bind(null, '/aclResource/checkResourcePathExist')
// 修改
export const updateAbilityAPI = request.post.bind(null, '/aclResource/update')
// 删除
export const removeAbilityAPI = request.post.bind(null, '/aclResource/remove')
// 上移
export const moveAbilityUpAPI = request.post.bind(null, '/aclResource/moveUp')
// 下移 {"resourceId":"dF3i1l0PcQLYxkKVOtP","parentResourceId":"ROOT"}
export const moveAbilityDownAPI = request.post.bind(null, '/aclResource/moveDown')
//
export const getFunctionURI = request.post.bind(null, '/aclResource/findFunctionUri')
