import { State, Action } from './interface'
import { ActionTypes, SaveTypes } from './enum'
export function reducer(state: State, action: Action) {
	const { type, payload } = action
	switch (type) {
		case ActionTypes.save:
			return { ...state, ...payload };
		case ActionTypes.changeEditView:
			const { editSchema } = state;
			return { ...state, editSchema: { ...editSchema, ...payload } };
		case ActionTypes.init:
			return {
				...state,
				visible: false,
				isEdit: false,
				nameModalVisible: false,
				saveType: SaveTypes.save,
				editSchema: {}
			}
	}
}
export const initState = {
	defaultIndex: -1,
	index: -1,
	visible: false,
	isEdit: false,
	saveModalVisible: false,
	saveType: SaveTypes.save,
	saveAsModalVisible: false,
	editSchema: {}
}