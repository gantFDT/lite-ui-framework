import React, { useState, useCallback, useMemo, } from 'react'
import { Tree, Button } from 'antd'
import { moveDirApi, BaseFileProps } from '@/services/file'
import { SmartModal } from '@/components/specific'
import { getNodesByType } from '../../utils'

interface FileMoveProps extends BaseFileProps {
  visible: boolean
  dispatch: Function
  fileId: string // 选中文件id
  files: any[] // 整个文件列表
  refresh: Function
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 520
}

/**
 * 文件移动
 * @param props
 */
export default (props: FileMoveProps) => {
  const {
    visible,
    dispatch,
    recTypeId,
    recId,
    subRecId,
    subRecTypeId,
    fileId,
    files,
    refresh
  } = props

  if (!visible) return null
  const [selectedKey, setSelectedKey] = useState('')
  const [selectedName, setSelectedName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showFiles, currentFile] = useMemo(() => {
    let tempFile: any = {}
    let tempFiles = {
      title: tr('全部文件'),
      key: 'ROOT',
      children: getNodesByType(JSON.parse(JSON.stringify(files)), 'folder', fileId, tempFile),
      isLeaf: false
    }
    return [tempFiles, tempFile.file]
  }, [files, fileId])

  const onClose = useCallback(() => {
    dispatch({ payload: { showFileMoveModal: false } })
  }, [dispatch])

  const onMove = useCallback(async () => {
    setLoading(true)
    let params = {
      recTypeId,
      recId,
      subRecId,
      subRecTypeId,
      fileId,
      targetPathId: selectedKey === 'ROOT' ? '' : selectedKey
    }
    try {
      await moveDirApi(params)
      onClose()
      refresh && refresh()
    } catch (error) {
      console.error('onMove', error)
    }
    setLoading(false)
  }, [recTypeId, recId, subRecId, subRecTypeId, fileId, selectedKey])

  const onSelect = useCallback((selectedKey: string[], node_: any) => {
    const { node: { props: { eventKey, title } } } = node_
    setSelectedKey(eventKey)
    setSelectedName(title)
  }, [])

  return (
    <SmartModal
      id='fileManagementFileMove'
      itemState={INIT_ITEM_STATE}
      title={`${currentFile.name} - ${tr('移动到')}${selectedName ? ` - ${selectedName}` : ''}`}
      visible={visible}
      onOk={onMove}
      onCancel={onClose}
      footer={(
        <>
          <Button size='small' onClick={onClose}>{tr('取消')}</Button>
          <Button
            size='small'
            type='primary'
            onClick={onMove}
            loading={loading}
            disabled={!selectedKey}>{tr('确定')}</Button>
        </>
      )}
    >
      <Tree.DirectoryTree
        blockNode
        treeData={showFiles}
        onSelect={onSelect}
        selectedKeys={[selectedKey]}
        defaultExpandedKeys={['ROOT']}
      />
    </SmartModal>
  )
}
