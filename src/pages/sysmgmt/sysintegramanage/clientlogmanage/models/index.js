import { notification, Modal } from 'antd';
import {
  getClientLogListAPI,
} from '../service';

const namespace = 'clientLogManage';

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
    clientLogListParams: formatParams(),
    selectedRowKeys: [],
    selectedRows: [],

    clientLogList: [],
    clientLogListTotal: 0,
    visible: false,
    drawerVisible: false
  },
  effects: {
    *getClientLogList({ payload }, { call, put, select }) {
      const { clientLogListParams } = yield select(state => state[namespace]);
      const newsParams = Object.assign({}, clientLogListParams, formatParams(payload));
      const ret = yield call(getClientLogListAPI, {data:newsParams});
      yield put({
        type: 'save',
        payload: {
          clientLogList: ret.content||[],
          clientLogListTotal: ret.totalCount,
          clientLogListParams: newsParams,
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
