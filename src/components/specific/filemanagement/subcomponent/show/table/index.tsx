import React, { useMemo, useCallback, ReactNode } from 'react'
import { Icon, Tooltip } from 'antd'
import { Table } from 'gantd'
import { getIconNameByFileName } from '@/utils/utils'
import { ContextMenuTrigger } from 'react-contextmenu'
import _ from 'lodash'
import { FileOperateProps } from '@/components/specific/filemanagement'
import { tr } from '@/components/common'
import styles from './index.less'
import { useHeight, docEdit } from '../../../utils'
import COLUMNS from './schema'
import FilenameColumn from '../../filenamecolumn'

interface TableShowProp extends FileOperateProps {
  state: any,
  dispatch: Function,
  headerRight: ReactNode,
  findFiles: Function
  filePreview: Function,
  fileDelete: Function,
  fileDownload: Function,
  fileEdit: Function
  height: string
  title: string | ReactNode
  headerProps: any
  isDir: boolean
  files: any[]
}

const INIT_ANY_ARRAY: string[] = []

/**
 * table形式展示文件列表
 * @param props
 */
export default function TableShow(props: TableShowProp) {
  const {
    state,
    dispatch,
    headerRight,
    findFiles,
    filePreview,
    fileDelete,
    officeAble,
    fileDownload,
    fileEdit,
    downloadAble,
    deleteAble,
    editAble,
    previewAble,
    height,
    title,
    headerProps,
    isDir,
    files
  } = props
  const { pageSize, total, findFileLoading, pageIndex, sorterState, selectedRowKeys } = state
  const tableHeight = useHeight(height, 'table', isDir)

  // 多选框点击
  const rowSelection = useMemo(() => ({
    type: isDir ? 'radio' : 'checkbox',
    clickable: true,
    selectedRowKeys,
    onChange: (selectedRowKeys: any) => {
      dispatch({ payload: { selectedRowKeys } })
    },
    showFooterSelection: !isDir
  }), [selectedRowKeys, isDir])

  const onPageChange = useCallback((current: number, newPageSize: number) => {
    let newBeginIndex = pageSize === newPageSize ? (current - 1) * newPageSize : 0
    findFiles({ newBeginIndex, newPageSize })
  }, [findFiles, pageSize])

  // 行
  const onRow = useCallback((record: any) => {
    return { onContextMenu: (e: Event) => { { e.target.currentFileId = record.id } } }
  }, [])

  // 动态设置columns
  let showColumns = useMemo(() => {
    let tempColumns = COLUMNS.map((item: any) => {
      const { dataIndex } = item
      if (dataIndex === 'name') {
        item.render = (name: string, record: any) => <FilenameColumn name={name} width={360} record={record} dispatch={dispatch} />
      }
      if (dataIndex === 'description') {
        item.render = (description: string, record: any) => {
          const { id, preview, name, editable: docEditAble } = record
          return (
            <div className={styles.operateContainer} onClick={(e) => e.stopPropagation()}>
              <Tooltip title={description} placement='bottom'>
                <div className={styles.description}>{description}</div>
              </Tooltip>
              <div className={styles.operateWrapper}>
                {officeAble && editAble && docEditAble && (
                  <Tooltip title={tr('编辑文档')}>
                    <Icon
                      className={styles.operateIcon}
                      type={getIconNameByFileName(name)}
                      onClick={docEdit.bind(null, id, 'edit')}
                    />
                  </Tooltip>
                )}
                {officeAble && previewAble && docEditAble && (
                  <Tooltip title={tr('预览')}>
                    <Icon
                      className={styles.operateIcon}
                      type='eye'
                      onClick={docEdit.bind(null, id, 'preview')}
                    />
                  </Tooltip>
                )}
                {previewAble && preview && (
                  <Tooltip title={tr('预览')}>
                    <Icon
                      className={styles.operateIcon}
                      type='eye'
                      onClick={() => filePreview(record)}
                    />
                  </Tooltip>
                )}
                {downloadAble && (
                  <Tooltip title={tr('下载')}>
                    <Icon
                      className={styles.operateIcon}
                      type='download'
                      onClick={fileDownload.bind(null, [id])}
                    />
                  </Tooltip>
                )}
                {editAble && (
                  <Tooltip title={tr('修改描述')}>
                    <Icon
                      className={styles.operateIcon}
                      type='edit'
                      onClick={fileEdit.bind(null, [id])}
                    />
                  </Tooltip>
                )}
                {deleteAble && (
                  <Tooltip title={tr('删除')}>
                    <Icon
                      className={styles.operateIcon}
                      type='delete'
                      onClick={fileDelete.bind(null, [id])}
                    />
                  </Tooltip>
                )}
              </div>
            </div>
          )
        }
      }

      return item
    })
    return tempColumns
  }, [officeAble, downloadAble, deleteAble, editAble, previewAble, fileEdit, fileDelete])

  const table = useMemo(() => {
    return (
      <Table
        rowKey='id'
        rowClassName={styles.rowWrapper}
        title={title}
        headerRight={headerRight}
        rowSelection={rowSelection}
        columns={showColumns}
        dataSource={files}
        resizeCell
        bordered={false}
        loading={findFileLoading}
        pagination={
          isDir
            ? null
            : {
              pageSize: pageSize,
              total,
              current: pageIndex,
              onChange: onPageChange
            }}
        onRow={onRow}
        scroll={{ y: tableHeight }}
        headerProps={headerProps}
        childrenColumnName={INIT_ANY_ARRAY}
      />
    )
  }, [rowSelection, findFileLoading, pageSize, total, pageIndex, tableHeight, headerRight, showColumns, title, isDir, files, onPageChange, headerProps])

  return (
    <ContextMenuTrigger
      id="file-management-menu-context"
      disable={(!downloadAble && !deleteAble && !editAble && !previewAble)}>
      {table}
    </ContextMenuTrigger >
  )
}
