import React, { useEffect, useReducer, useRef, ReactNode, useMemo, useCallback } from 'react'
import { message, Modal } from 'antd'
import { findFileApi, removeFileApi, downloadFileApi, getFilePreviewInfoApi, previewFileApi, TEXT_FILES, IMAGE_FILES, findDirApi, BaseFileNotRequiredProps } from '@/services/file'
import { debounce } from 'lodash'
import { FileContextMenu, FileEdit, FilePreview, FileUpload, OfficeAddModal, ListShow, TableShow, DirAddModal, FilePath, TitleOperates, FileMove } from './subcomponent'
import { getNodeAndPathById } from './utils'

export enum ShowType {
  Table = 'table',
  List = 'list'
}

const INIT_STATE = {
  beginIndex: 0, // 分页起始索引
  pageIndex: 1, // 当前页
  pageSize: 40, // 分页大小
  total: 0, // 文件总数
  files: [], // 当前页文件列表
  findFileLoading: false, // 查询列表loading状态
  selectedRowKeys: [], // 选中行的id
  showEditModal: false, // 是否显示编辑modal
  editFile: {}, // 编辑中的文件对象
  showPreviewModal: false, // 是否显示预览modal
  currentPreviewFile: {// 预览文件
    id: '', // 预览文件id
    name: '', // 文件名称
    text: '', // 预览文本文件的内容
    imageUrl: '', // 预览图片文件的地址
  },
  showFileUploadModal: false, // 是否显示文件上传modal
  sorterState: {}, // 当前排序
  showType: ShowType.Table, // 列表展现形式
  checkboxState: { // list展现时，全选状态
    checkAll: false, // 是否已全选
    indeterminate: false // 是否为不确定状态
  },
  showOfficeAddModal: false, // 是否显示添加office文件modal
  showDirAddModal: false, // 是否显示创建文件夹modal
  dirAddType: undefined, // 创建文件夹的类型
  dirId: undefined, // 当前目录id
  editDirName: undefined, // 选中目录名称
  showFileMoveModal: false // 显示文件移动modal
}

const updateState = (state: any, action: any) => {
  const { payload } = action
  return {
    ...state,
    ...payload
  }
}

export interface FileOperateProps {
  officeAble: boolean // 是否允许处理office文档
  downloadAble: boolean // 是否允许下载
  editAble: boolean, // 是否允许编辑
  deleteAble: boolean, // 是否允许删除
  previewAble: boolean // 是否允许预览
}

interface FileManagementProps extends BaseFileNotRequiredProps {
  officeAble?: boolean // 是否允许处理office文档
  downloadAble?: boolean // 是否允许下载
  addAble?: boolean, // 是否允许添加文档
  editAble?: boolean, // 是否允许编辑
  deleteAble?: boolean, // 是否允许删除
  previewAble?: boolean // 是否允许预览
  switchAble?: boolean // 是否允许切换视图
  height?: string // 高度 默认300px
  title?: string | ReactNode // 自定义标题
  extra?: ReactNode // 自定义额外的操作
  headerProps?: any // 针对BlockHeader的自定义内容
  isDir?: boolean // 是否是目录结构
}

const INIT_ANY_OBJECT = {}
const INIT_ANY_ARRAY: any[] = []

/**
 * 文件管理组件
 * @param props
 */
export default function FileManagement(props: FileManagementProps) {
  const {
    recTypeId = 0,
    recId = 0,
    subRecTypeId = 0,
    subRecId = 0,
    officeAble = false,
    downloadAble = true,
    addAble = true,
    editAble = true,
    deleteAble = true,
    previewAble = true,
    switchAble = true,
    height = '300px',
    title = <span>{tr('查询结果')}</span>,
    extra = null,
    headerProps = INIT_ANY_OBJECT,
    isDir = false
  } = props
  const [state, dispatch] = useReducer(updateState, INIT_STATE)
  const {
    beginIndex,
    pageSize,
    files,
    selectedRowKeys,
    currentPreviewFile,
    showFileUploadModal,
    showType,
    showOfficeAddModal,
    showDirAddModal,
    dirId,
    dirAddType,
    editDirName,
    showFileMoveModal,
    findFileLoading
  } = state

  // 显示的文件列表和路径
  const [showFiles, path] = useMemo(() => {
    if (!isDir || !dirId) {
      return [files, INIT_ANY_ARRAY]
    }
    let res: any = {
      node: undefined,
      path: []
    }
    getNodeAndPathById(files, dirId, res)
    const { node, path } = res
    return [node ? node.children : files, path]
  }, [isDir, dirId, files])

  // 标题
  const resTitle = useMemo(() => {
    if (!isDir) return title
    return (
      <>
        {title}&nbsp;&nbsp;
        {isDir && <FilePath path={path} dispatch={dispatch} />}
      </>
    )
  }, [title, path, isDir])

  // zmageRef
  const zmageRef = useRef(null)

  // 获取文件列表
  const findFiles = useCallback(async (temp: any) => {
    let res
    let currentBeginIndex
    let currentPageSize
    dispatch({ payload: { findFileLoading: true } })
    if (isDir) {
      res = await findDirApi({
        recTypeId, recId, subRecTypeId, subRecId
      })
    } else {
      const { newBeginIndex, newPageSize } = temp
      currentBeginIndex = typeof newBeginIndex === 'undefined' ? beginIndex : newBeginIndex
      currentPageSize = typeof newPageSize === 'undefined' ? pageSize : newPageSize
      res = await findFileApi({
        filterInfo: { recTypeId, recId, subRecTypeId, subRecId },
        pageInfo: { pageSize: currentPageSize, beginIndex: currentBeginIndex }
      })
    }
    let files = isDir ? res : res.content
    dispatch({
      payload: {
        findFileLoading: false,
        total: res.totalCount,
        files,
        beginIndex: currentBeginIndex,
        pageSize: currentPageSize,
        pageIndex: res.currentPage,
        selectedRowKeys: [],
        checkboxState: {
          checkAll: false,
          indeterminate: false
        }
      }
    })
  }, [recTypeId, recId, subRecTypeId, subRecId, beginIndex, pageSize])

  useEffect(() => {
    findFiles({})
  }, [])

  // 文件删除图表点击
  const fileDelete = useCallback(debounce((delIds?: string[]): any => {
    let ids = typeof delIds === 'undefined' ? selectedRowKeys : delIds
    if (ids.length === 0) return message.warning(tr('请选择需要删除的文档'))
    Modal.confirm({
      title: tr('提示'),
      content: tr(`是否删除选择的${ids.length}个文档?`),
      okText: tr('删除'),
      okType: 'danger',
      cancelText: tr('取消'),
      centered: true,
      cancelButtonProps: { size: 'small' },
      okButtonProps: { size: 'small' },
      onOk: async () => {
        try {
          let res = await removeFileApi(ids)
          if (res === 'OK') {
            if (isDir) {
              findFiles({})
            } else {
              let newFiles = files.filter((item: any) => !ids.includes(item.id))
              dispatch({ payload: { files: newFiles, selectedRowKeys: [] } })
            }
          }
        } catch (error) {
        }
      }
    })
  }, 300), [files, selectedRowKeys, isDir])

  // 文件下载图表点击
  const fileDownload = useCallback(debounce((downIds?: string[]): any => {
    let ids = typeof downIds === 'undefined' ? selectedRowKeys : downIds
    if (ids.length === 0) return message.warning(tr('请选择需要下载的文档'))
    downloadFileApi(ids)
  }, 300), [selectedRowKeys])

  // 描述信息修改图表点击事件
  const fileEdit = useCallback(debounce((editIds?: string[]): any => {
    let ids = typeof editIds === 'undefined' ? selectedRowKeys : editIds
    if (ids.length === 0) return message.warning(tr('请选择需要编辑的文档'))
    if (ids.length > 1) return message.warning(tr('只能选择一个文档'))
    let currentFile = showFiles.find((item: any) => item.id === ids[0])
    dispatch({ payload: { showEditModal: true, editFile: currentFile } })
  }, 300), [selectedRowKeys, showFiles])

  // 预览文件
  const filePreview = useCallback(debounce(async (file: any) => {
    const currentZmage = zmageRef.current.coverRef.current
    // 当前预览文件和上次是同一个
    if (currentPreviewFile.id === file.id && currentPreviewFile.text) {
      return dispatch({ payload: { showPreviewModal: true } })
    }
    if (currentPreviewFile.id === file.id && currentPreviewFile.imageUrl) {
      return currentZmage.click()
    }
    try {
      message.loading(tr('正在生成预览文件，请等待...'))
      let previewInfo = await getFilePreviewInfoApi(file.id)
      let { previewId, mimeType } = previewInfo
      let previewFile = await previewFileApi(previewId, mimeType)
      if (TEXT_FILES.some((item: string) => mimeType.indexOf(item) !== -1)) {
        dispatch({ payload: { currentPreviewFile: { id: file.id, text: previewFile, name: file.name }, showPreviewModal: true } })
      } else if (IMAGE_FILES.some((item: string) => mimeType.indexOf(item) !== -1)) {
        dispatch({ payload: { currentPreviewFile: { id: file.id, imageUrl: previewFile, name: file.name } } })
        try {
          currentZmage.click()
        } catch (error) {
          message.error(tr('图片预览失败'))
          console.error(error)
        }
      }
    } catch (error) {
    }
    message.destroy()
  }, 300), [currentPreviewFile])

  // 改变展示类型
  const onShowTypeChange = useCallback(() => {
    dispatch({ payload: { showType: showType === ShowType.Table ? ShowType.List : ShowType.Table } })
  }, [showType])

  // 文件夹重命名
  const fileDirRename = useCallback(debounce((editIds: string[]) => {
    let ids = typeof editIds === 'undefined' ? selectedRowKeys : editIds
    let currentFile = showFiles.find((item: any) => item.id === ids[0])
    if (currentFile.type !== 'folder') {
      message.warning(tr('请选择一个文件夹'))
      return
    }
    dispatch({ payload: { showDirAddModal: true, dirAddType: 'rename', editDirName: currentFile.name } })
  }, 300), [selectedRowKeys, showFiles])

  // 共有菜单操作
  const headerRight = useMemo(() => {
    return (
      <TitleOperates
        selectedRowKeys={selectedRowKeys}
        showType={showType}
        addAble={addAble}
        downloadAble={downloadAble}
        deleteAble={deleteAble}
        editAble={editAble}
        switchAble={switchAble}
        officeAble={officeAble}
        refresh={findFiles}
        dispatch={dispatch}
        isDir={isDir}
        extra={extra}
        fileEdit={fileEdit}
        fileDownload={fileDownload}
        fileDelete={fileDelete}
        onShowTypeChange={onShowTypeChange}
        fileDirRename={fileDirRename}
        fetchLoading={findFileLoading}
      />
    )
  }, [selectedRowKeys, showType, addAble, downloadAble, deleteAble, editAble, switchAble, extra, officeAble, fileDirRename, findFileLoading])

  return (
    <>
      {
        {
          table: (
            <TableShow
              state={state}
              dispatch={dispatch}
              headerRight={headerRight}
              findFiles={findFiles}
              filePreview={filePreview}
              fileDelete={fileDelete}
              fileDownload={fileDownload}
              fileEdit={fileEdit}
              officeAble={officeAble}
              downloadAble={downloadAble}
              editAble={editAble}
              deleteAble={deleteAble}
              previewAble={previewAble}
              height={height}
              title={resTitle}
              headerProps={headerProps}
              isDir={isDir}
              files={showFiles}
            />
          ),
          list: (
            <ListShow
              state={state}
              dispatch={dispatch}
              headerRight={headerRight}
              findFiles={findFiles}
              officeAble={officeAble}
              downloadAble={downloadAble}
              editAble={editAble}
              deleteAble={deleteAble}
              previewAble={previewAble}
              height={height}
              title={resTitle}
              headerProps={headerProps}
              isDir={isDir}
              files={showFiles}
            />
          )
        }[showType]
      }

      <FileContextMenu
        dispatch={dispatch}
        filePreview={filePreview}
        fileDelete={fileDelete}
        fileDownload={fileDownload}
        fileEdit={fileEdit}
        officeAble={officeAble}
        downloadAble={downloadAble}
        editAble={editAble}
        deleteAble={deleteAble}
        previewAble={previewAble}
        isDir={isDir}
        fileDirRename={fileDirRename}
        files={showFiles}
      />

      <FilePreview
        state={state}
        zmageRef={zmageRef}
        dispatch={dispatch}
      />

      <FileEdit
        state={state}
        dispatch={dispatch}
        isDir={isDir}
        refresh={findFiles}
      />

      <FileUpload
        show={showFileUploadModal}
        dispatch={dispatch}
        pageFiles={files}
        findFilesFunc={findFiles}
        recTypeId={recTypeId}
        recId={recId}
        subRecTypeId={subRecTypeId}
        subRecId={subRecId}
        isDir={isDir}
        pathId={dirId}
      />

      <OfficeAddModal
        visible={showOfficeAddModal}
        dispatch={dispatch}
        refresh={findFiles}
        recTypeId={recTypeId}
        recId={recId}
        subRecTypeId={subRecTypeId}
        subRecId={subRecId}
        pathId={dirId}
      />

      <DirAddModal
        visible={showDirAddModal}
        recTypeId={recTypeId}
        recId={recId}
        subRecTypeId={subRecTypeId}
        subRecId={subRecId}
        dispatch={dispatch}
        refresh={findFiles}
        type={dirAddType}
        name={editDirName}
        newId={dirId}
        editId={selectedRowKeys[0]}
        files={showFiles}
      />

      <FileMove
        visible={showFileMoveModal}
        dispatch={dispatch}
        recTypeId={recTypeId}
        recId={recId}
        subRecTypeId={subRecTypeId}
        subRecId={subRecId}
        fileId={selectedRowKeys[0]}
        files={files}
        refresh={findFiles}
      />
    </>
  )
}
