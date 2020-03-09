import React, { useMemo, useCallback, useReducer, useEffect, useRef, useState } from 'react';
import { connect } from 'dva';
import { Button, Tooltip, Spin } from 'antd'
import { Header } from 'gantd'
import UpdateTime from '@/components/common/updatetime'
import Chart from './chart'
import { SaveAsViewModal, SaveViewModal, ChartConfigModal } from './modal'
//工具
import { findIndex } from 'lodash'
import getViewPicker from './getViewPicker'
import { guid } from '../smartsearch/utils'
import { getChartParams } from './utils'
import { initState, reducer, } from './reducer'
import moment from 'moment'
import styles from './index.less'
//接口枚举
import { ActionTypes } from './enum'
import { Props, } from './interface'
import { DefaultView } from '@/components/specific/viewpicker'
import wrapperStyles from '../viewpicker/wrapper.less'
const timeformat = "hh:mm:ss"

function SmartChart(props: Props): any {
  const { dataSource, height, columns, userId, smartChartId, onChange, schema, headerRight,
    themType, onDataChange, loading, onRefresh, padding } = props;
  const localKey = `chart:${smartChartId}:${userId}`;
  if (schema.length <= 0) return null;
  const initIndex = useMemo(() => {
    const defaultViewId: any = localStorage.getItem(localKey);
    let indexView = findIndex(schema, { viewId: defaultViewId });
    indexView = indexView < 0 ? 0 : indexView;
    return indexView
  }, [schema, userId, smartChartId])
  const [updateTime, setUpdateTime] = useState(moment().format(timeformat))
  const [state, dispatch] = useReducer(reducer, { ...initState, defaultIndex: initIndex, index: initIndex, editSchema: schema[initIndex] })
  const [chartHeight, setChartHeight] = useState(600);

  const { visible, defaultIndex, index, editSchema, saveModalVisible, saveType, saveAsModalVisible } = state;
  const viewSchema = useMemo(() => {
    const systemViews: any[] = [], customViews: any[] = [];
    schema.map(item => {
      if (item.viewType === "system") {
        systemViews.push(item)
      } else {
        customViews.push(item)
      }
    })
    return {
      systemViews,
      customViews
    }
  }, [schema])
  const activeView = useMemo(() => {
    return schema[index]
  }, [schema, index]);
  useEffect(() => {
    if (onDataChange) {
      const params = getChartParams(activeView.dataConfig)
      onDataChange(params)
    }
  }, [activeView])
  const onDefaultViewChange = useCallback((chartView: DefaultView) => {
    const { viewId } = chartView
    const newIndex = findIndex(schema, { viewId });
    if (newIndex === defaultIndex) return
    localStorage.setItem(localKey, viewId);
    dispatch({ type: ActionTypes.save, payload: { defaultIndex: newIndex } })
    dispatch({ type: ActionTypes.init })
  }, [dispatch, schema, defaultIndex])
  const switchActiveView = useCallback((chartView: DefaultView) => {
    const { viewId } = chartView
    const newIndex = findIndex(schema, { viewId });
    if (newIndex === index) return;
    dispatch({ type: ActionTypes.save, payload: { index: newIndex } })
    dispatch({ type: ActionTypes.init })
  }, [dispatch, schema, index])
  const updateView = useCallback(({ operateView, hideModal, type }) => {
    const { viewId } = operateView;
    const newIndex = findIndex(schema, { viewId });
    let newSchema: any[] = [];
    if (type === "rename") {
      newSchema = [...schema.slice(0, newIndex), operateView, ...schema.slice(newIndex + 1)];
    } else {
      newSchema = [...schema.slice(0, newIndex), ...schema.slice(newIndex + 1)];
    }
    if (onChange) {
      onChange(newSchema, () => {
        hideModal();
        dispatch({ type: ActionTypes.init })
      })
      return;
    }
    hideModal();
    dispatch({ type: ActionTypes.init })

  }, [schema, dispatch])
  const defaultView = useMemo(() => {
    return {
      type: schema[defaultIndex].viewType,
      viewId: schema[defaultIndex].viewId
    }
  }, [schema, defaultIndex])
  const handleSetting = useCallback(() => {
    dispatch({
      type: ActionTypes.save, payload: {
        visible: true,
        editSchema: activeView
      }
    })
  }, [schema, index, dispatch])
  const { View, ViewConfig } = useMemo(() => {
    const viewProps = {
      viewName: activeView.name,
      viewId: activeView.viewId,
      updateView,
      switchActiveView,
      onDefaultViewChange,
      defaultView,
      renameLoading: false,
      loading: false,
      splitLine: false,
      config: <Tooltip title={tr("配置")} >
        <Button size="small" icon="setting" className="marginh5" onClick={handleSetting} />
      </Tooltip>,
      ...viewSchema
    }
    return getViewPicker(viewProps)
  }, [activeView, schema, defaultIndex, defaultView, handleSetting, updateView, switchActiveView, onDefaultViewChange])
  const handleCancel = useCallback(() => {
    dispatch({
      type: ActionTypes.save, payload: {
        visible: false
      }
    })
  }, [dispatch])
  const handleCancelSave = useCallback(() => {
    dispatch({
      type: ActionTypes.save, payload: {
        saveModalVisible: false
      }
    })
  }, [dispatch])
  const handleCancelSaveAs = useCallback(() => {
    dispatch({
      type: ActionTypes.save, payload: {
        saveAsModalVisible: false
      }
    })
  }, [dispatch])
  const setEditSchema = useCallback((editSchema) => {
    dispatch({ type: ActionTypes.changeEditView, payload: editSchema })
  }, [dispatch])

  const divRef = useRef<HTMLDivElement>({ clientHeight: 0, clientWidth: 0 } as HTMLDivElement)
  const getheight = useCallback(() => {
    if (divRef.current) setChartHeight(divRef.current.clientHeight)
  }, [height])
  useEffect(() => {
    getheight()
    window.addEventListener('resize', getheight)
    return () => {
      window.removeEventListener('resize', getheight)
    }
  }, [height])
  const openSaveAsModal = useCallback(() => {
    dispatch({
      type: ActionTypes.save,
      payload: {
        saveAsModalVisible: true
      }
    })
  }, [dispatch])
  const openSaveModal = useCallback(() => {
    const newSchema = [...schema.slice(0, index), { ...editSchema }, ...schema.slice(index + 1)]
    if (onChange) {
      onChange(newSchema, () => {
        dispatch({
          type: ActionTypes.save, payload: {
            visible: false,
            saveModalVisible: false
          }
        })
      })
    }
  }, [schema, index, editSchema, onChange])
  const handleSave = useCallback((name: string) => {
    const newSchema = [...schema.slice(0, index), { ...editSchema, name }, ...schema.slice(index + 1)]
    if (onChange) {
      onChange(newSchema, () => {
        dispatch({
          type: ActionTypes.save, payload: {
            visible: false,
            saveModalVisible: false
          }
        })
      })
    }
  }, [schema, index, editSchema, onChange])


  const handleSaveAs = useCallback((name: string, isDefault: boolean) => {
    const viewId = guid()
    const newIndex = schema.length;
    const newSchema = [...schema, {
      ...editSchema,
      name,
      viewId,
      viewType: "custom"
    }]
    if (onChange) {
      onChange(newSchema, () => {
        dispatch({
          type: ActionTypes.save, payload: {
            visible: false,
            saveAsModalVisible: false,
            index: newIndex,
            defaultIndex: isDefault ? newIndex : defaultIndex
          }
        })
      })
    }
  }, [schema, onChange, defaultIndex, editSchema])


  useEffect(() => {
    setUpdateTime(moment().format(timeformat))
  }, [dataSource, setUpdateTime])
  const renderRight = useMemo(() => {
    if (typeof headerRight != 'undefined' && headerRight instanceof Function) return headerRight(activeView);
    return headerRight
  }, [activeView, headerRight])
  return <div className={`${styles.smartChart} ${wrapperStyles['view-picker-wrapper']}`} style={{ height }} ref={divRef}   >
    <Header
      type=""
      size="big"
      title={ViewConfig}
      extra={<>
        {renderRight}
        <div style={{ lineHeight: "34px", display: "inline-block", margin: "0px 5px" }} >
          <UpdateTime time={updateTime} refresh={onRefresh} />
        </div>
      </>}
    />
    <div style={{ padding: "0px 10px 5px 10px" }} >
      <Spin spinning={loading}  >
        <Chart columns={columns} padding={padding} dataSource={dataSource} chartView={activeView} height={chartHeight - 55} themType={themType} />
      </Spin>
    </div>
    <ChartConfigModal
      visible={visible}
      handleCancel={handleCancel}
      onSaveAs={openSaveAsModal}
      onSave={openSaveModal}
      columns={columns}
      editSchema={editSchema}
      setEditSchema={setEditSchema}
      View={View}
      activeView={activeView}
    />
    <SaveViewModal
      visible={saveModalVisible}
      handleCancelSave={handleCancelSave}
      name={editSchema.name}
      handleSave={handleSave}
    />
    <SaveAsViewModal
      visible={saveAsModalVisible}
      handleCancelSaveAs={handleCancelSaveAs}
      handleSaveAs={handleSaveAs} />
  </div>
}
SmartChart.defaultProps = {
  dataSource: [],
  height: 500,
  schema: [],
  columns: [],
  userId: "",
  smartChartId: "",
  loading: false
}
export default connect((model: { settings: any }) => ({ themType: model.settings.MAIN_CONFIG.themeType }))(SmartChart)
