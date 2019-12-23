import { Model } from 'dva';
import { getFunctionList, publistFunction, removeFunction } from './services'



export const functionmgmtnamespace = 'functionmgmt'
export const functionmgmtstatename = 'functionlist'

const functionmgmtInitFilterInfo = {
    bizType: 'test'
}
const functionmgmtInitPageInfo: PageInfo = {
    beginIndex: 0,
    pageSize: 50,
}
export interface FunctionmgmtParamProps {
    pageInfo: PageInfo,
    filterInfo: typeof functionmgmtInitFilterInfo,
}
const functionmgmtParam: FunctionmgmtParamProps = {
    pageInfo: functionmgmtInitPageInfo,
    filterInfo: functionmgmtInitFilterInfo,
}
const functionmgmtInitialState = {
    param: functionmgmtParam,
    [functionmgmtstatename]: [],
    total: 0,
}



export type FunctionmgmtState = Readonly<typeof functionmgmtInitialState>

interface FunctionmgmtModel extends Model {
    namespace: 'functionmgmt',
    state: FunctionmgmtState
}

const functionmgmtModel: FunctionmgmtModel = {
    namespace: functionmgmtnamespace,
    state: functionmgmtInitialState,
    effects: {
        *getList({ payload }, { call, put }) {
            try {
                const res = yield call(getFunctionList, { data: payload })
                yield put({
                    type: 'save',
                    payload: {
                        [functionmgmtstatename]: res.content,
                        total: res.totalCount,
                        param: payload,
                    }
                })
            }
            catch{ }
        },
        *callback(action, { put, select }) {
            const { param } = yield select((store: object) => store[functionmgmtnamespace]) as FunctionmgmtState
            yield put({
                type: 'getList',
                payload: param,
            })
        },
        *publish({ payload }, { call, put, select }) {
            try {
                yield call(publistFunction, { data: payload }, { showSuccess: true, successMessage: tr('发布成功') })
                yield put({
                    type: 'callback',
                })
            } catch{ }
        },
        *remove({ payload, callback }, { call, put }) {
            try {
                yield call(removeFunction, { data: payload }, { showSuccess: true, successMessage: tr('删除成功') })
                callback();
                yield put({
                    type: 'callback',
                })
            } catch{ }
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            }
        }
    }
}

export default functionmgmtModel
