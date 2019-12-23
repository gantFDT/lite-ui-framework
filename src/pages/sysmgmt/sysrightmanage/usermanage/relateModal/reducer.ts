import { Action, State } from './interface'
export default function reducer(state: State, { type, payload }: Action) {
	switch (type) {
		case "save":
			return { ...state, ...payload }
	}
}

export const initState: State = {
	params: {
		filterInfo: {
		},
		pageInfo: {
			beginIndex: 0,
			pageSize: 50
		}
	},
	total: 0,
	list: [],
	loading: false,
}