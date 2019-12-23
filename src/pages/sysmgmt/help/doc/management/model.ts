import { Reducer } from 'redux'
import { Model } from 'dva'
import { deepCopy4JSON } from '@/utils/utils'
import { downloadFileImpl } from '@/services/file'
import _ from 'lodash'
import { message } from 'antd'
import { alterHelpTopicShowStatusApi, singleExportHelpDocumentApi, removeHelpTopicApi, findAclResourceTreeByTypeApi, findHelpTopicByPathApi, findTreeByTypeWithExportApi, exportHelpDocumentApi, importHelpDocumentApi, singleImportHelpDocumentApi, saveHelpTopicApi } from '../service'
import { translateNameToTitle, getLangeugage, findSelectedDocIds, getAllIdsFromNodes, findHelpDocument, getTreeNodesWhereExistChildren } from '../utils'

export interface Topic {
  attachmentList: string[]
  draftStatus: boolean
  helpEditValue: string
  imageList: string[]
  language: string | undefined
  title: string
  topicId: string | null
  topicPath: string | undefined
  topicStatus: boolean
}

interface State {
  docDirectory: any[] // 文档目录结构
  searchValue: string // 目录搜索关键字
  expandedDocDirectoryKeys: string[] // 展开指定的树节点
  topicId: string // 当前选中文档id
  selectedKeys: string[] // 当前选中节点ids
  viewDoc: {
    helpContent: string
  } // 当前查看文档
  selectedValue: string | undefined// 选择的节点名称
  selectedPath: string// 选中节点路径
  viewDocs: any[] // 选择目录下的文档列表
  exportDocPopoverVisible: boolean // 导出popover的显隐状态
  exportDocTree: any[] // 导出文档目录树
  exportDocTreeIds: string[] // 导出文档目录树ids
  checkedAll: boolean // 导出全选
  editing: boolean // 是否编辑
  editTopic: Topic // 编辑中的主题
}

const INIT_STATE: State = {
  docDirectory: [],
  searchValue: '',
  expandedDocDirectoryKeys: [],
  topicId: '',
  selectedKeys: [],
  viewDoc: {
    helpContent: ''
  },
  selectedValue: undefined,
  selectedPath: '',
  viewDocs: [],
  exportDocPopoverVisible: false,
  exportDocTree: [],
  exportDocTreeIds: [],
  checkedAll: false,
  editing: false,
  editTopic: {
    attachmentList: [],
    draftStatus: false,
    helpEditValue: '',
    imageList: [],
    language: undefined,
    title: '',
    topicId: null,
    topicPath: undefined,
    topicStatus: true
  }
}

interface ModelType extends Model {
  state: State,
  reducers: {
    updateState: Reducer<State>
  }
}

export default {
  namespace: 'helpDocManage',
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
    // 查询菜单目录结构
    *findHelpDocMenuTree(action, { put, select, call }) {
      let { docDirectory, expandedDocDirectoryKeys } = deepCopy4JSON(INIT_STATE)
      let language = yield getLangeugage(select)
      let params = {
        language: language,
        node: 'root',
        pageInfo: {},
        types: ["REACTMENU_CATEGORY", "REACTMENU_CATEGORY_ITEM"]
      }
      try {
        docDirectory = yield call(findAclResourceTreeByTypeApi, params)
        docDirectory = translateNameToTitle(docDirectory, language)
        getTreeNodesWhereExistChildren(docDirectory, expandedDocDirectoryKeys)
      } catch (error) {
        console.error('findHelpDocMenuTree error', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          docDirectory,
          expandedDocDirectoryKeys
        }
      })
    },
    // 获取导出文档目录树
    *findTreeByTypeWithExport(action, { put, call, select }) {
      let { exportDocTree, exportDocTreeIds, selectedKeys } = deepCopy4JSON(INIT_STATE)
      let language = yield getLangeugage(select)
      const { exportDocPopoverVisible } = yield select((store: any) => store.helpDocManage)
      if (exportDocPopoverVisible) {
        return
      } else {
        yield put({ type: 'updateState', payload: { exportDocPopoverVisible: true } })
      }
      let params = {
        language: language,
        node: 'root',
        pageInfo: {},
        types: ["WEBMENU_CATEGORY", "WEBMENU_CATEGORY_ITEM"]
      }
      try {
        exportDocTree = yield call(findTreeByTypeWithExportApi, params)
        exportDocTree = translateNameToTitle(exportDocTree, language)
        exportDocTreeIds = getAllIdsFromNodes(exportDocTree)
      } catch (error) {
        console.error('findHelpDocMenuTree error\n', error)
      }
      yield put({
        type: 'updateState',
        payload: {
          exportDocTree,
          selectedKeys,
          exportDocTreeIds,
          checkedAll: false
        }
      })
    },
    // 根据文档id查找文档内容
    findHelpDocument,
    // 改变文档的显隐状态
    *alterHelpTopicShowStatus(action, { call, put, select }) {
      const { payload: { topicStatus, topicId } } = action
      const params = {
        topicId,
        topicStatus
      }
      try {
        yield call(alterHelpTopicShowStatusApi, params)
        // 更新当前显示文档
        // const { viewDoc } = yield select((store: any) => store.helpDocManage)
        // yield put({
        //   type: 'updateState',
        //   payload: {
        //     viewDoc: {
        //       ...viewDoc,
        //       topicStatus
        //     }
        //   }
        // })
        // 刷新文档列表
        yield put({ type: 'findDocsByPath', payload: { isRefresh: true } })
        // 刷新当前文档
        yield put({ type: 'findHelpDocument', payload: { isRefresh: true } })
      } catch (error) {
      }
    },
    // 导出文档
    *exportDoc(action, { call, select }) {
      const { payload: { type } } = action
      let language = yield getLangeugage(select)
      let params: any = {
        language: language
      }
      let func: any = () => { }
      if (type === 'single') {
        const { topicId } = yield select((store: any) => store.helpDocManage)
        params.topicId = topicId
        func = singleExportHelpDocumentApi
      } else if (type === 'multiple') {
        const { exportDocTree, selectedKeys } = yield select((store: any) => store.helpDocManage)
        let resIds: string[] = []
        findSelectedDocIds(exportDocTree, selectedKeys, resIds)
        if (resIds.length === 0) {
          return message.warning('选中列表未包含任何文档主题！')
        }
        params.topicIdList = resIds
        func = exportHelpDocumentApi
      }
      try {
        message.loading('文档导出中,请稍等')
        let res = yield call(func, params)
        yield call(downloadFileImpl, res)
      } catch (error) {
        console.log('exportDoc error', error)
      }
      message.destroy()
    },
    // 删除文档
    *deleteDoc(action, { call, put }) {
      const { viewDoc, topicId: initTopicId, selectedKeys } = deepCopy4JSON(INIT_STATE)
      const { payload: { topicId } } = action
      try {
        yield call(removeHelpTopicApi, { topicId })
        // 刷新目录
        yield put({ type: 'findHelpTreeByType', payload: {} })
        yield put({
          type: 'updateState', payload: {
            selectedKeys,
            topicId: initTopicId,
            viewDoc
          }
        })
        // 刷新文档列表
        yield put({ type: 'findDocsByPath', payload: { isRefresh: true } })
      } catch (error) {
        console.log('deleteDoc error\n', error)
      }
    },
    // 通过路径获取对应文档列表
    *findDocsByPath(action, { call, put, select }) {
      let { selectedValue, selectedPath, viewDocs, topicId, viewDoc } = deepCopy4JSON(INIT_STATE)
      const { payload: { value, path, isRefresh = false } } = action
      let language = yield getLangeugage(select)
      let params = {
        topicPath: path,
        language: language
      }
      if (isRefresh) {
        const { selectedPath: oldPath } = yield select((store: any) => store.helpDocManage)
        params.topicPath = oldPath
      }
      try {
        if (params.topicPath) {
          viewDocs = yield call(findHelpTopicByPathApi, params)
        }
      } catch (error) {
      }
      let payload = { viewDocs }
      if (!isRefresh) {
        payload = _.merge(payload, {
          selectedValue: value || selectedValue,
          selectedPath: path || selectedPath,
          topicId,
          viewDoc
        })
      }
      yield put({
        type: 'updateState',
        payload: {
          ...payload
        }
      })
    },
    // 导入文档
    *importDoc(action, { call, select, put }) {
      const { payload: { fileId, isSingle } } = action
      let language = yield getLangeugage(select)
      let params: any = {
        fileId,
        language: language
      }
      let func: any = importHelpDocumentApi
      if (isSingle) {
        const { topicId } = yield select((store: any) => store.helpDocManage)
        params.topicId = topicId
        func = singleImportHelpDocumentApi
      }
      try {
        yield call(func, params)
      } catch (error) {
        console.log('importDoc error\n', error)
      }
      // 刷新文档列表
      yield put({ type: 'findDocsByPath', payload: { isRefresh: true } })
      if (isSingle) {
        // 刷新当前主题
        yield put({ type: 'findHelpDocument', payload: { isRefresh: true } })
      }
    },
    // 保存文档
    * saveDoc(action, { select, put, call }) {
      // 初始
      let { editTopic: initEditTopic } = deepCopy4JSON(INIT_STATE)
      // 被编辑
      let { editTopic, selectedPath } = yield select((store: any) => store.helpDocManage)
      // 编辑中
      const { payload: { title, helpEditValue, attachmentList } } = action
      let language = yield getLangeugage(select)
      let imageList = []
      let reg = /(\/help\/fileDownload\?id=)(\S+)"/mg
      let execRes = undefined
      while (execRes = reg.exec(helpEditValue)) {
        imageList.push({ id: execRes[2] })
      }
      let params: Topic = {
        ...initEditTopic,
        ...editTopic,
        title,
        helpEditValue,
        attachmentList,
        language: language,
        topicPath: selectedPath,
        imageList
      }
      try {
        yield call(saveHelpTopicApi, params)
        yield put({ type: 'updateState', payload: { editing: false } })
      } catch (error) {
        console.error('saveDoc error\n', error)
      }
      // 刷新文档列表
      yield put({ type: 'findDocsByPath', payload: { isRefresh: true } })
      // 刷新当前主题
      if (params.topicId) {
        yield put({ type: 'findHelpDocument', payload: { isRefresh: true } })
      }
    }
  }
} as ModelType
