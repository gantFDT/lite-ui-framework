
import { fetchApi, createApi, removeApi, updateApi } from './service';
import { Model } from 'dva'

export interface ModelProps {
    params: object;
    data: object[];
    totalCount: number;
}

const reduxModel: Model = {
    namespace: 'PAGE_NAME',
    state: {
        params: {
            pageInfo: {
                pageSize: 50,
                beginIndex: 0
            }
        },
        data: [],
        totalCount: 0,
    },
    effects: {
        *fetch({payload }, { put, call, select }) {
            const { params } = yield select((state:object) => state['PAGE_NAME']);
            const data = yield call(fetchApi);
            const newsParams = { ...params, ...payload };
            yield put({
                type: 'save',
                payload: {
                    data,
                    totalCount: data.length,
                    params: newsParams
                },
            });
        },
        *create({ payload, callback, final }, { call, put, select }) {
            let res = yield call(createApi, payload);
            if (res) {
                callback && callback()
                yield put({ type: 'fetch' });
            }
        },
        *remove({ payload, callback, final }, { call, put, select }) {
            let res = yield call(removeApi, payload);
            if (res) {
                callback && callback()
                yield put({ type: 'fetch' });
            }
        },
        *update({ payload, callback, final }, { call, put, select }) {
            let res = yield call(updateApi, payload);
            if (res) {
                callback && callback()
                yield put({ type: 'fetch' });
            }
        }
    },
    reducers: {
        save(state, { payload }) {
            return {
                ...state,
                ...payload
            };
        },
    }
}
export default reduxModel
