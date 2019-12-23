import { getAsyncTaskListAPI } from './service';
import { Model } from 'dva';
import { initParams } from '@/utils/utils';

const namespace = 'asyncTaskManage';

const reduxModel: Model = {
  namespace,
  state: {
    asyncTaskListParams: initParams,
    asyncTaskList: [],
    asyncTaskListTotal: 0,
  },
  effects: {
    *getAsyncTaskList({ payload }, { call, put, select }) {
      const { asyncTaskListParams } = yield select((state: any) => state[namespace]);
      const newsParams = { ...asyncTaskListParams, ...payload };
      try {
        yield put({ type: 'save', payload: { asyncTaskListParams: newsParams } })
        const ret = yield call(getAsyncTaskListAPI, { data: newsParams });
        yield put({
          type: 'save',
          payload: {
            asyncTaskList: ret.content || [],
            asyncTaskListTotal: ret.totalCount,
          },
        });
      } catch (err) {
        console.log(err)
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    }
  },
};
export default reduxModel