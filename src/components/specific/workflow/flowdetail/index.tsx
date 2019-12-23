import React from 'react'
import { Icon } from 'antd';
import { Command } from '@/components/common/ggeditor';
import GGEditor, { Flow } from '@/components/common/ggeditor';
import styles from './index.less';
import { parseFlowData } from '@/pages/sysmgmt/workflow/g6editormanage/utils'

const FlowDetail = (props: any) => {
  const { dataSource, currentStepIds, lastActionId, historyActionIds, ...restProps } = props;

  const targetData = parseFlowData(dataSource, {
    currentStepIds,
    lastActionId,
    historyActionIds
  });

  return (
    <GGEditor className={styles.editor}>
      <div className={styles.zoomIcon}>
        <Command name="zoomIn">
          <Icon type="zoom-in" />
        </Command>
        <Command name="zoomOut">
          <Icon type="zoom-out" />
        </Command>
      </div>
      <Flow data={targetData} {...restProps} className={styles.flow}/>
    </GGEditor>
  )
}

export default FlowDetail;