import { notification } from 'antd';
import {
  listResourceAPI,
  listAllResourceAPI,
  saveRoleResourceRelationAPI,
} from '../service';
// import { tr } from '@/components/common';
import { formatTreeData, fromTree2arr } from '@/utils/utils';

const namespace = 'roleRelateResource';
const typesMap = {
  // webMenu: ["WEBMENU", "WEBMENU_CATEGORY", "WEBMENU_CATEGORY_ITEM"],
  webMenu: ["REACTMENU_CATEGORY", "REACTMENU_CATEGORY_ITEM"],
  mobileMenu: ["MOBILEMENU", "MOBILEMENU_CATEGORY", "MOBILEMENU_CATEGORY_ITEM"],
  contextMenu: ["CONTEXTPAGE", "CONTEXTPAGE_CATEGORY_ITEM", "CONTEXTPAGE_CATEGORY"],
  funcMenu: ["FUNCTION", "FUNCTION_CATEGORY_ITEM", "FUNCTION_CATEGORY"],
}

const initialState = {
  modalVisible: false,

  webMenuList: [],
  webMenuLinkedList: [],
  webMenuSelectedKeys: [],

  mobileMenuList: [],
  mobileMenuLinkedList: [],
  mobileMenuSelectedKeys: [],

  contextMenuList: [],
  contextMenuLinkedList: [],
  contextMenuSelectedKeys: [],

  funcMenuList: [],
  funcMenuLinkedList: [],
  funcMenuSelectedKeys: [],
}

export default {
  namespace,
  state: initialState,
  effects: {
    *listResource({ payload = {} }, { call, put }) {
      let ret = yield call(listResourceAPI, {
        data: {
          node: "root",
          pageInfo: {},
          roleId: payload.roleId,
          types: typesMap[payload.type]
        }
      });
      formatTreeData(ret)
      yield put({
        type: 'save',
        payload: {
          [`${payload.type}LinkedList`]: ret || [],
          [`${payload.type}SelectedKeys`]: fromTree2arr(ret, 'children', 'id')
        },
      });
    },
    *listAllResource({ payload = {} }, { call, put, select }) {
      const { selectedRowKeys: [roleSelectedId] } = yield select(state => state['roleManage']);
      if (!roleSelectedId) return;
      let ret = yield call(listAllResourceAPI, {
        data: {
          node: "root",
          pageInfo: {},
          roleId: roleSelectedId,
          types: typesMap[payload.type]
        }
      });
      formatTreeData(ret)
      yield put({
        type: 'save',
        payload: {
          [`${payload.type}List`]: ret || []
        },
      });
    },
    *saveRoleResource({ payload }, { put, select }) {
      const types = ['webMenu', 'mobileMenu', 'contextMenu', 'funcMenu']
      const { state, roleManage: { selectedRowKeys: [roleSelectedId] } } = yield select(store => ({ state: store[namespace], roleManage: store.roleManage }));
      // const resourceCount = selected.resourceCount || 0
      yield put({ type: 'save', payload: { modalVisible: false } })
      for (const type of types) {
        yield put({ type: 'saveRoleResourceRelation', payload: { type, roleId: roleSelectedId, resources: state[`${type}SelectedKeys`] } })
      }
      // const selectedKeys = types.reduce((keys, type) => ([...keys, ...state[`${type}SelectedKeys`]]), [])

      // if (
      //   resourceCount !== selectedKeys.length &&
      //   (resourceCount === 0 || selectedKeys.length === 0)
      // ) {
      //   yield put({ type: 'roleManage/getRoleList' })
      // }
      // 更新角色列表
      yield put({ type: 'roleManage/getRoleList' })
    },
    *saveRoleResourceRelation({ payload: { type, roleId, resources } }, { call, put }) {
      yield call(saveRoleResourceRelationAPI, {
        data: {
          resources,
          roleId,
          types: typesMap[type]
        }
      });
      yield put({ type: 'listResource', payload: { type, roleId } });
      return true;
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    clear(state) {
      return {
        ...state,
        webMenuLinkedList: [],
        mobileMenuLinkedList: [],
        contextMenuLinkedList: [],
        funcMenuLinkedList: []
      }
    },
    clearSelect(state) {
      return {
        ...state,
        webMenuSelectedKeys: [],
        mobileMenuSelectedKeys: [],
        contextMenuSelectedKeys: [],
        funcMenuSelectedKeys: []
      }
    },
    resetState: () => initialState
  },
};
