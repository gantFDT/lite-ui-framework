import router from 'umi/router';
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { SubMenu, Icon, Card, BlockHeader } from 'gantd';
import { Avatar } from 'antd';
import Link from 'umi/link'
import styles from './style.less';
import { getImageById, getContentHeight } from '@/utils/utils';
import { UpdateRouteName } from '@/components/compose'
import EditPwdView from './components/EditPwd';
import PersonalView from './components/Personal';
import UIConfig from './components/UIConfig';
import StorageClear from './components/StorageClear';


const AccountSettings = props => {
  const {
    dispatch,
    selectKey,
    headerHeight,
    showBreadcrumb,
    children,
    MAIN_CONFIG,
    location: { pathname },
    currentUser: { pictureId = '', userName = '', id = '' },
    mode,
    config
  } = props;
  const { COMMON_CONFIG: {
    showUpdateSelfPassword,
    showUIConfig,
    showStorageClear
  } } = config
  const menuData = []
  const arr = [{
    name: tr('个人信息'),
    icon: <Icon type="icon-xingming" />,
    path: 'personal',
    visible: true
  },
  {
    name: tr('修改密码'),
    icon: <Icon type="icon-iconbi" />,
    path: 'editpwd',
    visible: showUpdateSelfPassword
  },
  {
    name: tr('界面设置'),
    icon: <Icon.Ant type="control" />,
    path: 'uiconfig',
    visible: showUIConfig
  },
  {
    name: tr('缓存清理'),
    icon: <Icon.Ant type="database" />,
    path: 'storage',
    visible: showStorageClear
  }
  ]
  arr.map((item, index, arr) => {
    if (item.visible) {
      menuData.push({ ...item, key: item.path })
    }
  });

  const avatarUrl = getImageById(pictureId);

  const getActiveKey = (_pathname) => {
    const currentTab = menuData.find(item => _pathname.includes(item.path));
    return currentTab ? currentTab.name : menuData[0].name;
  }

  const onSelectedChange = (_path, _name) => {
    router.push(_path)
    dispatch({
      type: 'accountSettings/save',
      payload: { selectKey: _name, mode }
    });
  };


  const onSwitchChange = (_mode) => {
    dispatch({
      type: 'accountSettings/save',
      payload: { mode: _mode }
    });
  }
  useEffect(() => {
    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent'
      })
      dispatch({
        type: 'accountSettings/save',
        payload: { selectKey: getActiveKey(pathname) }
      });
    }
  }, [])

  const renderChildren = () => {
    switch (selectKey) {
      case tr('个人信息'):
        return <PersonalView />
      case tr('修改密码'):
        return <EditPwdView showBottomBtn />
      case tr('界面设置'):
        return <UIConfig />
      case tr('缓存清理'):
        return <StorageClear />
      default:
        break;
    }
    return null;
  }

  return (
    <>
      {
        <SubMenu
          menuData={menuData}
          selectedKey={selectKey}
          mode={mode}
          width={150}
          onSelectedChange={onSelectedChange}
          onSwitchChange={onSwitchChange}
          style={{background:'var(--component-background)'}}
          extra={
            <div className="aligncenter" style={{ padding: '20px' }}>
              <Link to={`/common/user/${id}`}>
                <div className="aligncenter" style={{ flexDirection: 'column', width: '100%' }}>
                  <div className={styles.avatar} style={avatarUrl ? { backgroundImage: `url(${avatarUrl})` } : { backgroundColor: '#fafafa' }} />
                  <div className="text-overflow-hidden" style={{ textAlign: 'center' }}>{userName}</div>
                </div>
              </Link>
            </div>
          }
        >
          <div>
            <BlockHeader title={selectKey} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }} />
            <div style={{ padding: '10px 20px', minHeight: getContentHeight(MAIN_CONFIG, 40) }}>
              {renderChildren()}
            </div>
          </div>
        </SubMenu>
      }
    </>
  );
}

export default connect(({ accountSettings, loading, user, settings, config }) => ({
  currentUser: user.currentUser,
  selectKey: accountSettings.selectKey,
  mode: accountSettings.mode,
  loadingCurrentUser: loading.effects['user/fetchCurrent'],
  headerHeight: settings.MAIN_CONFIG.headerHeight,
  showBreadcrumb: settings.MAIN_CONFIG.showBreadcrumb,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  config
}))(
  AccountSettings
);