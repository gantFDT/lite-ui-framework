import React, { Component, useEffect } from 'react';
import { connect } from 'dva';
import router from 'umi/router'
import { Checkbox, Alert, Icon, Col, Row, Dropdown, Menu } from 'antd';
import LoginComponents from './components/Login';
import ValidateCode from './components/Login/ValidateCode';
import styles from './style.less';
import { Dispatch } from 'redux';
import { IStateType } from './model';
import { FormComponentProps } from 'antd/es/form';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { Header } from 'gantd'
const { UserName, Password, Submit } = LoginComponents;
import { setLocale, getLocale } from 'umi/locale'
import Link from 'umi/link'


interface LoginTokenProps {
  userToken: string,
}

interface LoginProps {
  dispatch: Dispatch<any>;
  login: LoginTokenProps;
  submitting: boolean;
  settings: IStateType;
  config: any;
  // "loginAlign": "",
  // "loginDisplayCard": "",
  // "loginCardStyle": "",
  // "logoImage": "logo.png",
  // "backgroundImage": "login-background.png",
  // "backgroundBlur": "",
  // "langulageIconColor": ""
}
interface LoginState {
  type: string;
  autoLogin: boolean;
}
export interface FromDataType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  validate: any;
}

@connect(
  ({
    login,
    loading,
    settings,
    config
  }: {
    login: IStateType;
    settings: IStateType;
    loading: {
      effects: {
        [key: string]: string;
      };
    };
    config: IStateType
  }) => ({
    login,
    settings,
    config,
    submitting: loading.effects['login/login'],
  }),
)
class Login extends Component<LoginProps, LoginState> {
  state: LoginState = {
    type: 'account',
    autoLogin: true,
  };
  loginForm: FormComponentProps['form'] | undefined | null;
  onTabChange = (type: string) => {
    this.setState({ type });
  };
  // onGetCaptcha = () =>
  //   new Promise((resolve, reject) => {
  //     if (!this.loginForm) {
  //       return;
  //     }
  //     this.loginForm.validateFields(['mobile'], {}, (err: any, values: FromDataType) => {
  //       if (err) {
  //         reject(err);
  //       } else {
  //         const { dispatch } = this.props;
  //         ((dispatch({
  //           type: 'login/getCaptcha',
  //           payload: values.mobile,
  //         }) as unknown) as Promise<any>)
  //           .then(resolve)
  //           .catch(reject);
  //       }
  //     });
  //   });
  componentDidMount() {
    this.props.dispatch({
      type: 'settings/getSetting'
    })
    if (this.props.login.userToken) {
      router.replace('/')
    }
  }

  componentDidUpdate(prevProps: LoginProps) {
    if (!prevProps.login.userToken && this.props.login.userToken) {
      router.replace('/')
    }
  }

  handleSubmit = (err: any, values: FromDataType) => {
    const { type, autoLogin } = this.state;
    const { validate, ...restValue } = values;
    const { config } = this.props;
    const { COMMON_CONFIG: { validateCode } } = config;
    const { setFields } = this.loginForm;
    if (!err) {
      const { dispatch } = this.props;
      if (validateCode) {
        if(!validate.code) return setFields({
          validate: {
            value: values.validate,
            errors: [new Error(tr('请输入验证码'))],
          }
        })
        dispatch({
          type: 'login/loginWithValidateCode',
          payload: {
            validateCode: validate.code,
            validateCodeId: validate.id,
            ...restValue,
          },
        });
      } else {
        dispatch({
          type: 'login/login',
          payload: {
            ...restValue,
            type,
            autoLogin
          },
        });
      }
    }
    // router.push('/')
  };

  changeAutoLogin = (e: CheckboxChangeEvent) => {
    this.setState({
      autoLogin: e.target.checked,
    });
  };

  renderMessage = (content: string) => (
    <Alert style={{ marginBottom: 24 }} message={content} type="error" showIcon />
  );
  onMenuClick = (item) => {
    const { key } = item;
    switch (key) {
      case 'zh':
        setLocale('zh-CN')
        break;
      case 'en':
        setLocale('en-US')
        break;
      default:
        break;
    }
  }
  render() {
    const { login, submitting, settings, config } = this.props;

    const { LOGIN_CONFIG, BASE_CONFIG } = settings;
    const { COMMON_CONFIG: {
      showDownloadClientLink,
      downloadClientUrl,
      showChangeLanguageMenu,
      validateCode
    } } = config;
    const { status = '', type: loginType } = login;
    const { type, autoLogin } = this.state;

    const {
      loginAlign = 'center',
      loginFormStyle = '',
      backgroundBlur = '0px',
      customHeader = false,
      customFooter = false,
      backgroundImage = '',
      backgroundColor = '#fff',
      langulageIconColor = 'rgba(0,0,0,0.65)',
      loginFormShowLogo = false,
      loginFormShowName = true,
      copyrightAlign = 'left',
      headerTheme = 'dark'
    } = LOGIN_CONFIG;

    const {
      logoImage,
      logoImageWhite,
      logoName,
      appTitle,
      logoNameEn,
      appTitleEn,
      copyright,
    } = BASE_CONFIG;
    const menu = (
      <Menu onClick={this.onMenuClick}>
        <Menu.Item key="zh">
          {tr('简体中文')}
        </Menu.Item>
        <Menu.Item key="en">
          {tr('英文')}
        </Menu.Item>
      </Menu>
    );



    return (
      <>
        <div className={styles.bkg} style={{ backgroundColor: `${backgroundColor}`, backgroundImage: `url(${backgroundImage})`, filter: `blur(${backgroundBlur})` }}></div>
        <Row className="full" >

          {loginAlign == 'right' &&
            <Col span={12} className="uiui"></Col>
          }



          <Col span={loginAlign == 'center' ? 24 : 12} className='aligncenter' style={{ height: '100%' }} >
            <div className={styles.main} style={{ ...loginFormStyle }}>
              <LoginComponents
                defaultActiveKey={type}
                onTabChange={this.onTabChange}
                onSubmit={this.handleSubmit}
                ref={(form: any) => {
                  this.loginForm = form;
                }}
              >

                <div>
                  {loginFormShowLogo && <img src={logoImage} style={{ width: 100, height: 100, margin: '0 auto' }} />}
                  {loginFormShowName &&
                    <h1 style={{ fontSize: '42px', color: '#000' }}>
                      <b>
                        {getLocale() == 'zh-CN' && appTitle}
                        {getLocale() == 'en-US' && appTitleEn}
                      </b>
                    </h1>
                  }
                </div>

                <Header title={tr('登录')} bottomLine={false} />
                {status === 'error' &&
                  loginType === 'account' &&
                  !submitting &&
                  this.renderMessage(
                    tr('错误')
                  )}
                <UserName
                  name="userName"
                  placeholder={tr('用户名:gantd.design')}
                  rules={[
                    {
                      required: true,
                      message: tr('请输入用户名'),
                    },
                  ]}
                  className="gant-margin-v-10"
                />
                <Password
                  name="password"
                  placeholder={tr('密码:任意字符')}
                  rules={[
                    {
                      required: true,
                      message: tr('请输入密码'),
                    },
                  ]}
                  onPressEnter={() =>
                    this.loginForm && this.loginForm.validateFields(this.handleSubmit)
                  }
                  className="gant-margin-v-10"
                />
                {
                  validateCode && (
                    <ValidateCode
                      name="validate"
                      placeholder={tr('验证码')}
                      size="large"
                      className="gant-margin-v-10"
                    />
                  )
                }
                
                {/* <div className="gant-margin-v-10">
                  <Checkbox checked={autoLogin} onChange={this.changeAutoLogin}>
                    {tr('记住我')}
                  </Checkbox>
                  <a style={{ float: 'right' }} href="">
                    <FormattedMessage id="login.login.forgot-password" />
                  </a>
                </div> */}
                <Submit loading={submitting} className="gant-margin-v-10">
                  {tr('登录')}
                </Submit>
                {/* <div className={styles.other}>
              <FormattedMessage id="login.login.sign-in-with" />
              <Icon type="alipay-circle" className={styles.icon} theme="outlined" />
              <Icon type="taobao-circle" className={styles.icon} theme="outlined" />
              <Icon type="weibo-circle" className={styles.icon} theme="outlined" />
              <Link className={styles.register} to="/user/register">
                <FormattedMessage id="login.login.signup" />
              </Link>
            </div> */}
              </LoginComponents>
            </div>
          </Col>
          {loginAlign == 'left' &&
            <Col span={12} className="uiui"></Col>
          }
        </Row>
        {
          customHeader ? <div style={{ width: '100%', position: 'absolute', top: 0, left: 0 }} dangerouslySetInnerHTML={{ __html: customHeader }}></div>
            :
            <div style={{ width: '100%', position: 'absolute', top: 0, left: 0, padding: '10px' }}>
              <img src={headerTheme == 'light' ? logoImageWhite : logoImage} style={{ height: '40px', width: 'auto', display: 'inline-block', verticalAlign: 'bottom' }} />
              <div style={{ fontSize: '24px', fontWeight: 'bold', lineHeight: '40px', display: 'inline-block', marginLeft: '10px', color: headerTheme == 'light' ? '#fff' : '#000' }}>
                {getLocale() == 'zh-CN' && logoName}
                {getLocale() == 'en-US' && logoNameEn}
              </div>
            </div>
        }
        {
          customFooter ? <div style={{ width: '100%', position: 'absolute', bottom: 0, left: 0 }} dangerouslySetInnerHTML={{ __html: customFooter }}></div>
            :
            <div style={{ width: '100%', position: 'absolute', bottom: 0, left: 0, padding: '10px' }}>
              <div style={{ width: '100%', lineHeight: '30px', fontSize: '14px', color: '#696969', textAlign: copyrightAlign }}>
                
                <p
                  style={{
                    // textAlign: copyrightAlign
                    margin: 0
                  }}
                >{copyright.replace('{now}', new Date().getFullYear())}</p>

              </div>
            </div>
        }
        {showChangeLanguageMenu && <Dropdown overlay={menu} >
          <Icon type="global" className={styles.global} style={{ color: langulageIconColor && langulageIconColor }} />
        </Dropdown>}

      </>
    );
  }
}

export default Login;
