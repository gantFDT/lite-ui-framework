import { notification, Modal } from 'antd';
import {
  getRoleListAPI,
  createRoleAPI,
  checkRoleUsedAPI,
  removeRoleAPI,
  updateRoleAPI
} from '../service';
import { initParams, formatParams } from '@/utils/utils'

const namespace = 'roleManage';

const initialState = {
  params: initParams,
  selectedRowKeys: [],
  selectedRows: [],

  relateType: 'relateuser',
  roleList: [],
  roleListTotal: 0,
  visible: false,
  drawerVisible: false
}

export default {
  namespace,
  state: initialState,
  effects: {
    *getRoleList({ payload }, { call, put, select }) {
      // const { params } = yield select(state => state[namespace]);
      // const newsParams = Object.assign({}, params, formatParams(payload));
      let params = payload
      if (!payload) {
        const state = yield select(store => store[namespace]);
        params = state.params
      }

      const ret = yield call(getRoleListAPI, { data: params });
      yield put({
        type: 'save',
        payload: {
          params: params,
          roleList: ret.content || [],
          roleListTotal: ret.totalCount,
        },
      });
    },
    *saveEditData({ payload }, { put }) {
      const [addList, delList, modifyList] = payload
      const count = payload.flat().length;
      let complete = 0
      const callback = function* callback(length) {
        complete += length
        if (complete === count) {
          yield put({ type: 'getRoleList' });
          yield put({ type: "organization/fetchAllRole" });
        }
      }
      if (addList.length) {
        yield put({ type: 'createRole', payload: addList, callback })
      }
      if (delList.length) {
        yield put({ type: 'removeRole', payload: delList, callback })
      }
      if (modifyList.length) {
        yield put({ type: 'updateRole', payload: modifyList, callback })
      }
    },
    *createRole({ payload, callback }, { call, put }) {
      for (const item of payload) {
        const { status, ...data } = item
        data.id = ''
        yield call(createRoleAPI, { data });
      }
      notification.success({ message: tr('新增角色成功') });
      yield call(callback, payload.length)
    },
    *checkRoleUsed({ payload }, { call, put, select }) {
      const { selectedRowKeys: [id] } = yield select(state => state[namespace]);
      return yield call(checkRoleUsedAPI, { data: { id } });// {id:''}
    },
    *removeRole({ payload, callback }, { call }) {
      for (const item of payload) {
        yield call(removeRoleAPI, { data: { id: item.id } });
      }
      notification.success({ message: tr('删除角色成功') });
      yield call(callback, payload.length)
    },
    *updateRole({ payload, callback }, { call }) {
      for (const item of payload) {
        yield call(updateRoleAPI, { data: item });
      }
      yield put({ type: "organization/fetchAllRole" });
      notification.success({ message: tr('编辑角色成功') });
      yield call(callback, payload.length)
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    closeModal(state) {
      return {
        ...state,
        visible: false
      }
    },
    resetState() {
      return initialState
    }
  },
};
