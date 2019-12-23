

import {
  findMarkDateApi,
  setMarkDateApi,
  unsetMarkDateApi,
  calculateDaysApi
} from './service'

const formatParams = ({ page = 1, pageSize = 20, ...restParams } = {}) => ({
  pageInfo: {
    pageSize,
    beginIndex: (page - 1) * pageSize
  },
  ...restParams
})

const formatYear = () => {
  const date = new Date();
  const year = date.getFullYear();
  return year
}

export default {
  namespace: 'calendarmanage',
  state: {
    params: formatParams(),
    markData: [],
    visible: false,
    cellType: '',
    cellValue: '',
    markType: '',
    currentYear: formatYear(),
    calcVisible:false,
    calretVisible:false,
    calculateDays: {},
    calStartDate: '',
    calEndDate: ''
  },
  effects: {
    *getMarkDate({ payload }, { call, put, select }) {
      const { params } = yield select(state => state['calendarmanage'])
      const newParams = Object.assign({}, params, formatParams(payload));
      const data = yield call(findMarkDateApi, { data: newParams })
      yield put({
        type: 'save',
        payload: {
          params: newParams,
          markData: data || []
        }
      })
    },
    *setMarkDate({ payload }, { call, put, select }) {
      const { data } = yield call(setMarkDateApi, { data: payload })
      const { params } = yield select(state => state['calendarmanage'])

      yield put({ type: 'getMarkDate' })
    },
    *unsetMarkDate({ payload }, { call, put, select }) {
      const { data } = yield call(unsetMarkDateApi, { data: payload })
      const { params } = yield select(state => state['calendarmanage'])

      yield put({ type: 'getMarkDate' })
    },
    *calculateDays({ payload }, { call, put }) {
      const { endDate , startDate } = payload
      let ret = yield call(calculateDaysApi, { data: payload })
      yield put({
        type: 'save',
        payload: {
          calculateDays: ret,
          calStartDate: startDate,
          calEndDate: endDate,
          calretVisible:true
        }
      })

     

    }
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    colseModal(state, { payload }) {
      return {
        ...state,
        ...payload,
        visible: false
      }
    }
  }
}