import React, { useState, useCallback, useEffect, useReducer } from 'react';
import { Button, Icon, Spin, Tooltip, Empty, message, } from 'antd';
import { Responsive, WidthProvider } from 'react-grid-layout';
import styles from './index.less'
import { Widget, widgets as widgetsTemp } from '@/widgets'
import { generateUuid, confirmUtil, reducer } from '@/utils/utils'
import WidgetSelector from '@/widgets/selector'
import FooterToolbar from '@/components/layout/footertoolbar';
import classnames from 'classnames'
import { getWidgetType } from '@/widgets/utils'
import { fetch as fetchApi, update as updateApi, removeWidgetApi } from './service'

const ResponsiveReactGridLayout: any = WidthProvider(Responsive)
const maxWidgetLength = 20

interface Dashboard {
  id: string;
  type: string;
  editMode?: boolean;
  exitEditCallback?: Function;
}

const Comp = (props: Dashboard) => {
  const {
    id,
    type = 'user',
    editMode = false,
    exitEditCallback = () => { }
  } = props;

  const [stateEditMode, setStateEditMode] = useState(editMode)
  const [loading, setLoading] = useState(editMode)

  const [state, dispatch] = useReducer(reducer, {
    currentLayout: [],
    widgets: widgetsTemp
  })

  const {
    currentLayout,
    widgets
  } = state;

  //计算当前widget可添加length
  const calcLength = useCallback((widgets, currentLayout) => {
    Object.keys(widgets).map((key) => {
      widgets[key].length = 0
    })
    currentLayout.map((item: object) => {
      Object.keys(widgets).map((key) => {
        if (item['i'].indexOf(key) >= 0) {
          widgets[key].length = widgets[key].length + 1
        }
      })
    })
  }, [])

  //获取操作
  const fetch = useCallback(async (payload: object, callback?: Function) => {
    try {
      setLoading(true)
      const response = await fetchApi({ id, type })

      let currentLayout = []
      if (response && response.bigData) {
        currentLayout = JSON.parse(response.bigData).currentLayout;
      }
      calcLength(widgets, currentLayout)
      if (currentLayout) {
        dispatch({
          type: 'save',
          payload: {
            currentLayout
          }
        })
      }
      setLoading(false)
    } catch (error) {
    }
  }, [id, type, widgets])

  //设置布局信息
  const update = useCallback(async (payload: object, callback: Function = () => { }) => {
    const currentLayout = payload['currentLayout']
    calcLength(widgets, currentLayout)
    try {
      const response = await updateApi({
        id,
        type,
        data: {
          currentLayout: currentLayout
        }
      })

      if (!response) { return }
      dispatch({
        type: 'save',
        payload: {
          currentLayout,
          widgets
        }
      })
      callback()
    } catch (error) {
    }
  }, [id, type, widgets])

  //删除widget信息
  const removeWidget = useCallback(async (widgetKey) => {
    try {
      await removeWidgetApi({
        widgetKey,
        type
      })
    } catch (error) {
    }
  }, [type])

  //改变布局触发
  const onLayoutChange = useCallback(_.debounce((layout: any, layouts?: any, callback?: Function) => {
    if (!stateEditMode) {
      return
    }
    update({
      currentLayout: layout
    }, callback)
  }, 300), [currentLayout, stateEditMode, update])

  //添加小程序
  const addWidget = useCallback((widget, type) => {
    if (currentLayout.length >= maxWidgetLength) {
      message.warning(tr('超过了最大限制数量20') + ',' + tr('不能再添加了'))
    }
    const lastItem = currentLayout[currentLayout.length - 1];
    const newLayout = [...currentLayout, {
      "w": widget.rect.defaultWidth,
      "h": widget.rect.defaultHeight,
      "x": 0,
      "y": lastItem ? lastItem['y'] + lastItem['h'] : 0,
      "i": type + '-' + generateUuid(),
      "minW": widget.rect.minWidth,
      "maxW": widget.rect.maxWidth,
      "minH": widget.rect.minHeight,
      "maxH": widget.rect.maxHeight,
    }]
    onLayoutChange(newLayout)
    message.success(tr('添加成功'));
  }, [currentLayout, onLayoutChange, maxWidgetLength])

  //删除小程序
  const deleteWidget = useCallback((widgetKey) => {
    currentLayout.map((item: object, index: number) => {
      if (item['i'] === widgetKey) {
        currentLayout.splice(index, 1)
      }
    })

    onLayoutChange(currentLayout, [], () => { removeWidget(widgetKey) })
  }, [currentLayout, onLayoutChange])

  //重置
  const reset = useCallback(() => {
    confirmUtil({
      content: tr('确定清空当前仪表板吗') + '?' + tr('清空操作不可恢复'),
      onOk: () => { onLayoutChange([]) }
    })
  }, [onLayoutChange])

  useEffect(() => {
    fetch({
      type,
      id
    })
  }, [id])

  useEffect(() => {
    setStateEditMode(editMode)
  }, [editMode])


  return (
    <Spin spinning={loading}>
      <div style={{ width: 'calc(100% + 20px)', marginLeft: '-10px', marginTop: '-10px' }}>
        <ResponsiveReactGridLayout
          className='layout'
          layouts={{ lg: currentLayout }}
          rowHeight={30}
          isDraggable={stateEditMode}
          breakpoints={{ lg: 1200, md: 800, sm: 600, xs: 400, xxs: 300 }}
          cols={{ lg: 12, md: 12, sm: 2, xs: 2, xxs: 2 }}
          // onBreakpointChange={onBreakpointChange} //断点回调
          onLayoutChange={onLayoutChange}    //布局改变回调
          isResizable={stateEditMode}      //准许改变大小
          // onWidthChange={()=>onWidthChange()}  //宽度改变回调
          measureBeforeMount              //动画相关
        >
          {currentLayout.map((item: any) =>
            <div key={item.i} className={classnames('ant-card', 'reactgriditem')}>
              {widgets[getWidgetType(item.i)] ?
                <Widget
                  widgetKey={item.i}
                  widgetType={getWidgetType(item.i)}
                  itemHeight={item.h * 40 - 10}
                  editMode={stateEditMode}
                  handleDeleteWidget={() => deleteWidget(item.i)}
                />
                : <div className="aligncenter full">
                  {tr('数据有误')}{getWidgetType(item.i)}
                </div>
              }
            </div>
          )}
        </ResponsiveReactGridLayout>

        {currentLayout.length > 0 ?
          !stateEditMode && <div style={{ display: 'flex', margin: '0 10px', marginBottom: '10px' }}>
            <Button className='big-btn' icon="reload" style={{ marginRight: '10px' }} onClick={() => fetch({ id, type })} />
            <Button className='big-btn' type="default" style={{ flex: 1 }} onClick={() => setStateEditMode(true)}>
              <Icon type="plus" />
              {tr('设计仪表板')}
            </Button>
          </div>
          :
          <>
            {!stateEditMode ? <Spin spinning={loading}>
              <div className="emptyContent" style={{ height: 'calc(100vh - 80px)' }}>
                {!loading && <Empty
                  description={
                    <span>
                      {tr('当前仪表板没有小程序')}
                    </span>
                  }
                >
                  <Button size="small" type="primary" onClick={() => setStateEditMode(true)}>{tr('设计仪表板')}</Button>
                  {/* <Button size="small" type="primary" className="marginh10" onClick={() => setDefault()}>{tr('一键设置经典布局')}</Button> */}
                </Empty>
                }
              </div>
            </Spin>
              :
              <div className={classnames('full', 'aligncenter')} style={{ height: 'calc(100vh - 80px)' }}>

                <WidgetSelector
                  widgets={widgets}
                  currentLayout={currentLayout}
                  addWidget={addWidget}
                >
                  <>
                    <Tooltip title={tr('添加小程序')}>
                      <Button type="dashed" shape="circle" icon="plus" size='large' />
                    </Tooltip>
                  </>
                </WidgetSelector>
              </div>
            }
          </>
        }
        {stateEditMode && <div className={styles.block} />}
        {
          stateEditMode &&
          <FooterToolbar style={{ width: '100%' }}>
            <Tooltip placement="top" title={
              tr('在布局时请尽量不要改变浏览器大小') + ',' +
              tr('布局宽度可以随浏览器变小') + ',' +
              tr('但不会随浏览器宽度变大') + '!'
            }>
              <Icon className="marginh10" type="exclamation-circle" />
            </Tooltip>
            <Button size="small" onClick={() => { setStateEditMode(false); exitEditCallback() }}>{tr('退出')}</Button>
            {!_.isEmpty(currentLayout) && <Button size="small" type="danger" onClick={() => reset()}>{tr('一键清空')}</Button>}
            <WidgetSelector
              widgets={widgets}
              currentLayout={currentLayout}
              addWidget={addWidget}
            />

          </FooterToolbar>
        }
      </div >
    </Spin>
  )
}

export default Comp
