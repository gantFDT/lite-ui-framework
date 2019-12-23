import React, { Component } from 'react';

import { Form, Input, notification, Card, Button } from 'antd';
import { connect } from 'dva';

const formItemLayout = {
  labelCol: {
    xs: { span: 6 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 18 },
    sm: { span: 16 },
  },
}


@Form.create({
  name: 'EditPwdForm',
  mapPropsToFields(props) {
    let obj = {
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    };
    for (var key in obj) {
      obj[key] = Form.createFormField({
        value: props[key],
      });
    }
    return obj;
  },
})
class EditPwdForm extends React.Component {
  state = {
    loading: this.props.loading,
  };
  // 密码校验
  checkSamePwd = (rule, value, callback) => {
    const { getFieldValue } = this.props.form;
    const newPassword = getFieldValue('newPassword');
    if (value.length >= 6 && value.length <= 16) {
      if (value === newPassword) {
        callback();
      } else {
        callback(tr('两次密码输入不一致'));
      }
    } else {
      callback();
    }
  };

  //保存修改
  handleSubmit = () => {
    const form = this.props.form;
    const { dispatch, dispatchType } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        dispatch({
          type: dispatchType,
          payload: {
            params: values,
          },
        });
      }
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { loading, showBottomBtn } = this.props;

    const commonRules = [
      {
        min: 6,
        message: tr('密码长度不能小于') + 6 + tr('位'),
      },
      {
        max: 16,
        message: tr('密码长度不能大于') + 16 + tr('位'),
      },
    ];
    return (
      <Form layout="horizontal" className="fixed-label-from-h" labelAlign="right">
        <Form.Item label={tr('旧密码')} {...formItemLayout}>
          {getFieldDecorator('oldPassword', {
            rules: [
              {
                required: true,
                message: tr('请输入旧密码'),
              },
              ...commonRules,
            ],
          })(
            <Input.Password
              placeholder={tr('请输入旧密码')}
              style={{
                width: '100%',
              }}
            />
          )}
        </Form.Item>
        <Form.Item label={tr('新密码')} {...formItemLayout}>
          {getFieldDecorator('newPassword', {
            rules: [
              {
                required: true,
                message: tr('请输入新密码'),
              },
              ...commonRules,
            ],
          })(
            <Input.Password
              placeholder={tr('长度') + tr('6-15') + tr('可包括大小写字母和数字')}
              style={{
                width: '100%',
              }}
            />
          )}
        </Form.Item>
        <Form.Item label={tr('确认新密码')} {...formItemLayout}>
          {getFieldDecorator('confirmPassword', {
            rules: [
              {
                required: true,
                message: tr('请再次输入密码'),
              },
              ...commonRules,
              ,
              {
                validator: this.checkSamePwd,
              },
            ],
          })(
            <Input.Password
              placeholder={tr('长度') + tr('6-15') + tr('可包括大小写字母和数字')}
            />
          )}
        </Form.Item>
        <Form.Item style={{ paddingLeft: '120px' }}>
          {showBottomBtn && (

            <Button size="small" type="primary" loading={loading} onClick={this.handleSubmit}>{tr('修改')}</Button>

          )}
        </Form.Item>
      </Form>
    );
  }
}

@connect(({ accountSettingsEditPwd, loading }) => ({
  accountSettingsEditPwd,
  loading: loading.effects['accountSettingsEditPwd/resetPwd']
}))
export default class AccountSettingsEditPwd extends React.Component {

  render() {
    const { dispatch, showBottomBtn, loading } = this.props;
    const { oldPassword, newPassword, confirmPassword } = this.props.accountSettingsEditPwd;
    let pwdInfo = {
      oldPassword,
      newPassword,
      confirmPassword,
      dispatch,
      loading,
      showBottomBtn,
      dispatchType: 'accountSettingsEditPwd/resetPwd'
    };
    return (
      <div
        style={{ padding: '10px 0 0 0' }}
      >
        <EditPwdForm {...pwdInfo} />
      </div>
    );
  }
}

export const PwdForm = EditPwdForm
