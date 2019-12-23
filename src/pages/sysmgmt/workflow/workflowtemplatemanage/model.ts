import { listFlowTempAPI, deployTemplateApi, updateTemplateApi, modifyTemplateApi, modifyTemplateTimeoutApi } from './service';

export const namespace: string = 'workflowTemplate';
export default {
  namespace,
  state: {
    params: {
      filterInfo: {
        filterModel: true
      },
      node: "root",
      pageInfo: {}
    },
    data: []
  },
  effects: {
    *listFlowTemp({ payload }: any, { call, put, select }: any) {
      const { params } = yield select(state => state[namespace]);
      const newsParams = { ...params, ...payload, node: 'root' };
      let data = yield call(listFlowTempAPI, newsParams);
      data.forEach(V => {
        if (!V.leaf) V.children = [];
      });
      yield put({
        type: 'save',
        payload: {
          data,
          params: newsParams
        },
      });
    },
    *listSubFlowTemp({ payload }: any, { call, put, select }: any) {
      const { params, data } = yield select(state => state[namespace]);
      const newsParams = { ...params, ...payload };
      let subList = yield call(listFlowTempAPI, newsParams);
      let newData = data.map(V => V.id === payload.node ? { ...V, children: subList } : V)
      yield put({
        type: 'save',
        payload: {
          data: newData,
          params: newsParams
        },
      });
    },
    *deployTemplate({ payload }: any, { call, put }: any) {
      try {
        yield call(deployTemplateApi, payload)
        yield put({ type: 'listFlowTemp', payload: {} })
      } catch (error) {
        return Promise.reject(error)
      }
      return Promise.resolve()
    },
    *updateTemplate({ payload }: any, { call, put }: any) {
      try {
        yield call(updateTemplateApi, payload)
        yield put({ type: 'listFlowTemp', payload: {} })
      } catch (error) {
        return Promise.reject(error)
      }
      return Promise.resolve()
    },
    *modifyTemplate({ payload }: any, { call, put }: any) {
      try {
        yield call(modifyTemplateApi, payload)
        yield put({ type: 'listFlowTemp', payload: {} })
      } catch (error) {
        return Promise.reject(error)
      }
      return Promise.resolve()
    },
    *modifyTemplateTimeout({ payload }: any, { call }: any) {
      try {
        yield call(modifyTemplateTimeoutApi, payload)
      } catch (error) {
        return Promise.reject(error)
      }
      return Promise.resolve()
    },
  },
  reducers: {
    save(state: any, { payload }: any) {
      return {
        ...state,
        ...payload,
      };
    },
  },
}
