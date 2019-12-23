import { getDetailApi, updateDetailApi } from './service';
import { Model } from 'dva';

const reduxModel: Model = {
    namespace: 'pageName',
    state: {
        detailContent: {}
    },
    effects: {
        *fetch({ payload }, { put, call }) {
            try {
                const res = yield call(getDetailApi, { id: payload });
                yield put({
                    type: 'save',
                    payload: { detailContent: res || {} }
                })
            } catch (err) { console.log(err) }
        },
        *update({ payload, cb }, { call, put }) {
            try {
                const res = yield call(updateDetailApi, payload);
                yield put({ type: 'save', payload: { detailContent: res || {} } })
                cb && cb();
            } catch (err) { console.warn(err) }
        },
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload,
            };
        },
    }
}
export default reduxModel;