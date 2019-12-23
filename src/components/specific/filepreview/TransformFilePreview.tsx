import React from 'react'
import { Modal, Input, Button } from 'antd'
import Zmage from 'react-zmage'
import styles from './index.less'
import { tr } from '@/components/common'

interface FilePreviewProp {
  state: any,
  zmageRef: any,
  dispatch: Function
}

/**
 * 文件预览
 * @param props 
 */
export default function FilePreview(props: FilePreviewProp) {
  const { state, zmageRef, dispatch } = props
  const { currentPreviewFile, showPreviewModal } = state
  const { imageUrl, name, text } = currentPreviewFile

  const closePreViewModal = () => {
    dispatch({ payload: { showPreviewModal: false } })
  }

  return (
    <>
      <div className={styles.zmageWrapper}>
        <Zmage src={imageUrl} ref={zmageRef} />
      </div>
      <Modal
        style={{ top: 25 }}
        width='80%'
        title={tr(`文件 ${name} 预览`)}
        visible={showPreviewModal}
        onCancel={closePreViewModal}
        footer={[
          <Button size="small"   onClick={closePreViewModal}>{tr('关闭')}</Button>
        ]}
      >
        <Input.TextArea
          autoSize={{ minRows: 20 }}
          readOnly
          value={text}
        />
      </Modal>
    </>
  )
}
