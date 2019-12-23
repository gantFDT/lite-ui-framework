import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getLockInfoApi, killResourceLockApi } from './service'

export interface LockInfo {
  name: string
  maxProcessCount: number | string
  keepTime: string
}

interface State {
  lockInfoList: LockInfo[] // 锁列表
  selectedNames: string[] // 选中的锁名称
}

const INIT_STATE: State = {
  lockInfoList: [],
  selectedNames: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'resourceLockManage',
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
    // 获取锁列表
    *getLockInfo(action, { put, call }) {
      let { lockInfoList, selectedNames } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getLockInfoApi)
        lockInfoList = res
      } catch (error) {
        console.log('getLockInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          lockInfoList,
          selectedNames
        }
      })
    },
    // 释放锁
    *killResourceLock(action, { put, call, select }) {
      let { selectedNames } = yield select((store: any) => store.resourceLockManage)
      try {
        yield call(killResourceLockApi, selectedNames)
        yield put({ type: 'resourceLockManage/getLockInfo' })
      } catch (error) {
        console.log('killResourceLock error\n', error)
      }
    }
  }
} as ModelType
