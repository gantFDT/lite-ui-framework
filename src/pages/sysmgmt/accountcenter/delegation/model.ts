import { fetchApi, createApi, removeApi, updateApi } from './service';
import _ from 'lodash'
import { Model } from 'dva'

export interface ModelProps {
  params: object;
  data: object[];
  totalCount:number;
}



const reduxModel: Model = {
  namespace: 'delegation',
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
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['delegation']);
      let newsParams = { ...params, ...payload };
      let res = yield call(fetchApi, newsParams);
      if (res) {
        const {
          content,
          currentIndex,
          currentPage,
          pageSize,
          totalCount,
          totalPage,
        } = res
        yield put({
          type: 'save',
          payload: {
            ...res,
            data: content,
            params: newsParams,
            totalCount
          },
        });
      }

    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['delegation']);
      let newsParams = { ...params, ...payload };
      let res = yield call(fetchApi, newsParams);
      if (res) {
        const {
          content,
          currentIndex,
          currentPage,
          pageSize,
          totalCount,
          totalPage,
        } = res
        yield put({
          type: 'save',
          payload: {
            ...res,
            data: content,
            params: newsParams,
            totalCount
          },
        });
      }
    },
    *create({ payload,callback,final }, { call, put, select }) {
      let res = yield call(createApi, payload);
      if (res) {
        callback && callback()
        yield put({
          type: 'fetch',
        });
      }
    },
    *remove({ payload,callback,final }, { call, put, select }) {
      let res = yield call(removeApi, payload);
      if (res) {
        callback && callback()
        yield put({
          type: 'fetch',
        });
      }
    },
    *update({ payload,callback,final }, { call, put, select }) {
      let res = yield call(updateApi, payload);
      if (res) {
        callback && callback()
        yield put({
          type: 'fetch',
        });
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