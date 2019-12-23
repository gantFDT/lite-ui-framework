import React, { useCallback, useMemo, useRef, useState } from 'react'
import { Form, Button, Input, Modal } from 'antd'
import { tr } from '@/components/common/formatmessage'
import { SmartModal } from '@/components/specific'
import FormSchema from '@/components/form/schema'
import { passwordSchema } from './schema'
import { isEmpty } from 'lodash'
const ResetPwd = (props: any) => {
  const {
    onSubmit,
    onCancel,
    confirmLoading,
    visible,
    title
  } = props
  const [formRef2, setFormRef] = useState<any>({} as any);
  const wrappedComponentRef = useCallback(ref => {
    setFormRef(ref)
  }, [setFormRef])
  const handlerResetPwd = useCallback(async (e) => {
    const { validateForm } = formRef2;
    const { errors, values } = await validateForm();
    if (errors) return;
    onSubmit(values)
  }, [formRef2, onSubmit])
  const schema = useMemo(() => {
    const initSchema = {
      type: "object",
      required: ["newPassword", "confirmPassword"],
      propertyType: {}
    }
    if (isEmpty(formRef2)) return initSchema
    const { getFieldsValue, validateForm } = formRef2;
    const confirmPassword = { ...passwordSchema.repeatPassword };
    const newPassword = { ...passwordSchema.password };
    newPassword["options"] = {
      rules: [{
        validator(rule: any, value: string, callback: (val?: string) => void) {
          if (value && getFieldsValue(['confirmPassword'])['confirmPassword']) {
            validateForm(['confirmPassword'], { force: true })
          }
          callback()
        }
      }]
    }
    confirmPassword["options"] = {
      rules: [{
        validator(rule: any, value: string, callback: (val?: string) => void) {
          if (value && value !== getFieldsValue(['newPassword'])['newPassword']) {
            return callback(tr('两次密码输入不一致'))
          }
          callback()
        }
      }]
    }
    initSchema["propertyType"] = { newPassword, confirmPassword }
    return initSchema;
  }, [passwordSchema, formRef2, visible]);
  return (
    <SmartModal
      id={"resetPasswordModal" + '_modal_normal'}
      visible={visible}
      title={title}
      isModalDialog
      maskClosable={false}
      onCancel={onCancel}
      destroyOnClose
      itemState={{
        width: 600,
        height: 300
      }}
      footer={
        <>
          <Button size="small" onClick={onCancel} >{tr('取消')}</Button>
          <Button size="small"
            type='primary'
            loading={confirmLoading}
            onClick={handlerResetPwd}
          >{tr("确定")}</Button>
        </>
      }
    >
      <FormSchema wrappedComponentRef={wrappedComponentRef} schema={schema} />
    </SmartModal>
  )
};

export default ResetPwd;