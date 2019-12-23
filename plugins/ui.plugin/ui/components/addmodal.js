import React, { useEffect, useContext, useCallback, useMemo, useState } from 'react'
import { Modal, Form, message } from 'antd'
import { APIContext } from '../context'
import SelectRouter from './selectrouter'
import SelectFolder from './selectfolder'


const AddModal = ({ path, ...props }) => {

  const { api } = useContext(APIContext)
  const [form] = Form.useForm();
  const [loading, setloading] = useState(false)
  const initialValues = useMemo(() => ({
    routePath: path,
    // folderPath: path
    folderPath: `/sysmgmt${path}`
  }), [path])

  const onCancel = useCallback(
    () => {
      setloading(false);
      props.onCancel()
    },
    [props.onCancel],
  )

  return (
    <Modal
      title='添加模板'
      closable
      destroyOnClose
      confirmLoading={loading}
      onOk={
        () => {
          setloading(true)
          form.validateFields().then(values => api.callRemote({
            type: 'gantui/setPage',
            payload: {
              ...values,
              template: path
            }
          })).then(res => {
            message.success(res.message)
            props.onCancel()
          }).catch(err => {
            if (Array.isArray(err)) {
              const msg = err.map(([m, s]) => (
                <div style={s}>{m}</div>
              ))
              message.error(msg, 8)
            } else {
              message.error(err, 3)
            }
          }).finally(() => {
            setloading(false)
          })
        }
      }
      onCancel={onCancel}
      {...props}
    >
      <Form layout='vertical' form={form} initialValues={initialValues}>
        <Form.Item label='模板页面路径' name="routePath">
          <SelectRouter />
        </Form.Item>
        <Form.Item label='模板页面目录' name="folderPath">
          <SelectFolder />
        </Form.Item>
      </Form>
    </Modal>
  )
}

export default AddModal
