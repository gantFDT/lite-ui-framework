import { Reducer } from 'redux'
import { Model } from 'dva'
import { delay } from 'dva/saga'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getCurrentTargetDataSourceApi, getLoggersInfoApi, changeCurrentTargetDataSourceApi, setLoggerLevelApi, setAppenderFilterLevelApi } from './service'
import { EditStatus } from 'gantd'

// 日志级别列表
export const LEVELS = ['ALL', 'TRACE', 'DEBUG', 'INFO', 'WARN', 'ERROR', 'OFF']

// 当前日志级别类型
export type CurrentLog = 'ORIGINAL' | 'DEBUG' | undefined

// 日志等级类型
export type LevelType = 'ALL' | 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'OFF'

// 日志输出器
export interface Appender {
  name: string
  appender: string
  filterLevel: LevelType
}

// 日志级别信息
export interface Level {
  name: string
  level: LevelType
}

// 日志级别和输出器信息
export interface LoggersInfo {
  appenders: Appender[]
  levels: Level[]
}

interface State {
  currentLog: CurrentLog
  loggersInfo: LoggersInfo
  tableEditStatus: EditStatus
}

const INIT_STATE: State = {
  currentLog: undefined,
  loggersInfo: {
    appenders: [],
    levels: []
  },
  tableEditStatus: EditStatus.EDIT
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'logLevelManage',
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
    // 获取当前日志级别
    *getCurrentTargetDataSource(action, { put, call }) {
      let { currentLog } = deepCopy4JSON(INIT_STATE)
      try {
        let res: CurrentLog = yield call(getCurrentTargetDataSourceApi)
        currentLog = res
      } catch (error) {
        console.log('getCurrentTargetDataSource error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          currentLog
        }
      })
    },
    // 获取日志级别列表信息
    *getLoggersInfo(action, { put, call }) {
      let { loggersInfo } = deepCopy4JSON(INIT_STATE)
      try {
        let res: LoggersInfo = yield call(getLoggersInfoApi)
        loggersInfo = res
      } catch (error) {
        console.log('getLoggersInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          loggersInfo
        }
      })
      yield call(delay, 50)
      yield put({
        type: 'updateState',
        payload: {
          tableEditStatus: EditStatus.SAVE
        }
      })
      yield call(delay, 50)
      yield put({
        type: 'updateState',
        payload: {
          tableEditStatus: EditStatus.EDIT
        }
      })
    },
    // 修改当前日志级别
    *changeCurrentTargetDataSource(action, { put, call }) {
      const { payload: { currentLog } } = action
      try {
        let res: CurrentLog = yield call(changeCurrentTargetDataSourceApi, currentLog)
        yield put({
          type: 'updateState',
          payload: {
            currentLog: res
          }
        })
      } catch (error) {
        console.log('changeCurrentTargetDataSource error\n', error)
      }
    },
    // 添加或更新日志级别信息
    *setLoggerLevel(action, { put, call }) {
      const { payload: { level, type, hideModal, callback } } = action
      try {
        yield call(setLoggerLevelApi, level, type)
        hideModal && hideModal()
        callback && callback()
        yield put({ type: 'getLoggersInfo' })
      } catch (error) {
        console.log('setLoggerLevel error\n', error)
      }
    },
    // 更新日志输出器信息
    *setAppenderFilterLevel(action, { put, call, select }) {
      const { payload: { appender }, callback } = action
      try {
        yield call(setAppenderFilterLevelApi, appender)
        callback && callback();
        yield put({ type: 'getLoggersInfo' })
      } catch (error) {
        console.log('setAppenderFilterLevel error\n', error)
      }
    }
  }
} as ModelType
