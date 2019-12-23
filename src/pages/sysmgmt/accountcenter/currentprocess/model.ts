import { fetchApi } from './service';
import _ from 'lodash'
import { Model } from 'dva'

export interface ModelProps {
  params: object;
  data: object[];
  modalVisible: boolean
}



const reduxModel: Model = {
  namespace: 'sysmgmtCurrentProcess',
  state: {
    params: {

    },
    data: [],
    modalVisible: false,
  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['sysmgmtCurrentProcess']);
      const newsParams = { ...params, ...payload };
      let data = yield call(fetchApi, newsParams);

      yield put({
        type: 'save',
        payload: {
          data,
          params: newsParams
        },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select((state: object) => state['sysmgmtCurrentProcess']);
      const newsParams = { ...params, ...payload };
      let data = yield call(fetchApi, newsParams);

      yield put({
        type: 'save',
        payload: {
          data,
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
