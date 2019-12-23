import React, { useEffect, useCallback, useMemo } from 'react'
import { widgets } from '@/widgets'
import { Icon, Drawer } from 'antd'
import event from '@/utils/events';

//获取widget的类型
export const getWidgetType = (i: string): string => {
  var widgetType = '';
  Object.keys(widgets).map((key) => {
    if (i.indexOf(key) >= 0) {
      widgetType = key;
    }
  })
  return widgetType
}

//widget配置和删除按钮
export const ConfigBar = (props: any) => {
  const { widgetKey, editMode, handleDeleteWidget, setVisible = () => { } } = props;
  return (<>
    {editMode && <div className={'mask'}></div>}
    {
      editMode && widgets[getWidgetType(widgetKey)] && widgets[getWidgetType(widgetKey)].configPanel ?
        <div className={'configicon'} onClick={() => setVisible(true)}>
          <Icon type="setting" />
        </div> : ''
    }
    {
      editMode && <div className={'deleteicon'}
        onClick={() => handleDeleteWidget()}>
        <Icon type="delete" />
      </div>
    }
  </>)
}

//config的容器
export const ConfigWrap = (props: any) => {
  const { widgetKey, visible, setVisible, width, children } = props;

  const afterVisibleChange = useCallback((visible) => {
    if (visible) {
      const widgetConfigPanel = document.getElementsByClassName('widgetConfigPanel')[0]
      widgetConfigPanel && widgetConfigPanel.addEventListener('mousedown', function (e) { e.stopPropagation() })
    } else {
      const widgetConfigPanel = document.getElementsByClassName('widgetConfigPanel')[0]
      widgetConfigPanel && widgetConfigPanel.removeEventListener('mousedown', function (e) { e.stopPropagation() })
    }
  }, [visible])

  const title = useMemo(() => {
    if (!widgetKey) { return }
    return widgets[getWidgetType(widgetKey)]['name'] + tr('设置')
  }, [widgetKey, widgets, getWidgetType])

  useEffect(() => {
    afterVisibleChange(visible)
  }, [visible])

  return (<>{visible && <Drawer
    className="widgetConfigPanel"
    title={title}
    placement="right"
    closable={true}
    onClose={() => setVisible(false)}
    visible={visible}
    width={width}
    bodyStyle={{ padding: '10px' }}
    afterVisibleChange={afterVisibleChange}
    zIndex={1005}
  >
    {children}
  </Drawer>}</>)
}


//动态按需注册model
export const registerModel = (modelRegisterKey: string = '', callBack: Function = () => { }) => {
  if (!modelRegisterKey) { return }
  useEffect(() => {
    event.on(modelRegisterKey, () => callBack())
    return () => {
      event.off(modelRegisterKey, () => callBack())
    };
  }, [])
}

