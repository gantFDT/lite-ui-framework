import React, { ReactNode } from 'react'
import { Progress, Modal } from 'antd'
import styles from './index.less'

interface ProgressModalProps {
  visible: boolean // 是否显示
  type?: 'circle' | 'line' // 显示类型
  status: 'success' | 'exception' | 'normal' | 'active' // 状态 active仅限type为line
  percent: number // 进度百分比
  topContent?: ReactNode // 进度条上面自定义内容
  bottomContent?: ReactNode // 进度条下面自定义内容
  closable?: boolean // 是否显示右上角的关闭按钮
  maskClosable?: boolean // 点击蒙层是否允许关闭
  onClose?: () => void // 关闭modal的回调
  width?: number // 宽度
}

/**
 * 进度条弹窗
 * @param props
 */
export default (props: ProgressModalProps) => {
  const {
    visible,
    type = 'circle',
    onClose,
    percent,
    status,
    topContent,
    bottomContent,
    closable = false,
    maskClosable = false,
    width = 300
  } = props

  return (
    <Modal
      visible={visible}
      footer={null}
      centered
      onCancel={onClose}
      closable={closable}
      maskClosable={maskClosable}
      width={width}
      wrapClassName={styles.progressModal}
      destroyOnClose
    >
      {topContent}
      <Progress
        type={type}
        percent={percent}
        status={status}
      />
      {bottomContent}
    </Modal>
  )
}
