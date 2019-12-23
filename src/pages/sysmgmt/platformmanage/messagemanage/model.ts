import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getMessageInfoApi } from './service'

export interface MessageInfo {
  topic: string
  className: string
}

export interface CustomMessageInfo {
  name: string
  children: CustomMessageInfo[]
}

interface State {
  messageInfoList: MessageInfo[],
  customMsgList: CustomMessageInfo[]
}

const INIT_STATE: State = {
  messageInfoList: [],
  customMsgList: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'messageManage',
  state: {
    ...INIT_STATE
  },
  reducers: {
    updateState(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    clear() {
      return {
        ...deepCopy4JSON(INIT_STATE)
      }
    }
  },
  effects: {
    // 获取消息列表
    *getMessageInfo(action, { put, call }) {
      let { messageInfoList, customMsgList } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getMessageInfoApi)
        messageInfoList = res
        customMsgList = res.map(item => {
          return {
            name: `${tr('主题：')}${item.topic}`,
            children: [{
              name: item.className
            }]
          }
        })
      } catch (error) {
        console.log('getMessageInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          messageInfoList,
          customMsgList
        }
      })
    },
  }
} as ModelType
