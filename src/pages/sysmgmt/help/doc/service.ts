import request from '@/utils/request'

// 文档附件上传地址
export const HELP_ATTACHMENT_UPLOAD_URL = '/api/help/attachmentUpload'

interface CommonProps {
  language: string
}

interface FindHelpTreeByTypeProps extends CommonProps {
  node: string,
  pageInfo: object,
  types: string[]
}

interface FindHelpDocumentProps extends CommonProps {
  topicId: string
}

interface FindHelpTopicByPathProps extends CommonProps {
  topicPath: string
}

interface AlterHelpTopicShowStatusProps {
  topicId: string,
  topicStatus: 0 | 1
}

interface SingleExportHelpDocumentProps extends CommonProps {
  topicId: string[]
}

interface ExportHelpDocumentProps extends CommonProps {
  topicIdList: string[]
}


interface ImportHelpDocumentProps extends CommonProps {
  fileId: number
}

interface SingleImportHelpDocumentProps extends ImportHelpDocumentProps {
  topicId: number
}

interface SaveHelpTopicProps extends CommonProps {
  attachmentList: object[],
  draftStatus: boolean,
  helpEditValue: string,
  imageList: object[],
  title: string,
  topicId: string | null,
  topicPath: string,
  topicStatus: boolean
}

interface RemoveHelpTopicProps {
  topicId: string
}

/**
 * 查询文档目录结构
 * @param props
 */
export function findHelpTreeByTypeApi(props: FindHelpTreeByTypeProps) {
  return request('/help/findTreeByType', {
    method: 'POST',
    data: props
  })
}

/**
 * 根据文档路径查找文档目录结构
 * @param props
 */
export function findHelpTopicByPathApi(props: FindHelpTopicByPathProps) {
  return request('/help/findTopicByPath', {
    method: 'POST',
    data: props
  })
}

/**
 * 获取菜单目录结构
 * @param props
 */
export function findAclResourceTreeByTypeApi(props: FindHelpTreeByTypeProps) {
  return request('/aclResource/findTreeByType', {
    method: 'POST',
    data: props
  })
}

/**
 * 获取导出文档的树形目录
 * @param id
 */
export function findTreeByTypeWithExportApi(props: FindHelpTreeByTypeProps) {
  return request(`/help/findTreeByTypeWithExport`, {
    method: 'POST',
    data: props
  })
}

/**
 * 根据文档id查找文档内容
 * @param props
 */
export function findHelpDocumentApi(props: FindHelpDocumentProps) {
  return request('/help/findHelpDocument', {
    method: 'POST',
    data: props
  })
}

/**
 * 根据文档id查找文档草稿内容
 * @param props
 */
export function getHelpDocumentDraftApi(props: FindHelpDocumentProps) {
  return request('/help/getHelpDocumentDraft', {
    method: 'POST',
    data: props
  })
}

/**
 * 改变文档的显隐状态
 * @param props
 */
export function alterHelpTopicShowStatusApi(props: AlterHelpTopicShowStatusProps) {
  return request('/help/alterHelpTopicShowStatus', {
    method: 'POST',
    data: props,
  }, {
    showSuccess: true,
    successMessage: tr('修改主题展示状态成功')
  })
}

/**
 * 获取单个文档导出的文件id
 * @param props
 */
export function singleExportHelpDocumentApi(props: SingleExportHelpDocumentProps) {
  return request('/help/singleExportHelpDocument', {
    method: 'POST',
    data: props
  })
}

/**
 * 获取多个文档导出的文件id
 * @param props
 */
export function exportHelpDocumentApi(props: ExportHelpDocumentProps) {
  return request('/help/exportHelpDocument', {
    method: 'POST',
    data: props
  })
}

/**
 * 导入文档
 * @param props
 */
export function importHelpDocumentApi(props: ImportHelpDocumentProps) {
  return request('/help/importHelpDocument', {
    method: 'POST',
    data: props
  }, {
    showSuccess: true,
    successMessage: tr('文档导入成功！')
  })
}

/**
 * 单个导入文档
 * @param props
 */
export function singleImportHelpDocumentApi(props: SingleImportHelpDocumentProps) {
  return request('/help/singleImportHelpDocument', {
    method: 'POST',
    data: props
  }, {
    showSuccess: true,
    successMessage: tr('文档导入成功！')
  })
}

/**
 * 保存文档
 * @param props
 */
export function saveHelpTopicApi(props: SaveHelpTopicProps) {
  return request('/help/saveTopic', {
    method: 'POST',
    data: props
  }, {
    showSuccess: true,
    successMessage: tr('发布成功！')
  })
}

/**
 * 删除文档
 * @param props
 */
export function removeHelpTopicApi(props: RemoveHelpTopicProps) {
  return request('/help/removeTopic', {
    method: 'POST',
    data: props
  }, {
    showSuccess: true,
    successMessage: tr('主题文档删除成功')
  })
}
