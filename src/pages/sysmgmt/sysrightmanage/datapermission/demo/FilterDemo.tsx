import React, { useState, useCallback, useImperativeHandle, forwardRef } from 'react'
import SchemaForm from '@/components/form/schema'

const schema = {
  type: "object",
  required: ["parameterValue"],
  propertyType: {
    parameterValue: {
      title: tr('数据过滤条件参数'),
      type: "string",
      componentType: "Textarea",
    }
  }
}

const FilterDemo = (props: any, ref: any) => {
  const [formContent, setFormContent] = useState()

  const getValue = useCallback(() => {
    const {parameterValue} = formContent
    return parameterValue
  }, [formContent])

  useImperativeHandle(ref, () => ({
    getValue
  }));

  return (
    <div style={{width:'100%',height:'100%',padding:'20px'}}>
      <SchemaForm
        schema={schema}
        onChange={(params: any) => { setFormContent(params) }}
        uiSchema={{
          'ui:col': {
            xs: 24,
            sm: 24,
            md: 24,
            lg: 24,
            xl: 24,
            xxl: 24
          }
        }}
      />
    </div>)
}

export default forwardRef(FilterDemo)