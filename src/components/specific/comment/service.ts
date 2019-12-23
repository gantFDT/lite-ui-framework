import request from "@/utils/request"
export function findListApi(data: any) {
	return request('/comment/find', {
		method: "POST",
		data
	})
}
export function createCommentApi(data: any) {
	const { parentId } = data;
	// const successMessage = parentId ? tr("回复成功") : tr("评论成功")
	return request('/comment/create', {
		method: "POST",
		data
	})
}
export function deleteCommentApi(id: string) {
	// const successMessage = tr("删除成功")
	return request('/comment/remove', {
		method: "POST",
		data: { id }
	})
}
export function modifyThumbUpApi(data: any) {
	return request('/comment/modifyThumbUp', {
		method: "POST",
		data
	})
}
export function modifyThumbDownApi(data: any) {
	return request('/comment/modifyThumbDown', {
		method: "POST",
		data
	})
}
export function findReplyListApi(id: string) {
	return request('/comment/listRelatedByCommentId', {
		method: "POST",
		data: { id }
	})
}

