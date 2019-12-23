import React, { useState, useCallback } from 'react'
import { Form, Select, Input } from 'antd'
import { Button } from 'antd'
import _ from 'lodash'
import { SmartModal } from '@/components/specific'
import { LEVELS } from './model'

interface Props {
  loading: boolean
  form: any,
  names: string[]
  onSubmit: (params: any, hidenModal: Function) => void
}

const INIT_ITEM_STATE = {
  width: 520,
  height: 260
}

/**
 * 日志级别添加
 * @param props
 */
const LogLevelModal = (props: Props) => {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    loading,
    names,
    onSubmit
  } = props
  const [showModal, setShowModal] = useState(false)


  const onOk = (e: any) => {
    e.stopPropagation()
    validateFieldsAndScroll((errors: any, values: any) => {
      if (errors) return
      onSubmit && onSubmit(values, () => setShowModal(false))
    })
  }

  const changeModalStatus = useCallback((res: boolean) => {
    setShowModal(res)
  }, [])

  return (
    <>
      <SmartModal
        id='logLevelAddModal'
        title={tr('新增日志级别')}
        visible={showModal}
        destroyOnClose
        onCancel={changeModalStatus.bind(null, false)}
        onOk={onOk}
        confirmLoading={loading}
        itemState={INIT_ITEM_STATE}
        canMaximize={false}
        canResize={false}
      >
        <Form layout='horizontal'>
          <Form.Item label={tr('名称')}>
            {getFieldDecorator('name', {
              rules: [{
                required: true, message: tr('日志名称不能为空!')
              }, {
                message: tr('日志名称不能重复!'),
                validator: function (rule: any, value: string, callback: Function) {
                  let tempValue = value ? value.trim() : value
                  if (names.includes(tempValue)) {
                    callback(true)
                  }
                  callback(undefined)
                }
              }]
            })(<Input placeholder={tr('请输入日志名称')} />)}
          </Form.Item>
          <Form.Item label={tr('等级')}>
            {getFieldDecorator('level', {
              initialValue: 'ALL'
            })(<Select children={LEVELS.map((level: string) => <Select.Option key={level}>{level}</Select.Option>)} />)}
          </Form.Item >
        </Form>
      </SmartModal>
      <Button
        size='small'
        icon='plus'
        onClick={changeModalStatus.bind(null, true)}
      />
    </>
  )
}

export default Form.create()(LogLevelModal)
