import router from 'umi/router';
import React, { useState, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import { Submenu, Icon, Card, Header } from 'gantd';
import { Avatar } from 'antd';
import Link from 'umi/link'
import styles from './style.less';
import { getImageById, getContentHeight } from '@/utils/utils';
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
    title: tr('个人信息'),
    icon: <Icon type="idcard" />,
    key: 'personal',
    visible: true
  },
  {
    title: tr('修改密码'),
    icon: <Icon type="lock" />,
    key: 'editpwd',
    visible: showUpdateSelfPassword
  },
  {
    title: tr('界面设置'),
    icon: <Icon type="control" />,
    key: 'uiconfig',
    visible: showUIConfig
  },
  {
    title: tr('缓存清理'),
    icon: <Icon type="database" />,
    key: 'storage',
    visible: showStorageClear
  }
  ]
  arr.map((item, index, arr) => {
    if (item.visible) {
      menuData.push({ ...item, key: item.key })
    }
  });

  const avatarUrl = getImageById(pictureId);

  const getActiveKey = (_pathname) => {
    const currentTab = menuData.find(item => _pathname.includes(item.key));
    return currentTab ? currentTab.key : menuData[0].key;
  }

  const onSelectedChange = (key, item) => {
    router.push(key)
    dispatch({
      type: 'accountSettings/save',
      payload: { selectKey: key, mode }
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

  const activeItem = useMemo(() => {
    const item = _.find(arr, (i) => i['key'] === selectKey)
    if (_.isEmpty(item)) { return arr[0]}
    return item
  }, [selectKey])

  const renderChildren = () => {
    switch (selectKey) {
      case 'personal':
        return <PersonalView />
      case 'editpwd':
        return <EditPwdView showBottomBtn />
      case 'uiconfig':
        return <UIConfig />
      case 'storage':
        return <StorageClear />
      default:
        break;
    }
    return null;
  }

  return (
    <>
      {
        <Submenu
          menuData={menuData}
          selectedKey={selectKey}
          mode={mode}
          width={150}
          onSelectedChange={onSelectedChange}
          onSwitchChange={onSwitchChange}
          style={{ background: 'var(--component-background)' }}
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
            <Header title={<><span className='gant-margin-h-5'>{activeItem['icon']}</span>{activeItem['title']}</>} style={{ borderBottom: '1px solid rgba(0,0,0,0.1)' }} />
            <div style={{ padding: '10px 20px', minHeight: getContentHeight(MAIN_CONFIG, 40) }}>
              {renderChildren()}
            </div>
          </div>
        </Submenu>
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
