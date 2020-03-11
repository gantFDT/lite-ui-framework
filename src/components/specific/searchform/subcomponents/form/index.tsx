import React, { useMemo } from 'react'
import  { UISchema } from 'schema-form-g'
import { SchemaForm } from 'gantd'
import { isEmpty as _isEmpty } from 'lodash'
import { CustomComponent } from '../../interface'
import styles from './index.less'

const colLayout = {
  xs: 24,
  sm: 12,
  md: 8,
  lg: 8,
  xl: 6,
  xxl: 4
}

const formItemLayout = {
  labelCol: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24,
  },
  wrapperCol: {
    xs: 24,
    sm: 24,
    md: 24,
    lg: 24,
    xl: 24,
    xxl: 24,
  },
}

const defaultUiSchema = {
  'ui:col': colLayout,
  'ui:labelCol': formItemLayout.labelCol,
  'ui:wrapperCol': formItemLayout.wrapperCol,
  'ui:gutter': 40,
  'ui:labelAlign': 'top'
}

interface FormProps {
  onValuesChange: Function,
  formRef: any,
  customComponents: CustomComponent[],
  uiSchema: UISchema
  schema: any
  defaultParams: any
}

export default function Form(props: FormProps) {
  const {
    onValuesChange,
    formRef,
    customComponents,
    uiSchema: uiSchemaProps,
    schema,
    defaultParams
  } = props;


  // 转化为SchemaForm的标准格式，以及获取默认值对象
  const [schema_, extraProps] = useMemo(() => {
    let tempSchema = {
      type: 'object',
      propertyType: {
        ...schema
      }
    }
    let tempExtraProps: any = {}
    if (!_isEmpty(defaultParams)) {
      tempExtraProps.data = defaultParams
    }
    return [tempSchema, tempExtraProps]
  }, [schema, defaultParams])

  const uiSchema = useMemo(() => {
    return {
      ...defaultUiSchema,
      ...uiSchemaProps
    }
  }, [uiSchemaProps])

  const customFields = useMemo(() => {
    let res: any[] = customComponents.map(({ name, component }) => {
      return ({
        type: name,
        component
      })
    })
    return res
  }, [customComponents])

  return (
    <div className={styles.searchform} >
      <SchemaForm
        schema={schema_}
        wrappedComponentRef={formRef}
        uiSchema={uiSchema as any}
        onChange={onValuesChange}
        customFields={customFields}
        {...extraProps}
      />
    </div>
  )
}
