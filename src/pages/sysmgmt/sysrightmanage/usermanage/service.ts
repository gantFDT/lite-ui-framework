import request from '@/utils/request'

/**
|--------------------------------------------------
| 用户管理
|--------------------------------------------------
*/
// 获取组织用户列表
export const listUserByOrgAPI = request.post.bind(null, '/accountUser/findHierarchicalByOrganization')
// 获取用户列表
export const listUserAPI = request.post.bind(null, '/accountUser/findHierarchical')
// 新增组织用户
export function createUserAPI(data) {
	return request('/accountUser/create', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: tr('创建用户成功')
		})
}
// 编辑组织用户
export function updateUserAPI(data) {
	return request('/accountUser/update', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: tr('编辑用户成功')
		})
}
// 删除组织用户
export function removeUserAPI(data) {
	return request('/accountUser/remove', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: tr('删除用户成功')
		})
}

// 批量接口
// 激活冻结用户
export function setActiveAPI(data) {
	return request('/accountUser/updateActive', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: data.active ? tr('激活用户成功') : tr('冻结用户成功')
		})
}
export function unlockAPI(data) {
	return request('/accountUser/unlock', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: tr('解锁用户成功')
		})
}
// 修改密码
export function resetPwdAPI(data) {
	return request('/accountUser/updatePassword', {
		method: "POST",
		data
	}, {
			showSuccess: true,
			successMessage: tr('重置密码成功')
		})
}
// 修改组织
export const updateOrganizationAPI = (data: any) => {
	return request.post('/accountUser/updateOrganization', {
		data
	}, {
			showSuccess: true,
			successMessage: tr('切换组织成功')
		})
}

// 关联角色
// 获取角色列表
export const listRoleAPI = request.post.bind(null, '/aclRole/findHierarchicalByUser')
// 添加到角色 {"userId":15,"roles":["zbWeUGq1TXCnhV72UTJ"]}
export const addRolesToUserAPI = request.post.bind(null, '/accountUser/addRolesToUser')
// 移除角色 {"userId":15,"roles":["zbWeUGq1TXCnhV72UTJ"]}
export const removeRolesFromUserAPI = request.post.bind(null, '/accountUser/removeRolesFromUser')

// 关联用户组
// 获取用户组列表
export const listGroupAPI = request.post.bind(null, '/aclGroup/findHierarchicalByUser')
// 添加到用户组 {"userId":15,"groups":["zbWeUGq1TXCnhV72UTJ"]}
export const addGroupsToUserAPI = request.post.bind(null, '/accountUser/addGroupsToUser')
// 移除用户组 {"userId":15,"groups":["zbWeUGq1TXCnhV72UTJ"]}
export const removeGroupsFromUserAPI = request.post.bind(null, '/accountUser/removeGroupsFromUser')

