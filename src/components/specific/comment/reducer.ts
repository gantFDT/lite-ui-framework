import { Reducer } from 'redux'
import { CommentItem } from './interface'
interface PageInfo {
	beginIndex: number,
	pageSize: number
}
export interface State {
	objId: string,
	data: CommentItem[],
	total: number,
	pageInfo: PageInfo,
	loading: boolean,
	initLoading: boolean,
	createLoading: boolean,
	replyData: CommentItem[],
	replyId: string,
	replyVisible: boolean,
	replyListLoading: boolean,
}
export const reducers: Reducer<State> = (state, action) => {
	const { type, payload } = action
	switch (type) {
		case "save":
			return { ...state, ...payload }
	}
}

export const initState = {
	objId: "",
	data: [],
	replyData: [],
	total: 0,
	pageInfo: {
		beginIndex: 0,
		pageSize: 10
	},
	loading: false,
	initLoading: false,
	createLoading: false,
	replyId: "",
	replyVisible: false,
	replyListLoading: false,
} as State