import React, { useState, useCallback, useEffect, Dispatch } from 'react'
import { connect } from 'dva'
import { Form, Input } from 'antd'
import { getLocale } from 'umi/locale'
import { SmartModal } from '@/components/specific';
const locale = getLocale();

const formItemLayout = {
  labelCol: {
    xs: { span: 2 },
    sm: { span: 2 },
  },
  wrapperCol: {
    xs: { span: 20 },
    sm: { span: 20 },
  },
};
interface LanguageModalProps {
  [propName: string]: any
}

function LanguageModal(props: LanguageModalProps) {
  const {
    visible,
    languageData,
    form,
    form: { getFieldDecorator },
    onOk,
    onCancel
  } = props
  const [formValue, setFormValue] = useState({ 'zh_CN': '', 'en': '' })
  useEffect(() => {
    if (languageData) {
      const { value, locale, otherLocale } = languageData
      let data:any = {}
      data[locale] = value
      data[otherLocale.key] = otherLocale.value
      setFormValue({ ...data })
    }
  }, [languageData])

  const handleOk = useCallback(() => {
    form.validateFields((err:any, values:any) => {
      if (!err) {
        const { catalog, description, id, name, optCounter, type } = languageData
        let _newData = {
          catalog, 
          description, 
          id, 
          name, 
          optCounter, 
          type,
          value:JSON.stringify(values)
        }
        let val = locale === 'en-US' ? values['en'] : values['zh_CN']
        onOk && onOk(val , _newData)
      }
    })
  }, [languageData])
  const handleCancel = useCallback(() => {
    onCancel && onCancel()
  }, [])

  return (
    <SmartModal
      id='langgguagemodel'
      visible={visible}
      title={tr('多语言编辑')}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      okButtonProps={{size:'small'}}
      cancelButtonProps={{size:'small'}}
    >
      <Form {...formItemLayout}>
        <Form.Item label={tr('中文')} key='zh_CN'>
          {getFieldDecorator('zh_CN', {
            initialValue: formValue['zh_CN']
          })(<Input />)}
        </Form.Item>
        <Form.Item label={tr('英文')} key='en'>
          {getFieldDecorator('en', {
            initialValue: formValue['en']
          })(<Input />)}
        </Form.Item>
      </Form>
    </SmartModal>
  )
}

export default connect(
  ({ loading }: any) => ({

  }),
  (dispatch: Dispatch<any>) => ({

  }))(Form.create()(LanguageModal))


