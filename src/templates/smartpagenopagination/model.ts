import { fetchApi, createApi, removeApi, updateApi } from './service';
import _ from 'lodash';
import { Model } from 'dva';

export interface ModelProps {
  params: object;
  dataSource: object[];
  totalCount: number;
}

const reduxModel: Model = {
  namespace: 'pageName',
  state: {
    params: {},
    dataSource: [],
    totalCount: 0,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['pageName']);
      const newsParams = { ...params, ...payload };
      let dataSource = yield call(fetchApi, newsParams);

      yield put({
        type: 'save',
        payload: { dataSource, params: newsParams },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['pageName']);
      const newsParams = { ...params, ...payload };
      let dataSource = yield call(fetchApi, newsParams);

      yield put({
        type: 'save',
        payload: { dataSource, params: newsParams },
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