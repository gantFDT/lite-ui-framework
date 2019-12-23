import React, { useState, useCallback, useMemo, useEffect, useContext } from 'react'
import { Form, Button, Row, Col, Input } from 'antd'
import { FormComponentProps } from 'antd/es/form'
import { SmartModal } from '@/components/specific';
import { tr } from '@/components/common/formatmessage';
import SelectorFeatureName from '../components/featurename';

import { IdsContext } from '../context'
interface OpenFormModalProps extends FormComponentProps {
  visible: boolean,
  loading: boolean,
  [propName: string]: any
}

function OpenFormModal(props: OpenFormModalProps) {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    visible,
    onCreate,
    onCancel,
    loading
  } = props;

  const { endpointId, systemId } = useContext(IdsContext)

  const handlerSubmit = useCallback(() => {
    validateFieldsAndScroll((errors: any, values: { code: { value: string, name: string, bussinessCode: string }, name: string, bussinessCode: string }) => {
      if (errors) return;
      onCreate({
        systemId,
        ...values,
        code: values.code.value
      })
    })
  }, [systemId])


  return (
    <SmartModal
      id='openformmodal'
      visible={visible}
      title={tr('开放功能')}
      bodyStyle={{ padding: "10px" }}
      destroyOnClose
      onCancel={onCancel}
      footer={
        <>
          <Button size="small" onClick={onCancel} >{tr('取消')}</Button>
          <Button size="small"
            type='primary'
            loading={loading}
            onClick={handlerSubmit}
          >{tr("保存")}</Button>
        </>
      }
    >
      <Row style={{ minWidth: 450 }}>
        <Col span={16} style={{ width: 'calc(100%)' }}>
          <Form>
            <Form.Item key='name' >
              {getFieldDecorator('name')(<></>)}
            </Form.Item>
            <Form.Item key='code' label={tr('功能名称')}>
              {
                getFieldDecorator('code', {
                  initialValue: {},
                  rules: [
                    {
                      required: true,
                      message: tr('必须选择功能名称')
                    }
                  ]
                })(<SelectorFeatureName endpointId={endpointId} systemId={systemId} />)
              }
            </Form.Item>

            <Form.Item key='businessCode' label={tr('业务代码')}>
              {
                getFieldDecorator('businessCode', {
                  rules: [
                    {
                      required: true,
                      message: tr('必须填写业务代码')
                    }
                  ]
                })(<Input disabled />)
              }
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </SmartModal>
  )
}


export default Form.create<OpenFormModalProps>({
  onValuesChange: (props, changedValues, allValues) => {
    if (changedValues.code) {
      const { businessCode, name } = changedValues.code
      props.form.setFieldsValue({ businessCode, name })
    }
  }
})(OpenFormModal)
