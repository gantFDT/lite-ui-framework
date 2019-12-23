import React, { useCallback, useState, useEffect, useMemo, useRef } from 'react';
import { Tabs, Radio, Tooltip, Button, Icon } from 'antd';
import _ from 'lodash';
import arrayMove from 'array-move';
import { deepCopy4JSON } from '@/utils/utils';
import { ResizableModal, ResizableProvider } from '@/components/common/modal';
import { UiContent, SortableList, SaveAsModal } from './components';
import { SupportFilterField, SupportOrderField, View, SearchField, OrderField, CompatibilityMode } from '../../interface';
import { UiConfigProps } from '../../interface';
import styles from './index.less';
const { TabPane } = Tabs;

enum TabsEnum { search, order, uiConfig };

export interface SaveAsDataProps {
  values: { name: string, isDefault: boolean },
  searchFields: SearchField[],
  orderFields: OrderField[],
  uiConfig: UiConfigProps
}

export interface ConfigProps {
  activeView: View,
  viewSelector: any,
  supportFilterFields: SupportFilterField[],
  supportOrderFields: SupportOrderField[],
  configModalSize?: any,
  loading?: boolean,
  saveAsLoading?: boolean,
  onSave?: (view: any, cb: () => void) => void,
  onSaveAs?: (data: SaveAsDataProps, cb: () => void) => void,
  isCompatibilityMode: boolean
}

const setLockKey = function (arr: Array<any>) {
  return _.map(arr, (item, key) => {
    return { ...item, lockKey: key }
  })
}

export default function Config(props: ConfigProps) {
  const {
    activeView,
    viewSelector,
    supportFilterFields,
    supportOrderFields,
    configModalSize,
    loading,
    saveAsLoading,
    onSave,
    onSaveAs,
    isCompatibilityMode
  } = props;
  const { isSystem, panelConfig: { searchFields, orderFields = [], uiConfig = {} } } = activeView;
  const [visible, setVisible] = useState<boolean>(false);
  const [saveAsVisible, setSaveAsVisible] = useState<boolean>(false);
  const [tabsKey, setTabsKey] = useState<string>(TabsEnum[0]);
  const [tempSearchFields, setTempSearchFields] = useState<SearchField[]>(setLockKey(searchFields));
  const [tempOrderFields, setTempOrderFields] = useState<OrderField[]>(setLockKey(orderFields));
  const [tempUiConfig, setTempUiConfig] = useState<UiConfigProps>(uiConfig);
  const [searchMaxLockKey, setSearchMaxLockKey] = useState<number>(searchFields.length);
  const [orderMaxLockKey, setOrderMaxLockKey] = useState<number>(orderFields.length);
  const tempSearchRef = useRef(tempSearchFields);
  const tempOrderRef = useRef(tempOrderFields);
  const tempUiRef = useRef(tempUiConfig);

  useEffect(() => {
    updateConfig()
  }, [activeView])

  useEffect(() => {
    tempSearchRef.current = tempSearchFields
  }, [tempSearchFields])

  useEffect(() => {
    tempOrderRef.current = tempOrderFields
  }, [tempOrderFields])

  useEffect(() => {
    tempUiRef.current = tempUiConfig
  }, [tempUiConfig])

  const updateConfig = useCallback(() => {
    setTempSearchFields(setLockKey(searchFields))
    setTempOrderFields(setLockKey(orderFields))
    setTempUiConfig(uiConfig)
    setSearchMaxLockKey(searchFields.length)
    setOrderMaxLockKey(orderFields.length)
  }, [searchFields, orderFields, uiConfig])

  const onSearchChange = useCallback((value, index, isMain) => {
    const { label, key } = value;
    let data = deepCopy4JSON(tempSearchRef.current);
    if (isMain) {
      data[index].fieldName = key;
      if (!isCompatibilityMode) {
        data[index].title = label;
      }
      delete data[index].operator;
    } else {
      data[index].operator = key;
    }
    setTempSearchFields(data)
  }, [isCompatibilityMode])

  const onOrderChange = useCallback((value, index, isMain) => {
    const { label, key } = value;
    let data = deepCopy4JSON(tempOrderRef.current);
    if (isMain) {
      data[index].fieldName = key;
      data[index].title = label;
      data[index].orderType = 'DESC';
    } else {
      data[index].orderType = key;
    }
    setTempOrderFields(data)
  }, [])

  const onUiConfigChange = useCallback((key, value) => {
    setTempUiConfig({ ...tempUiRef.current, [key]: value })
  }, [tempUiRef])

  const onCreate = useCallback((type, index) => {
    if (type == TabsEnum[0]) {
      let data = deepCopy4JSON(tempSearchRef.current);
      data.splice(index + 1, 0, { lockKey: searchMaxLockKey });
      setTempSearchFields(data);
      setSearchMaxLockKey(searchMaxLockKey + 1);
    } else {
      let data = deepCopy4JSON(tempOrderRef.current);
      data.splice(index + 1, 0, { orderType: 'DESC', lockKey: orderMaxLockKey });
      setTempOrderFields(data);
      setOrderMaxLockKey(orderMaxLockKey + 1);
    }
  }, [searchMaxLockKey, orderMaxLockKey])

  const onRemove = useCallback((type, index) => {
    let setFn = type == TabsEnum[0] ? setTempSearchFields : setTempOrderFields;
    let data = deepCopy4JSON(type == TabsEnum[0] ? tempSearchRef.current : tempOrderRef.current);
    if (data.length == 1) return;
    data.splice(index, 1);
    setFn(data);
  }, [])

  const onSortEnd = useCallback((type, { oldIndex, newIndex }) => {
    if (type == TabsEnum[0]) {
      setTempSearchFields([...arrayMove(tempSearchRef.current, oldIndex, newIndex)])
    } else {
      setTempOrderFields([...arrayMove(tempOrderRef.current, oldIndex, newIndex)])
    }
  }, [])

  const changeModalStatus = useCallback(() => {
    setVisible((modalStatus: boolean) => {
      if (!modalStatus) {
        updateConfig()
      }
      return !modalStatus
    })
  }, [updateConfig])

  const getAllFields = useCallback(() => {
    let searchFields = _.chain(tempSearchRef.current).map(i => _.omit(i, 'lockKey')).filter((i) => !_.isEmpty(i)).uniqWith(_.isEqual).value();
    let orderFields = _.chain(tempOrderRef.current).map(i => _.omit(i, 'lockKey')).filter((i) => i.fieldName != undefined).uniqWith(_.isEqual).value();
    return { searchFields, orderFields }
  }, [])

  const handleSave = useCallback(() => {
    if (isSystem) return;
    const { searchFields, orderFields } = getAllFields();
    const newView = {
      ...activeView,
      panelConfig: {
        ...activeView.panelConfig,
        searchFields,
        orderFields,
        uiConfig: tempUiRef.current
      }
    };
    let cb = () => { setVisible(false) };
    onSave && onSave(newView, cb)
  }, [onSave, isSystem])

  const handleSaveAs = useCallback((values) => {
    const { searchFields, orderFields } = getAllFields();
    let cb = () => {
      setSaveAsVisible(false);
      setVisible(false);
    };
    onSaveAs && onSaveAs(
      {
        values,
        searchFields,
        orderFields,
        uiConfig: tempUiRef.current
      }, cb);
  }, [onSaveAs])

  const titleElement = useMemo(
    () => (
      <div className={styles.configHeaderTitle}>
        <Icon className={styles.configHeaderTitleIcon} type="setting" />
        <span>{tr('查询视图配置')}</span>
        {viewSelector}
      </div>
    ),
    [viewSelector],
  )
  return (
    <>
      <ResizableProvider
        maxZIndex={12}
        minWidth={400}
        minHeight={400}
        initalState={{
          ...configModalSize,
        }}>
        <ResizableModal
          id='searchFormConfigModal'
          visible={visible}
          title={titleElement}
          onCancel={changeModalStatus}
          isModalDialog
          zIndex={1007}
          footer={<div>
            <Button size="small"
              icon='close-circle'
              onClick={() => { setVisible(false) }}
            >{tr('取消')}</Button>
            <Button size="small"
              icon='diff'
              onClick={() => { setSaveAsVisible(true) }}
            >{tr('另存为')}</Button>
            <Button size="small"
              type='primary'
              icon='save'
              loading={loading}
              onClick={handleSave}
              disabled={isSystem}
            >{tr('保存')}</Button>
          </div>}
        >
          <div className={styles.configContent}>
            <div className={styles.RadioGroupTabs}>
              <Radio.Group
                defaultValue={tabsKey}
                buttonStyle="solid"
                onChange={(e) => setTabsKey(e.target.value)}>
                <Radio.Button value={TabsEnum[0]}>{tr("字段配置")}</Radio.Button>
                {!isCompatibilityMode && (
                  <Radio.Button value={TabsEnum[1]}>{tr("结果排序规则")}</Radio.Button>
                )}
                <Radio.Button value={TabsEnum[2]}>{tr("显示配置")}</Radio.Button>
              </Radio.Group>
            </div>
            <Tabs activeKey={tabsKey} className={styles.contentTabs}>
              <TabPane tab={tr("字段配置")} key={TabsEnum[0]}>
                <SortableList
                  helperClass={styles.sortableHelper}
                  useDragHandle
                  supportFields={supportFilterFields}
                  fields={tempSearchFields}
                  type={TabsEnum[0]}
                  onSelectChange={onSearchChange}
                  onCreate={onCreate}
                  onRemove={onRemove}
                  onSortEnd={onSortEnd.bind(null, TabsEnum[0])}
                  isCompatibilityMode={isCompatibilityMode}
                />
              </TabPane>
              {!isCompatibilityMode && (
                <TabPane tab={tr("排序配置")} key={TabsEnum[1]}>
                  <SortableList
                    helperClass={styles.sortableHelper}
                    useDragHandle
                    supportFields={supportOrderFields}
                    fields={tempOrderFields}
                    type={TabsEnum[1]}
                    onSelectChange={onOrderChange}
                    onCreate={onCreate}
                    onRemove={onRemove}
                    onSortEnd={onSortEnd.bind(null, TabsEnum[1])}
                    isCompatibilityMode={isCompatibilityMode}
                  />
                </TabPane>
              )}
              <TabPane tab={tr("显示配置")} key={TabsEnum[2]}>
                <UiContent uiConfig={tempUiConfig} onChange={onUiConfigChange} />
              </TabPane>
            </Tabs>
          </div>
        </ResizableModal>
      </ResizableProvider>
      <SaveAsModal
        loading={saveAsLoading}
        visible={saveAsVisible}
        onSubmit={handleSaveAs}
        onCancel={() => { setSaveAsVisible(false) }}
      />
      <Tooltip title={tr('配置')}>
        <Button size="small" icon='setting' onClick={changeModalStatus} />
      </Tooltip>
    </>
  )
}
