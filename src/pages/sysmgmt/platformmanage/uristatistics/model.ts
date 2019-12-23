import { findUriStatisticsApi } from './service'
import _ from 'lodash'
import { Model } from 'dva'

export interface ModelProps {
  daysFilterInfo: Object
  dayFilterInfo: Object
  daysDataSource: Object[]
  dayDataSource: Object[]
}

export const pageKey = 'uriStatistics'

const reduxModel: Model = {
  namespace: pageKey,
  state: {
    daysFilterInfo: {},
    dayFilterInfo: {},
    daysDataSource: [],
    dayDataSource: [],
  },
  effects: {
    *fetchDays({ payload }, { call, put, select }) {
      const { daysFilterInfo } = yield select((state: Object) => state[pageKey])
      const newsParams = { ...daysFilterInfo, ...payload }
      const daysDataSource = yield call(findUriStatisticsApi, newsParams, 'days')
      yield put({
        type: 'save',
        payload: { daysDataSource, daysFilterInfo: newsParams }
      })
    },
    *fetchDay({ payload }, { call, put, select }) {
      const { dayFilterInfo } = yield select((state: Object) => state[pageKey])
      const newsParams = { ...dayFilterInfo, ...payload }
      const dayDataSource = yield call(findUriStatisticsApi, newsParams, 'day')

      yield put({
        type: 'save',
        payload: { dayDataSource, dayFilterInfo: newsParams }
      })
    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
  },
}

export default reduxModel
