import { notification } from 'antd';
import {
  listGroupCategoryAPI,
  createGroupCategoryAPI,
  updateGroupCategoryAPI,
  removeGroupCategoryAPI,
} from '../service';

const namespace = 'groupCategory';

const emptyParams = {
  categoryCode: '',
  categoryName: '',
  optCounter: 0
}

const formatParams = ({ page = 1, pageSize = 50, ...restParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  filterInfo: {
    ...restParams,
    filterModel: true
  }
})

export default {
  namespace,
  state: {
    params: formatParams(),
    selectedRowKeys: [],
    selectedRows: [],

    groupCategoryList: [],
    groupCategoryListTotal: 0,
    formModalVisible: false,
    visible: false
  },
  effects: {
    *listGroupCategory({ payload }, { call, put, select }) {
      const { params } = yield select(state => state[namespace]);
      const newsParams = Object.assign({}, params, formatParams(payload));
      const ret = yield call(listGroupCategoryAPI, { data: newsParams });
      yield put({
        type: 'save',
        payload: {
          groupCategoryList: ret || [],
          groupCategoryListTotal: ret.length,
          params: newsParams,
          selectedRowKeys: [],
          selectedRows: []
        },
      });
    },
    *createGroupCategory({ payload, callback }, { call, put, select }) {
      yield call(createGroupCategoryAPI, {
        data: {
          ...emptyParams,
          ...payload
        }
      });
      notification.success({ message: tr('新增用户组类别成功') });
      yield put({ type: 'listGroupCategory' });
      callback && callback()
      yield put({
        type: 'save',
        payload: {
          formModalVisible: false
        },
      });
    },
    *removeGroupCategory({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(removeGroupCategoryAPI, { data: { id } });
      callback && callback()
      notification.success({ message: tr('删除用户组类别成功') });
      yield put({ type: 'listGroupCategory' });
    },
    *updateGroupCategory({ payload, callback }, { call, put, select }) {
      const { selectedRowKeys: [id], selectedRows: [rowData] } = yield select(state => state[namespace]);
      yield call(updateGroupCategoryAPI, {
        data: {
          id,
          ...rowData,
          ...payload
        }
      });
      notification.success({ message: tr('编辑用户组类别成功') });
      yield put({ type: 'listGroupCategory' });
      callback && callback()
      yield put({
        type: 'save',
        payload: {
          formModalVisible: false
        },
      });
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
