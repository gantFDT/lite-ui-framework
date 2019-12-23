import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getEventClassesApi, getClassEventsApi, getEventListnersApi } from './service'

export interface EventClass {
  beanName: string
  className: string
}

export interface BaseClassEvent {
  afterArgs: string[]
  beforeArgs: string[]
  eventName: string
}

export interface ClassEvent extends BaseClassEvent {
  description: string
}

export interface EventListner {
  after: boolean
  description: string
  enabled: boolean
  listenerName: string
  order: number
}


interface State {
  eventClasses: EventClass[] // 事件对象列表
  classEvents: ClassEvent[] //发起事件列表
  eventListners: EventListner[] // 事件监听列表
  selectedEventClassKeys: string[] // 选中的事件对象beanName列表
  selectedClassEventKeys: string[] // 选中发起事件对应的eventName列表
}

const INIT_STATE: State = {
  eventClasses: [],
  classEvents: [],
  eventListners: [],
  selectedEventClassKeys: [],
  selectedClassEventKeys: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'eventManage',
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
    // 获取事件对象列表
    *getEventClasses(action, { put, call }) {
      let { eventClasses, classEvents, eventListners, selectedClassEventKeys, selectedEventClassKeys } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getEventClassesApi)
        eventClasses = res
      } catch (error) {
        console.log('getIconList error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          eventClasses,
          classEvents,
          eventListners,
          selectedClassEventKeys,
          selectedEventClassKeys
        }
      })
    },
    // 获取发起事件列表
    *getClassEvents({ payload: { beanName } }, { put, call, select }) {
      const { eventClasses } = yield select((store: any) => store.eventManage)
      let { classEvents, eventListners, selectedClassEventKeys } = deepCopy4JSON(INIT_STATE)
      try {
        let selectedEventClass = eventClasses.filter((item: any) => item.beanName === beanName)[0]
        yield put({ type: 'updateState', payload: { selectedEventClassKeys: [beanName] } })
        let res: any[] = yield call(getClassEventsApi, selectedEventClass)
        classEvents = res
      } catch (error) {
        console.log('getClassEvents error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          classEvents,
          eventListners,
          selectedClassEventKeys
        }
      })
    },
    // 获取事件监听列表
    *getEventListners({ payload: { eventName } }, { put, call, select }) {
      const { classEvents } = yield select((store: any) => store.eventManage)
      let { eventListners } = deepCopy4JSON(INIT_STATE)
      try {
        let selectedClassEvent = classEvents.filter((item: any) => item.eventName === eventName)[0]
        yield put({ type: 'updateState', payload: { selectedClassEventKeys: [eventName] } })
        let res: any[] = yield call(getEventListnersApi, selectedClassEvent)
        eventListners = res
      } catch (error) {
        console.log('getEventListners error\n', error)
      }
      yield put({ type: 'updateState', payload: { eventListners } })
    }
  }
} as ModelType
