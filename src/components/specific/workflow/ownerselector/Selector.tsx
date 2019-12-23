import React, { useState, useCallback } from 'react'
import { Input, EditStatus } from 'gantd'
import Modal from './Modal'
import { Owner } from './Panel'

interface OwnerSelctorProps {
  value: string[]
  ownerList: Owner[] // 可供选择的候选人列表
  edit?: EditStatus
  allowEdit?: boolean
  allowClear?: boolean
  placeholder?: string
  onBlur?: Function
  onChange?: Function
}

/**
 * 候选人选择器
 */
export default (props: OwnerSelctorProps) => {
  const {
    value,
    ownerList,
    allowEdit = true,
    edit,
    placeholder = tr('请选择...'),
    allowClear = true,
    onBlur,
    onChange,
    ...res
  } = props

  const [visible, setVisible] = useState(false)
  const [isMouseOver, setIsMourseOver] = useState(false)

  const customOnFlur = useCallback(() => {
    if (!isMouseOver) {
      onBlur && onBlur()
    }
  }, [onBlur, isMouseOver])

  const onOk = useCallback((res: any[]) => {
    onChange && onChange(res)
    setVisible(false)
    onBlur && onBlur()
  }, [])

  const onSearch = useCallback((value: string, e: Event) => {
    // 当前是清空
    if (e.target.tagName === 'INPUT') {
      onChange && onChange([])
      onBlur && onBlur()
    } else {
      setVisible(true)
    }
  }, [])

  const onCancel = useCallback(() => {
    setVisible(false)
    onBlur && onBlur()
  }, [])

  return allowEdit
    ? (<>
      <span
        onMouseOver={() => setIsMourseOver(true)}
        onMouseLeave={() => setIsMourseOver(false)}
      >
        <Input.Search
          value={value}
          placeholder={placeholder}
          edit={edit}
          allowClear={allowClear}
          allowEdit={false}
          {...res}
          onBlur={customOnFlur}
          onSearch={onSearch}
        />
      </span>
      <Modal
        visible={visible}
        onCancel={onCancel}
        selectedLoginNames={value}
        ownerList={ownerList}
        onOk={onOk}
      />
    </>)
    : (<span>{value}</span>)
}
