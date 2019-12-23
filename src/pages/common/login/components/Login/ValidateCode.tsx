import React, { Component, useEffect, useCallback, useState } from 'react';
import { Form, Input, Icon, Row, Col } from 'antd';
import styles from './index.less';
import { FormComponentProps } from 'antd/es/form';
import LoginContext from './LoginContext';
import { getValidateCodeApi } from '../../service';

const FormItem = Form.Item;
const style = {
  display:'block',
  width: 120,
  height: 40,
  cursor: 'pointer'
};

export interface ValidateCodeProps {
  name: string;
  value: any;
  placeholder?: string;
  type?: string;
  defaultValue?: string;
  form: FormComponentProps['form'];
  onChange: (e: any) => void;
  updateActive: (name: string) => void;
}

export interface ValidateCodeState {
  vCode: string;
}

const ValidateItem = (props: any) => {
  const { value = {}, onChange } = props;

  const [code, setCode] = useState('')
  
  const refreshValidateCode = useCallback(
    (flag?: boolean) => getValidateCodeApi({
      codeCount: 4,
      imageHeight: style.height,
      imageWidth: style.width
    }).then(ret => {
      setCode(ret.content)
      value.id = ret.id;
      value.firstLoad = flag ? false : true;
      onChange(value)
    })
  ,[value])
  
  const handlerChange = useCallback((e: any) => {
    const { target: { value: inputValue } } = e;
    onChange({
      ...value,
      code: inputValue,
      firstLoad: false
    })
  },[value])
  
  useEffect(() => {
    refreshValidateCode()
  }, [])

  return (
    <Row gutter={8} style={{margin: '10px 0'}}>
      <Col span={16} style={{paddingLeft: 0}}>
        <Input
          size="large"
          value={value.code}
          onChange={handlerChange}
          prefix={<Icon type="safety" className={styles.prefixIcon} />}
        />
      </Col>
      <Col span={8}>
        <img onClick={() => refreshValidateCode(true)} style={style} src={'data:image/jpeg;base64,' + code} alt={tr('验证码')}/>
      </Col>
    </Row>
  )
}

class ValidateCode extends Component<ValidateCodeProps, ValidateCodeState> {
  constructor(props: ValidateCodeProps) {
    super(props);
  }

  componentWillMount() {
    const { updateActive, name = '' } = this.props;
    if (updateActive) {
      updateActive(name);
    }
  }

  render() {
    const {
      form,
      name,
    } = this.props;
    if (!form) {
      return null;
    }
    const { getFieldDecorator } = form;
    return (
      <FormItem>
        {getFieldDecorator(name, {
          rules: [
            {
              message: tr('请输入验证码'),
              validator: (rule: any, value: any, callback: Function) => {
                const { id, code, firstLoad } = value;
                if (id && !firstLoad && !code) {
                  callback(true)
                }
                callback(undefined)
              }
            }
          ]
        })(<ValidateItem setFields={form.setFields}/>)}
      </FormItem>
    );
  }
}

export default (props: ValidateCodeProps) => (
  <LoginContext.Consumer>
    {context => {
      return (
        <ValidateCode
          {...props}
          {...context}
        />
      );
    }}
  </LoginContext.Consumer>
);
