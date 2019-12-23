import React from 'react';
import { Row, Col } from 'antd';
import GGEditor, { Flow, Grid } from '@/components/common/ggeditor';
import { GraphConfig } from '@/components/common/ggeditor/common/interface';
import { getContentHeight } from '@/utils/utils'
import { FlowToolbar } from './components/editortoolbar';
import { FlowItemPanel } from './components/editoritempanel';
import { FlowDetailPanel } from './components/editordetailpanel';
import { FlowContextMenu } from './components/editorcontextmenu';
import EditorMinimap from './components/editorminimap';
import styles from './index.less';
import { connect } from 'dva';

export const g6Grid = new Grid({});

const data = {
  nodes: [
    {
      id: "START",
      label: tr("开始"),
      shape: "_type_start",
      size: [120, 50],
      x: 200,
      y: 100,
    },
    {
      id: "END",
      label: tr("结束"),
      shape: "_type_end",
      size: [120, 50],
      x: 200,
      y: 400
    }
  ]
}

const graphConfig: Partial<GraphConfig> = {
  edgeType: 'approve',
  plugins: [ g6Grid ]
}

const FlowPage = (props: any) => {
  const {
    MAIN_CONFIG
  } = props;

  const cardHeight = getContentHeight(MAIN_CONFIG, 2);

  return (
    <GGEditor className={styles.editor} style={{ height: cardHeight }}>
      <Row type="flex" className={styles.editorHd}>
        <Col span={24}>
          <FlowToolbar />
        </Col>
      </Row>
      <Row type="flex" className={styles.editorBd}>
        <Col className={styles.editorContent}>
          <FlowItemPanel />
        </Col>
        <div className={styles.canvasContent}>
          <Flow
            data={data}
            mode="edit"
            graphConfig={graphConfig}
            className={styles.flow}
          />
        </div>
        <Col className={styles.editorSidebar}>
          <FlowDetailPanel />
          <EditorMinimap />
        </Col>
      </Row>
      <FlowContextMenu />
    </GGEditor>
  );
};

export default connect(
  ({ settings }: any) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
  })
)(FlowPage)
