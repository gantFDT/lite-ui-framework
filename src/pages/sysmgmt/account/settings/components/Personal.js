import React, { Component } from 'react';
import { Form, Button, Popconfirm, notification, PageHeader, Modal, Progress } from 'antd';
import { Input, BlockHeader, EditStatus } from 'gantd';
import { connect } from 'dva';
import styles from './personal.less';

import ImageSelector from '@/components/form/upload/ImageSelector';
import { faxRegexp, phoneRegexp, landlineRegexp, emailRegexp } from '@/utils/regexp'
import { getImageById } from '@/utils/utils'

@connect(({ accountSettingsPersonal, user, loading, config }) => ({
  accountSettingsPersonal,
  currentUser: user.currentUser,
  config
}))
@Form.create()
class AccountSettingsPersonal extends Component {
  state = {
    uploadModalVisible: false,
    showEditButton: true,

    positionEditStatus: false,
    emailEditStatus: false,
    mobileEditStatus: false,
    telEditStatus: false,
    faxEditStatus: false,
  };
  // 加载完毕
  componentDidMount() {
    // 请求数据绑定
    const { dispatch, config } = this.props;
    dispatch({
      type: 'user/fetchCurrent'
    }).then(() => {
      this.setBaseInfo();
    });
  }

  // 头像组件 方便以后独立，增加裁剪之类的功能
  generateAvatar = pictureId => {
    let avatar = getImageById(pictureId);
    const { dispatch, currentUser, config } = this.props;
    const { COMMON_CONFIG: {
      showUpdateSelfInfo
    } } = config
    return (
      <>
        {showUpdateSelfInfo ? <ImageSelector
          shape="circle"
          onConfirm={ret => {
            dispatch({
              type: 'accountSettingsPersonal/saveUserInfo',
              payload: {
                params: {
                  ...currentUser,
                  pictureId: ret.id
                }
              }
            }).then(() => dispatch({
              type: 'user/fetchCurrent',
            }))
          }}
        >
          <div className={styles.avatar} style={{cursor:'pointer'}}>
            <div
              className={styles.imageContainer}
              style={{
                backgroundImage: `url(${avatar})`,
                backgroundSize: 'cover',
              }}
            />
          </div>
        </ImageSelector>
          :
          <div className={styles.avatar}>
            <div
              className={styles.imageContainer}
              style={{
                backgroundImage: `url(${avatar})`,
                backgroundSize: 'cover',
              }}
            />
          </div>
        }

        {showUpdateSelfInfo && <div
          style={{
            display: 'flex',
            justifyContent: 'space-around',
            alignContent: 'center',
            width: 200,
          }}
        >
          <ImageSelector
            shape="circle"
            onConfirm={ret => {
              dispatch({
                type: 'accountSettingsPersonal/saveUserInfo',
                payload: {
                  params: {
                    ...currentUser,
                    pictureId: ret.id
                  }
                }
              }).then(() => dispatch({
                type: 'user/fetchCurrent',
              }))
            }}
          >
            <Button size="small" size="small">{tr('上传头像')}</Button>
          </ImageSelector>


          <Popconfirm
            placement="bottom"
            title={tr('确认使用默认头像吗') + '？'}
            onConfirm={this.initAvatarUrl}
            okText={tr('确认')}
            cancelText={tr('取消')}
          >
            <Button size="small" size="small">{tr('默置头像')}</Button>
          </Popconfirm>
        </div>}
      </>
    );
  };

  // 设置基本信息
  setBaseInfo = () => {
    const {
      currentUser,
      form,
    } = this.props;

    Object.keys(form.getFieldsValue()).forEach(key => {
      let { telephone = '', mobil: mobile = '', fax = '', position = '', email = '' } = currentUser;
      let emplpyeeInfo = { telephone, mobile, fax, position, email };
      form.setFieldsValue(emplpyeeInfo);
    });
  };

  // 设置默认头像
  initAvatarUrl = () => {
    const { dispatch, currentUser } = this.props;

    dispatch({
      type: 'accountSettingsPersonal/saveUserInfo',
      payload: {
        params: {
          ...currentUser,
          pictureId: 0
        }
      }
    }).then(() => dispatch({
      type: 'user/fetchCurrent',
    })).then(() => {
      notification.success({
        message: tr('默认头像设置成功'),
      });
    })
  };

  // 静态内容展示区
  rederSaticUserInfo = staticEmployeeInfo => {
    let { userName = '' } = staticEmployeeInfo;
    let empoyeInfo = {
      userName: {
        value: tr('姓名'),
        key: userName,
      }
    };
    let saticUserInfoDom = (
      <div>
        {Object.keys(empoyeInfo).map(item => (
          <div key={item} className={styles.pure_label}>
            <div className={styles.pure_label_title}>
              <span>{empoyeInfo[item].value}</span>
            </div>
            <div className={styles.pure_label_content}>{empoyeInfo[item].key}</div>
          </div>
        ))}
      </div>
    );

    return saticUserInfoDom;
  };

  //保存修改
  handleSubmit = () => {
    const {
      currentUser,
      dispatch,
      form,
    } = this.props;
    form.validateFields((err, values) => {
      if (err) {
        return;
      } else {
        //判断有无参数变化
        let params = { ...currentUser, ...values };
        delete params.areaCode;
        delete params.prefix;
        // 阻止参数没有改变的情况
        if (JSON.stringify(currentUser) == JSON.stringify(params)) {
          this.saveEditStatus();
          return;
        }
        // 字段兼容mobil
        params.mobil = params.mobile;
        delete params.mobile;

        dispatch({
          type: 'accountSettingsPersonal/setBtnLoadingReducer',
        });

        dispatch({
          type: 'accountSettingsPersonal/saveUserInfo',
          payload: {
            params
          }
        }).then(res => {
          // 同步user model 中的相关信息(直接调用接口更新,没有局部更新)
          dispatch({
            type: 'user/fetchCurrent',
          });
          this.saveEditStatus();
        });
      }
    });
  };

  // 打开编辑
  openEdit = () => {
    this.setState({
      positionEditStatus: EditStatus.EDIT,
      emailEditStatus: EditStatus.EDIT,
      mobileEditStatus: EditStatus.EDIT,
      telEditStatus: EditStatus.EDIT,
      faxEditStatus: EditStatus.EDIT,

      showEditButton: false,
    });
  };

  //取消编辑
  cancelEdit = () => {
    this.setState({
      positionEditStatus: EditStatus.CANCEL,
      emailEditStatus: EditStatus.CANCEL,
      mobileEditStatus: EditStatus.CANCEL,
      telEditStatus: EditStatus.CANCEL,
      faxEditStatus: EditStatus.CANCEL,

      showEditButton: true,
    });
  };

  //保存编辑状态
  saveEditStatus = () => {
    this.setState({
      positionEditStatus: EditStatus.SAVE,
      emailEditStatus: EditStatus.SAVE,
      mobileEditStatus: EditStatus.SAVE,
      telEditStatus: EditStatus.SAVE,
      faxEditStatus: EditStatus.SAVE,

      showEditButton: true,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      accountSettingsPersonal: { avatarUrl, loading, showSaveBtn },
      currentUser,
      dispatch,
      config
    } = this.props;

    const { COMMON_CONFIG: {
      showUpdateSelfInfo
    } } = config

    let { uploadModalVisible } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 16,
          offset: 8,
        },
      },
    };
    return (
      <div className={styles.baseView}>
        <div className={styles.left}>
          <BlockHeader
            // style={{ padding: '20px 0' }}
            extra={
              showUpdateSelfInfo && (this.state.showEditButton ? (
                <Button size="small" icon="edit" onClick={this.openEdit} />
              ) : (
                  <Button size="small" icon="minus-circle" onClick={this.cancelEdit} />
                )
              )
            }
            title={tr('基础信息')}
            type="none"
            bottomLine={false}
          />
          <Form
            hideRequiredMark={this.state.showEditButton}
          >
            {this.rederSaticUserInfo(currentUser)}
            <Form.Item label={tr('职位')} {...formItemLayout}>
              {getFieldDecorator('position')(
                <Input
                  edit={this.state.positionEditStatus}
                  onSave={(val, value, callback) => {
                    if (!this.props.form.getFieldError('position')) {
                      callback();
                      this.handleSubmit();
                    }
                  }}
                  allowEdit={showUpdateSelfInfo}
                />
              )}
            </Form.Item>

            <Form.Item label={tr('邮箱')} {...formItemLayout}>
              {getFieldDecorator('email', {
                rules: [{
                  pattern: emailRegexp,
                  message: tr('请输入正确的邮箱地址')
                }],
              })(
                <Input
                  edit={this.state.emailEditStatus}
                  onSave={(val, value, callback) => {
                    if (!this.props.form.getFieldError('email')) {
                      callback();
                      this.handleSubmit();
                    }
                  }}
                  allowEdit={showUpdateSelfInfo}
                />
              )}
            </Form.Item>

            <Form.Item label={tr('移动电话')} {...formItemLayout}>
              {getFieldDecorator('mobile', {
                rules: [{
                  pattern: phoneRegexp,
                  message: tr('请输入正确的移动电话')
                }],
              })(
                <Input
                  edit={this.state.mobileEditStatus}
                  onSave={(val, value, callback) => {
                    if (!this.props.form.getFieldError('mobile')) {
                      callback();
                      this.handleSubmit();
                    }
                  }}
                  allowEdit={showUpdateSelfInfo}
                />
              )}
            </Form.Item>

            <Form.Item label={tr('固定电话')} {...formItemLayout}>
              {getFieldDecorator('telephone', {
                rules: [{
                  pattern: landlineRegexp,
                  message: tr('请输入正确的固定电话')
                }],
              })(
                <Input
                  edit={this.state.telEditStatus}
                  onSave={(val, value, callback) => {
                    if (!this.props.form.getFieldError('telephone')) {
                      callback();
                      this.handleSubmit();
                    }
                  }}
                  allowEdit={showUpdateSelfInfo}
                />
              )}
            </Form.Item>

            <Form.Item label={tr('传真')} {...formItemLayout}>
              {getFieldDecorator('fax', {
                rules: [{
                  pattern: faxRegexp,
                  message: tr('请输入正确的传真')
                }],
              })(
                <Input
                  edit={this.state.faxEditStatus}
                  onSave={(val, value, callback) => {
                    if (!this.props.form.getFieldError('fax')) {
                      callback();
                      this.handleSubmit();
                    }
                  }}
                  allowEdit={showUpdateSelfInfo}
                />
              )}
            </Form.Item>
            <Form.Item {...tailFormItemLayout}>
              {!this.state.showEditButton && (
                <Button size="small"
                  type="primary"
                  style={{ marginRight: 10 }}
                  loading={loading}
                  onClick={this.handleSubmit}
                >{tr('保存')}</Button>
              )}
            </Form.Item>
          </Form>
        </div>
        <div className={styles.right} style={{ paddingTop: '50px' }}>

          {this.generateAvatar(currentUser.pictureId)}
        </div>
      </div>
    );
  }
}

export default AccountSettingsPersonal;
