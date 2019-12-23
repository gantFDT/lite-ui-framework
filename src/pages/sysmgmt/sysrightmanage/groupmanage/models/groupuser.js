import { notification } from 'antd';
import {
  listUserByGroupAPI,
  addUsersToGroupAPI,
  removeUsersFromGroupAPI
} from '../service';

const namespace = 'groupuser';

const formatParams = ({ beginIndex = 0, pageSize = 50, ...restParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex
  },
  filterInfo: {
    ...restParams
  }
})

export default {
  namespace,
  state: {
    modalVisible: false,

    relateUserParams: formatParams(),
    relateUserList: [],
    relateUserSelectedKeys: [],
    relateUserListTotal: 0,

    unRelateUserParams: formatParams(),
    unRelateUserList: [],
    unRelateUserSelectedKeys: [],
    unRelateUserListTotal: 0,
    relateUserListPageSize:50,
  },
  
  effects: {
    *listRelateUser({ payload = {},cb }, { call, put, select }) {
      const { relateUserParams } = yield select(state => state[namespace]);
      const { selectedRowKeys: [groupSelectedId] } = yield select(state => state['group']);
      payload.objectId = groupSelectedId ? groupSelectedId : '0';
      payload.filterModel = true;
      const newsParams = Object.assign({}, relateUserParams, formatParams(payload));
      payload.pageInfo && (newsParams.pageInfo = payload.pageInfo);
      delete newsParams.filterInfo.pageInfo;
      let ret = yield call(listUserByGroupAPI, { data: newsParams });
      yield put({
        type: 'save',
        payload: {
          relateUserList: ret.content || [],
          relateUserListTotal: ret.totalCount,
          relateUserParams: newsParams,
          relateUserSelectedKeys: [],
          relateUserListPageSize:ret.pageSize
        },
      });
      cb&&cb();
    },
    *listUnRelateUser({ payload = {},cb }, { call, put, select }) {
      const { unRelateUserParams } = yield select(state => state[namespace]);
      const { selectedRowKeys: [groupSelectedId] } = yield select(state => state['group']);
      payload.excludeObjectId = groupSelectedId;
      const newsParams = Object.assign({}, unRelateUserParams, formatParams(payload));
      payload.pageInfo && (newsParams.pageInfo = payload.pageInfo);
      delete newsParams.filterInfo.pageInfo;
      let ret = yield call(listUserByGroupAPI, { data: newsParams });
      yield put({
        type: 'save',
        payload: {
          unRelateUserList: ret.content || [],
          unRelateUserListTotal: ret.totalCount,
          unRelateUserParams: newsParams,
          unRelateUserSelectedKeys: []
        },
      });
      cb&&cb();
    },
    *addUsersToGroup({ payload }, { call, put, select }) {
      const { selectedRowKeys: [groupSelectedId] } = yield select(state => state['group']);
      yield call(addUsersToGroupAPI, {
        data: {
          objectId: groupSelectedId,
          users: payload
        }
      });
      // notification.success({ message: tr('关联用户成功') });
      yield put({ type: 'listRelateUser' });
      yield put({ type: 'listUnRelateUser' });
    },
    *removeUsersFromGroup({ payload }, { call, put, select }) {
      const { selectedRowKeys: [groupSelectedId] } = yield select(state => state['group']);
      yield call(removeUsersFromGroupAPI, {
        data: {
          objectId: groupSelectedId,
          users: payload
        }
      });
      // notification.success({ message: tr('解除关联用户成功') });
      yield put({ type: 'listRelateUser' });
      yield put({ type: 'listUnRelateUser' });
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
