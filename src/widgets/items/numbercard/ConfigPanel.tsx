import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Input, Select, Switch, Form, Radio } from 'antd'
import { BlockHeader, Icon } from 'gantd'
import IconHouse from '@/components/common/iconhouse'

const { Option } = Select;
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
}

const Page = (props: any) => {
  const {
    form,
    fetch,
    update,
    widgetKey,
    state
  } = props;

  const { getFieldDecorator } = form;

  const handleSubmit = (e: any) => {
    e.preventDefault();
    form.validateFields((err: any, fieldsValue: object) => {
      if (err) {
        return;
      }
      update({
        data: fieldsValue
      })
    });
  };

  useEffect(() => {
    form.setFieldsValue({ ...state })
  }, [])

  return (<>
    {/* <BlockHeader title={tr('标题')} type='num' num={1} bottomLine={false} /> */}
    <Form layout='vertical' onSubmit={handleSubmit}>
      <Form.Item label={tr('标题')} {...formItemLayout}>
        {getFieldDecorator('title', {
          initialValue: '',
          rules: [{ required: true, message: tr('标题必填') }],
        })(
          <Input />
        )}
      </Form.Item>
      <Form.Item label={tr('图标')} {...formItemLayout}>
        {getFieldDecorator('icon', {
          initialValue: '',
        })(
          <IconHouse />
        )}
      </Form.Item>
      <Form.Item label={tr('背景')} {...formItemLayout} style={{ marginTop: '-3px' }}>
        {getFieldDecorator('backgroundImage', {
          initialValue: '#161F30',
          rules: [{ required: true, message: tr('背景必选') }],
        })(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value="linear-gradient(to right, #161F30 0%, #161F30 100%)" style={{ color: '#fff', backgroundColor: '#161F30' }}>{tr('黑')}</Radio.Button>
            <Radio.Button value="linear-gradient(to right, #F94E25 0%, #F01F6E 100%)" style={{ color: '#fff', backgroundImage: 'linear-gradient(to right, #F94E25 0%, #F01F6E 100%)' }}>{tr('虹')}</Radio.Button>
            <Radio.Button value="linear-gradient(to right, #CD784D 0%, #CB5050 100%)" style={{ color: '#fff', backgroundImage: 'linear-gradient(to right, #CD784D 0%, #CB5050 100%)' }}>{tr('橙')}</Radio.Button>
            <Radio.Button value="linear-gradient(to right, #2DA16D 0%, #5EB396 100%)" style={{ color: '#fff', backgroundImage: 'linear-gradient(to right, #2DA16D 0%, #5EB396 100%)' }}>{tr('绿')}</Radio.Button>
            <Radio.Button value="linear-gradient(to right, #4995C5 0%, #3277B5 100%)" style={{ color: '#fff', backgroundImage: 'linear-gradient(to right, #4995C5 0%, #3277B5 100%)' }}>{tr('蓝')}</Radio.Button>
          </Radio.Group>
        )}
      </Form.Item>
      <div className="widgetconfigfooterblank"></div>
      <div className="widgetconfigfooter">
        <Button size="small" type='primary' htmlType="submit">{tr('保存')}</Button>
      </div>
    </Form>
  </>)

}

export default Form.create()(Page)
