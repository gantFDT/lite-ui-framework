import React, { useCallback, useState, useRef, useMemo } from 'react'
import { Button, message } from 'antd'
import { SmartModal, UserSelector } from '@/components/specific'
import { showInfoMsg } from '@/utils/utils'
import { getUserInfo } from '@/utils/user'
import { modalSchema, modalUISchema } from './schema'
import { getWorkflowConfig } from '../utils'
import { doDispatchApi } from '../service'

interface DispatchLogModal {
  processIds: string[] // 流程ids
  taskIds: string[] // 任务ids
  visible: boolean // 弹框是否可见
  onClose: () => void // 关闭弹框的回调
  onDispatched: () => void // 转派成功的回调
  forceDispatch?: boolean // 是否强制转派 值为“true”时系统将不检查操作人是否为任务的拥有人，值为“false”时操作人必须是任务的拥有人
}

const INIT_STATE = {
  width: 760,
  height: 280
}

/**
 * 转派日志弹框组件,用于处理转派任务
 */
export default (props: DispatchLogModal) => {
  const {
    processIds,
    taskIds,
    visible,
    onClose,
    onDispatched,
    forceDispatch = false
  } = props

  const formSchemaRef = useRef<any>({})
  const [formData, setFormData] = useState<any>({})
  const [dispatchLoading, setDispatchLoading] = useState(false)
  const { dispatchComment } = useMemo(() => {
    let config = getWorkflowConfig() || {}
    return config
  }, [])

  const onFormChange = useCallback((value: any, values: any) => {
    setFormData(values)
  }, [])

  const onClose_ = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const doDispatchImpl = useCallback(async (user: any, dispatchComment: string = '') => {
    setDispatchLoading(true)
    try {
      const { userLoginName, userName } = user
      let msg = await doDispatchApi({
        dispatchUserLoginName: userLoginName,
        dispatchUserName: userName,
        force: forceDispatch,
        processIds,
        taskIds,
        dispatchComment
      })
      showInfoMsg(msg)
      onDispatched && onDispatched()
      onClose_()
    } catch (error) {

    }
    setDispatchLoading(false)
  }, [taskIds, processIds, onClose_, forceDispatch])

  const onOk_ = useCallback(async () => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!_.isEmpty(validateRes.errors)) {
      return
    }
    const { dispatchComment, userId } = formData
    const user = getUserInfo(userId)
    doDispatchImpl(user, dispatchComment)
  }, [formData, onClose_, doDispatchImpl])

  const onUserSelectorOk = useCallback((userIds: string[], users: any[]) => {
    if (users.length === 0) {
      message.warn(tr('请选择用户'))
      return
    }
    let user = users[0] || {}
    doDispatchImpl(user)
  }, [doDispatchImpl])

  return (
    <>
      {dispatchComment
        ? (<SmartModal
          id='dispatchLogModal'
          title={`${tr('转派审批任务')}`}
          isModalDialog
          maxZIndex={12}
          itemState={INIT_STATE}
          visible={visible}
          schema={modalSchema}
          uiSchema={modalUISchema}
          formSchemaProps={{
            wrappedComponentRef: formSchemaRef,
            onChange: onFormChange
          }}
          data={formData}
          onCancel={onClose_}
          canMaximize={false}
          canResize={false}
          footer={(
            <>
              <Button size='small' onClick={onClose_}>{tr('取消')}</Button>
              <Button
                size='small'
                type='primary'
                loading={dispatchLoading}
                onClick={onOk_}
              >{tr('确定')}</Button>
            </>
          )}
        />)
        : (
          <UserSelector.Modal
            title={`${tr('转派审批任务')}`}
            visible={visible}
            onCancel={onClose_}
            onOk={onUserSelectorOk}
          />
        )}
    </>
  )
}
