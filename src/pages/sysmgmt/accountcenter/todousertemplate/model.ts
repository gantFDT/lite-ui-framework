import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { findAllTaskUserTemplateApi } from './service'

interface State {
  sourceTemplates: any[] // 后端返回的源列表
  templates: any[] // 模板列表
}

const INIT_STATE: State = {
  sourceTemplates: [],
  templates: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export const PAGE_KEY = 'todoUserTemplate'

export default {
  namespace: 'todoUserTemplate',
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
    *fetch(action, { put, call }) {
      const { payload: { isSingle } } = action
      let { templates, sourceTemplates } = deepCopy4JSON(INIT_STATE)
      try {
        sourceTemplates = yield call(findAllTaskUserTemplateApi, isSingle)
        if (isSingle) {
          templates = sourceTemplates.map((item: any) => {
            const { wfTemplateName, wfTemplateVersion } = item
            return {
              customName: `${wfTemplateName}_V${wfTemplateVersion}`,
              ...item
            }
          })
        } else {
          templates = sourceTemplates.reduce((res: any, item: any) => {
            const { wfTemplateName, wfTemplateVersion } = item
            let key = `${wfTemplateName}_V${wfTemplateVersion}`
            if (res[key]) {
              res[key].push(item)
            } else {
              res[key] = [item]
            }
            return res
          }, {})
          templates = Object.entries(templates).map(([key, data]: [string, any]) => {
            return {
              customName: key,
              data
            }
          })
        }
      } catch (error) {
        console.log('findAllTaskUserTemplateApi error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          sourceTemplates,
          templates
        }
      })
    }
  }
} as ModelType
