import {
  editUserInfoApi,
} from '../service';

export default {
  namespace: 'accountSettingsPersonal',

  state: {
    loading: false,
    visible: false,
    editable: false, //编辑按钮的编辑状态
    userInfo: {
      mobile: '',
      telephone: '',
      fax: '',
      employeeName: '',
    },
    loadingAvatarUrl: false,
    avatarModalvisible: false, //头像弹窗状态
    showSaveBtn: false,
  },

  effects: {

    // 保存用户信息
    *saveUserInfo({ payload }, { call, put }) {
      yield call(
        editUserInfoApi,
        {
          ...payload.params,
        },
        {
          showSuccess: true,
          successMessage: tr('保存基本信息成功'),
        }
      );
      yield put({
        type: 'saveUserInfoReducer',
        payload: {
          newUserInfo:{
            ...payload.params
          },
        },
      });

      return {...payload.params};
    }
  },
  reducers: {
    // 设置用户信息
    setUserInfoReducer(state, action) {
      return {
        ...state,
        userInfo: action.payload.userInfo,
        editable: true,
        avatarUrl: action.payload.avatarUrl,
      };
    },

    //保存数据
    saveUserInfoReducer(state, action) {
      return {
        ...state,
        userInfo: action.payload.newUserInfo,
        loading: false,
        visible: false,
      };
    },

    // 打开保存loading标志
    setBtnLoadingReducer(state, action) {
      return {
        ...state,
        loading: true,
      };
    },

    //更换头像
    updateAvatarUrlReducer(state, action) {
      return {
        ...state,
        avatarUrl: action.payload.newAvatarUrl,
        loadingAvatarUrl: false,
      };
    },

    //打开跟换头像loading标志
    openUpdateAvatarUrlReducer(state, action) {
      return {
        ...state,
        loadingAvatarUrl: true,
      };
    },

    changeAvatarModalStatusReducer(state, action) {
      return {
        ...state,
        avatarModalvisible: action.payload,
      };
    },

    changeSaveBtnStatusReducer(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
