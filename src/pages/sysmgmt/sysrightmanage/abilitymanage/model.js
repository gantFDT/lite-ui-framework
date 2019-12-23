import { notification } from 'antd';
import {
  listAbilityAPI,
  checkAbilityAPI,
  createAbilityAPI,
  updateAbilityAPI,
  removeAbilityAPI,
  moveAbilityUpAPI,
  moveAbilityDownAPI,
  getFunctionURI,
} from './service';
import { formatTreeData } from '@/utils/utils'

const namespace = 'abilityManage';

const CATEGORY = 'FUNCTION_CATEGORY';
const ITEM = 'FUNCTION_CATEGORY_ITEM';

const emptyParams = {
  id: "",
  parentResourceId: "ROOT",
  type: CATEGORY,
  name: "",
  path: "",
  description: ""
}

export default {
  namespace,
  state: {
    // 已不再使用modal中的下列两个数据
    selectedRowKeys: [],
    selectedRows: [],

    abilityList: [],
    abilityListTotal: 0,
    mode: 'create:root'
  },
  effects: {
    *listAbility({ payload }, { call, put, select }) {
      const ret = yield call(listAbilityAPI, {
        data: {
          node: "root",
          pageInfo: {},
          types: ["FUNCTION_CATEGORY", "FUNCTION_CATEGORY_ITEM"]
        }
      });
      formatTreeData(ret)
      yield put({
        type: 'save',
        payload: {
          abilityList: ret || [],
          abilityListTotal: ret.length,
          selectedRowKeys: [],
          selectedRows: []
        },
      });
    },
    *createAbilityCategory({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [parentResourceId] } = yield select(state => state[namespace]);
      yield call(createAbilityAPI, {
        data: {
          ...emptyParams,
          parentResourceId: parentResourceId || "ROOT",
          type: CATEGORY,
          ...payload
        }
      });
      notification.success({ message: tr('新增功能分类成功') });
      callback()
      yield put({ type: 'listAbility' });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     formModalVisible: false
      //   },
      // });
    },
    *createAbilityItem({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [parentResourceId] } = yield select(state => state[namespace]);
      yield call(createAbilityAPI, {
        data: {
          ...emptyParams,
          parentResourceId: parentResourceId || "ROOT",
          type: ITEM,
          ...payload
        }
      });
      notification.success({ message: tr('新增功能点成功') });
      callback()
      yield put({ type: 'listAbility' });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     formModalVisible: false
      //   },
      // });
    },
    *removeAbility({ payload }, { call, put, select }) {
      const { selectedRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(removeAbilityAPI, { data: { id } });
      notification.success({ message: tr('删除功能成功') });
      yield put({ type: 'listAbility' });
    },
    *updateAbility({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id], selectedRows: [rowData] } = yield select(state => state[namespace]);
      yield call(updateAbilityAPI, {
        data: {
          id,
          ...rowData,
          ...payload
        }
      });
      notification.success({ message: tr('编辑功能成功') });
      callback()
      yield put({ type: 'listAbility' });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     formModalVisible: false
      //   },
      // });
    },
    *moveAbilityUp({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id], selectedRows: [rowData] } = yield select(state => state[namespace]);
      yield call(moveAbilityUpAPI, {
        data: {
          resourceId: id,
          parentResourceId: rowData.parentResourceId
        }
      });
      notification.success({ message: tr('移动成功') });
      callback()
      yield put({ type: 'listAbility' });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     formModalVisible: false
      //   },
      // });
    },
    *moveAbilityDown({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id], selectedRows: [rowData] } = yield select(state => state[namespace]);
      yield call(moveAbilityDownAPI, {
        data: {
          resourceId: id,
          parentResourceId: rowData.parentResourceId
        }
      });
      notification.success({ message: tr('移动成功') });
      callback();
      yield put({ type: 'listAbility' });
      // yield put({
      //   type: 'save',
      //   payload: {
      //     formModalVisible: false
      //   },
      // });
    },
    *finduri({ payload }, { call, put }) {
      const res = yield call(getFunctionURI, {
        data: {
          id: payload,
          node: 'root'
        }
      })

      yield put({
        type: 'save',
        payload: {
          uriList: res
        }
      })
    }
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
