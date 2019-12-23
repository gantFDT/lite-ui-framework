import React, { useState, useMemo, useCallback, ReactNode, useEffect, useLayoutEffect, useRef } from 'react'
import { TableProps, ExpandIconProps } from 'antd/lib/table'
import { PaginationConfig } from 'antd/lib/pagination'
import { Tooltip, Button, Icon, Empty } from 'antd'
import { connect } from 'dva'
import moment from 'moment'
import { isEmpty } from 'lodash';
import { Table } from 'gantd'
import ConfigModal from './config'
import { generColumns, SchemaProps } from './fieldgenerator'
import styles from './style.less'
import classnames from 'classnames'
import ViewPicker, { DefaultView } from '../viewpicker';
import { getCustomViewsApi, setCustomViewsApi } from './service';
import { useTableConfig, useLocalStorage, guid } from './utils'
import { withFocusKeyEvent } from '@/components/common/withkeyevent'
import wrapperStyles from '../viewpicker/wrapper.less'
import { ExportExcel } from '../../common'

function CustomExpandIcon(props: ExpandIconProps<object>, isTree?: boolean) {
  if (!isTree) {
    return null;
  }
  let type;
  let prefix;
  if (!props.expandable) {
    type = 'file';
    prefix = null;
  } else if (props.expanded) {
    type = 'folder-open';
    prefix = 'expanded';
  } else {
    type = 'folder';
    prefix = 'collapsed';
  }
  return (
    <span onClick={(e: any) => props.onExpand(props.record, e)} style={{ paddingLeft: prefix ? 0 : 17 }}>
      {
        prefix && <span className={"ant-table-row-expand-icon ant-table-row-" + prefix} />
      }
      <Icon
        className="marginh5"
        type={type}
        theme="filled"
      />
    </span>
  );
}

const defaultChildrenColumnName: string = 'children';
const defaultRowKey: string = 'id';
const defaultBodyMinHeight: number = 600;
const viewVersionFormat: string = 'YYYY-MM-DD HH:mm:SSSS';
const keyReg = /^on(Alt|Ctrl|Meta|Shift){0,4}([A-Z][a-z]*)+$/

export const defaultActiveView: any = {
  wrap: true,
  isZebra: true,
  bordered: true,
  clickable: true,
  footerDirection: 'row',
  heightMode: 'full',
  pageSize: 50,
}

export interface ViewProps {
  viewId: string,
  name: string,
  defaultView: boolean,
  version: string,
  panelConfig: any
}

interface ViewListProps {
  systemViews: ViewProps[],
  customViews: ViewProps[],
}

export interface SmartTableProps<T> extends TableProps<T> {
  searchTableCellResizable: boolean,
  schema: Array<SchemaProps<T>>,
  viewSchema?: any,
  onViewChange?: (viewSchema: any) => void,

  tableKey: string,
  headerRight?: React.ReactNode,
  bindKeys?: any,
  onReload?: () => void,
  bodyMinHeight?: number | string,
  bodyHeight?: number | string,

  pagination?: PaginationConfig | false,
  pageIndex?: number,
  pageSize?: number,
  pageSizeOptions?: string[],
  onPageChange?: (pageIndex: number, pageSize?: number) => void,
  totalCount?: number,
  emptyDescription?: string | React.ReactNode,
  headerProps?: object,
  hasExport?: boolean,
}

function SmartTable<T>(props: SmartTableProps<T>) {
  const {
    searchTableCellResizable,
    tableKey,
    title,
    schema,
    viewSchema,
    bindKeys,
    headerRight,
    onReload,
    childrenColumnName = defaultChildrenColumnName,
    // 选择
    rowSelection,
    className,
    bodyStyle,
    dataSource,
    bodyMinHeight = defaultBodyMinHeight,
    bodyHeight,
    rowKey = defaultRowKey,
    // 分页
    pagination,
    pageIndex = 1,
    pageSize = 50,
    onPageChange,
    totalCount = 0,
    pageSizeOptions,
    emptyDescription = tr('暂无数据'),
    headerProps = {},
    hasExport,
    onViewChange,
    ...restProps
  } = props;

  const {
    columns,
    columnKeys,
  } = useMemo(() => generColumns(schema), [schema]);

  const [configModalVisible, setConfigModalVisible] = useState(false);

  const [saveLoading, setSaveLoading] = useState(false)
  const [saveAsLoading, setSaveAsLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const [updateViewLoading, setUpdateViewLoading] = useState(false)

  const sysView = {
    viewId: 'sys',
    name: tr("初始视图"),
    version: '1.0',
    defaultView: true,
    panelConfig: {
      ...defaultActiveView,
      columnKeys,
    },
  }
  const [viewList, setViewList] = useState<ViewListProps>({
    systemViews: [sysView],
    customViews: [],
  });

  const [activeView, setActiveView] = useLocalStorage<ViewProps>(`tableKey:${tableKey}`, sysView);
  const [defaultView, setDefaultView] = useLocalStorage<DefaultView>(`tableKey:${tableKey}`, {} as DefaultView)
  const { panelConfig } = activeView;

  useEffect(() => {
    getCustomViewsApi(tableKey).then(ret => {
      if (ret && ret.bigData) {
        const customViews = JSON.parse(ret.bigData);
        setViewList({
          ...viewList,
          customViews,
        })

        let usedView;
        let defaultView;

        usedView = [sysView].find((sV: ViewProps) => {
          if (sV.defaultView) defaultView = sV;
          return sV.viewId === activeView.viewId && sV.version === activeView.version
        });
        if (!usedView) {
          usedView = customViews.find((cV: ViewProps) => {
            if (cV.defaultView) defaultView = cV;
            return cV.viewId === activeView.viewId && cV.version === activeView.version
          })
        }

        if (!usedView) usedView = defaultView;

        setActiveView(usedView);
        onViewChange && onViewChange(usedView.panelConfig)
      }
    })
  }, [])

  useEffect(() => {
    if (viewSchema) {
      setActiveView({
        ...activeView,
        panelConfig: {
          ...activeView.panelConfig,
          ...viewSchema
        }
      })
    }
  }, [viewSchema]);

  const handlerSaveViews = useCallback(
    ({ views, hideModal, type }) => {
      let saveLoadngFunc: Function | undefined
      switch (type) {
        case 'save':
          saveLoadngFunc = setSaveLoading
          break
        case 'saveAs':
          saveLoadngFunc = setSaveAsLoading
          break
        case 'setDefault':
          saveLoadngFunc = setUpdateViewLoading
          break
        case 'delete':
          saveLoadngFunc = setUpdateViewLoading
          break
        case 'rename':
          saveLoadngFunc = setRenameLoading
          break
      }
      saveLoadngFunc && saveLoadngFunc(true)
      return setCustomViewsApi(tableKey, views).then(
        () => {
          saveLoadngFunc && saveLoadngFunc(false)
          setViewList({
            ...viewList,
            customViews: views,
          })
          if (hideModal) {
            hideModal()
          }
        }
      )
    }
    , [viewList, tableKey])

  const handlerSaveConfig = useCallback((config) => {
    setActiveView({ ...config })
    let curViewIndex;
    curViewIndex = viewList.customViews.findIndex((cV: ViewProps) => cV.viewId === config.viewId);
    if (curViewIndex > -1) {
      viewList.customViews[curViewIndex] = config;
    }
    handlerSaveViews({ views: viewList.customViews })
    setConfigModalVisible(false)
  }, [viewList])

  // 另存视图
  const onViewSaveAs = useCallback((vals, hideModal) => {
    let newCustomViews = []
    const { name, isDefault, panelConfig } = vals;
    const newView: ViewProps = {
      viewId: guid(),
      name,
      defaultView: isDefault,
      version: moment().format(viewVersionFormat),
      panelConfig,
    }
    if (isDefault) {
      viewList.systemViews[0].defaultView = false;
    }
    newCustomViews = viewList.customViews.map(item => {
      return {
        ...item,
        defaultView: isDefault ? false : item.defaultView,
      }
    })
    newCustomViews.push(newView)
    viewList.customViews = newCustomViews;
    handlerSaveViews({ views: newCustomViews }).then(() => {
      setViewList(viewList)
      setActiveView(newView)
      hideModal()
      setConfigModalVisible(false)
    })
  }, [viewList])

  const isTreeTable = useMemo(() => dataSource && dataSource.some(data => data[childrenColumnName]), [dataSource, childrenColumnName])

  const [
    fakeRowSelection,
    finalColumns,
    fakePagination,
  ] = useTableConfig({
    tableConfig: panelConfig,
    rowSelection,
    columns,

    pagination,
    pageIndex,
    pageSize,
    onPageChange,
    totalCount,
    pageSizeOptions,
    tableKey,
  })

  const HeaderRight: ReactNode = (
    <>
      {headerRight}
      {
        hasExport && <ExportExcel
          schema={finalColumns}
          dataSource={dataSource}
        >
          <Button
            size="small"
            icon="export"
            className="marginh5"
          />
        </ExportExcel>
      }
      {onReload && (
        <Tooltip title={tr(`刷新`)}>
          <Button size="small" icon="reload" className="marginh5" onClick={() => onReload()} />
        </Tooltip>
      )}
    </>
  )
  const titleRef = useRef(null)

  const TableTitle = useMemo(() => (
    <ViewPicker
      viewName={activeView.name}
      viewId={activeView.viewId}
      customViews={viewList.customViews}
      systemViews={viewList.systemViews}
      switchActiveView={setActiveView}
      updateView={handlerSaveViews}
      renameLoading={renameLoading}
      loading={updateViewLoading}
      splitLine={false}
      defaultView={defaultView}
      onDefaultViewChange={setDefaultView}
      config={<Tooltip title={tr(`表格配置`)}>
        <Button size="small" icon="setting" className="marginh5" onClick={() => setConfigModalVisible(true)} />
      </Tooltip>}
      getPopupContainer={() => titleRef.current || document.body}
    />
  ), [activeView, viewList, renameLoading, updateViewLoading, defaultView, titleRef])

  const tableHeight = useMemo(() => isEmpty(dataSource) ? bodyHeight : (panelConfig.heightMode === 'auto' ? 'auto' : bodyHeight), [dataSource, panelConfig.heightMode, bodyHeight])

  return (
    <div className={wrapperStyles['view-picker-wrapper']}>
      {
        withFocusKeyEvent(<Table
          {...restProps}
          title={(
            <div ref={titleRef}>
              {title}
              {TableTitle}
            </div>
          )}
          hideVisibleMenu
          columns={finalColumns}
          headerRight={HeaderRight}
          dataSource={dataSource}
          resizeCell={searchTableCellResizable}
          bordered={panelConfig.bordered}
          wrap={panelConfig.wrap}
          isZebra={panelConfig.isZebra}
          tableKey={`tableKey:${tableKey}`}
  
          expandIcon={(_prop: any) => CustomExpandIcon(_prop, isTreeTable)}
          rowSelection={fakeRowSelection}
          childrenColumnName={childrenColumnName}
  
          footerDirection={panelConfig.footerDirection}
          className={classnames(styles.table, className)}
          bodyStyle={{
            ...bodyStyle,
            minHeight: panelConfig.heightMode === 'auto' || isEmpty(dataSource) ? undefined : bodyHeight,
          }}
          scroll={{ y: tableHeight === 'auto' ? undefined : tableHeight }}
          rowKey={rowKey}
          pagination={fakePagination}
          emptyDescription={emptyDescription}
          headerProps={headerProps}
        />, bindKeys)
      }
      <ConfigModal
        visible={configModalVisible}
        originColumns={columns}
        dataSource={activeView}
        tableKey={tableKey}
        views={viewList}
        onSaveViews={handlerSaveViews}
        onSaveAs={onViewSaveAs}
        onOk={handlerSaveConfig}
        onCancel={() => setConfigModalVisible(false)}
        onViewChange={onViewChange}
      />
    </div>
  )
}

export default connect(({ settings }: any) => ({
  searchTableCellResizable: settings.MAIN_CONFIG.searchTableCellResizable,
}))(SmartTable)
