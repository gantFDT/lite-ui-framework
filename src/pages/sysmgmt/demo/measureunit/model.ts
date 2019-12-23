import { findUnit, createUnit,removeUnit,updateUnit } from './service';
import { generateTree } from '@/utils/utils'
import { notification } from 'antd'
import { tr } from '@/components/common';

export default {
  namespace: 'sysmgmtDemoMeasureunit',
  state: {
    params: {

    },
    flatData:[],
    data: [],
    modalOperationVisible: false,
    modalNormalVisible: false

  },
  effects: {
    *fetch({ payload }, { call, put, select }) {
      const { params } = yield select(state => state['sysmgmtDemoMeasureunit']);
      const newsParams = { ...params, ...payload };
      let flatData = yield call(findUnit, newsParams);
      let data = generateTree(flatData, undefined);
      if (_.isEmpty(data)) { data = flatData }
      yield put({
        type: 'save',
        payload: {
          data,
          flatData,
          params: newsParams
        },
      });
    },
    *reload({ payload }, { call, put, select }) {
      const { params } = yield select(state => state['sysmgmtDemoMeasureunit']);
      const newsParams = { ...params, ...payload };
      let flatData = yield call(findUnit, newsParams);
      let data = generateTree(flatData, undefined);
      if (_.isEmpty(data)) { data = flatData }
      yield put({
        type: 'save',
        payload: {
          data,
          flatData,
          params: newsParams
        },
      });
    },
    *create({ payload }, { call, put, select }) {
      let res = yield call(createUnit, payload);
      if (res == tr('添加失败: 创建计量单位失败')) {//无奈之举，后端返回数据不规范
        notification.warning({
          message: tr('添加失败'),
          description: tr('创建计量单位失败'),
        });
        return
      }
      if (res) {
        yield put({
          type: 'fetch',
        });
        yield put({
          type: 'save',
          payload: {
            modalOperationVisible: false,
            modalNormalVisible: false
          },
        });
      }
    },
    *remove({ payload }, { call, put, select }) {
      let res = yield call(removeUnit, payload);
      if (res) {
        yield put({
          type: 'fetch',
        });
      }
    },
    *update({ payload }, { call, put, select }) {
      payload={
        units:payload
      }
      let res = yield call(updateUnit, payload);
      if (res) {
        yield put({
          type: 'fetch',
        });
      }
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
}