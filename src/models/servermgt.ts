import { Model } from './connect';
import { findUnregisteredEndpointAPI, findByTypeAPI, findNotSetHandleAPI } from '@/services/servermgt'


const initialState = {
  listServerNameselector: [],
  listFeatureNameselector: [],
  listBindProtocolselector: [],
}

export type ServermgtState = Readonly<typeof initialState>

interface Servermgt extends Model {
  state: ServermgtState
}

const ServerMgtModels: Servermgt = {
  namespace: 'servermgt',
  state: initialState,
  effects: {
    *listServerName({ payload }, { call, put, select }) {
      const res = yield call(findUnregisteredEndpointAPI);
      yield put({
        type: 'save',
        payload: {
          listServerNameselector: res || [],
        },
      });
    },
    *listFeatureName({ payload }, { call, put, select }) {
      const res = yield call(findNotSetHandleAPI, { data: payload });
      yield put({
        type: 'save',
        payload: {
          listFeatureNameselector: res || [],
        },
      });
    },
    *listBindProtocol({ payload }, { call, put, select }) {
      const { type } = payload
      const res = yield call(findByTypeAPI, { data: { type: type } });
      yield put({
        type: 'save',
        payload: {
          listBindProtocolselector: res || [],
        },
      });
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

export default ServerMgtModels;