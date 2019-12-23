import React, { useState, useCallback, ReactNode, useEffect } from 'react'
import TableTransfer, { BaseTableTransferProps } from './index'
import { SmartModal } from '@/components/specific'


export type modalProps = {
  title: ReactNode | string // 弹窗标题
  visible: boolean // modal是否可见
  onCancel?: Function // modal取消按钮的回调
  onOk?: Function // modal确认按钮的回调
  extraModalProps?: any // 额外的modal的参数
}

export type TableTransferModalProps = modalProps & BaseTableTransferProps

const DEFAULT_ANY_OBJECT: any = {}

/**
 * 表格穿梭框弹框组件
 */
export default (props: TableTransferModalProps) => {
  const {
    title,
    visible,
    onCancel,
    onOk,
    extraModalProps = DEFAULT_ANY_OBJECT,
    transKey,
    rowKey,
    schema,
    columns,
    left,
    right,
    dataSource,
    onSearch,
    targetKeys,
    onChange
  } = props

  const [size, setSize] = useState({ width: 0, height: 0 })
  const { footer, itemState } = extraModalProps

  useEffect(() => {
    itemState && setSize({
      width: itemState.width - 20,
      height: itemState.height - 41 - 20 - (footer === null ? 0 : 45)
    })
  }, [itemState, footer])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setSize({
      width: width - 20,
      height: height - 41 - 20 - (footer === null ? 0 : 45)
    })
  }, [footer])

  return (
    <SmartModal
      id={transKey}
      title={title}
      visible={visible}
      onSubmit={onOk}
      onCancel={onCancel}
      {...extraModalProps}
      onSizeChange={onModalSizeChange}
      maxZIndex={1001}
    >
      <TableTransfer
        transKey={transKey}
        rowKey={rowKey}
        schema={schema}
        columns={columns}
        left={left}
        right={right}
        dataSource={dataSource}
        height={size.height}
        width={size.width}
        onSearch={onSearch}
        targetKeys={targetKeys}
        onChange={onChange}
      />
    </SmartModal>
  )
}
