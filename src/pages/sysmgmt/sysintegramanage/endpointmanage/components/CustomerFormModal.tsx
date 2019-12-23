import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Form, Button, Row, Col, Modal } from 'antd'
import { FormComponentProps } from 'antd/es/form'

import { modalFileds, getValues } from './customerfileds'
import { getType } from '@/utils/utils';
import { tr } from '@/components/common/formatmessage';
import { SmartModal } from '@/components/specific';

interface CustomerFormModalProps extends FormComponentProps {
  dataSource: any,
  submitLoading: boolean,
  visible: boolean,
  formType: string,
  [propName: string]: any
}

function CustomerFormModal(props: CustomerFormModalProps) {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    dataSource = {},
    // confirmLoading,
    formType,
    visible,
    onCreate,
    onCancel,
    submitLoading
  } = props;

  const handlerSubmit = useCallback(() => {
    validateFieldsAndScroll((errors: any, dataSource: object) => {
      if (errors) return;
      const formatValues = getValues(dataSource, modalFileds)
      const { name, principal, credential } = formatValues;
      let _formatValues = {
        credential,
        name,
        principal,
        errorNumber: 0,
        id: "",
        logTime: "",
        maxDuration: 0,
        optCounter: 0,
        recentTime: "",
        totalNumber: 0
      }
      onCreate(_formatValues)
    })
  }, [dataSource])

  // 根据编辑新增、tab切换form字段
  const filedsKeys = useMemo(() => {
    return Object.keys(modalFileds)
      .filter(_key => formType !== 'update' || !_key.toLowerCase().includes('password'))
      .map(_key => {

        return {
          key: _key,
        };

      });
  }, [formType])

  const bindFiledsFun = useCallback(
    (fieldOptions = {}) => {
      let ret;
      ret = Object.entries(fieldOptions)
        .reduce((total, [_key, _value]: any) => {
          if (_key === 'rules') {
            _value = _value.map((_rule: any) => Object.entries(_rule).reduce((_total, [__key, __value]: any) => {
              if (getType(__value) === 'Function') {
                __value = __value.bind(props)
              }
              return {
                ..._total,
                [__key]: __value
              }
            }, {}))
          }
          return {
            ...total,
            [_key]: _value
          }
        }, {})
      return ret;
    },
    [],
  )


  return (
    <SmartModal
      id='customerformmodal'
      isModalDialog
      visible={visible}
      title={formType === 'create' ? tr('新增客户') : `${tr('编辑客户')}--${dataSource.name}`}
      bodyStyle={{ padding: "10px" }}
      destroyOnClose={true}
      onCancel={onCancel}
      footer={
        <>
          <Button size="small" onClick={onCancel} >{tr('取消')}</Button>
          <Button size="small" type='primary' onClick={handlerSubmit} loading={submitLoading}>{tr("保存")}</Button>
        </>
      }
    >
      <Row style={{ minWidth: 450 }}>
        <Col span={16} style={{ width: 'calc(100%)' }}>
          <Form>
            {
              filedsKeys.map(({ key, hide }) => <Form.Item key={key} label={modalFileds[key].title}>
                {
                  getFieldDecorator(key, {
                    initialValue: modalFileds[key].type == "date" && dataSource[key] ? moment(dataSource[key]) : dataSource[key],
                    ...bindFiledsFun(modalFileds[key].fieldOptions)
                  })(modalFileds[key].Component)
                }
              </Form.Item>)
            }
          </Form>
        </Col>
      </Row>
    </SmartModal>
  )
}


export default Form.create<CustomerFormModalProps>()(CustomerFormModal)
