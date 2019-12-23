import {
  getCodeTypeApi, createCodeTypeApi,
  deteleCodeTypeApi, syncAllCodeTypeApi,
  editCodeTypeApi, getSelectedListApi,
  codeBatchSaveApi
} from './service';

export default {
  namespace: 'codelist',
  state: {
    params: {
      beginIndex: 0,
      pageSize: 20,
      category: "ALL"
    },
    selectedRowKeys: [],
    selectedRows: [],
    data: [],
    total: 0,
    visible: false,
    formType: "new",
    editValue: {},
    selectData: [],
    editSelectData: [],
    codeselectedRowKeys: [],
    codeselectedRows: [],
    selectVisible: false,
    selectFormType: "new",
    selectEditValue: {},
    editting: false
  },
  effects: {
    *getCodeType({ payload }, { call, put, select }) {
      const { params } = yield select(state => state['codelist']);
      const { pageSize, beginIndex } = params;
      const newsParams = { pageSize, beginIndex, ...payload };
      yield put({
        type: 'save', payload: {
          params: newsParams
        }
      })
      const { content, totalCount } = yield call(getCodeTypeApi, newsParams);
      yield put({ type: "initState" })
      yield put({
        type: 'save',
        payload: {
          data: content,
          total: totalCount,
        },
      });
    },
    *createCodeType({ payload }, { call, put }) {
      yield call(createCodeTypeApi, payload)
      yield put({ type: "getCodeType" })

    },
    *editCodeType({ payload }, { call, put }) {
      yield call(editCodeTypeApi, payload)
      yield put({ type: "getCodeType" })
    },
    *deteleCodeType(_, { call, put, select }) {
      const { selectedRowKeys } = yield select(state => state.codelist);
      const id = selectedRowKeys[0];
      yield call(deteleCodeTypeApi, { id });
      yield put({ type: "getCodeType" })
    },
    *syncAllCodeType(_, { call, put }) {
      yield call(syncAllCodeTypeApi)
      yield put({ type: "getCodeType" })
    },
    *selectCodeList({ payload }, { call, put }) {
      const { selectedRowKeys, selectedRows } = payload;
      yield put({
        type: "save", payload: {
          selectedRowKeys,
          selectedRows,
          selectData: [],
          editSelectData: [],
        }
      })
      yield put({
        type: "getSelectedList", payload: selectedRows[0].type
      })
    },
    *getSelectedList({ payload }, { call, put }) {
      const { content, totalCount } = yield call(getSelectedListApi, { type: payload })
      yield put({
        type: "save", payload: {
          selectData: content,
          editSelectData: content,
          codeselectedRowKeys: [],
          codeselectedRows: [],
        }
      })
    },
    *codeBatchSave({ payload }, { call, put }) {
      yield call(codeBatchSaveApi, payload.data);
      yield put({
        type: "getSelectedList", payload: payload.type
      })
      return true;
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    initState(state, { payload }) {
      return {
        ...state,
        codeselectedRowKeys: [],
        codeselectedRows: [],
        selectedRowKeys: [],
        selectedRows: [],
        visible: false,
        formType: "new",
        editValue: {},
        selectData: [],
        editSelectData: [],
      }
    }
  },
};
