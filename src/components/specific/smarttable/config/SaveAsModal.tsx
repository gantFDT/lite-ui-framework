import React, { useState, useCallback, memo } from 'react';
import { Modal, Form, Input, Checkbox, Button } from 'antd';

export interface SaveAsModalProps {
    form: any,
    visible?: boolean,
    loading?: boolean,
    onCancel?: () => void,
    onSubmit?: (values: object) => void,
}

function SaveAsModal(props: SaveAsModalProps) {
    const {
        form: { getFieldDecorator, validateFieldsAndScroll },
        visible,
        loading,
        onCancel,
        onSubmit,
        ...nextProps
    } = props;

    const onOk = useCallback(() => {
        validateFieldsAndScroll((errors: any, values: object) => {
            if (errors) return;
            onSubmit && onSubmit(values)
        })
    }, [onSubmit])

    return <Modal
        visible={visible}
        title={tr('另存视图')}
        onCancel={onCancel}
        centered
        destroyOnClose
        footer={<div>
            <Button size="small"   icon='close-circle' onClick={onCancel}>{tr('取消')}</Button>
            <Button size="small"   type='primary' icon='save' loading={loading} onClick={onOk}>{tr('保存')}</Button>
        </div>}
        {...nextProps}
    >
        <Form>
            <Form.Item label={tr('视图名称')}>
                {getFieldDecorator('name', {
                    rules: [{ required: true, message: tr('视图名称必填') }],
                })(<Input placeholder={tr('请输入视图名称')} maxLength={500} />)}
            </Form.Item>
            <Form.Item>
                {getFieldDecorator('isDefault', {
                    valuePropName: 'checked',
                    initialValue: false,
                })(<Checkbox>{tr('设为默认')}</Checkbox>)}
            </Form.Item>
        </Form>
    </Modal>
}
export default memo(Form.create()(SaveAsModal));