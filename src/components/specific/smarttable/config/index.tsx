import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { notification, Icon, Button } from 'antd'
import { ResizableModal, ResizableProvider } from '@/components/common/modal'
import { ModalProps } from 'antd/lib/modal'
import { deepCopy4JSON } from '@/utils/utils'
import ViewPicker from '../../viewpicker'
import SaveAsModal from './SaveAsModal'
import UIContent from './UIContent'

interface ConfigModalProps extends ModalProps {
  dataSource: any,
  originColumns: any,
  views:any,
  onSaveViews: (vals: any) => void,
  onSaveAs: (vals: any, cb: () => void) => void,
  tableKey?: string,
  onOk?: (config: any) => void,
  onCancel?: () => void,
  onViewChange?: (viewSchema: any) => void,
}

function ConfigModal(props: ConfigModalProps) {
  const {
    visible,
    originColumns,
    dataSource,
    tableKey,
    views,
    onSaveViews,
    onSaveAs,
    onOk,
    onCancel,
    onViewChange,
    ...restProps
  } = props;

  const [titleModalVisible, setTitleModalVisible] = useState(false);

  const [fakeView, setFakeView] = useState(deepCopy4JSON(dataSource));
  const { panelConfig } = fakeView;

  useEffect(() => {
    const view = deepCopy4JSON(dataSource);
    visible && setFakeView(view)
    onViewChange && onViewChange(view.panelConfig)
  }, [dataSource,visible]);

  const handlerClose = useCallback(() => {
    onCancel && onCancel()
  }, [])

  const handlerSave = useCallback(() => {
    if(!panelConfig.columnKeys.filter((record: any)=>record.checked).length) return notification.info({
      message: tr('必须保留一列')
    })
    onOk && onOk(fakeView)
  }, [fakeView])

  const handlerChooseView = useCallback((view) => {
    const _view = deepCopy4JSON(view);
    setFakeView(_view)
    onViewChange && onViewChange(_view.panelConfig)
  },[])

  const isSystem = useMemo(() => fakeView.viewId&&fakeView.viewId.includes('sys'),[fakeView])

  const handleSaveAs = useCallback((values) => {
    let cb = () => { setTitleModalVisible(false) };
    onSaveAs && onSaveAs({
      panelConfig:{
        ...fakeView.panelConfig
      },
      ...values,
    }, cb);
  }, [fakeView, onSaveAs])

  const handlerChangeConfig = useCallback((config) => {
    setFakeView({
      ...fakeView,
      panelConfig: config
    })
    onViewChange && onViewChange(config)
  },[fakeView])

  return (
    <>
      <ResizableProvider
        maxZIndex={12}
        minWidth={400}
        minHeight={400}
        initalState={{ width: 520, height: 520 }}>
        <ResizableModal
          id='smartTableConfigModal'
          visible={visible}
          title={
            <>
              <Icon type="setting"/>
              <span style={{margin:'0 8px'}}>{tr('表格配置')}</span>
              <ViewPicker
                showLeftSpace
                viewName={fakeView.name}
                viewId={fakeView.viewId}
                customViews={views.customViews}
                systemViews={views.systemViews}
                switchActiveView={handlerChooseView}
                updateView={onSaveViews}
                // renameLoading={renameLoading}
                // loading={updateViewLoading}
              />
            </>
          }
          onCancel={handlerClose}
          destroyOnClose
          isModalDialog
          footer={
            <div>
              <Button size="small"  
                icon='close-circle'
                onClick={handlerClose}
              >{tr('取消')}</Button>
              <Button size="small"  
                icon='diff'
                onClick={() => { setTitleModalVisible(true) }}
              >{tr('另存为')}</Button>
              <Button size="small"  
                type='primary'
                icon='save'
                onClick={handlerSave}
                disabled={isSystem}
              >{tr('保存')}</Button>
            </div>
          }
          {...restProps}
        >
          <UIContent
            viewConfig={fakeView.panelConfig}
            // schema={}
            onChange={handlerChangeConfig}
          />
        </ResizableModal>
      </ResizableProvider>
      <SaveAsModal
        visible={titleModalVisible}
        onSubmit={handleSaveAs}
        onCancel={() => { setTitleModalVisible(false) }}
      />
    </>
  )
}

export default ConfigModal;