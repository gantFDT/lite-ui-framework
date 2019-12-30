import { fetchUnit } from '../services/unit'
import { Reducer } from 'redux';
import { Effect } from 'dva';
const params = {
	node: "root",
	pageInfo: {}
}
export interface Unit {
	coefficient: number
	domain: string
	id: string
	isSystemUnit: true
	name: string
	nameEn: string
	parentId: string
	symbol: string
}
export interface UnitModalType {
	namespace: string,
	state: UnitStateType,
	effects: {
		fetchUtilList: Effect
	},
	reducers: {
		save: Reducer<UnitStateType>
	}
}
export interface UnitStateType {
	units: Unit[],
	loading: boolean;
}

export default {
	namespace: "unit",
	state: {
		units: [],
		loading: false
	},
	effects: {
		*fetchUtilList(action, { call, select, put }) {
			const { loading } = yield select((state: any) => state.unit);
			if (loading) return;
			yield put({ type: "save", payload: { loading: true } })
			const data = yield fetchUnit(params);
			yield put({ type: "save", payload: { loading: false, units: data } })
		}
	},
	reducers: {
		save(state, { payload }) {
			return { ...state, ...payload }
		}
	}
} as UnitModalType