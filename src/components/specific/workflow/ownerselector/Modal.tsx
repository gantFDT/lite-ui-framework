import React, { ReactNode, useCallback, useState, useMemo } from 'react'
import SmartModal, { initalState } from '@/components/specific/smartmodal'
import Panel, { BaseOwnerSelctorProps } from './Panel'
import { getUserInfo } from '@/utils/user'

interface OwnerSelctorModalProps extends BaseOwnerSelctorProps {
  visible: boolean
  id?: string
  title?: string | ReactNode
  initalState?: initalState
  onCancel: () => void | any
  onOk: (res: any[]) => void | any
  maxZIndex?: number
  confirmLoading?: boolean
}

const DEFAULT_INITAL_STATE: initalState = {
  width: 1090,
  height: 650
}

/**
 * 候选人选择器弹窗
 */
export default (props: OwnerSelctorModalProps) => {
  const {
    visible,
    id = 'owners-selector-modal',
    title = tr('选择操作候选人'),
    initalState = DEFAULT_INITAL_STATE,
    onCancel,
    onOk,
    maxZIndex = 1003,
    confirmLoading,
    ownerList,
    selectedLoginNames,
    isAllUser
  } = props
  if (!visible) return null
  const [selectedUsers, setSelectedUsers] = useState<any[]>([])
  const [selectedLoginNames_, setSelectedLoginNames] = useState(selectedLoginNames)
  const [modalSize, setModalSize] = useState({ width: initalState.width, height: initalState.height })

  const onChange = useCallback((selectedUsers: any[]) => {
    setSelectedUsers(selectedUsers)
    setSelectedLoginNames(selectedUsers.map((item: any) => item.userLoginName))
  }, [])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalSize({
      width: width - 20,
      height: height - 41 - 20 - 45
    })
  }, [])

  const onOk_ = useCallback(() => {
    onOk && onOk(selectedUsers)
  }, [selectedLoginNames_, selectedUsers])

  const setUesrs = useCallback(async (selectedLoginNames: string[]) => {
    // 获得已选择用户ids
    let getUserInfos = selectedLoginNames.map(item => getUserInfo(null, item))
    let selectedUsers = await Promise.all(getUserInfos)
    setSelectedUsers(selectedUsers)
  }, [])

  useMemo(() => {
    setSelectedLoginNames(selectedLoginNames)
    setUesrs(selectedLoginNames)
  }, [selectedLoginNames])

  return (
    <SmartModal
      maxZIndex={maxZIndex}
      visible={visible}
      id={id}
      title={title}
      itemState={initalState}
      onSubmit={onOk_}
      onCancel={onCancel}
      confirmLoading={confirmLoading}
      isModalDialog
      onSizeChange={onModalSizeChange}
    >
      <Panel
        transKey={id}
        selectedLoginNames={selectedLoginNames_}
        ownerList={ownerList}
        isAllUser={isAllUser}
        onChange={onChange}
        height={modalSize.height}
        width={modalSize.width}
      />
    </SmartModal>
  )
}
