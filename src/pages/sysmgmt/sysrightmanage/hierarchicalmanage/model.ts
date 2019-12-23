import { AnyAction } from 'redux';
import { set } from 'lodash'

import {
  getHierarchicalAPI,
  removeHierarchicalAPI,
  createHierarchicalAPI,
  getHierarchicalRoleAPI,
  getHierarchicalRoleGroupAPI,
  updateHierarchicalAPI,
} from './services'
import { Model } from 'dva'

const initialState = {
  hierList: [],
  roleList: [],
  noroleList: [], // 未分配角色
  groupList: [],
}

export type HierarchicalState = Readonly<typeof initialState>

export interface HierarchicalModal extends Model {
  namespace: 'hierarchical',
  readonly state: HierarchicalState,
}

const hierarchicalModal: HierarchicalModal = {
  namespace: 'hierarchical',

  state: initialState,

  effects: {
    *getHierarchicalList({ payload, callback }, { call, put }) {
      try {
        const list = yield call(getHierarchicalAPI, { data: payload })
        yield put({
          type: 'save',
          payload: {
            hierList: list,
          },
        })
      } catch { }
    },
    *removeHierarchicalList({ payload, callback }, { call, put }) {
      try {
        yield call(removeHierarchicalAPI, { data: { id: payload } })
        callback()
      } catch { }
    },
    *createHierarchicalList({ payload, callback }, { call, put }) {
      try {
        yield call(createHierarchicalAPI, { data: payload })
        callback()
      } catch { }
    },
    *updateHierarchicalList({ payload, callback }, { call, put }) {
      try {
        yield call(updateHierarchicalAPI, { data: payload })
        callback()
      } catch { }
    },
    // 查询角色接口
    *getHierarchicalRoleList({ payload, callback }, { call, put }) {
      try {
        const key = payload.filterInfo.assigned ? 'roleList' : 'noroleList'
        const { content } = yield call(getHierarchicalRoleAPI, { data: payload })
        yield put({
          type: 'save',
          payload: {
            [key]: content,
          },
        })
      } catch { }
    },
    // 查询用户组列表
    *getHierarchicalRoleGroupList({ payload, callback }, { call, put }) {
      try {
        yield put({
          type: 'save',
          payload: {
            groupList: yield call(getHierarchicalRoleGroupAPI, { data: payload }),
          },
        })
      } catch { }
    },
  },

  reducers: {
    save(state: HierarchicalState, { payload }: AnyAction) {
      return {
        ...state,
        ...payload,
      }
    },
    resetState() {
      return initialState
    },
    clearRoleList(state) {
      return {
        ...state,
        roleList: [],
      }
    },
    clearRoleGroupList(state) {
      return {
        ...state,
        groupList: [],
      }
    },
  }
}

export default hierarchicalModal
