import React from 'react';
import { Dropdown } from 'antd';
import classNames from 'classnames';
import styles from './index.less';

const HeaderDropdown = ({ overlayClassName, ...restProps }) => (
  <Dropdown overlayClassName={classNames(styles.container, overlayClassName)} {...restProps} />
);

export default HeaderDropdown;
