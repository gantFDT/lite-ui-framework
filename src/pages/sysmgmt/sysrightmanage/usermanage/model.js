import { notification } from 'antd';
import { merge, findIndex, difference } from 'lodash';
import {
  listUserByOrgAPI,
  listUserAPI,
  createUserAPI,
  updateUserAPI,
  removeUserAPI,
  resetPwdAPI,
  setActiveAPI,
  updateOrganizationAPI,
  unlockAPI
} from './service.ts';
import { initParams, formatParams } from '@/utils/utils';
import { updateUserCache } from '@/utils/user';

const namespace = 'userManage';
export default {
  namespace,
  state: {
    params: {
      pageInfo: {
        pageSize: 50,
        beginIndex: 0
      },
      filterInfo: {
        filterModel: true
      }
    },
    list: [],
    total: 0,
    organization: {},
    selectedRowKeys: [],
    selectedRows: [],
    visible: false,
    userModalType: "create",
    passwordVisible: false,
    unlockVisible: false,
    relateRoleVisible: false,
    relateGroupVisible: false,
    orgModalVisible: false
  },
  effects: {
    *listUser({ payload }, { call, put, select }) {
      const { params } = yield select(state => state[namespace]);
      const newsParams = { ...params, ...payload };
      yield put({
        type: 'save',
        payload: {
          params: newsParams
        },
      });
      const { content = [], totalCount } = yield call(listUserAPI, {
        data: newsParams
      });
      yield put({
        type: 'save',
        payload: {
          list: content,
          total: totalCount,
          selectedRowKeys: [],
          selectedRows: []
        },
      });
    },
    *createUser({ payload }, { call, put }) {
      let data = yield call(createUserAPI, payload);
      updateUserCache(data);
      yield put({ type: 'listUser' });
      yield put({ type: 'closeUserModal' });
    },
    *updateUser({ payload }, { call, put }) {
      const data = yield call(updateUserAPI, payload);
      updateUserCache(data);
      yield put({ type: 'listUser' });
      yield put({ type: 'closeUserModal' });
    },
    *removeUser({ payload }, { call, put }) {
      yield call(removeUserAPI, { id: payload });
      yield put({ type: 'listUser' });
    },
    *resetPwd({ payload }, { call, put }) {
      yield call(resetPwdAPI, payload);
      yield put({ type: 'listUser' });
      yield put({ type: "save", payload: { passwordVisible: false } })
    },
    *unlock({ payload }, { call, put }) {
      yield call(unlockAPI, payload);
      yield put({ type: 'listUser' });
      yield put({ type: "save", payload: { unlockVisible: false } })
    },
    *setActive({ payload }, { call, put, select }) {
      yield call(setActiveAPI, payload);
      yield put({ type: 'listUser' });
    },
    *updateOrganization({ payload }, { call, put, select }) {
      const { selectedUserKeys } = yield select(state => state[namespace]);
      yield call(updateOrganizationAPI, payload);
      yield put({ type: "save", payload: { orgModalVisible: false } })
      yield put({ type: 'listUser' });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeUserModal(state) {
      return {
        ...state,
        visible: false,
        userModalType: "create"
      };
    },
  },
};
