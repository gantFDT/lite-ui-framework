import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { getGraphDbEnabledApi, listDgraphSchemaApi, initDgraphApi, queryDgraphApi } from './service'

export interface GraphSchema {
  predicate: string
  type: string
  index: string
  reverse: string
  count: string
  upsert: string
  lang: string
  tokenizers: string
  createRDF: string
}

const TEST_GRAPHSCHEMALIST: GraphSchema[] = [
  {
    index: true,
    reverse: true,
    count: true,
    upsert: false,
    lang: true
  }
]

interface State {
  graphDbEnabled: boolean // 图形连接数据库状态
  graphSchemaList: GraphSchema[] // 数据库模式列表信息
  selectedNames: string[] // 选中的缓存名称
  sql: string // 输入的SQL语句
  result: string // 查询结果
}

const INIT_STATE: State = {
  graphDbEnabled: true,
  graphSchemaList: [],
  // graphSchemaList: TEST_GRAPHSCHEMALIST,
  selectedNames: [],
  sql: '',
  result: ''
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'graphDb',
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
    // 获取数据库连接状态
    *getGraphDbEnabled(action, { put, call }) {
      let { graphDbEnabled } = deepCopy4JSON(INIT_STATE)
      try {
        let res: boolean = yield call(getGraphDbEnabledApi)
        graphDbEnabled = res
        if (graphDbEnabled) {
          yield put({
            type: 'listDgraphSchema'
          })
        }
      } catch (error) {
        console.log('getGraphDbEnabled error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          graphDbEnabled
        }
      })
    },
    // 获取图形数据库模式
    *listDgraphSchema(action, { put, call }) {
      let { graphSchemaList } = deepCopy4JSON(INIT_STATE)
      try {
        let res = yield call(listDgraphSchemaApi)
        graphSchemaList = res
      } catch (error) {
        console.log('listDgraphSchema error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          graphSchemaList
        }
      })
    },
    // 初始化图数据库
    *initDgraph(action, { put, call }) {
      try {
        yield call(initDgraphApi)
        yield put({ type: 'updateState', payload: { graphSchemaList: [] } })
        yield put({ type: 'getGraphDbEnabled' })
        return Promise.resolve()
      } catch (error) {
        console.log('initDgraph error\n', error)
        return Promise.reject()
      }
    },
    // 执行查询
    *queryDgraph(action, { put, call }) {
      const { payload: { sql } } = action
      let { result } = deepCopy4JSON(INIT_STATE)
      try {
        let res = yield call(queryDgraphApi, sql)
        result = res
      } catch (error) {
        console.log('queryDgraph error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          result
        }
      })
    }
  }
} as ModelType
