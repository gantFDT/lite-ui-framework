import { fetchApi } from './service';
import _ from 'lodash'
import { Model } from 'dva'

export interface ModelProps {
  params: object;
  data: object[];
}



const reduxModel: Model = {
  namespace: 'myStartProcess',
  state: {
    params: {
      pageInfo: {
        pageSize: 50,
        beginIndex: 0
      }
    },
    data: [],
    totalCount: 0
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['myStartProcess']);
      const newsParams = { ...params, ...payload };
      let data = yield call(fetchApi, newsParams);
      yield put({
        type: 'save',
        payload: {
          data: data.content,
          totalCount: data.totalCount,
          params: newsParams
        },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['myStartProcess']);
      const newsParams = { ...params, ...payload };
      let data = yield call(fetchApi, newsParams);
      yield put({
        type: 'save',
        payload: {
          data: data.content,
          totalCount: data.totalCount,
          params: newsParams
        },
      });
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
