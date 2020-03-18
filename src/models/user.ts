import { Model } from './connect'

import { query as queryUsers, getUserByUserLoginNameApi, findPermission } from '@/services/user';
import { getUserIdentity, getImageById } from '@/utils/utils';

const initialState = {
  currentUser: {},
} as UserState

export interface UserState {
  currentUser: {
    avatar: string,
    isSuperAdmin: boolean,
    id: string,
    userLoginName: string,
  }
}

interface User extends Model {
  state: UserState
}

const UserModel: User = {
  namespace: 'user',
  state: initialState,
  effects: {
    *fetch(_, { call, put }) {
      const response = yield call(queryUsers);
      yield put({
        type: 'save',
        payload: response,
      });
    },
    *findPermission(_, { call, put }) {
      const permission = yield call(findPermission)
      yield put({
        type: 'save',
        payload: {
          permission
        }
      })
    },
    *fetchCurrent(_, { call, put }) {
      const { userLoginName } = getUserIdentity();
      // const userloginname = window.localStorage.getItem('username')
      let user = yield call(getUserByUserLoginNameApi, { userLoginName });
      user.isSuperAdmin = user.id === -1;
      yield put({
        type: 'save',
        payload: { currentUser: user },
      });
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },

    changeNotifyCount(
      state = {
        currentUser: {},
      },
      action,
    ) {
      return {
        ...state,
        currentUser: {
          ...state.currentUser,
          notifyCount: action.payload.totalCount,
          unreadCount: action.payload.unreadCount,
        },
      };
    },
  },
};
export default UserModel;
