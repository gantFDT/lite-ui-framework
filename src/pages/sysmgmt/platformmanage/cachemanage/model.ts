import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getCacheInfoApi, clearCacheApi } from './service'

export interface CacheInfo {
  initClass: string
  local: boolean
  name: string
  size: false
}

interface State {
  cacheInfoList: CacheInfo[] // 缓存列表
  selectedNames: string[] // 选中的缓存名称
}

const INIT_STATE: State = {
  cacheInfoList: [],
  selectedNames: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'cacheManage',
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
    // 获取缓存列表
    *getCacheInfo(action, { put, call }) {
      let { cacheInfoList, selectedNames } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getCacheInfoApi)
        cacheInfoList = res
      } catch (error) {
        console.log('getCacheInfoApi error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          cacheInfoList,
          selectedNames
        }
      })
    },
    // 清除缓存
    *clearCache(action, { put, call, select }) {
      let { selectedNames } = yield select((store: any) => store.cacheManage)
      try {
        yield call(clearCacheApi, selectedNames)
        yield put({ type: 'getCacheInfo' })
      } catch (error) {
        console.log('clearCacheApi error\n', error)
      }
    }
  }
} as ModelType
