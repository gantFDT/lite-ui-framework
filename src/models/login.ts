import { notification } from 'antd'
import { stringify, parse } from 'qs';
import { getLocale } from 'umi/locale';

import { Model } from './connect'
import event from '@/utils/events'
import { getUserIdentity, getCookie, setCookie, delCookie } from '@/utils/utils'
import { accountLogin, accountLoginWithValidateCode, getDelegateInfo, delegateLogin, delegateLogout, checkToken, ssoLogin, getProductName } from '@/services/api'


const locale = getLocale()

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

const userIdentity: UserIdentity = getUserIdentity()



export interface LoginState extends UserIdentity {
  delegation: [],
  delegateMode: boolean,
  checkCookieRet: boolean,
}

interface Login extends Model {
  state: LoginState
}

const login: Login = {
  namespace: 'login',
  state: {
    delegation: [],//可代理账户列表
    delegateMode: false,
    checkCookieRet: false,
    ...userIdentity,
  },
  effects: {
    // 登录
    *login({ payload }, { call, put }) {
      const { userName, password, type, autoLogin } = payload;
      try {
        const response = yield call(accountLogin, {
          userLoginName: userName,
          password,
          usertype: undefined
        });
        const { token = '' } = response
        if (token) {
          const userIdentity: UserIdentity = {
            userToken: token,
            userLoginName: userName,
            userLanguage: locale === 'en-US' ? 'en' : locale, // 根据国际化替换
          }
          setCookie('userIdentity', JSON.stringify(userIdentity), 7 * 24 * 3600, '/')
          window.localStorage.setItem('username', userName)
          event.emit('setExtraHeader', userIdentity) // 通知request模块
          yield put({ // 缓存到redux
            type: 'setRequestHeader',
            payload: userIdentity
          })
        } else {
          notification.error({
            message: '用户名或密码错误'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    // 验证码登录
    *loginWithValidateCode({ payload }, { call, put }) {
      const { userName, password, validateCodeId, validateCode } = payload;
      try {
        const response = yield call(accountLoginWithValidateCode, {
          userLoginName: userName,
          password,
          validateCodeId,
          validateCode,
          type: null
        });
        const { token = '' } = response
        if (token) {
          const userIdentity = {
            userToken: token,
            userLoginName: userName,
            userLanguage: locale === 'en-US' ? 'en' : locale, // 根据国际化替换
          }
          setCookie('userIdentity', JSON.stringify(userIdentity), 7 * 24 * 3600, '/')
          window.localStorage.setItem('username', userName)
          event.emit('setExtraHeader', userIdentity) // 通知request模块
          yield put({ // 缓存到redux
            type: 'setRequestHeader',
            payload: userIdentity
          })
        } else {
          notification.error({
            message: '用户名或密码错误'
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    //获取可代理账户列表信息
    *fetchDelegateInfo({ payload }, { call, put }) {
      const response = yield call(getDelegateInfo, {});
      yield put({ // 缓存到redux
        type: 'save',
        payload: {
          delegation: response.delegation
        }
      })
    },
    *writeToCookie({ payload }, { call, put, select }) {
      const { userLoginName, userToken, delegateMode, delegateCertificateId, delegateUserLoginName } = payload;
      let userIdentity = {
        loginType: 'DEFAULT_LOGIN',
        userLoginName: userLoginName,
        userToken: userToken,
        locale,
        delegateMode,
        delegateCertificateId,
        delegateUserLoginName
      }

      setCookie('userIdentity', JSON.stringify(userIdentity), 7 * 24 * 3600, '/')
    },
    //切换用户代理
    *delegateLogin({ payload }, { call, put, select }) {
      const { delegateCertificateId, ownerUserLoginName } = payload;
      const { userLoginName } = yield select(state => state.login);
      const delegateMode = true
      const response = yield call(delegateLogin, {
        ...payload
      });

      if (response) {
        const token = response.token
        yield put({
          type: 'writeToCookie',
          payload: {
            delegateMode,
            userLoginName: ownerUserLoginName,
            userToken: token,
            delegateCertificateId,
            delegateUserLoginName: userLoginName
          }
        })
        window.location.reload()
      }
    },
    //退出用户代理
    *delegateLogout({ payload }, { call, put, select }) {
      const { delegateCertificateId, delegateUserLoginName } = yield select(state => state.login);
      const delegateMode = false
      const response = yield call(delegateLogout, {
        delegateCertificateId
      });
      if (response) {
        const token = response.token
        yield put({
          type: 'writeToCookie',
          payload: {
            delegateMode,
            userLoginName: delegateUserLoginName,
            userToken: token,
            delegateCertificateId: undefined,
            delegateUserLoginName: undefined
          }
        })
        window.location.reload()
      }
    },
    // 退出
    *logout(_, { put }) {
      delCookie('userIdentity')
      window.location.reload()
    },
  },
  reducers: {
    save(state, { payload }) {
      return { ...state, ...payload }
    },
    setRequestHeader(state, { payload }) {
      return { ...state, ...payload }
    }
  },
};
export default login;
