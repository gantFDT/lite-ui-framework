import { notification } from 'antd';
import {
  getUserListByRoleAPI,
  addUsersToRoleAPI,
  removeUsersFromRoleAPI
} from '../service';

const namespace = 'roleRelateUser';

const formatParams = ({ page = 1, pageSize = 20, ...restParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  filterInfo: {
    ...restParams
  }
})

const initialState = {
  relateUserParams: formatParams(),
  relateUserList: [],
  relateUserSelectedKeys: [],
  relateUserListTotal: 0,
}

export default {
  namespace,
  state: initialState,
  effects: {
    *listRelateUser({ payload }, { call, put, select }) {
      let params = payload
      if (!payload) {
        const state = yield select(store => store[namespace]);
        params = state.relateUserParams
      }
      const ret = yield call(getUserListByRoleAPI, { data: params });
      yield put({
        type: 'save',
        payload: {
          relateUserParams: params,
          relateUserList: ret.content || [],
          relateUserListTotal: ret.totalCount
        },
      });
    },
    *addUsersToRole({ payload, callback, reload }, { call, put }) {
      yield call(addUsersToRoleAPI, {
        data: payload
      });
      callback()
      if (reload) {
        yield put({
          type: 'roleManage/getRoleList'
        })
      }

    },
    *removeUsersFromRole({ payload, callback, reload }, { call, put }) {
      yield call(removeUsersFromRoleAPI, {
        data: payload
      });
      callback()
      if (reload) {
        yield put({
          type: 'roleManage/getRoleList'
        })
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    resetState: () => initialState
  },
};
