import {
  listCallbackFunctionsAPI,
  listCallbackConditionFunctionsAPI,
  listCallbackUserFunctionsAPI,
  listWorkflowTemplatesAPI,
  getDeployTemplateAPI,
  listDesignTemplateAPI,
  getDesignTemplateAPI,
  updateDesignNameAPI,
  removeDesignTemplateAPI,
  importDesignTemplateAPI
} from './service';

export const namespace: string = 'workFlowDesigner';
export default {
  namespace,
  state: {
    workflowTemplates: [],
    designTemplates: [],

    callbackFunctions: [],
  },
  effects: {
    *listCallbackFunctions({ payload }: any, { call, put, select }: any) {
      const Api =
        (payload === 'Condition' || payload === 'LogicCondition') ? listCallbackConditionFunctionsAPI :
          payload === 'User' ? listCallbackUserFunctionsAPI : listCallbackFunctionsAPI;
      let list = yield call(Api, { pageInfo: { pageSize: 0, beginIndex: 0 } });
      list.forEach((V: any) => {
        if (V.callbackParameterNames) {
          V.parameter = [];
          V.parameter = V.callbackParameterNames.map((CN: string) => ({
            name: CN,
            value: ''
          }))
        }
        else V.parameter = [];
      })
      yield put({
        type: 'save',
        payload: {
          callbackFunctions: list
        },
      });
      return true;
    },
    *listFlowTemp({ payload }: any, { call, put, select }: any) {
      let data = yield call(listWorkflowTemplatesAPI, { node: 'root', pageInfo: {} });
      data.forEach(V => {
        if (!V.leaf) V.children = [];
      });
      yield put({
        type: 'save',
        payload: {
          workflowTemplates: data
        },
      });
    },
    *listSubFlowTemp({ payload }: any, { call, put, select }: any) {
      const { workflowTemplates } = yield select(state => state[namespace]);
      let subList = yield call(listWorkflowTemplatesAPI, { ...payload, pageInfo: {} });
      let newData = workflowTemplates.map(V => V.id === payload.node ? { ...V, children: subList } : V)
      yield put({
        type: 'save',
        payload: {
          workflowTemplates: newData,
        },
      });
    },
    *getDeployTemplate({ payload }: any, { call, put, select }: any) {
      let data = yield call(getDeployTemplateAPI, { ...payload });
      return data;
    },
    *importDesignTemplate({ payload }: any, { call, put, select }: any) {
      yield call(importDesignTemplateAPI, payload);
      yield put({ type: 'listDesignTemplate' });
      return true;
    },
    *listDesignTemplate({ payload }: any, { call, put, select }: any) {
      let list = yield call(listDesignTemplateAPI, { ...payload, pageInfo: { pageSize: 0, beginIndex: 0 } });
      yield put({
        type: 'save',
        payload: {
          designTemplates: list
        },
      });
    },
    *getDesignTemplate({ payload }: any, { call, put, select }: any) {
      let data = yield call(getDesignTemplateAPI, { ...payload });
      return data;
    },
    *updateDesignName({ payload }: any, { call, put, select }: any) {
      yield call(updateDesignNameAPI, { ...payload });
      yield put({ type: 'listDesignTemplate' });
      return true;
    },
    *removeDesignTemplate({ payload }: any, { call, put, select }: any) {
      yield call(removeDesignTemplateAPI, { ...payload });
      yield put({ type: 'listDesignTemplate' });
      return true;
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