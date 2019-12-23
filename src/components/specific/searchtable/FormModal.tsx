import React, { useCallback } from 'react'
import { Form, Modal, Button } from 'antd'
import moment from 'moment'
import styles from './style.less'
import { getType } from '@/utils/utils';
import { generValues } from './fieldgenerator';

function FormCP(props:any){
  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    values = {},
    fields,
    fieldsMap,
    confirmLoading,
    onSubmit,
    onCancel,
    okText,
    cancelText
  } = props;

  const submit = useCallback(() => {
    validateFieldsAndScroll((errors:any, values:object) => {
      if (errors) return;
      const formatValues = generValues(values, fieldsMap)
      onSubmit({
        ...values,
        ...formatValues
      })
    })
  }, [values,onSubmit])

  const bindFiledsFun = useCallback(
    (fieldOptions={}) => {
      let ret;
      ret = Object.entries(fieldOptions)
      .reduce((total,[_key,_value]:any)=>{
        if(_key === 'rules'){
          _value = _value.map((_rule:any)=>Object.entries(_rule).reduce((_total,[__key,__value]:any)=>{
            if(getType(__value) === 'Function'){
              __value = __value.bind(props)
            }
            return {
              ..._total,
              [__key]:__value
            }
          },{}))
        }
        return {
          ...total,
          [_key]:_value
        }
      },{})
      return ret;
    },
    [],
  )

  return <Form className={styles.modalForm} >
    {
      fields.map(({key,name,type,component,options}:any) => {
        return (
          <Form.Item key={key} label={name}>
            {
              getFieldDecorator(key, {
                valuePropName: type === "Switch"?'checked':'value',
                initialValue: type === "DatePicker" && values[key] ? moment(values[key]) : values[key],
                ...bindFiledsFun(options)
              })(component)
            }
          </Form.Item>
        )
      })
    }
    <div className="ant-modal-footer" style={{margin:'0 -10px -10px'}}>
      <Button size="small"   onClick={onCancel}>{cancelText}</Button>
      <Button size="small"   type="primary" onClick={submit} loading={confirmLoading}>{okText}</Button>
    </div>
  </Form>
}

const FormCPWithForm:any = Form.create({
  onValuesChange:(props:any, changedValues, allValues) => {
    const { onFormValueChange } = props;
    if(onFormValueChange) onFormValueChange(changedValues,allValues);
  }
})(FormCP);

function FormModal(props: any) {
	const {
    values = {},
    fields,
    fieldsMap,
    confirmLoading,
    onSubmit,
    onCancel,
    okText,
    cancelText,
    onFormValueChange,
    ...restProps
  } = props;

	return (
    <Modal
      destroyOnClose
      onCancel={onCancel}
      footer={null}
      {...restProps}
    >
      <FormCPWithForm
        values={values}
        fields={fields}
        fieldsMap={fieldsMap}
        confirmLoading={confirmLoading}
        onSubmit={onSubmit}
        onCancel={onCancel}
        okText={okText}
        cancelText={cancelText}
        onFormValueChange={onFormValueChange}
      />
    </Modal>
  )
}

export default FormModal;