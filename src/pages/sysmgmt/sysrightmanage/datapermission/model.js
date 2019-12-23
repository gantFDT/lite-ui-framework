import { getAllDomains, getDataAcls, getDomainActions, getDomainFilters, saveDataAcls, refreshDataSecurity, exportDataAcls, importDataAcls, getDomainTargets } from './service';

export default {
  namespace: 'datapermission',
  state: {
    params: {
      pageInfo: {
        beginIndex: 0,
        pageSize: 50
      }
    },
    allDomains: [],
    dataAcls: [],
    activeDataAcl: {},
    filters: [],
    activeFilter: {},
    domainFilters: [],
    domainTargets: [],
    actions: [],
    actionData: [],
    selectedFiltersRowKeys: [],
    modalVisible: false,
    modalTargetVisible: false,
    modalFilterVisible: false,

    registerTarget: [],
    registerDomain: [],
    registerAction: [],
    registerFilter: [],
  },
  effects: {
    *getAllDomains({ payload }, { call, put, select }) {
      const { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);

      const res = yield call(getAllDomains);
      const domain = _.filter(registerDomain, function (o) {
        return _.includes(res, o.code)
      });
      yield put({
        type: 'save',
        payload: {
          allDomains: domain,
          registerTarget, registerDomain, registerAction, registerFilter,
        },
      });
    },
    *getDataAcls({ payload }, { call, put, select }) {
      const { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);
      const { domainCode } = payload;
      const res = yield call(getDataAcls, {
        domainCode
      });

      if (res) {
        yield put({
          type: 'save',
          payload: {
            dataAcls: res
          },
        });
      }

    },
    *getDomainActions({ payload }, { call, put, select }) {
      const { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);
      const { domainCode } = payload;

      const res = yield call(getDomainActions, {
        domainCode
      });
      const action = _.filter(registerAction, function (o) {
        return _.includes(res, o.code)
      });
      yield put({
        type: 'save',
        payload: {
          actions: action
        },
      });
    },
    *getDomainFilters({ payload }, { call, put, select }) {
      let { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);
      const { domainCode } = payload;
      const res = yield call(getDomainFilters, {
        domainCode
      });
      registerFilter = _.unionWith(registerFilter, function (a, b) { return a.code == b.code })
      const domainFilters = _.filter(registerFilter, function (o) {
        return _.includes(res, o.code)
      });
      yield put({
        type: 'save',
        payload: {
          domainFilters
        },
      });
    },
    *getDomainTargets({ payload }, { call, put, select }) {
      let { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);
      const { domainCode } = payload;
      const res = yield call(getDomainTargets, {
        domainCode
      });
      registerTarget = _.unionWith(registerTarget, function (a, b) { return a.code == b.code })
      const domainTargets = _.filter(registerTarget, function (o) {
        return _.includes(res, o.code)
      });
      yield put({
        type: 'save',
        payload: {
          domainTargets
        },
      });
    },
    *saveDataAcls({ payload, cb }, { call, put, select }) {
      let { registerTarget, registerDomain, registerAction, registerFilter } = yield select(state => state['config']['DATA_ACL_CONFIG']);
      const { dataAcls, domainCode } = payload;
      const res = yield call(saveDataAcls, {
        dataAcls,
        domainCode
      });
      if (res) {
        yield put({
          type: 'save',
          payload: {
            activeDataAcl: {},
            activeFilter: {},
            modalVisible: false
          }
        });
        yield put({
          type: 'getDataAcls',
          payload: {
            domainCode
          }
        });
        cb();
      }
    },
    *refreshDataSecurity({ payload }, { call, put, select }) {
      const { domainCode } = payload;
      const res = yield call(refreshDataSecurity, {
        domainCode
      });
      if (res) {
        yield put({
          type: 'getDataAcls',
          payload: {
            domainCode
          }
        });
      }
    },
    *exportDataAcls({ payload }, { call, put, select }) {
      const res = yield call(exportDataAcls, {
        ...payload
      });
    },
    *importDataAcls({ payload,callback }, { call, put, select }) {
      const { domainCode } = payload
      const res = yield call(importDataAcls, {
        ...payload
      });
      yield put({
        type: 'getDataAcls',
        payload: {
          domainCode
        }
      })
      callback && callback()
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
};
