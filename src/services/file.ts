import request, { sucMessage } from '@/utils/request'
import { getUserIdentity } from '@/utils/utils'

// 上传文件URL
export const UPLOAD_URL = '/api/file/upload'
// 上传文件到目录URL
export const UPLOAD_DIR_URL = '/api/file/uploadDir'
// 文本文件
export const TEXT_FILES = ['text/']
// 图片文件
export const IMAGE_FILES = ['image/']
// pdf文件
export const PDF_FILE = 'application/pdf'

// 上传后的文件结构
export interface File {
  fileName: string
  fileSize: number
  fileUploadDate: string
  id: number
  operatorId: number
  optCounter: number
  virtureId: string
}

export interface BaseFileProps {
  recTypeId: number, // 关联业务类型id
  recId: number, // 关联业务对象id
  subRecTypeId: number, // 关联子业务类型id
  subRecId: number // 关联子业务对象id
}

export interface BaseFileNotRequiredProps {
  recTypeId?: number, // 关联业务类型id
  recId?: number, // 关联业务对象id
  subRecTypeId?: number, // 关联子业务类型id
  subRecId?: number // 关联子业务对象id
}

interface FindFileProps {
  filterInfo: BaseFileProps,
  pageInfo: {
    pageSize: number,
    beginIndex: number
  }
}

interface turnRightFileParam extends BaseFileProps {
  description?: string,
  id: string | number
}

export interface CreateOfficeOnlineProps extends BaseFileProps {
  fileDescription: string
  fileName: string
  officeType: 'WORD' | 'EXCEL' | 'PPT'
  pathId: string
}

export interface CreateDirApiProps extends BaseFileProps {
  dirName: string // 文件目录
  id?: string // id
  pathId?: string // 目录id
}

export interface MoveDirApiProps extends BaseFileProps {
  fileId: string // 文件id
  targetPathId: string // 目标文件目录id
}

export interface ModifyDirNameApi extends BaseFileProps {
  dirName: string // 文件目录
  id: string // 目录id
}

/**
 * 获取文件列表
 * @param {object} params
 */
export function findFileApi(params: FindFileProps) {
  return request('/file/find', {
    method: 'POST',
    data: params
  })
}

/**
 * 删除文件
 * @param ids 文件id列表
 * @param showSuccess 是否显示成功提示
 */
export function removeFileApi(ids: string[], showSuccess: boolean = true) {
  return request('/file/remove',
    {
      method: 'POST',
      data: { ids },
    },
    {
      showSuccess: showSuccess,
      successMessage: '删除成功'
    }
  )
}

/**
 * 下载文件
 * @param ids 文件id列表
 */
export async function downloadFileApi(ids: string[]) {
  try {
    let res = await request('/file/getDownloadIds', {
      method: 'POST',
      data: { ids }
    })
    downloadFileImpl(res)
  } catch (error) {
  }
}

export function downloadFileImpl(id: string) {
  let { userToken, userLoginName, userLanguage } = getUserIdentity()
  location.href = `/api/file/downloadFile?id=${id}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
}

/**
 * 修改文件描述信息
 * @param param
 */
export function modifyFileDescriptionApi(param: { id: string, description: string }) {
  return request('/file/modifyDescription', {
    method: 'POST',
    data: param
  },
    {
      showSuccess: true,
      successMessage: '保存成功'
    })
}

/**
 * 获取文件的预览基础信息
 * @param id 文件id
 */
export function getFilePreviewInfoApi(id: string) {
  return request('/file/getPreviewInfo', {
    method: 'POST',
    data: { id }
  })
}

/**
 * 预览文件
 * @param id 预览id
 * @param type mimeType
 */
export function previewFileApi(id: string, type: string): any {
  const URL = '/file/previewFile'
  if (TEXT_FILES.some((item: string) => type.indexOf(item) !== -1)) {
    return request(`${URL}?id=${id}`, {
      method: 'GET',
    })
  }
  const { userToken, userLoginName, userLanguage } = getUserIdentity()
  let url = `/api${URL}?id=${id}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  if (IMAGE_FILES.some((item: string) => type.indexOf(item) !== -1)) {
    return url
  } else if (PDF_FILE === type) {
    window.open(`/api/static/base/js/plugins/PDFJSInNet/web/viewer.html?file=${url}`)
    return
  }
}


/**
 * 保存文件
 * @export
 * @param {turnRightFileParam} params
 */
export function turnRightFileApi(params: turnRightFileParam) {
  return request('/file/turnRight',
    {
      method: 'POST',
      data: params
    })
}

/**
 * 在线创建office文件
 * @param params
 */
export function createOfficeOnlineApi(params: CreateOfficeOnlineProps) {
  return request('/officeOnline/create',
    {
      method: 'POST',
      data: params
    }, {
    showSuccess: true
  })
}

/**
 * 根据条件查询已经上传的文件夹和文件
 * @param {object} params
 */
export function findDirApi(params: BaseFileProps) {
  return request('/file/findDir', {
    method: 'POST',
    data: {
      filterInfo: params
    }
  })
}

/**
 * 创建文件目录
 * @param params
 */
export function createDirApi(params: CreateDirApiProps) {
  return request('/file/createDir',
    {
      method: 'POST',
      data: params
    }, {
    showSuccess: true,
    successMessage: sucMessage.createMes
  })
}


/**
 * 移动文件夹和文件
 * @param params
 */
export function moveDirApi(params: MoveDirApiProps) {
  return request('/file/moveDir',
    {
      method: 'POST',
      data: params
    }, {
    showSuccess: true
  })
}

/**
 * 重命名文件夹
 * @param params
 */
export function modifyDirNameApi(params: ModifyDirNameApi) {
  return request('/file/modifyDirName',
    {
      method: 'POST',
      data: params
    }, {
    showSuccess: true
  })
}
