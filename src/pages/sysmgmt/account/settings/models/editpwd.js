import { resetPwdApi } from '../service';

import { notification } from 'antd';

export default {
  namespace: 'accountSettingsEditPwd',
  state: {
    loading: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  },

  effects: {
    // 重置密码
    *resetPwd({ payload }, { call, put }) {
      try {
        let ret = yield call(resetPwdApi, payload.params);
        yield put({
          type: 'setBtnLoadingReducer',
          payload: {
            loading: false,
            oldPassword: '',
            newPassword: '',
            confirmPassword: '',
          },
        });
        notification.success({
          message: tr('密码修改成功'),
        });
      } catch (e) {
        console.error(e);
        yield put({
          type: 'setBtnLoadingReducer',
          payload: {
            loading: false,
            ...payload.params,
          },
        });
      }
    },
  },
  reducers: {
    // 打开保存loading标志
    setBtnLoadingReducer(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
