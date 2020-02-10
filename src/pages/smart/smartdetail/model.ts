import { fetchApi, removeApi, updateApi } from './service';
import _ from 'lodash';
import { Model } from 'dva';

export interface ModelProps {
  params: object;
  dataSource: object[];
  totalCount: number;
}

const reduxModel: Model = {
  namespace: 'exampleSmartDetail',
  state: {
    detail: {}
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      // const { id } = payload
      let detail = yield call(fetchApi, payload);

      yield put({
        type: 'save',
        payload: {
          detail
        },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['exampleSmartDetail']);
      const newsParams = { ...params, ...payload };
      let dataSource = yield call(fetchApi, newsParams);

      yield put({
        type: 'save',
        payload: {
          dataSource,
          totalCount: dataSource.totalCount,
          params: newsParams
        },
      });
    },
    *remove({ payload, callback, final }, { call, put, select }) {
      let res = yield call(removeApi, payload);
      if (res) {
        callback && callback()
      }
    },
    *update({ payload, callback, final }, { call, put, select }) {
      let res = yield call(updateApi, payload);
      if (res) {
        callback && callback()
        yield put({ type: 'fetch',payload });
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