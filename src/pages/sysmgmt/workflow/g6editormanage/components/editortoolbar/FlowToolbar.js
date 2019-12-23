import React from 'react';
import { Divider, Tooltip } from 'antd';
import { Icon } from 'gantd';
import FlowTempModal from '../flowtempmodal'
import Button from './Button';
import styles from './index.less';
import ModalManager from './ModalManager';

const FlowToolbar = () => {
  return (
    <>
      <div className={styles.toolbar}>
        <Button command="import" icon="icon-daoruyonghuzuzhi" text={tr('打开已部署模板')}/>
        <Button command="read" icon="icon-daoru" text={tr('打开流程设计模板')}/>
        <Button command="save" icon="save" text={tr('保存')}/>
        <Divider type="vertical" />
        <Button command="create" icon="file-add" text={tr('新建')}/>
        <Divider type="vertical" />
        <Button command="undo" text={tr('撤销')}/>
        <Button command="redo" text={tr('重做')}/>
        <Divider type="vertical" />
        <Button command="copy" icon="copy" text={tr('复制')}/>
        <Button command="paste" icon = "snippets" text = {tr('粘贴')}/>
        <Button command="remove" icon="delete" type='danger' text={tr('删除')}/>
        <Divider type="vertical" />
        <Button command="zoomIn" icon="zoom-in" text={tr('放大')}/>
        <Button command="zoomOut" icon="zoom-out" text={tr('缩小')}/>
        <Button command="autoZoom" icon="fullscreen" text={tr('适应画布')}/>
        <Button command="resetZoom" icon="fullscreen-exit" text={tr('实际尺寸')}/>
        <Divider type="vertical" />
        <Button command="toBack" icon="icon-xiayi" text={tr('层级后置')}/>
        <Button command="toFront" icon="icon-shangyi" text={tr('层级前置')}/>
        <Divider type="vertical" />
        <Button command="multiSelect" icon="icon-xiangmuguanli" text={tr('多选')}/>
        <Divider type="vertical" />
        <Button command="publish" icon="icon-yiburenwurizhi" text={tr('发布')}/>
        <Button command="edit" icon="form" text={tr('更新')}/>
        <Divider type="vertical" />
        <Button command="exportImg" icon="icon-daochu" text={tr('导出图片')}/>
        <Divider type="vertical" />
      </div>
      <ModalManager/>
    </>
  );
};

export default FlowToolbar;
