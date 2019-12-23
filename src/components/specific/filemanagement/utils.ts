import { useMemo } from 'react'
import md5 from 'md5-node'
import { getUserIdentity, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, TABLE_FOOTER_HEIGHT, TABLE_TITLE_HEIGHT, getIconNameByFileName } from '@/utils/utils'

const apikey = '2f6b0ebb11781440342f93b8f90688ac24bfc47c9cfafb7e507f956ef0e7c84d'
const seperator = '//'
const bishengProtocol = 'http:'
const bishengServer = '192.168.1.191'
const hostName = PROXY_TARGET.split('http://')[1]

/**
 * 根据传入的高度返回table和list展示的最新高度
 * @param height 高度
 * @param type 类型
 * @param isDir 是否是目录
 */
export function useHeight(height: string, type: 'table' | 'list', isDir = false) {
  return useMemo(() => {
    if (type === 'table') {
      const common = TABLE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT + (isDir ? 0 : TABLE_FOOTER_HEIGHT)
      return typeof height === 'number' ? height - common : `calc(${height} - ${common}px)`
    }
    return `calc(${height} - ${40 + (isDir ? 0 : 35)}px)`
  }, [height, type, isDir])
}

/**
 * 根据传入id打开office文档编辑窗口
 * @param id 文档id
 * @param type 操作类型
 */
export function docEdit(id: string, type: 'edit' | 'preview') {
  const { userLoginName } = getUserIdentity()
  const callUrl = btoa(`${bishengProtocol}${seperator}${hostName}/officeOnline/getOfficeFileInfo?docId=${id}&loginName=${userLoginName}`)
  const sign = md5(apikey, callUrl)
  const baseUrl = `${bishengProtocol}${seperator}${bishengServer}`
  const editUrl = `${baseUrl}/apps/editor/openEditor?callURL=${callUrl}&sign=${sign}`
  const previewUrl = `${baseUrl}/apps/editor/openPreview?callURL=${callUrl}&sign=${sign}`
  window.open(type === 'edit' ? editUrl : previewUrl)
}

/**
 * 根据文件名称和文件类型获取对应图标
 */
export function getIconNameByFileNameAndType(name: string, type: string) {
  if (type === 'folder') return type
  return getIconNameByFileName(name)
}

/**
 * 根据id获取对应节点，以及该节点对应的父节点路径
 * @params nodes 所有节点
 * @param id 对应id
 * @param res 用于返回最终结果
 */
export function getNodeAndPathById(nodes: any[], id: string, res: any, tempPath?: any[]): any {
  const currentTempPath: any[] = tempPath || []
  // 先判断当前级有没有对应节点
  const currentIsExist = nodes.find(item => item.id.includes(id))
  if (currentIsExist) {
    const { id: nodeId, name } = currentIsExist
    res.node = currentIsExist
    res.path = [...currentTempPath, { id: nodeId, name }]
    return true
  }
  // 在判断对应列表子节点是否有对应节点
  const dirNodes = nodes.filter(nodesItem => Array.isArray(nodesItem.children) && nodesItem.children.length > 0)
  if (dirNodes.length < 0) return false
  return dirNodes.some(dirNodesItem => {
    const { id: dirId, name, children } = dirNodesItem
    return getNodeAndPathById(children, id, res, [...currentTempPath, { id: dirId, name }])
  })
}

/**
 * 返回节点数中类型为type的所有节点
 * @param nodes
 * @param type 过滤类型
 * @param id 过滤id
 * @param res 把id过滤到文件返回
 */
export function getNodesByType(nodes: any[], type: string, id: string, res: any) {
  return nodes.filter((item: any) => {
    if (item.id === id) {
      res.file = item
    }
    if (item.type === type && item.id !== id) {
      return true
    }
    return false
  }).map((item) => {
    const { children, name, id: itemId } = item
    if (Array.isArray(children) && children.length > 0) {
      item.children = getNodesByType(children, type, id, res)
    }
    item.title = name
    item.key = itemId
    return item
  })
}
