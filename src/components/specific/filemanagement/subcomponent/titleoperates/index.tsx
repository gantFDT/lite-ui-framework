import React, { ReactNode } from 'react'
import { Button, Tooltip, Menu, Icon, Dropdown } from 'antd'
import { ShowType } from '@/components/specific/filemanagement'
import styles from './index.less'

interface TitleOperatesProps {
  selectedRowKeys: string[]
  showType: ShowType
  addAble: boolean
  downloadAble: boolean
  deleteAble: boolean
  editAble: boolean
  switchAble: boolean
  extra: ReactNode | string
  officeAble: boolean
  isDir: boolean
  dispatch: Function
  fileEdit: Function
  fileDownload: Function
  fileDelete: Function
  onShowTypeChange: Function
  refresh: Function
  fileDirRename: Function
  fetchLoading: boolean
}

/**
 * 标题操作栏
 */
export default (props: TitleOperatesProps) => {
  const {
    selectedRowKeys,
    showType,
    addAble,
    downloadAble,
    deleteAble,
    editAble,
    switchAble, extra,
    officeAble,
    isDir,
    dispatch,
    fileEdit,
    fileDelete,
    fileDownload,
    onShowTypeChange,
    refresh,
    fileDirRename,
    fetchLoading
  } = props

  const showMultiAdd = [officeAble, addAble, isDir].filter(item => item).length > 1
  const multiAdd = (
    <Menu>
      {isDir && (
        <Menu.Item onClick={() => { dispatch({ payload: { showDirAddModal: true, dirAddType: 'new' } }) }}>
          <Icon type='file-add' />
          {tr('新建文件夹')}
        </Menu.Item>
      )}
      {(officeAble) && (
        <Menu.Item onClick={() => { dispatch({ payload: { showOfficeAddModal: true } }) }}>
          <Icon type='file-add' />
          {tr('创建office文档')}
        </Menu.Item>
      )}
      <Menu.Item onClick={() => { dispatch({ payload: { showFileUploadModal: true } }) }}>
        <Icon type='file-add' />
        {tr('添加文档')}
      </Menu.Item>
    </Menu>
  )

  const showMultiEdit = [editAble, isDir].filter(item => item).length > 1
  const multiEdit = (
    <Menu>
      {isDir && (
        <Menu.Item
          onClick={fileDirRename.bind(null, undefined)}
          disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
        >
          <Icon type='edit' />
          {tr('文件夹重命名')}
        </Menu.Item>
      )}
      <Menu.Item
        onClick={fileEdit.bind(null, undefined)}
        disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}>
        <Icon type='edit' />
        {tr('修改描述')}
      </Menu.Item>
    </Menu>
  )

  return (
    <div className={styles.headerRight}>
      {extra}
      {showMultiAdd && addAble && (
        <Tooltip title={tr('添加')}>
          <Dropdown overlay={multiAdd} trigger={['click']}>
            <Button size="small" icon='plus' />
          </Dropdown>
        </Tooltip>
      )}
      {!showMultiAdd && addAble && (
        <Tooltip title={tr('添加文档')}>
          <Button size="small"
            icon='plus'
            onClick={() => { dispatch({ payload: { showFileUploadModal: true } }) }}
          />
        </Tooltip>
      )}
      {showMultiEdit && editAble && (
        <Tooltip title={tr('编辑')}>
          <Dropdown overlay={multiEdit} trigger={['click']} disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}>
            <Button size="small" icon='edit' />
          </Dropdown>
        </Tooltip>
      )}
      {!showMultiEdit && editAble && (
        <Tooltip title={tr('修改描述')}>
          <Button size="small"
            icon='edit'
            onClick={fileEdit.bind(null, undefined)}
            disabled={selectedRowKeys.length === 0 || selectedRowKeys.length > 1}
          />
        </Tooltip>
      )}
      {downloadAble && (
        <Tooltip title={tr('下载文档')}>
          <Button size="small"
            icon='download'
            onClick={fileDownload.bind(null, undefined)}
            disabled={selectedRowKeys.length === 0}
          />
        </Tooltip>
      )}
      {deleteAble && (
        <Tooltip title={tr('删除文档')}>
          <Button size="small"
            icon='delete'
            type='danger'
            onClick={fileDelete.bind(null, undefined)}
            disabled={selectedRowKeys.length === 0}
          />
        </Tooltip>
      )}
      {switchAble && (
        <Tooltip title={showType === ShowType.Table ? tr('平铺') : tr('列表')}>
          <Button
            size="small"
            icon={showType === ShowType.Table ? 'appstore' : 'menu'}
            onClick={onShowTypeChange.bind(null)}
          />
        </Tooltip>
      )}
      <Tooltip title={tr('刷新')}>
        <Button size="small" icon='redo' loading={fetchLoading} onClick={() => refresh({})} />
      </Tooltip>
    </div>
  )
}
