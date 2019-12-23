import React from 'react';
import { Avatar, Menu, Spin, Icon, Tag } from 'antd';
import { FormattedMessage } from 'umi-plugin-react/locale';
import { connect } from 'dva';
import router from 'umi/router';
import HeaderDropdown from '@/components/layout/headerdropdown';
import styles from './index.less';
// import { url } from 'inspector';

class AvatarDropdown extends React.Component {
  gotoPersonal = () => {
    router.push(`/sysmgmt/account/personal`);
  }

  logout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }

  delegateLogin = (delegateCertificateId, ownerUserCode) => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/delegateLogin',
        payload: {
          delegateCertificateId,
          ownerUserLoginName: ownerUserCode
        }
      });
    }
  }

  delegateLogout = () => {
    const { dispatch } = this.props;
    if (dispatch) {
      dispatch({
        type: 'login/delegateLogout',
      });
    }
  }

  render() {
    const { currentUser = {}, menu, delegation, delegateMode, config } = this.props;
    const { COMMON_CONFIG: {
      showLogout,
      showDelegateMenu
    } } = config
    const menuHeaderDropdown = (
      <Menu className={styles.menu} selectedKeys={[]}>
        {currentUser.id != '-1' &&
          <Menu.Item key="personal" onClick={this.gotoPersonal}>
            <Icon type="setting" />
            {tr('个人设置')}
          </Menu.Item>
        }
        {showDelegateMenu && currentUser.id != '-1' &&
          <Menu.Divider />
        }
        {showDelegateMenu && currentUser.id != '-1' && !delegateMode &&
          <Menu.SubMenu disabled={delegation.length == 0} title={<><Icon type="usergroup-add" />{tr('切换代理用户')}</>}>
            {
              delegation.length &&
              delegation.map(item => (
                <Menu.Item key={item.delegateCertificateId} onClick={this.delegateLogin.bind(this, item.delegateCertificateId, item.ownerUserCode)}>
                  {item.ownerUserName}
                </Menu.Item>
              ))
            }
          </Menu.SubMenu>
        }
        {currentUser.id != '-1' && delegateMode &&
          <Menu.Item key="delegatelogout" onClick={this.delegateLogout}>
            <Icon type="rollback" />
            {tr('退出用户代理')}
          </Menu.Item>
        }
        {showLogout && currentUser.id != '-1' &&
          <Menu.Divider />
        }
        {showLogout && <Menu.Item key="logout" onClick={this.logout}>
          <Icon type="logout" />
          {tr('退出')}
        </Menu.Item>
        }
      </Menu>
    );

    return currentUser && currentUser.userName ? (
      <HeaderDropdown overlay={menuHeaderDropdown} trigger={['click']}>
        <span className={`${styles.action} ${styles.account}`}>
          {/* <Avatar size="small" className={styles.avatar} src={currentUser.avatar} alt="avatar" /> */}
          {currentUser.id != '-1' && <div className={styles.avatar} style={{ marginRight: '10px', width: '24px', height: '24px', borderRadius: '50%', backgroundImage: `url(${currentUser.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>}
          <span className={styles.name}>{currentUser.userName}</span>
          {delegateMode && <Tag style={{ marginLeft: '10px' }} color="green">{tr('代理模式')}</Tag>}
        </span>
      </HeaderDropdown>
    ) : (
        <Spin
          size="small"
          style={{
            marginLeft: 8,
            marginRight: 8,
          }}
        />
      );
  }
}

export default connect(({ user, login, config }) => ({
  currentUser: user.currentUser,
  config,
  delegation: login.delegation,
  delegateMode: login.delegateMode
}))(AvatarDropdown);
