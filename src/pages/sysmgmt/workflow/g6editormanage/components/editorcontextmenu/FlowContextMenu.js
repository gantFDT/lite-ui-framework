import React from 'react';
import { NodeMenu, ContextMenu, CanvasMenu, EdgeMenu, GroupMenu, MultiMenu } from '@/components/common/ggeditor';
import { withEditorPrivateContext } from '@/components/common/ggeditor/common/context/EditorPrivateContext';
import MenuItem from './MenuItem';
import styles from './index.less';

const FlowContextMenu = (props) => {
  const { contextMenuState } = props;
  return (
    <ContextMenu className={styles.contextMenu}>
      <NodeMenu state={contextMenuState.type}>
        <MenuItem command="copy" icon="copy" text={tr('复制')}/>
        <MenuItem command="remove" icon="delete" text={tr('删除')}/>
      </NodeMenu>
      <EdgeMenu state={contextMenuState.type}>
        <MenuItem command="remove" icon="delete" text={tr('删除')}/>
      </EdgeMenu>
      <CanvasMenu state={contextMenuState.type}>
        <MenuItem command="undo" text={tr('撤销')}/>
        <MenuItem command="redo" text={tr('重做')}/>
        <MenuItem command="pasteHere" icon = "snippets" text = {tr('粘贴')}/>
      </CanvasMenu>
      <GroupMenu state={contextMenuState.type}>
        <MenuItem command="copy" icon="copy" text={tr('复制')}/>
        <MenuItem command="remove" icon="delete" text={tr('删除')}/>
        {/* <MenuItem command="unGroup" icon="folder-open" text={tr('解组')}/> */}
      </GroupMenu>
      <MultiMenu state={contextMenuState.type}>
        <MenuItem command="copy" icon="copy" text={tr('复制')}/>
        <MenuItem command="remove" icon="delete" text={tr('删除')}/>
        {/* <MenuItem command="addGroup" icon="folder" text={tr('归组')}/> */}
      </MultiMenu>
    </ContextMenu>
  );
};

export default withEditorPrivateContext(FlowContextMenu);
