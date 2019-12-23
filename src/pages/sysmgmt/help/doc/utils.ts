import { useMemo } from 'react'
import _ from 'lodash'
import { delay } from 'dva/saga'
import { getContentHeight } from '@/utils/utils'
import { findHelpDocumentApi } from './service'

/**
 * 获取对应语言
 */
export function* getLangeugage(select: Function): any {
  const { userLanguage } = yield select((store: any) => store.login)
  return userLanguage === 'zh-CN' ? 'zh_CN' : 'en'
}

/**
 * 返回面板最小高度
 * @param headerHeight
 */
export const useCardHeight = (MAIN_CONFIG: any) => {
  return getContentHeight(MAIN_CONFIG, 0)
}

/**
 * 根据情况获取最大或最小高度
 */
export const useDocHeight = (isAffix: boolean, showBreadcrumb: boolean, minHeight: string, maxHeight: string) => {
  return useMemo(() => {
    return isAffix && showBreadcrumb ? minHeight : maxHeight
  }, [isAffix, showBreadcrumb, minHeight, maxHeight])
}

/**
 * 将目录结构中的name转换成title
 * @param nodes 所有目录节点
 * @param userLanguage 当前语言
 */
export const translateNameToTitle = (nodes: any[], userLanguage: string): any[] => {
  return nodes.map((item: any) => {
    const { name, children } = item
    let title: string | object = name
    try {
      title = JSON.parse(name)
      title = title[userLanguage]
      title = title === '' ? '' : (title || name)
    } catch (error) {
      console.error(tr('目录title解析\n'), error)
    }

    item.title = title
    item.name = title
    if (children) {
      item.children = translateNameToTitle(children, userLanguage)
    }
    return item
  })
}

// 返回与搜索关键匹配的节点
export const findTitleMatchNodes = (nodes: any[], searchValue: string, parentIdsProps?: string[], newExpandedKeys?: string[], ): string[] => {
  const resKeys: string[] = newExpandedKeys || []
  nodes.forEach(({ id, title, children }: any) => {
    const parentIds: string[] = parentIdsProps || []
    // 当前节点包含搜索关键字
    if (title.indexOf(searchValue) !== -1) {
      // 先记录当前节点的父节点
      resKeys.push(...parentIds)
      // 在记录当前节点
      resKeys.push(id)
    }
    if (children) {
      parentIds.push(id)
      findTitleMatchNodes(children, searchValue, parentIds, resKeys)
    }
  })

  return resKeys
}

/**
 * 找到某个节点的父节点
 * @param nodes 所以目录节点
 * @param idProps 某个节点的id
 * @param res 最终返回结果
 */
export const findParentNodes = (nodes: any[], idProps: string, res: string[], parentIdsProps?: string[]): void => {
  nodes.some((item: any) => {
    const parentsId = parentIdsProps || []
    const { id, children } = item
    if (id === idProps) {
      res.push(...parentsId, id)
      return true
    } if (children) {
      parentsId.push(id)
      return findParentNodes(children, idProps, res, parentsId)
    }
    return false
  })
}

/**
 * 根据路径找到与之相关的父节点与第一个子节点
 * @param nodes
 * @param path
 * @param res
 * @param parentIdsProps
 */
export const findNodesByPath = (nodes: any[], path: string, enpandIds: string[], selectedNode: any, parentIdsProps?: string[]): void => {
  nodes.some((item: any) => {
    const parentsId = parentIdsProps || []
    const { id, children, path: _path, isLeaf } = item
    if (_path === path && isLeaf) {
      enpandIds.push(...parentsId, id)
      _.merge(selectedNode, item)
      return true
    } if (children) {
      parentsId.push(id)
      return findNodesByPath(children, path, enpandIds, selectedNode, parentsId)
    }
    return false
  })
}

/**
 * 找到某个子节点的所有子节点id
 * @param node
 * @param ids
 */
export const findAllChildrenByParent = (node: any, ids: string[]) => {
  const { children } = node
  if (children) {
    return children.forEach((item: any) => {
      const { id } = item
      ids.push(id)
      findAllChildrenByParent(item, ids)
    })
  }
}

/**
 * 从已选择的节点中选取文档节点
 * @param nodes 节点数
 * @param selectedIds 已选中节点ids
 * @param resIds 最终的结果
 */
export const findSelectedDocIds = (nodes: any[], selectedIds: string[], resIds: string[]): boolean => {
  return nodes.some((item: any): boolean => {
    const { id, isHelpDoc, children } = item
    if (isHelpDoc && selectedIds.includes(id)) {
      resIds.push(id)
    }
    if (resIds.length === selectedIds.length) {
      return true
    }
    if (children) {
      return findSelectedDocIds(children, selectedIds, resIds)
    }
    return false
  })
}

/**
 * 获取一个节点数的所有id
 * @param nodes 节点数
 */
export const getAllIdsFromNodes = (nodes: any[], resProps?: string[]): string[] => {
  const res: string[] = resProps || []
  nodes.forEach((item: any) => {
    const { id, children } = item
    res.push(id)
    if (children) {
      res.concat(getAllIdsFromNodes(children, res))
    }
  })
  return res
}

// 根据文档id查找文档内容
export function* findHelpDocument(action: any, { put, select, call }: any) {
  const { payload: { topicId, isRefresh = false, isHelpDoc = true } } = action
  if (!isHelpDoc) {
    yield call(delay, 50)
    yield put({
      type: 'updateState',
      payload: {
        topicId,
        selectedKeys: [topicId],
        viewDoc: {
          isEmpty: true
        }
      }
    })
    return
  }
  let viewDoc = {
    helpContent: '',
    viewHelpContent: ''
  }
  const language = yield getLangeugage(select)
  const params = {
    language,
    topicId
  }
  if (isRefresh) {
    const { topicId: oldTopicId } = yield select((store: any) => store.helpDocManage)
    params.topicId = oldTopicId
  }
  try {
    viewDoc = yield call(findHelpDocumentApi, params)
    viewDoc.viewHelpContent = viewDoc.helpContent
  } catch (error) {
    console.error('findHelpDocument error\n', error)
  }
  yield put({
    type: 'updateState',
    payload: {
      viewDoc,
      topicId: params.topicId,
      selectedKeys: [params.topicId]
    }
  })
}

// 获取到树形结构存在子节点的节点id列表
export function getTreeNodesWhereExistChildren(nodes: any[], res: string[]) {
  nodes.filter((item: any) => Array.isArray(item.children) && item.children.length > 0).forEach((item: any) => {
    const { id, children } = item
    res.push(id)
    getTreeNodesWhereExistChildren(children, res)
  })
}
