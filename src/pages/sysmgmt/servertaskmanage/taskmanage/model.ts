import {
  getTaskListAPI,
  createTaskAPI,
  removeTaskAPI,
  testTaskAPI,
  updateTaskAPI,
  readLogTaskAPI,
} from './service';
import { Model } from 'dva';
import { initParams } from '@/utils/utils';

const namespace = 'taskManage';

const reduxModel: Model = {
  namespace,
  state: {
    taskListParams: initParams,
    taskList: [],
    taskListTotal: 0,

    taskLogParams: initParams,
    taskLogList: [],
    taskLogListTotal: 0,
  },
  effects: {
    *getTaskList({ payload }, { call, put, select }) {
      const { taskListParams } = yield select((state: object) => state[namespace]);
      const newsParams = { ...taskListParams, ...payload };
      yield put({ type: 'save', payload: { taskListParams: newsParams } })
      const ret = yield call(getTaskListAPI, newsParams);
      yield put({
        type: 'save',
        payload: {
          taskList: ret.content || [],
          taskListTotal: ret.totalCount,
        },
      });
    },
    *getTaskLogList({ payload }, { call, put, select }) {
      const { taskLogParams } = yield select((state: object) => state[namespace]);
      const newsParams = { ...taskLogParams, ...payload };
      const { pageInfo: { beginIndex, pageSize } } = newsParams;
      yield put({ type: 'save', payload: { taskLogParams: newsParams } })
      const ret = yield call(readLogTaskAPI, {
        ...newsParams, pageInfo: {
          beginIndex: beginIndex * pageSize,
          pageSize
        }
      });
      yield put({
        type: 'save',
        payload: {
          taskLogList: ret.content || [],
          taskLogListTotal: ret.totalCount,
        },
      });
    },
    *createTask({ payload, callback }, { call, put }) {
      yield call(createTaskAPI, payload);
      yield put({ type: 'getTaskList' });
      callback && callback();
    },
    *removeTask({ payload, callback }, { call, put }) {
      const { id } = payload;
      yield call(removeTaskAPI, { id });
      callback && callback();
      yield put({ type: 'getTaskList' });
    },
    *testTask({ payload }, { call, put }) {
      const { id } = payload;
      yield call(testTaskAPI, { timerTaskId: id, isAsyn: true });
      yield put({ type: 'getTaskList' });
    },
    * updateTask({ payload, callback }, { call, put }) {
      yield call(updateTaskAPI, payload);
      callback && callback();
      yield put({ type: 'getTaskList' });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetLogParams(state) {
      return {
        ...state,
        taskLogParams: initParams,
        taskLogList: [],
        taskLogListTotal: 0,
      };
    },
  },
}
export default reduxModel