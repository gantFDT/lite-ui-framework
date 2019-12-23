import React, { useCallback, useState, useRef, ReactNode, useMemo } from 'react'
import { Button } from 'antd';
import { isEmpty, isEqual } from 'lodash'
import { SmartModal, SingleFileUpload } from '@/components/specific'
import { deployFormSchema, updateFormSchema, modifyFormSchema } from './schema'
import Switch from '../switch'

export interface TemplateInfoProps {
  type: 'deploy' | 'update' | 'modify'
  title: string | ReactNode
  visible: boolean
  btnLoading: boolean
  values?: {
    name: string
    strategy: boolean
  }
  onSubmit: Function
  onClose: (e?: any) => void
}

const customFileds = [{
  type: 'CustomSwitch',
  component: Switch
}]

const INIT_ANY_OBJECT = {}

/**
 * 模板信息编辑组件、用于发布、更新、编辑模板
 */
export default (props: TemplateInfoProps) => {
  const {
    type,
    title,
    visible,
    btnLoading,
    onSubmit,
    onClose,
    values = INIT_ANY_OBJECT
  } = props

  if (visible === false) {
    return null
  }

  const [templateData, setTemplateData] = useState<any>(type === 'deploy' ? { file: {}, info: {} } : values)
  const formSchemaRef = useRef<any>({})
  const [formSchema, uiSchema, itemState] = useMemo(() => {
    let schema: any
    let uiSchema: any
    let itemState: any
    switch (type) {
      case 'deploy':
        schema = deployFormSchema
        uiSchema = {
          'ui:col': 12,
          file: {
            fileEntityId: {
              'ui:col': 0
            }
          }
        }
        itemState = { width: 600, height: 472 }
        break
      case 'update':
        schema = updateFormSchema
        uiSchema = {
          fileEntityId: {
            'ui:col': 0
          }
        }
        itemState = { width: 520, height: 270 }
        break
      case 'modify':
        schema = modifyFormSchema
        uiSchema = {}
        itemState = { width: 520, height: 270 }
        break
    }
    return [schema, uiSchema, itemState]
  }, [type])

  // 模板上传成功
  const onFileSuccess = useCallback((file: any) => {
    const { id, fileName, fileSize } = file
    let params: any = {}
    if (type === 'deploy') {
      params = {
        ...templateData,
        file: {
          fileEntityId: id,
          templateFileName: fileName,
          templateFileSize: fileSize
        }
      }
    } else {
      params = {
        fileEntityId: id,
        templateFileName: fileName,
        templateFileSize: fileSize
      }
    }
    setTemplateData(params)
  }, [templateData, type])

  // 模板信息修改
  const onInfoChange = useCallback((value: any, values: any) => {
    let params = {}
    if (type === 'deploy') {
      params = {
        ...templateData,
        info: values.info
      }
    } else {
      params = values
    }
    setTemplateData(params)
  }, [templateData])

  // 发布
  const deployTemplate = useCallback(async () => {
    const { validateForm } = formSchemaRef.current
    if (!validateForm) {
      return
    }
    const validateRes = await validateForm()
    if (!isEmpty(validateRes.errors)) {
      return
    }
    const params = {
      ...templateData.file,
      ...templateData.info,
      strategy: templateData.info.strategy ? 'on' : undefined
    }
    onSubmit && onSubmit(params)
  }, [templateData])

  // 更新
  const updateTemplate = useCallback(() => {
    onSubmit && onSubmit(templateData)
  }, [templateData])

  // 编辑
  const modifyTemplate = useCallback(() => {
    onSubmit && onSubmit(templateData)
  }, [templateData])

  return (
    <SmartModal
      visible={visible}
      id={`deployProcessTemplate${type}`}
      title={title}
      schema={formSchema}
      values={templateData}
      itemState={itemState}
      uiSchema={{
        'ui:col': 24,
        ...uiSchema
      }}
      titleConfig={{
        'title:visible': true
      }}
      formSchemaProps={{
        wrappedComponentRef: formSchemaRef,
        onChange: onInfoChange,
        customFileds
      }}
      footer={(
        <>
          <Button
            icon="close"
            className="marginh5"
            size="small"
            onClick={onClose}
          >
            {tr('取消')}
          </Button>
          {['deploy', 'update'].includes(type) && (
            <SingleFileUpload
              btnText={tr('上传模板')}
              tempFile
              onSuccess={onFileSuccess}
              extraBtnProps={{
                icon: 'upload',
                disabled: btnLoading,
                type: 'primary'
              }}
            />
          )}
          {type === 'deploy' && (
            <Button
              icon="database"
              className="marginh5"
              size="small"
              type='primary'
              disabled={isEmpty(templateData.file)}
              onClick={deployTemplate}
              loading={btnLoading}
            >
              {tr('发布模板')}
            </Button>
          )}
          {type === 'update' && (
            <Button
              icon="interaction"
              className="marginh5"
              size="small"
              type='primary'
              disabled={isEmpty(templateData)}
              onClick={updateTemplate}
              loading={btnLoading}
            >
              {tr('更新模板')}
            </Button>
          )}
          {type === 'modify' && (
            <Button
              icon="interaction"
              className="marginh5"
              size="small"
              type='primary'
              disabled={isEqual(values, templateData)}
              onClick={modifyTemplate}
              loading={btnLoading}
            >
              {tr('保存信息')}
            </Button>
          )}
        </>
      )}
      onCancel={onClose}
    />)
}
