import { getStudentDetailApi, updateStudentsApi } from '../service';

export default {
    namespace: 'demoUserManageDetail',
    state: {
        studentDetail: {}
    },
    effects: {
        *fetch({ payload }, { put, call }) {
            try {
                const res = yield call(getStudentDetailApi, { id: payload });
                yield put({
                    type: 'save',
                    payload: { studentDetail: res }
                })
            } catch (err) { console.warn(err) }
        },
        *update({ payload, cb }, { call, put }) {
            try {
                const res = yield call(updateStudentsApi, payload);
                yield put({ type: 'save', payload: { studentDetail: res } })
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