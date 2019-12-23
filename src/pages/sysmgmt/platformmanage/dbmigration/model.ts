import { Reducer } from 'redux'
import { Model } from 'dva'
import { message } from 'antd'
import { deepCopy4JSON } from '@/utils/utils'
import { getSchemaListApi, getMigrationInfoApi, migrateApi, getErrorMessageApi, forceSuccessApi } from './service'

export interface Schema {
  code: string
  name: string
}

export interface MigrationInfo {
  applied: boolean
  executionTime: number
  failed: boolean
  id: number
  installedOn: string
  resolved: boolean
  scriptFileName: string
  state: string
  success: boolean
}

interface State {
  schemaList: Schema[] // schema列表
  selectedSchema: string // 选中的schema
  migrationInfoList: MigrationInfo[] // 脚本列表
  errorMsg: string // 脚本执行错误信息
  failId: string | number// 错误执行脚本的id
}

const testMigrationInfoList = [{
  state: 'PENDING'
},
{
  state: 'FAILED',
  id: 'temptemp'
}, {
  state: 'SUCCESS'
}]

const INIT_STATE: State = {
  schemaList: [],
  selectedSchema: '',
  migrationInfoList: [],
  errorMsg: '',
  failId: ''
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'dbMigration',
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
    closeModal(state: State) {
      return {
        ...state,
        errorMsg: '',
        failId: ''
      }
    },
    reset() {
      return {
        ...INIT_STATE
      }
    }
  },
  effects: {
    // 获取schema列表
    *getSchemaList(action, { put, call }) {
      let { schemaList } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any[] = yield call(getSchemaListApi)
        schemaList = res
      } catch (error) {
        console.error('getSchemaList error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          schemaList
        }
      })
    },
    // 获取脚本列表
    *getMigrationInfo(action, { put, call }) {
      const { payload: { schema } } = action
      let { migrationInfoList, selectedSchema } = deepCopy4JSON(INIT_STATE)
      try {
        let res: any = yield call(getMigrationInfoApi, schema)
        migrationInfoList = res.content
        selectedSchema = schema
      } catch (error) {
        console.error('getMigrationInfo error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          migrationInfoList,
          selectedSchema
        }
      })
    },
    // 执行脚本
    *migrate(action, { put, call, select }) {
      const { selectedSchema } = yield select((store: any) => store.dbMigration)
      try {
        message.loading(tr('脚本运行中, 请稍等'), 0)
        yield call(migrateApi, selectedSchema)
        yield put({
          type: 'getMigrationInfo',
          payload: {
            schema: selectedSchema
          }
        })
      } catch (error) {
        console.error('getSchemaList error\n', error)
      } finally {
        message.destroy()
      }
    },
    // 获取脚本执行错误信息
    *getErrorMessage(action, { put, call, select }) {
      const { payload: { id = '' } } = action
      let { errorMsg } = INIT_STATE
      const { selectedSchema } = yield select((store: any) => store.dbMigration)
      try {
        let res: any = yield call(getErrorMessageApi, selectedSchema)
        errorMsg = res
      } catch (error) {
        console.error('getErrorMessage error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          errorMsg,
          failId: id
        }
      })
    },
    // 强制将脚本状态改为SUCCESS
    *forceSuccess(action, { put, call, select }) {
      const { selectedSchema, failId } = yield select((store: any) => store.dbMigration)
      try {
        yield call(forceSuccessApi, selectedSchema, failId)
        yield put({ type: 'closeModal' })
        yield put({
          type: 'getMigrationInfo',
          payload: {
            schema: selectedSchema
          }
        })
        return Promise.resolve()
      } catch (error) {
        console.error('forceSuccess error\n', error)
        return Promise.resolve()
      }
    }
  }
} as ModelType
