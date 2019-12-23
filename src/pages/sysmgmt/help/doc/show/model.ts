import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import _ from 'lodash'
import { findHelpTreeByTypeApi } from '../service'
import { translateNameToTitle, findNodesByPath, getLangeugage, findHelpDocument } from '../utils'

interface State {
  docDirectory: any[], // 文档目录结构
  searchValue: string, // 目录搜索关键字
  expandedKeys: string[], // 展开指定的树节点
  topicId: string, // 当前选中文档id
  selectedKeys: string[], // 当前选中节点ids
  viewDoc: {
    helpContent: string
  }, // 当前查看文档
  selectedValue: string | undefined,// 选择的节点名称
  selectedPath: string,// 选中节点路径
  viewDocs: any[], // 选择目录下的文档列表
  exportDocTree: any[], // 导出文档目录树
}

const INIT_STATE: State = {
  docDirectory: [],
  searchValue: '',
  expandedKeys: [],
  topicId: '',
  selectedKeys: [],
  viewDoc: {
    helpContent: ''
  },
  selectedValue: undefined,
  selectedPath: '',
  viewDocs: [],
  exportDocTree: []
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'helpDocShow',
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
    // 查询文档目录结构
    *findHelpTreeByType(action, { put, select, call }) {
      const { payload: { path } } = action
      let { docDirectory, expandedKeys } = deepCopy4JSON(INIT_STATE)
      let language = yield getLangeugage(select)
      let params = {
        language: language,
        node: 'root',
        pageInfo: {},
        types: ["REACTMENU_CATEGORY", "REACTMENU_CATEGORY_ITEM"]
      }
      let addedState = {}
      let selectedNode = { isHelpDoc: false, id: '' }
      try {
        docDirectory = yield call(findHelpTreeByTypeApi, params)
        docDirectory = translateNameToTitle(docDirectory, language)
      } catch (error) {
        console.error('findHelpTreeByType error\n', error)
      }
      // 找到路径对应的节点
      if (path) {
        findNodesByPath(docDirectory, path, expandedKeys, selectedNode)
        addedState = {
          expandedKeys,
          selectedKeys: [selectedNode.id]
        }
      }
      yield put({
        type: 'updateState',
        payload: {
          docDirectory,
          ...addedState
        }
      })
      if (selectedNode.isHelpDoc) {
        yield put({
          type: 'findHelpDocument',
          payload: { topicId: selectedNode.id }
        })
      }
    },
    // 根据文档id查找文档内容
    findHelpDocument
  }
} as ModelType
