import { Reducer } from 'redux'
import { Model } from 'dva'
import updateIP2AdminPasswordApi from './service'

export interface Password {
  oldPassword: string
  newPassword: string
  confirmPassword: string
}

interface State extends Password {
}

const INIT_STATE: State = {
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'superPwdManage',
  state: {
    ...INIT_STATE
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    }
  },
  effects: {
    // 更新密码
    *updateIP2AdminPassword(action, { put, call }) {
      const { payload: { params: { oldPassword, newPassword, confirmPassword } } } = action
      try {
        yield call(updateIP2AdminPasswordApi, { oldPassword, newPassword, confirmPassword })
        yield put({
          type: 'updateState',
          payload: { ...INIT_STATE }
        })
      } catch (error) {
        console.error('updateIP2AdminPassword error\n', error)
        yield put({
          type: 'updateState',
          payload: { oldPassword, newPassword, confirmPassword }
        })
      }
    }
  }
} as ModelType
