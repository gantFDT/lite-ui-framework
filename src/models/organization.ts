import {
  getAllOrgAPI,
  getAllUserAPI,
  listRoleAPI,
  getAllUserGroupAPI,
} from '@/services/organization';
import { getImageById, initParams } from '@/utils/utils'
import { setOrganization, getOrganizationInfo } from '@/utils/organization'
import { setUser, setUserExtra } from '@/utils/user'
import { setRole } from '@/utils/role'
import { setUserGroup } from '@/utils/usergroup'
import { Model } from './connect'


interface Param {
  filterInfo: {
    filterModel: boolean,
    [prop: string]: any
  },
  pageInfo: PageInfo
}

interface Org {
  id: string,
}

interface User {
  id: number,
  orgInfo: {
    orgName: string
  },
  organizationId: string,
  orgName: string,
  pictureId: string,
  avatarUrl: string,
  userLoginName: string,
}

interface Role {
  id: string
}
interface UserGroup {
  id: string
}


export const formatParamsUserRole: (obj: { page: number, pageSize: number, [p: string]: any }) => Param = ({ page, pageSize, ...restParams } = {} as any) => {
  return {
    filterInfo: {
      filterModel: true,
      ...restParams
    },
    pageInfo: {
      pageSize,
      beginIndex: (page - 1) * pageSize
    }
  };
}

const initialState = {
  organizations: {},
  users: {},
  userGroups: {},
  roles: {},

  listOrganizations: [],
  listUsers: [],
  listUserGroups: [],
  listRoles: [],
}

export type OrganizationState = Readonly<typeof initialState>

interface Organization extends Model {
  state: OrganizationState
}

const OrganizationModel: Organization = {
  namespace: 'organization',
  state: initialState,
  effects: {
    *fetchAllOrg(action, { put }) {
      yield put({ type: 'fetchOrg' });
      yield put({ type: 'fetchAllUser' });
      yield put({ type: 'fetchAllRole' });
      yield put({ type: 'fetchAllUserGroup' });
    },
    //获取所有组织信息(平铺)
    *fetchOrg(action, { call, put }) {
      try {
        const response = yield call(getAllOrgAPI);
        yield put({
          type: 'save',
          payload: { listOrganizations: response },
        });
        let organizations = response.reduce((merged: object, cur: Org) => {
          setOrganization({
            id: cur.id,
            data: cur
          }) // 缓存到utils 以便脱离modle使用
          return Object.assign(merged, { [cur.id]: cur });
        }, {});
        yield put({
          type: 'save',
          payload: { organizations },
        });
        return true;
      } catch (err) {
        console.error(err)
        return false;
      }
    },
    *fetchAllUser(_, { call, put }) {
      const response = yield call(getAllUserAPI);
      yield put({
        type: 'save',
        payload: { listUsers: response }
      })
      let users = response.reduce((merged: object, cur: User) => {
        // 将组织用户的所属组织信息关联起来
        // cur.orgInfo = getOrganizationInfo(cur.organizationId);
        // cur.orgName = cur.orgInfo.orgName;
        // cur.avatarUrl = getImageById(cur.pictureId);
        setUserExtra({
          userLoginName: cur.userLoginName,
          data: cur
        })
        setUser({
          id: cur.id,
          data: cur
        }) // 缓存到utils 以便脱离modle使用
        return Object.assign(merged, { [cur.id]: cur })
      }, {});
      yield put({
        type: 'save',
        payload: { users },
      });
    },
    *fetchAllRole(action, { call, put, select }) {
      const params = { page: 1, pageSize: 500 };
      const newsParams = Object.assign({}, initParams, formatParamsUserRole(params));
      const response = yield call(listRoleAPI, { data: newsParams });
      yield put({
        type: 'save',
        payload: { listRoles: response.content }
      })
      let roles = response.content.reduce((merged: object, cur: Role) => {
        setRole({
          id: cur.id,
          data: cur
        }) // 缓存到utils 以便脱离modle使用
        return Object.assign(merged, { [cur.id]: cur })
      }, {});
      yield put({
        type: 'save',
        payload: {
          roles: response.content,
        },
      });
    },
    *fetchAllUserGroup(action, { call, put }) {
      const response = yield call(getAllUserGroupAPI);
      yield put({
        type: 'save',
        payload: { listUserGroups: response },
      });
      let userGroups = response.reduce((merged: object, cur: UserGroup) => {
        setUserGroup({
          id: cur.id,
          data: cur
        }) // 缓存到utils 以便脱离modle使用
        return Object.assign(merged, { [cur.id]: cur });
      }, {});
      yield put({
        type: 'save',
        payload: { userGroups },
      });
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    mergeUser(state, { payload }) {
      setUser({
        id: payload.id,
        data: payload
      })
      setUserExtra({
        userLoginName: payload.userLoginName,
        data: payload
      })
      return {
        ...state,
        users: {
          ...state.users,
          [payload.id]: payload
        }
      };
    },
  },
};

export default OrganizationModel;