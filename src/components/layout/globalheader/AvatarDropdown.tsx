import React from 'react';
import { Menu, Spin, Icon, Dropdown } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
// import HeaderDropdown from '@/components/layout/headerdropdown';
import styles from './index.less';


const AvatarDropdown = (props: any) => {
  const { currentUser = {}, config } = props;
  const {
    COMMON_CONFIG: {
      showLogout,
    }
  } = config

  const gotoPersonal = () => {
    router.push(`/sysmgmt/account/personal`);
  }

  const logout = () => {
    const { dispatch } = props;
    if (dispatch) {
      dispatch({
        type: 'login/logout',
      });
    }
  }

  const menuHeaderDropdown = (
    <Menu className={styles.menu} selectedKeys={[]}>
      {currentUser.id != '-1' &&
        <Menu.Item key="personal" onClick={gotoPersonal}>
          <Icon type="setting" />
          {tr('个人设置')}
        </Menu.Item>
      }
      {showLogout && currentUser.id != '-1' &&
        <Menu.Divider />
      }
      {showLogout && <Menu.Item key="logout" onClick={logout}>
        <Icon type="logout" />
        {tr('退出')}
      </Menu.Item>
      }
    </Menu>
  );

  return currentUser && currentUser.userName ? (
    <Dropdown overlay={menuHeaderDropdown} trigger={['click']}>
      <span className={`${styles.action} ${styles.account}`}>
        <div className={styles.avatar} style={{ marginRight: '10px', width: '24px', height: '24px', borderRadius: '50%', backgroundImage: `url(${currentUser.avatar})`, backgroundSize: 'cover', backgroundPosition: 'center' }}></div>
        <span className={styles.name}>{currentUser.userName}</span>
      </span>
    </Dropdown>
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


export default connect(({ user, login, config }: { user: any, login: any, config: any }) => ({
  currentUser: user.currentUser,
  config,
  delegation: login.delegation,
  delegateMode: login.delegateMode
}))(AvatarDropdown);
