import { getUserByUserLoginNameApi } from '@/services/user';

export default {
  namespace: 'accountSettings',
  state: {
    currentUser: {},
    selectKey: '',
    mode:'inline'
  },

  effects: {
    // 获取当前用户信息
    *getCurrentUser({ payload }, { call, put, select }) {
      try {
        const currentUser = yield call(getUserByUserLoginNameApi)
        yield put({
          type: 'save',
          payload: { currentUser }
        })
      } catch (error) {
        console.log(error)
      }
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
