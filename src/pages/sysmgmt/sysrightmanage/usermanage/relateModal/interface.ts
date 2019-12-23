import { SearchFormSchema } from '@/components/specific/searchform'

export interface Action {
	type: string,
	payload?: any
}
interface Params {
	filterInfo: any,
	pageInfo: {
		beginIndex: number,
		pageSize: number
	}
}
export interface State {
	params: Params,
	total: number,
	list: any[],
	loading: boolean
}
export interface Props {
	visible: boolean,
	transKey: string,
	rowKey: string,
	title: string,
	userInfo?: string,
	schema: SearchFormSchema,
	columns: any[],
	initRelateParams: any,
	initUnRelateParams: any,
	onCancel: () => any,
	query: (payload: any) => any,
	relate: (payload: any) => any,
	removeRelate: (payload: any) => any,
	uiSchema?: any
}