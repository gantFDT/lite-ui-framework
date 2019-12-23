import React, { useCallback, useEffect } from 'react'
import { Form, Button, Input, Modal } from 'antd'
import { InputLang, EditStatus } from 'gantd'
import { tr, getLocale } from '@/components/common/formatmessage'

const Locale = getLocale();
const LocaleField = Locale === 'zh-CN' ? 'zh_CN' : 'en';
const LangFieldValue = { zh_CN: '', en: '' };
const initialValue = {}
const ModalForm = (props: any) => {
  const {
    form,
    values = initialValue,
    mode,
    onCancel,
    onOK,
    confirmLoading,
    ...restProps
  } = props
  const { getFieldDecorator, validateFields, setFieldsValue } = form;

  useEffect(() => {
    const keys = ['name', 'path', 'description'];
    const initValues = Object.entries(values).filter(_ => keys.includes(_[0])).reduce((total, cur) => {
      let [key, value]: any = cur;
      if (key === 'name') {
        value = JSON.parse(value)[LocaleField];
      }
      return {
        ...total,
        [key]: value
      }
    }, {})
    setFieldsValue(initValues)
  }, [values])

  const handlerSubmit = useCallback((e) => {
    e.preventDefault();
    validateFields((err: any, values: any) => {
      if (!err) {
        // if (values['name']) {
        //   values['name'] = JSON.stringify({
        //     ...LangFieldValue,
        //     [LocaleField]: values['name']
        //   });
        // }
        onOK(values)
      }
    });
  }, [onOK])

  return (
    <Modal onCancel={onCancel} {...restProps} destroyOnClose
      footer={
        <>
          <Button size="small" onClick={onCancel} >{tr('取消')}</Button>
          <Button size="small" type='primary' loading={confirmLoading} onClick={handlerSubmit} >{tr("保存")}</Button>
        </>
      }
    >
      <Form>
        {/* <Form.Item label={tr('名称')}>
          {getFieldDecorator('name', {
            rules: [
              { required: true, message: tr('请输入名称') }
            ],
          })(
            <InputLang
              edit={EditStatus['EDIT']}
              locale={Locale}
              placeholder={tr('请输入名称')}
            />,
          )}
        </Form.Item> */}
        {/* {
          mode.includes('item') && (
            <Form.Item label={tr('操作关键字')}>
              {getFieldDecorator('path', {
                rules: [
                  { required: true, message: tr('请输入操作关键字') }
                ],
              })(
                <Input
                  type="text"
                  placeholder={tr('请输入操作关键字')}
                />,
              )}
            </Form.Item>
          )
        } */}
        <Form.Item label={tr('描述')}>
          {getFieldDecorator('description')(<Input type="text" placeholder={tr('请输入描述')} />)}
        </Form.Item>
      </Form>
    </Modal>
  )
};
const ModalFormForm: any = Form.create({ name: 'ModalForm' })(ModalForm)
export default ModalFormForm;