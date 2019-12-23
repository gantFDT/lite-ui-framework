import React, { useState, useRef, useCallback, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { SmartModal } from '@/components/specific'
import { createDirApi, BaseFileProps, modifyDirNameApi } from '@/services/file'
import schema from './schema'

interface DirAddProps extends BaseFileProps {
  visible: boolean
  dispatch: Function
  refresh: Function
  type: 'new' | 'rename' // 新建 | 重命名
  newId: string // 新建的id
  editId: string // 编辑的id
  name: string
  files: any[] // 当前目录文件列表
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 190
}

/**
 * 文件目录编辑与创建
 * @param props
 */
export default (props: DirAddProps) => {
  const {
    visible,
    dispatch,
    refresh,
    recTypeId,
    recId,
    subRecTypeId,
    subRecId,
    type,
    newId,
    editId,
    name,
    files
  } = props
  if (!visible) return null

  const [loading, setLoading] = useState(false)
  const formSchemaRef = useRef<any>({})
  const [data, setData] = useState({ dirName: type === 'rename' ? name : '' })
  const dirNames = useMemo(() => {
    let tempDirs = files.filter(item => type === 'rename' ? (item.type === 'folder' && item.id !== editId) : item.type === 'folder').map(item => item.name)
    return tempDirs
  }, [files, type, editId])

  const onChange = useCallback((value: any) => {
    setData(value)
  }, [])

  const onClose = useCallback(() => {
    dispatch({ payload: { showDirAddModal: false } })
  }, [])

  const createDir = useCallback(async () => {
    let params: any = {
      recTypeId,
      recId,
      subRecTypeId,
      subRecId,
      dirName: data.dirName,
      id: type === 'rename' ? editId : ''
    }
    if (type === 'new' && newId) {
      params.pathId = newId
    }
    setLoading(true)
    try {
      if (type === 'rename') {
        await modifyDirNameApi(params)
      } else {
        await createDirApi(params)
      }
      refresh && refresh()
      onClose()
    } catch (error) {
      console.error('createDir error', error)
    }
    setLoading(false)
  }, [recTypeId, recId, subRecTypeId, subRecId, type, data, newId, editId])

  const onOk = useCallback(async () => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!isEmpty(validateRes.errors)) {
      return
    }
    createDir()
  }, [createDir])

  const showSchema = useMemo(() => {
    let tempSchema = JSON.parse(JSON.stringify(schema))
    tempSchema.propertyType.dirName.options.rules.push({
      message: tr('已存在同名文件夹'),
      validator: function (rule: any, value: string, callback: Function) {
        let tempValue = value ? value.trim() : value
        if (dirNames.includes(tempValue)) {
          callback(true)
        }
        callback(undefined)
      }
    })
    return tempSchema
  }, [dirNames])

  return (
    <SmartModal
      id='fileManagementDirAddModal'
      title={type === 'new' ? tr('新建文件夹') : tr('重命名文件夹')}
      visible={visible}
      destroyOnClose
      onCancel={onClose}
      onOk={onOk}
      confirmLoading={loading}
      itemState={INIT_ITEM_STATE}
      schema={showSchema}
      canMaximize={false}
      canResize={false}
      values={data}
      formSchemaProps={{
        wrappedComponentRef: formSchemaRef,
        onChange
      }}
    />
  )
}
