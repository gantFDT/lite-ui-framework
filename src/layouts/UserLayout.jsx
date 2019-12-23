import SelectLang from '@/components/common/selectlang';
import GlobalFooter from '@/components/layout/globalfooter';
import { Icon } from 'antd';
import React, { Component, Fragment } from 'react';
import DocumentTitle from 'react-document-title';
import { formatMessage } from 'umi-plugin-locale';
import Link from 'umi/link';
import logo from '../assets/logo.svg';
import styles from './UserLayout.less';
import { getPageTitle, getMenuData } from '@ant-design/pro-layout';
const links = [
  {
    key: 'help',
    title: formatMessage({
      id: 'layout.user.link.help',
    }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({
      id: 'layout.user.link.privacy',
    }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({
      id: 'layout.user.link.terms',
    }),
    href: '',
  },
];
const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" /> 2019 甘棠软件
  </Fragment>
);

class UserLayout extends Component {
  render() {
    const {
      route = {
        routes: [],
      },
    } = this.props;
    const { routes = [] } = route;
    const { children, location } = this.props;
    const { breadcrumb } = getMenuData(routes, this.props);
    console.log(getMenuData)
    return (
      <DocumentTitle
        title={getPageTitle({
          pathname: location.pathname,
          breadcrumb,
          formatMessage,
        })}
      >
        <div className={styles.container}>
          <div className={styles.lang}>
            <SelectLang />
          </div>
          <div className={styles.content}>
            <div className={styles.top}>
              <div className={styles.header}>
                <Link to="/">
                  <img alt="logo" className={styles.logo} src={logo} />
                  <span className={styles.title}>Gant</span>
                </Link>
              </div>
              <div className={styles.desc}>{tr('Gant 前端开发框架')}</div>
            </div>
            {children}
          </div>
          <GlobalFooter links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
