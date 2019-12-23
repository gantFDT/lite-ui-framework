import { getStudentsApi, createStudentApi, updateStudentsApi, removeStudentsApi, getStudentsCount, getChartDataApi } from './service';
import { isEqual } from 'lodash'
export default {
    namespace: 'demoUserManage',
    state: {
        organization: {},
        userList: [],
        userListTotal: 0,
        chartParams: {
            filterInfo: [],
            summaryField: []
        },
        chartData: [],
        count: {
            excellent: 0,
            good: 0,
            general: 0,
            fail: 0
        }
    },
    effects: {
        *fetchCount({ payload: { name, params } }, { put, call, select }) {
            const data = yield call(getStudentsCount, {
                whereList: params
            })
            const { count } = yield select(state => state.demoUserManage);
            yield put({ type: "save", payload: { count: { ...count, [name]: data } } })
        },
        *fetch({ payload }, { put, call }) {
            try {
                const res = yield call(getStudentsApi, payload);
                const { content, totalCount } = res;
                yield put({
                    type: 'save',
                    payload: {
                        userList: content || [],
                        userListTotal: totalCount,
                    }
                })
            } catch (err) { console.warn(err) }
        },
        *fetchMore({ payload }, { put, call, select }) {
            try {
                const { userList } = yield select(state => state.demoUserManage);
                const res = yield call(getStudentsApi, payload);
                const { content, totalCount } = res;
                yield put({
                    type: 'save',
                    payload: {
                        userList: userList.concat(content || []),
                        userListTotal: totalCount,
                    }
                })
            } catch (err) { console.warn(err) }
        },
        *fetchChart({ payload }, { call, put, select }) {
            const data = yield call(getChartDataApi, payload);
            const chartData = data ? data : []
            yield put({
                type: "save", payload: {
                    chartParams: payload,
                    chartData
                }
            })
        },

        *create({ payload, cb }, { put, call }) {
            try {
                const { values, filterInfo } = payload;
                const res = yield call(createStudentApi, values);
                cb && cb();
                yield put({ type: 'fetch', payload: filterInfo });
            } catch (err) { console.warn(err) }
        },
        *update({ payload, cb }, { call, put, select }) {
            const { userList } = yield select(state => state.demoUserManage);
            try {
                const res = yield call(updateStudentsApi, payload);
                let _userList = _.cloneDeep(userList);
                let index = _userList.findIndex(item => item.id == res.id);
                _userList[index] = res;
                cb && cb();
                yield put({
                    type: 'save',
                    payload: { userList: _userList }
                })
            } catch (err) { console.warn(err) }
        },
        *remove({ payload, cb }, { put, call, select }) {
            const { userList, userListTotal } = yield select(state => state.demoUserManage);
            try {
                yield call(removeStudentsApi, { id: payload[0] });
                let _userList = _.cloneDeep(userList);
                _.remove(_userList, item => { return _.includes(payload, item.id) })
                cb && cb();
                yield put({
                    type: 'save',
                    payload: {
                        userList: _userList,
                        userListTotal: userListTotal - 1
                    }
                })
            } catch (err) { console.warn(err) }
        }
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