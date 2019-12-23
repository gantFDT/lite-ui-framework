import React, { useState, useCallback } from 'react';
import { Card, Radio } from 'antd';
import { ItemPanel, Item, withEditorContext } from '@/components/common/ggeditor';
import { SplitNodeIcon, StepNodeIcon, JoinNodeIcon } from '@/components/common/ggeditor/common/constants';
import styles from './index.less';

const edgeTypes = [
  { value: 'approve', label: tr('批准操作') },
  { value: 'reject', label: tr('否决操作') },
  { value: 'cancel', label: tr('作废操作') }
];

const FlowItemPanel = (props) => {
  const { graph } = props;

  if(!graph) return null;

  const [edgeType, setEdgeType] = useState(graph.get('edgeType'));

  const handlerChange = useCallback((e) => {
    graph.set('edgeType',e.target.value)
    setEdgeType(e.target.value)
  },[graph])
  
  return (
    <ItemPanel className={styles.itemPanel}>
      <div className={styles.nodePanel}>
        <Item
          type="node"
          size="120*60"
          shape="_type_step"
          model={{
            label: tr('任务'),
          }}
        >
          <div className={styles.stepNode}>
            <img
              className={styles.nodeLogo}
              src={StepNodeIcon}
            />
            <span>{tr('任务')}</span>
          </div>
        </Item>
        <Item
          type="node"
          size="120*60"
          shape="_type_split"
          model={{
            label: tr('分支'),
          }}
        >
          <div className={styles.splitNode}>
            <img
              className={styles.nodeLogo}
              src={SplitNodeIcon}
            />
            <span>{tr('分支')}</span>
          </div>
        </Item>
        <Item
          type="node"
          size="120*60"
          shape="_type_join"
          model={{
            label: tr('合并'),
          }}
        >
          <div className={styles.splitNode}>
            <img
              className={styles.nodeLogo}
              src={JoinNodeIcon}
            />
            <span>{tr('合并')}</span>
          </div>
        </Item>
      </div>
      <div className={styles.edgePanel}>
        <div className={styles.edgePanelTitle}>
          {tr('操作类型')}
        </div>
        <div className={styles.edgePanelContent}>
          <Radio.Group onChange={handlerChange} value={edgeType}>
            {
              edgeTypes.map(V=>(
                <Radio value={V.value}>{V.label}</Radio>
              ))
            }
          </Radio.Group>
        </div>
      </div>
    </ItemPanel>
  );
};

export default withEditorContext(FlowItemPanel);
