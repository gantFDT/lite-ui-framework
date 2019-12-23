import request from '@/utils/request'

// 获取表格数据
export const getMainMenuAPI = request.post.bind(null, '/aclResource/findTreeByType')

// 创建菜单
export const createMenuAPI = request.post.bind(null, '/aclResource/create')

// 删除菜单
export const removeMenuAPI = request.post.bind(null, '/aclResource/remove')

// 修改菜单
export const updateMenuAPI = request.post.bind(null, '/aclResource/update')

// 提升为主菜单/分类
export const moveToRootAPI = request.post.bind(null, '/aclResource/moveToRoot')

// 上移
export const moveUpAPI = request.post.bind(null, '/aclResource/moveUp')

// 下移
export const moveDownAPI = request.post.bind(null, '/aclResource/moveDown')


// 移动到新的分类下面
export const moveToParentAPI = request.post.bind(null, '/aclResource/moveToParent')
