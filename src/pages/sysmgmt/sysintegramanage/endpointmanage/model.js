import { notification, Modal } from 'antd';

import {
  findEndpointAPI,
  createServiceAPI,
  removeServiceAPI,
  updateServiceAPI,

  findLogAPI,

  findSystemAPI,
  createCustomerAPI,
  removeCustomerAPI,
  updateCustomerAPI,

  findHandleAPI,
  createOpenAPI,
  removeOpenAPI,
} from './service'

const namespace = 'endpointmanage'

const formatParams = ({ page = 1, pageSize = 20, ...resetParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  ...resetParams,
})

const formatParams2 = ({ page = 1, pageSize = 20, ...resetParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  filterInfo: {
    ...resetParams
  }
})

const initialParams = {
  pageInfo: {
    pageSize: 20,
    beginIndex: 0
  },
  filterInfo: {}
}

export default {
  namespace,
  state: {
    endpointList: [],
    endpointListParams: initialParams,
    serviceModalType: 'create',
    selectedServiceRowKeys: [],
    selectedServiceRows: [],
    serviceVisible: false,

    logVisible: false,
    logList: [],
    logListParams: initialParams,
    logType: '',
    logId: '',

    customerList: [],
    customerListParams: formatParams2(),
    customerModalType: 'create',
    selectedCustomerRowKeys: [],
    selectedCustomerRows: [],
    customerVisible: false,

    openList: [],
    openListParams: formatParams2(),
    openModalType: 'create',
    selectedOpenRowKeys: [],
    selectedOpenRows: [],
    openVisible: false,

  },
  effects: {
    *findLogList({ payload }, { call, put, select }) {
      const { logListParams, logType } = yield select(state => state[namespace]);
      if (logType) {
        let params = logListParams
        if (payload) {
          params = payload
        }
        const ret = yield call(findLogAPI, { data: params });
        yield put({
          type: 'save',
          payload: {
            logList: ret.content || [],
            logListParams: params,
          },
        });
      }
    },
    *findEndpointList({ payload }, { call, put, select }) {
      let params = null
      if (payload) {
        params = payload
      } else {
        const { endpointListParams } = yield select(state => state[namespace]);
        params = endpointListParams
      }
      const ret = yield call(findEndpointAPI, { data: params });
      yield put({
        type: 'save',
        payload: {
          endpointList: ret || [],
          endpointListParams: params,
        },
      });
    },
    *createService({ payload }, { call, put }) {
      yield call(createServiceAPI, { data: payload });
      notification.success({ message: tr('新增服务成功') });
      yield put({ type: 'findEndpointList' });
      yield put({ type: 'closeModal' });
    },
    *updateService({ payload }, { call, put, select }) {
      const { selectedServiceRowKeys: [id], selectedServiceRows: [rowData] } = yield select(state => state[namespace]);
      yield call(updateServiceAPI, {
        data: {
          id,
          ...rowData,
          ...payload
        }
      });// {id:'',...}
      notification.success({ message: tr('编辑服务成功') });
      yield put({ type: 'findEndpointList' });
      yield put({ type: 'closeModal' });
    },
    *removeService({ payload }, { call, put, select }) {
      const { selectedServiceRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(removeServiceAPI, { data: { id } });// {id:''}
      notification.success({ message: tr('删除服务成功') });
      // 关闭弹窗
      payload()
      yield put({
        type: 'save',
        payload: {
          selectedServiceRowKeys: [],
          selectedServiceRows: []
        }
      })
      yield put({ type: 'findEndpointList' });
    },
    *findCustomerList({ payload }, { call, put, select }) {
      let params = {}
      if (payload) {
        params = formatParams2(payload)
      } else {
        const { customerListParams } = yield select(state => state[namespace]);
        params = customerListParams
      }
      const ret = yield call(findSystemAPI, { data: params });
      yield put({
        type: 'save',
        payload: {
          customerList: ret || [],
          customerListParams: params,
        },
      });
    },
    *createCustomer({ payload }, { call, put }) {
      yield call(createCustomerAPI, { data: payload });
      notification.success({ message: tr('新增客户成功') });
      const { endpointId } = payload
      yield put({ type: 'findCustomerList', payload: { endpointId } });
      yield put({ type: 'closeCustomerModal' });
    },
    *updateCustomer({ payload }, { call, put, select }) {
      const { selectedCustomerRowKeys: [id], selectedCustomerRows: [rowData] } = yield select(state => state[namespace]);
      yield call(updateCustomerAPI, {
        data: {
          ...rowData,
          ...payload,

          id,
        }
      });// {id:'',...}
      notification.success({ message: tr('编辑客户成功') });
      yield put({ type: 'findCustomerList' });
      yield put({ type: 'closeCustomerModal' });
    },
    *removeCustomer({ payload, callback }, { call, put, select }) {
      const { selectedCustomerRowKeys: [id] } = yield select(state => state[namespace]);
      yield call(removeCustomerAPI, { data: { id } });// {id:''}
      notification.success({ message: tr('删除客户成功') });
      if (callback) callback();
      yield put({
        type: 'save',
        payload: {
          selectedCustomerRowKeys: [],
          selectedCustomerRows: []
        }
      })
      yield put({ type: 'findCustomerList', payload });
    },
    *findOpenList({ payload }, { call, put, select }) {
      const { openListParams } = yield select(state => state[namespace]);
      const newsParams = Object.assign({}, openListParams, formatParams2(payload));
      const ret = yield call(findHandleAPI, { data: newsParams });
      yield put({
        type: 'save',
        payload: {
          openList: ret || [],
          openListParams: newsParams,
        },
      });
    },
    *createOpen({ payload }, { call, put }) {
      yield call(createOpenAPI, { data: payload });
      notification.success({ message: tr('新增开放功能成功') });
      yield put({ type: 'findOpenList' });
      yield put({ type: 'closeOpenModal' });
    },
    *removeOpen({ payload, callback }, { call, put }) {
      yield call(removeOpenAPI, { data: payload });
      callback()
      notification.success({ message: tr('删除开放功能成功') });
      yield put({
        type: 'save',
        payload: {
          selectedOpenRowKeys: [],
          selectedOpenRows: []
        }
      })
      yield put({ type: 'findOpenList' });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    closeModal(state) {
      return {
        ...state,
        serviceVisible: false
      }
    },
    closeCustomerModal(state) {
      return {
        ...state,
        customerVisible: false
      }
    },
    closeOpenModal(state) {
      return {
        ...state,
        openVisible: false
      }
    },
  }
}
