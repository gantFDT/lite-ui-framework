import React from 'react';
import { Card } from 'antd';
import { Minimap } from '@/components/common/ggeditor';
import styles from './index.less';

const EditorMinimap = () => {
  return (
    <Card type="inner" size="small" className={styles.minimap} title={tr('缩略图')} bordered={false}>
      <Minimap height={150}/>
    </Card>
  );
};

export default EditorMinimap;
