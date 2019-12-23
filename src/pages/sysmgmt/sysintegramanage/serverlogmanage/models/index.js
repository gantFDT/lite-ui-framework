import { notification, Modal } from 'antd';
import {
  getServerLogListAPI,
} from '../service';

const namespace = 'serverLogManage';

const formatParams = ({page = 1,pageSize = 20,...restParams} = {}) => ({
  pageInfo:{
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  ...restParams,
})

export default {
  namespace,
  state: {
    params: formatParams(),
    serverLogListParams: formatParams(),
    selectedRowKeys: [],
    selectedRows: [],

    serverLogList: [],
    serverLogListTotal: 0,
    visible: false,
    drawerVisible: false
  },
  effects: {
    *getServerLogList({ payload }, { call, put, select }) {
      const { serverLogListParams } = yield select(state => state[namespace]);
      const newsParams = Object.assign({}, serverLogListParams, formatParams(payload));
      const ret = yield call(getServerLogListAPI, {data:newsParams});
      yield put({
        type: 'save',
        payload: {
          serverLogList: ret.content||[],
          serverLogListTotal: ret.totalCount,
          serverLogListParams: newsParams,
          selectedRowKeys: [],
          selectedRows: []
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
    closeModal(state){
      return {
        ...state,
        visible: false
      }
    }
  },
};
