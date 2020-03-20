import { fetchApi, createApi, removeApi, updateApi } from './service';
import _ from 'lodash';
import { Model } from 'dva';

export interface ModelProps {
  params: object;
  dataSource: object[];
  totalCount: number;
}

const reduxModel: Model = {
  namespace: 'exampleSmartTable',
  state: {
    params: {
      pageInfo: {
        pageSize: 50,
        beginIndex: 1
      }
    },
    dataSource: [],
    totalCount: 0,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['exampleSmartTable']);
      const newsParams = { ...params, ...payload };
      let res = yield call(fetchApi, newsParams);
      yield put({
        type: 'save',
        payload: {
          dataSource: res.data,
          totalCount: res.totalCount,
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
        ...payload,
      };
    },
  },
}

export default reduxModel