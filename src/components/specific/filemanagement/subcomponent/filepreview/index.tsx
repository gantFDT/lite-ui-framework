import React, { useState, useMemo, useCallback } from 'react'
import { Input, Button } from 'antd'
import Zmage from 'react-zmage'
import styles from './index.less'
import { tr } from '@/components/common'
import { SmartModal } from '@/components/specific'
import { CARD_BORDER_HEIGHT, MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT } from '@/utils/utils'

interface FilePreviewProp {
  state: any,
  zmageRef: any,
  dispatch: Function
}

const INIT_ITEM_STATE = {
  width: 1200,
  height: 660
}

/**
 * 文件预览
 * @param props
 */
export default function FilePreview(props: FilePreviewProp) {
  const { state, zmageRef, dispatch } = props
  const { currentPreviewFile, showPreviewModal } = state
  const { imageUrl, name, text } = currentPreviewFile
  const [modalHeight, setModalHeight] = useState(0)
  const textareaHeight = useMemo(() => {
    return modalHeight - MODAL_HEADER_HEIGHT - 20 - CARD_BORDER_HEIGHT - MODAL_FOOTER_HEIGHT
  }, [modalHeight])

  const closePreViewModal = useCallback(() => {
    dispatch({ payload: { showPreviewModal: false } })
  }, [])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalHeight(height)
  }, [])

  return (
    <>
      <div className={styles.zmageWrapper}>
        <Zmage src={imageUrl} ref={zmageRef} />
      </div>
      <SmartModal
        id='fileManagementFilePreview'
        itemState={INIT_ITEM_STATE}
        title={tr(`文件 ${name} 预览`)}
        visible={showPreviewModal}
        onCancel={closePreViewModal}
        footer={[
          <Button size="small" onClick={closePreViewModal}>{tr('关闭')}</Button>
        ]}
        onSizeChange={onModalSizeChange}
      >
        <Input.TextArea
          readOnly
          value={text}
          style={{
            height: textareaHeight,
            resize: 'none'
          }}
        />
      </SmartModal>
    </>
  )
}
