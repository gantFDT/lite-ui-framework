export interface User {
	id: string,
	userName: string,
	pictureId: string,
	[propsname: string]: any
}

export interface CommentProps {
	objId: string,
	user: User,
	loadType?: "default" | "click" | "scroll",
	bodyHeight?: number
}

export interface CommentInputProps {
	placeholder: string,
	onSubmit: (value: string | undefined) => any,
	type: "comment" | "reply",
	defaultValue?: string
}

export interface CommentItem {
	id: string,
	objId: string,
	loginId: string,
	userName: string,
	content: string,
	createDate: string,
	createdBy: string,
	pictureId: string,
	thumbDown: boolean,
	thumbUp: boolean,
	thumbUpCount: number,
	parentCreatedBy?: string,
	isReply?: boolean,
	parentCreatedByName?: string,
	[propname: string]: any,
}