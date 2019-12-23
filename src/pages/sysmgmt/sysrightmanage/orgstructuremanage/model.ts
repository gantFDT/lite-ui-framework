import {
  fetchApi, findApi, createApi, removeApi, updateApi, moveApi,
  userFetchApi, userCreateApi, userUpdateApi, userRemoveApi,
  userRelatesApi,
} from './service';
import _ from 'lodash'
import { Model } from 'dva'
import { formatTreeData } from '@/utils/utils';
import { updateOrganizationCacheByCreate } from '@/utils/organization';
import { updateUserCache } from '@/utils/user';

export interface ModelProps {
  dataSource: object[];
  userList: object[],
  userTotalCount: number
}

const initParams = {
  pageInfo: {
    beginIndex: 0,
    pageSize: 50
  },
  filterInfo: {}
}

const reduxModel: Model = {
  namespace: 'orgStructureManage',
  state: {
    treeOrganizations: [],
    excludeDataSource: [],
    orgListParams: initParams,
    orgListTotalCount: 0,

    userList: [],
    userTotalCount: 0,
    userParams: initParams
  },
  effects: {
    //获取所有组织信息(树形)
    *fetchTreeOrg(action, { call, put, select }) {
      const { orgListParams } = yield select((state: any) => state.orgStructureManage);
      const newsParams = { ...orgListParams, filterInfo: { keyWork: '' } };
      const res = yield call(fetchApi);
      formatTreeData(res, 'children', { title: 'orgName' });
      yield put({
        type: 'save',
        payload: {
          treeOrganizations: res,
          orgListParams: newsParams
        }
      });
    },
    //获取筛选后的组织信息(扁平化)
    *fetchByKeyWork({ payload }, { call, put, select }) {
      try {
        const { orgListParams } = yield select((state: any) => state.orgStructureManage);
        const newsParams = { ...orgListParams, ...payload };
        yield put({ type: 'save', payload: { orgListParams: newsParams } })
        let res = yield call(findApi, newsParams);
        let excludeDataSource = res.content || [];
        formatTreeData(excludeDataSource, 'children', {});
        yield put({
          type: 'save',
          payload: {
            excludeDataSource,
            orgListTotalCount: res.totalCount
          },
        });
      } catch (err) { console.log(err) }
    },
    //新建组织
    *createOrg({ payload, callback }, { call, put }) {
      try {
        const res = yield call(createApi, payload);
        callback && callback();
        yield put({ type: 'fetchTreeOrg' });
        updateOrganizationCacheByCreate(res);
      } catch (err) { console.log(err) }
    },
    //修改组织信息
    *updateOrg({ payload, callback }, { call, put }) {
      try {
        const res = yield call(updateApi, payload);
        callback && callback(res);
        yield put({ type: 'fetchTreeOrg' });
        const finished = yield put({ type: 'organization/fetchOrg' })
        if (finished) {
          yield put({ type: 'save', payload: { userList: [] } })
          yield put({ type: 'fetchUserList' });
        }
      } catch (err) {
        console.log(err)
      }
    },
    //删除组织
    *removeOrg({ payload, callback }, { call, put }) {
      try {
        yield call(removeApi, payload);
        callback && callback();
        yield put({ type: 'fetchTreeOrg' });
      } catch (err) {
        console.log(err)
      }
    },
    //移动组织
    *moveOrg({ payload, callback }, { call, put }) {
      try {
        yield call(moveApi, payload);
        callback && callback();
        yield put({ type: 'fetchTreeOrg' });
        const finished = yield put({ type: 'organization/fetchOrg' })
        if (finished) {
          yield put({ type: 'save', payload: { userList: [] } })
          yield put({ type: 'fetchUserList' });
        }
      } catch (err) {
        console.log(err)
      }
    },
    //获取组织机构用户
    *fetchUserList({ payload }, { call, put, select }) {
      try {
        const { userParams } = yield select((state: any) => state.orgStructureManage);
        const newsParams = { ...userParams, ...payload };
        yield put({ type: 'save', payload: { userParams: newsParams } })
        const res = yield call(userFetchApi, newsParams);
        yield put({
          type: 'save',
          payload: {
            userList: res.content || [],
            userTotalCount: res.totalCount
          },
        });
      } catch (err) { console.log(err) }
    },
    *createUser({ payload, callback }, { call, put }) {
      try {
        const res = yield call(userCreateApi, payload);
        callback && callback();
        updateUserCache(res);
        yield put({ type: 'fetchUserList' });
      } catch (err) {
        console.log(err)
      }
    },
    *updateUser({ payload, callback }, { call, put }) {
      try {
        const res = yield call(userUpdateApi, payload);
        callback && callback(res);
        updateUserCache(res);
        yield put({ type: 'fetchUserList' });
      } catch (err) {
        console.log(err)
      }
    },
    *removeUser({ payload, callback }, { call, put }) {
      try {
        yield call(userRemoveApi, payload);
        callback && callback();
        yield put({ type: 'fetchUserList' });
      } catch (err) {
        console.log(err)
      }
    },
    *relateUsers({ payload, callback }, { call, put }) {
      try {
        yield call(userRelatesApi, payload);
        callback && callback();
        yield put({ type: 'fetchUserList' });
      } catch (err) {
        console.log(err)
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
    resetOrgInfo(state, { payload }) {
      return {
        ...state,
        excludeDataSource: [],
        orgListParams: initParams,
      }
    },
    resetUserlist(state, { payload }) {
      return {
        ...state,
        userList: [],
        userTotalCount: 0
      }
    }
  },
}

export default reduxModel