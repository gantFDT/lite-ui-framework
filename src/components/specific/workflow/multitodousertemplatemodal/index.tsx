import React, { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { isEmpty } from 'lodash'
import { Button } from 'antd'
import { Table } from 'gantd'
import { SmartModal } from '@/components/specific'
import SchemaForm from '@/components/form/schema'
import { confirmUtil, MODAL_HEADER_HEIGHT, MODAL_FOOTER_HEIGHT, MODAL_PADDING_HEIGHT, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { column, formSchema } from './schema'
import { findMultiTaskUserTemplateApi } from '../service'
import styles from './index.less'

interface MultiTodoUserTemplateModalProps {
  type: 'load' | 'save' // 加载|保存
  templateKey: string // 模板key
  visible: boolean
  onClose: Function
  onSave?: (userTemplateName: string) => void // 保存模板的回调
  onLoad?: (taskUsers: any[]) => void // 加载模板的回调
  loading?: boolean
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 380
}

/**
 * 多模式代办人模板弹框组件
 */
export default (props: MultiTodoUserTemplateModalProps) => {
  const {
    type,
    templateKey,
    visible,
    onClose,
    onSave,
    onLoad,
    loading = false
  } = props

  if (!visible) return null
  const formSchemaRef = useRef<any>({})
  const [templates, setTemplates] = useState<any[]>([])
  const [data, setData] = useState<any>({ userTemplateName: '' })
  const [fetchLoading, setFetchLoading] = useState(false)
  const [selectedRowKeys, setSelectedRowKeys] = useState<string[]>([])
  const [modalHeight, setModalHeight] = useState(0)
  const tableHeight = useMemo(() => {
    return modalHeight - MODAL_HEADER_HEIGHT - MODAL_FOOTER_HEIGHT - 2 * MODAL_PADDING_HEIGHT - TABLE_HEADER_HEIGHT - CARD_BORDER_HEIGHT - (type === 'save' ? 95 : 0)
  }, [type, modalHeight])

  const findMultiTaskUserTemplate = useCallback(async () => {
    setFetchLoading(true)
    try {
      let res = await findMultiTaskUserTemplateApi(templateKey)
      setTemplates(res)
    } catch (error) {

    }
    setFetchLoading(false)
  }, [templateKey])

  useEffect(() => {
    findMultiTaskUserTemplate()
  }, [])

  const closeModal = useCallback(() => {
    onClose && onClose()
  }, [onClose])

  const onChange = useCallback((value: any, values: any) => {
    setData(values)
  }, [])

  // 保存
  const onSave_ = useCallback(async () => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!isEmpty(validateRes.errors)) {
      return
    }

    const { userTemplateName } = data

    let isExistSameName = templates.some((item: any) => item.name === userTemplateName)
    // 重名是否覆盖
    if (isExistSameName) {
      confirmUtil({
        content: tr('模板名称已存在，是否覆盖?'),
        okLoading: false,
        onOk: () => onSave && onSave(userTemplateName)
      })
    } else {
      onSave && onSave(userTemplateName)
    }

  }, [onSave, data, templates])

  // 加载
  const onLoad_ = useCallback(() => {
    let tempObj: any = templates.find((item: any) => item.id === selectedRowKeys[0]) || {}
    onLoad && onLoad(tempObj.taskUsers || [])
  }, [onLoad, templates, selectedRowKeys])

  // 额外的table属性
  const extraTableProps = useMemo(() => {
    let tableProps: any = {}
    if (type === 'load') {
      tableProps.rowSelection = {
        type: 'radio',
        clickable: true,
        selectedRowKeys,
        onChange: (selectedRowKeys: any) => {
          setSelectedRowKeys(selectedRowKeys)
        }
      }
    } else if (type === 'save') {
      tableProps.onRow = (record: any) => {
        return {
          onClick: () => setData({ userTemplateName: record.name })
        }
      }

      tableProps.rowClassName = (record: any) => record.name === data.userTemplateName ? styles.selectedRow : ''
    }
    return tableProps
  }, [type, data, selectedRowKeys])

  // 确定按钮点击
  const onOk = useCallback(() => {
    if (type === 'load') {
      onLoad_()
    } else if (type === 'save') {
      onSave_()
    }
  }, [type, onSave_, onLoad_])

  const onModalSizeChange = useCallback((width: number, height: number) => {
    setModalHeight(height)
  }, [])

  return (
    <SmartModal
      id='multiTodoUserTemplateEditModal'
      title={`${tr('待办用户模板')}`}
      visible={visible}
      destroyOnClose
      onCancel={closeModal}
      confirmLoading={loading}
      itemState={INIT_ITEM_STATE}
      canMaximize={false}
      canResize={false}
      onSizeChange={onModalSizeChange}
      footer={(
        <>
          <Button onClick={closeModal} size='small'>{tr('取消')}</Button>
          <Button
            type='primary'
            size='small'
            loading={loading}
            disabled={type === 'save' ? false : (selectedRowKeys.length === 0)}
            onClick={onOk}
          >{tr('确定')}</Button>
        </>
      )}
    >
      <Table
        tableKey='multiTodoUserTemplateModal'
        rowKey='id'
        dataSource={templates}
        columns={column}
        scroll={{
          y: tableHeight
        }}
        loading={fetchLoading}
        {...extraTableProps}
      />
      {type === 'save' && (
        <SchemaForm
          schema={formSchema}
          wrappedComponentRef={formSchemaRef}
          onChange={onChange}
          data={data}
        />
      )}
    </SmartModal>
  )
}
