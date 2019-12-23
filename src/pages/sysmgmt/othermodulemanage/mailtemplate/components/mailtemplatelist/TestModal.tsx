import React, { useCallback, useMemo } from 'react'
import { SmartModal } from '@/components/specific';
import { Form, Input } from 'antd'
import { tr } from '@/components/common/formatmessage'

interface TestModalProps {
  [propName: string]: any
}

function TestModal(props: TestModalProps) {

  const {
    visible,
    form: { getFieldDecorator, validateFieldsAndScroll },
    onTestOk,
    onTestCancel,
    dataSource
  } = props

  const handOk = useCallback(() => {
    validateFieldsAndScroll((errors: any, formValues: object) => {
      if (!errors) {
        const { email } = formValues
        const { key } = dataSource
        let payload = {
          attachFileIds: [],
          bccMails: [],
          ccMails: [],
          nick: "邮件系统",
          subject: "测试邮件模板发送",
          tempParam: {receive: email},
          receive: email,
          templateKey: key,
          toMails: [email],
          0: email,

        }
        onTestOk && onTestOk(payload)
      }
    })

  }, [dataSource])

  const handCancel = useCallback(() => {
    onTestCancel && onTestCancel('test')
  }, [])

  return (
    <SmartModal
      width={632}
      id='testmodal'
      visible={visible}
      title={`${tr('测试模版发送邮件')}`}
      bodyStyle={{ padding: "10px" }}
      onOk={handOk}
      onCancel={handCancel}
      okButtonProps={{size:'small'}}
      cancelButtonProps={{size:'small'}}
    >
      <Form>
        <Form.Item label={tr('收件人邮箱')}>
          {getFieldDecorator('email', {
            rules: [{ type: 'email', required: true, message: tr('请填写正确的邮箱地址') }],
          })(
            <Input />,
          )}
        </Form.Item>
      </Form>
    </SmartModal>
  )

}

export default Form.create()(TestModal)



