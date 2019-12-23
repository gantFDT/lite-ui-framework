import { Model } from 'dva'
import { findLogAPI } from './services'
import Types from './types'

export interface Listitem {
  id: string,
}
export interface QueryParam {
  filterInfo: {
    logType: Types,
    [propsName: string]: any,
  },
  pageInfo: PageInfo,
}
export interface StateItem {
  content?: Array<Listitem>,
  currentIndex: number,
  currentPage: number,
  pageSize: number,
  totalCount?: number,
  totalPage?: number,
  param: QueryParam
}
export const initialStateItem: StateItem = {
  content: [],
  currentIndex: 0,
  currentPage: 1,
  pageSize: 50,
  totalCount: 0,
  totalPage: 0,
  param: {
    filterInfo: {},
    pageInfo: {}
  } as QueryParam,
}
// const formatParams = ({ page = initialStateItem.currentPage, pageSize = initialStateItem.pageSize, ...restParams }) => ({
//   pageInfo: {
//     pageSize,
//     beginIndex: (page - 1) * pageSize,
//   },
//   filterInfo: {
//     ...restParams,
//   }
// })

/**
 * content 数据列表
 * currentIndex 当前索引对应beginIndex
 * currentPage 当前页码
 * pageSize     分页大小
 * totalCount   总大小
 * totalPage    总页数
 */

const initialState = {}

export type ModelState = Readonly<typeof initialState>
export const namespace = 'syslog'

export interface SyslogModel extends Model {
  namespace: 'syslog',
  readonly state: ModelState,
}

const LogModel: SyslogModel = {
  namespace,
  state: initialState,
  effects: {
    *queryLog({ payload, callback, final }, { call, put, select }) {
      try {
        const response = yield call(findLogAPI, { data: payload })
        yield put({
          type: 'save',
          payload: {
            [payload.filterInfo.logType]: {
              ...response,
              param: payload,
            },
          }
        })
        if (callback) { callback() }
      }
      catch{
        // 错误上报
      }
      finally {
        if (final) { final() }
      }
    },
  },
  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      }
    },
    resetState: () => initialState
  }
}

export default LogModel
