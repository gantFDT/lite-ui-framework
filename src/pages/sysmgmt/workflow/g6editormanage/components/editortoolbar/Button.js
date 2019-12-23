import React from 'react';
import { Tooltip } from 'antd';
import { Command } from '@/components/common/ggeditor';
import { upperFirst } from 'lodash';
import { Icon } from 'antd';
import { Icon as GantdIcon } from 'gantd';
import styles from './index.less';

const Button = (props) => {
  const { command, icon, text } = props;

  return (
    <Command name={command}>
      <Tooltip
        title={text || upperFirst(command)}
        placement="bottom"
        overlayClassName={styles.tooltip}
      >
        {
          icon && icon.includes('icon-') ? (
            <GantdIcon type={icon} />
          ) : (
            <Icon type={`${icon || command}`} />
          )
        }
      </Tooltip>
    </Command>
  );
};

export default Button;
