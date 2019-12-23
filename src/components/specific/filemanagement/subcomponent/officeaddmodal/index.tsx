import React, { useState, useRef, useCallback } from 'react'
import { isEmpty } from 'lodash'
import { SmartModal } from '@/components/specific'
import { createOfficeOnlineApi, BaseFileProps } from '@/services/file'
import schema from './schema'

interface OfficeAddModalProps extends BaseFileProps {
  visible: boolean
  dispatch: Function
  refresh: Function
  pathId: string
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 363
}

/**
 * office文档添加
 * @param props
 */
export default (props: OfficeAddModalProps) => {
  const {
    visible,
    dispatch,
    refresh,
    recTypeId,
    recId,
    subRecTypeId,
    subRecId,
    pathId = ''
  } = props

  if (!visible) return null
  const [loading, setLoading] = useState(false)
  const formSchemaRef = useRef<any>({})
  const [data, setData] = useState<any>({})

  const closeModal = () => {
    dispatch && dispatch({
      payload: {
        showOfficeAddModal: false
      }
    })
  }

  const onChange = useCallback((value: any, values: any) => {
    setData(values)
  }, [])

  const createOfficeFile = useCallback(async () => {
    let params_ = {
      recTypeId,
      recId,
      subRecTypeId,
      subRecId,
      pathId,
      ...data
    }
    setLoading(true)
    try {
      await createOfficeOnlineApi(params_)
      refresh && refresh({})
      closeModal()
    } catch (error) {
      console.log('createOfficeFile error\n', error)
    }
    setLoading(false)
  }, [recTypeId, recId, subRecTypeId, subRecId, pathId, data])

  const onOk = useCallback(async (e: any) => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!isEmpty(validateRes.errors)) {
      return
    }
    createOfficeFile()
  }, [createOfficeFile])

  return (
    <SmartModal
      id='fileManagementOfficeAddModal'
      title={tr('创建office文档')}
      visible={visible}
      destroyOnClose
      onCancel={closeModal}
      onOk={onOk}
      confirmLoading={loading}
      itemState={INIT_ITEM_STATE}
      canMaximize={false}
      canResize={false}
      schema={schema}
      values={data}
      formSchemaProps={{
        wrappedComponentRef: formSchemaRef,
        onChange
      }}
    />
  )
}
