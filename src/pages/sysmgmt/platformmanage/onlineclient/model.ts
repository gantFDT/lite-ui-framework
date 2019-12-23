import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getOnlineClientApi } from './service'

export interface OnlineClientInfo {
  id: string
  lastActivityTime: string
  userLoginName: string
  userName: string
  user: any
}

interface State {
  onlineClientInfoList: OnlineClientInfo[] // 在线连接列表
}

const INIT_STATE: State = {
  onlineClientInfoList: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'onlinemanage',
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
    // 获取在线连接列表
    *getOnlineClient(action, { put, call, select }) {
      let { onlineClientInfoList } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getOnlineClientApi)
        onlineClientInfoList = res
        let { users, listUsers } = yield select((store: any) => store.organization)
        onlineClientInfoList.map(item => {
          const { userLoginName } = item
          let tempUser = listUsers.filter((listUserItem: any) => userLoginName === listUserItem.userLoginName)[0]
          item.user = users[tempUser.id]
        })
      } catch (error) {
        console.log('getOnlineClient error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          onlineClientInfoList
        }
      })
    }
  }
} as ModelType
