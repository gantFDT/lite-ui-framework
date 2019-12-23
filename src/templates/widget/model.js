
import { fetchDataApi } from './service';

export default {
  namespace: 'WIDGET_NAME',
  state: {

  },
  effects: {
    *fetch({ payload }, { call, put }) {
      try {
        const response = yield call(fetchDataApi, payload);
        yield put({
          type: 'save',
          payload: response,
        });
      } catch (err) {
        console.warn(err);
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      };
    },
  },
};
