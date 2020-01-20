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
      <Form.Item label={tr('业务统计类型')} {...formItemLayout} style={{ marginTop: '-3px' }}>
        {getFieldDecorator('type', {
          initialValue: 'area',
          rules: [{ required: true, message: tr('必填') }],
        })(
          <Radio.Group buttonStyle="solid">
            <Radio.Button value='area' >{tr('访问量')}</Radio.Button>
            <Radio.Button value="bar">{tr('支付笔数')}</Radio.Button>
            <Radio.Button value="progress">{tr('转化率')}</Radio.Button>
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
