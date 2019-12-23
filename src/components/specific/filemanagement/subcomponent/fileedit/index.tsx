import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { Form, Input } from 'antd'
import { modifyFileDescriptionApi } from '@/services/file'
import { SmartModal } from '@/components/specific'
import { MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT, MODAL_PADDING_HEIGHT } from '@/utils/utils'

interface FileEditProps {
  state: any,
  dispatch: Function
  isDir: boolean
  refresh: Function
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 300
}

/**
 * 文件编辑
 * @param props
 */
export default function FileEdit(props: FileEditProps) {
  const { state, dispatch, isDir, refresh } = props
  const { files, editFile = {}, showEditModal } = state
  const { id, name, description } = editFile
  const [editDes, setEditDes] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [modalHeight, setModalHeight] = useState(0)

  const inputHeight = useMemo(() => {
    return modalHeight - MODAL_HEADER_HEIGHT - MODAL_FOOTER_HEIGHT - 2 * MODAL_PADDING_HEIGHT - 35
  }, [modalHeight])

  useEffect(() => {
    setEditDes(description)
  }, [id, description])

  // 描述信息输入改变
  const descriptionOnChange = useCallback((e: any) => {
    setEditDes(e.target.value)
  }, [])

  const onClose = useCallback(() => {
    dispatch({ payload: { showEditModal: false } })
  }, [dispatch])

  // 描述信息修改确认按钮点击
  const fileEditOnOK = useCallback(async () => {
    setLoading(true)
    let newFiles = []
    try {
      let requestRes = await modifyFileDescriptionApi({ id, description: editDes })

      if (isDir) {
        refresh && refresh({})
      } else {
        // 更新当前列表中
        if (requestRes === 'OK') {
          newFiles = files.map((item: any) => {
            if (id === item.id) {
              item.description = editDes
            }
            return { ...item }
          })
        }

        let params = { showEditModal: false, modifyFileLoading: false, selectedRowKeys: [] }
        if (newFiles.length !== 0) {
          params['files'] = newFiles
        }
        dispatch({ payload: { ...params } })
      }

      onClose()
    } catch (error) {
    }
    setLoading(false)
  }, [files, id, editDes, isDir, dispatch, onClose, refresh])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalHeight(height)
  }, [])

  return (
    <SmartModal
      id='fileManagementFileEdit'
      itemState={INIT_ITEM_STATE}
      title={tr(`修改描述 - ${name}`)}
      visible={showEditModal}
      onOk={fileEditOnOK}
      onCancel={onClose}
      okText={tr('保存')}
      cancelText={tr('取消')}
      confirmLoading={loading}
      canMaximize={false}
      canResize={false}
      onSizeChange={onModalSizeChange}
    >
      <Form>
        <Form.Item label={tr('文档描述')}>
          <Input.TextArea
            placeholder={tr('请在此处输入文档描述信息')}
            value={editDes}
            onChange={descriptionOnChange}
            style={{ height: inputHeight, resize: 'none' }}
          />
        </Form.Item>
      </Form>
    </SmartModal>
  )
}
