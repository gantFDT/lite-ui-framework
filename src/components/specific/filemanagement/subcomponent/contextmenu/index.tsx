import React, { useState, useMemo, useCallback } from 'react'
import { ContextMenu, MenuItem } from 'react-contextmenu'
import classnames from 'classnames'
import { FileOperateProps } from '@/components/specific/filemanagement'
import { tr } from '@/components/common'
import styles from './index.less'
import { docEdit } from '../../utils'

interface FileContextMenuProps extends FileOperateProps {
  dispatch: Function,
  filePreview: Function,
  fileDownload: Function,
  fileEdit: Function,
  fileDelete: Function,
  isDir: boolean,
  fileDirRename: Function,
  files: any[]
}

/**
 * 鼠标右键
 * @param props
 */
export default function FileContextMenu(props: FileContextMenuProps) {
  const {
    dispatch,
    filePreview,
    fileDownload,
    fileDelete,
    fileEdit,
    officeAble,
    downloadAble,
    deleteAble,
    editAble,
    previewAble,
    isDir,
    fileDirRename,
    files
  } = props
  const [fileId, setFileId] = useState('')
  const currentFile = useMemo(() => {
    return files.find(item => item.id === fileId) || {}
  }, [fileId, files])
  const { preview: hoverFilePreview, id: hoverFileId, editable: docEditAble, type } = currentFile

  // 菜单样式
  const contextMenuClass = classnames(styles['react-contextmenu'])
  const menuItemClass = classnames(styles['react-contextmenu-item'])

  // 预览
  const currentFilePreview = useCallback(() => {
    filePreview(files.find((item: any) => item.id === fileId))
  }, [files, fileId])

  return (
    <ContextMenu
      id="file-management-menu-context"
      className={contextMenuClass}
      onShow={(e: any) => {
        const { detail: { data: { target } } } = e
        const tempFileId = target.currentFileId
        setFileId(tempFileId)
        dispatch({
          payload: {
            selectedRowKeys: [tempFileId],
            checkboxState: { checkAll: false, indeterminate: true }
          }
        })
      }}
    >
      {
        _.isEmpty(currentFile) ? null : (
          <>
            {officeAble && previewAble && docEditAble && (
              <MenuItem
                attributes={{
                  className: classnames(menuItemClass)
                }}
                onClick={docEdit.bind(null, hoverFileId, 'preview')}
              >{tr('预览')}</MenuItem>)}
            {previewAble && (!docEditAble) && (
              <MenuItem
                disabled={!hoverFilePreview}
                attributes={{
                  className: classnames(menuItemClass, {
                    [styles['react-contextmenu-item--disabled']]: !hoverFilePreview
                  })
                }}
                onClick={currentFilePreview}
              >{tr('预览')}</MenuItem>
            )}
            {downloadAble && (
              <MenuItem
                attributes={{
                  className: classnames(menuItemClass, {
                    [styles['react-contextmenu-item--disabled']]: !downloadAble
                  })
                }}
                onClick={fileDownload.bind(null, undefined)}
              >{tr('下载')}</MenuItem>
            )}
            {editAble && (
              <>
                <MenuItem
                  divider
                  attributes={{ className: classnames(styles['react-contextmenu-item--divider']) }}
                />
                {officeAble && docEditAble && (
                  <MenuItem
                    attributes={{ className: classnames(menuItemClass) }}
                    onClick={docEdit.bind(null, hoverFileId, 'edit')}
                  >{tr('编辑文档')}</MenuItem>
                )}
                <MenuItem
                  attributes={{ className: classnames(menuItemClass) }}
                  onClick={fileEdit.bind(null, undefined)}
                >{tr('修改描述')}</MenuItem>
                {isDir && (
                  <MenuItem
                    attributes={{ className: classnames(menuItemClass) }}
                    onClick={() => dispatch({ payload: { showFileMoveModal: true } })}
                  >{tr('移动到')}</MenuItem>
                )}
                {(isDir && type === 'folder') && (
                  <MenuItem
                    attributes={{ className: classnames(menuItemClass) }}
                    onClick={fileDirRename.bind(null, undefined)} >{tr('重命名')}</MenuItem>
                )}
              </>)
            }
            {(deleteAble) && (
              <>
                <MenuItem
                  divider
                  attributes={{ className: classnames(styles['react-contextmenu-item--divider']) }}
                />
                <MenuItem
                  attributes={{ className: classnames(menuItemClass) }}
                  onClick={fileDelete.bind(null, undefined)}>{tr('删除')}</MenuItem>
              </>
            )}
          </>
        )
      }
    </ContextMenu>
  )
}
