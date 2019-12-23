import PropTypes from 'prop-types'
import React, { useCallback } from 'react';

import { Form, Input, Button } from 'antd';
import { SmartModal } from '@/components/specific';



function NoteForm(props) {
  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    visible,
    noteChange
  } = props;

  function handleOk() {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      noteChange && noteChange(values)
    })
  }

  function handleCancel() {
    noteChange && noteChange()
  }

  return (
    <SmartModal
      id='notemodal'
      title={tr("添加备注")}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
    >
      <Form layout="inline">
        <Form.Item label={tr('备注')}>
          {getFieldDecorator('note', {
            rules: [
              {
                required: false,
              }
            ]
          })(

            <Input />
          )}
        </Form.Item>
      </Form>
    </SmartModal>
  )
}
NoteForm.propTypes = {
  visible: PropTypes.bool,
  noteChange: PropTypes.func
}
NoteForm.defaultProps = {
  visible: false,
  noteChange: () => { }
}
export default Form.create()(NoteForm)

