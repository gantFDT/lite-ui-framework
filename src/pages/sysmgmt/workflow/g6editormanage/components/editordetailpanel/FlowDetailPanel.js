import React from 'react';
import { connect } from 'dva';
import {
  NodePanel,
  EdgePanel,
  CanvasPanel,
  MultiPanel
} from '@/components/common/ggeditor';
import { getContentHeight } from '@/utils/utils'
import DetailForm from './DetailForm';
import styles from './index.less';

const FlowDetailPanel = (props) => {
  const { MAIN_CONFIG } = props;
  const panelHeight = getContentHeight(MAIN_CONFIG, 244);
  return (
    <div className={styles.detailPanel}>
      <NodePanel style={{ height: panelHeight }}>
        <DetailForm type="node" />
      </NodePanel>
      <EdgePanel style={{ height: panelHeight }}>
        <DetailForm type="edge" />
      </EdgePanel>
      <CanvasPanel style={{ height: panelHeight }}>
        <DetailForm type="canvas" />
      </CanvasPanel>
      <MultiPanel style={{ height: panelHeight }}>
        <DetailForm type="multi" />
      </MultiPanel>
    </div>
  );
};

export default connect(
  ({ settings }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
  })
)(FlowDetailPanel);
