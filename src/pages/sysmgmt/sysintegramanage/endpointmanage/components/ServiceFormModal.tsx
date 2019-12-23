import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { Form, Button, Row, Col, message } from 'antd'
import { SmartModal } from '@/components/specific';
import { modalFileds, getValues } from './servicefileds'
import { getType } from '@/utils/utils';
import { tr } from '@/components/common/formatmessage';

interface ServiceFormModalProps {
  dataSource: { name: string },
  submitLoading: boolean,
  formType: string,
  onCreate: (v: object) => void,
  onCancel: () => void,
  visible: boolean,
  [propName: string]: any
}

function ServiceFormModal(props: ServiceFormModalProps) {
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

  const [upCodeData, setUpCodeData] = useState({})
  useEffect(() => {
    const { code } = dataSource;
    code ? setUpCodeData(dataSource) : setUpCodeData({})

  }, [dataSource])

  const handlerSubmit = useCallback(() => {
    validateFieldsAndScroll((errors: any, dataSource: object) => {
      if (errors) return;
      const formatValues = getValues(dataSource, modalFileds)
      const { code, type } = formatValues;

      let _code = code ? code : upCodeData['code'];
      if (!_code) {
        message.error(tr('必须选择服务名称'));
      } else {
        let _formatValues = {
          code: _code,
          id: code ? "" : upCodeData['id'],
          name: code ? "" : upCodeData['name'],
          optCounter: code ? "" : upCodeData['optCounter'],
          reserve: code ? "" : upCodeData['reserve'],
          type,
          universal: code ? "" : upCodeData['universal']
        }
        onCreate(_formatValues)
      }
    })
  }, [dataSource, upCodeData])

  // 根据编辑新增、tab切换form字段
  const filedsKeys = useMemo(() => {
    return Object.keys(modalFileds)
      .filter(_key => formType !== 'update' || !_key.toLowerCase().includes('code'))
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
      id='serviceformmodal'
      visible={visible}
      title={formType === 'create' ? tr('注册服务') : `${tr('编辑服务')}--${dataSource.name}`}
      bodyStyle={{ padding: "10px" }}
      onCancel={onCancel}
      destroyOnClose={true}
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


export default Form.create()(ServiceFormModal)
