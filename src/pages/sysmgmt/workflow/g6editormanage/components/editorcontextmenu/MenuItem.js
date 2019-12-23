import React from 'react';
import { Command } from '@/components/common/ggeditor';
import upperFirst from 'lodash/upperFirst';
import { Icon } from 'antd';
import { Icon as GantdIcon } from 'gantd';
import styles from './index.less';

const MenuItem = (props) => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <div className={styles.item}>
        {
          icon && icon.includes('icon-') ? (
            <GantdIcon type={icon} />
          ) : (
            <Icon type={`${icon || command}`} />
          )
        }
        <span>{text || upperFirst(command)}</span>
      </div>
    </Command>
  );
};

export default MenuItem;
