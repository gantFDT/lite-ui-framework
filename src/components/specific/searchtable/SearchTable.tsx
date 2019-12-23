import React, { useState, useMemo, useEffect, useCallback, ReactNode } from 'react'
import { TableProps, ExpandIconProps, ColumnProps } from 'antd/lib/table'
import { PaginationConfig } from 'antd/lib/pagination'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form'
import { Tooltip, Button, Icon, Popconfirm, Empty } from 'antd'
import { connect } from 'dva'
import { isEmpty } from 'lodash';
import { Table } from 'gantd'
import FormModal from './FormModal'
import SearchForm from './SearchForm'
import { generFields } from './fieldgenerator'
import { getType } from '@/utils/utils';
import styles from './style.less'
import classnames from 'classnames'
import { usePagination, useRowSelection } from './hooks'

function CustomExpandIcon(props: ExpandIconProps<object>, isTree?: boolean) {
  if (!isTree) {
    return null;
  }
  let type, prefix;
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
    <span onClick={e => props.onExpand(props.record, e)} style={{ paddingLeft: prefix ? 0 : 17 }}>
      {
        prefix && <span className={"ant-table-row-expand-icon ant-table-row-" + prefix}></span>
      }
      <Icon
        className="marginh5"
        type={type}
        theme="filled"
      />
    </span>
  );
}


const defaultCreateText: string = tr('新增');
const defaultUpdateText: string = tr('编辑');
const defaultRemoveText: string = tr('删除');
const searchFormTitleSuffix: string = tr('过滤条件');
const confirmRemoveText: string = tr('确定移除') + '？';
const okText: string = tr('确定');
const cancelText: string = tr('取消');

const defaultRowKey: string = 'id';
const defaultBodyMinHeight: number = 600;


export interface SearchTableScheme extends ColumnProps<any> {
  key: string,
  name: string,
  type?: 'DatePicker' | 'Input' | 'CodeList' | 'UserSelector' | 'TextArea' | 'GroupSelector' | 'SelectorServerName',
  props?: { [propName: string]: any },
  search?: boolean,
  column?: boolean,
  create?: boolean,
  edit?: boolean,
  searchBlockName?: string,
  options?: GetFieldDecoratorOptions,
  render?: (text?: any, record?: any, index?: number) => React.ReactNode;
}

export interface SearchTableProps extends TableProps<any> {
  scheme: Array<SearchTableScheme>,
  tableKey?: string,
  filterKey?: string,
  filterTtrigger?: 'auto' | 'manual',
  filterDisplay?: 'tile' | 'drawer',
  onFilter?: (values: any) => void,
  onReload?: (values: any) => void,
  headerRight?: React.ReactNode,
  onCreate?: (values: any) => void,
  onClickCreate?: () => void,
  formModalTitle?: string | ReactNode,
  formModalVisible?: boolean,
  formModalType?: 'create' | 'update',
  formDataSource?: any,
  onFormValueChange?: (changedValues: any, allValues: any) => void,
  createLoading?: boolean,
  udpateLoading?: boolean,
  hideCreateButton?: boolean,
  hideUpdateButton?: boolean,
  createButtonText?: string,
  updateButtonText?: string,
  removeButtonText?: string,
  onCloseFormModal?: () => void,
  onClickUpdate?: (keys?: any, rows?: any) => void,
  onUpdate?: (values: any, keys?: any, rows?: any) => void,
  onSelect?: (keys: any, rows: any) => void,
  onRemove?: (keys: any, rows: any, callback?: () => void) => void,
  pagination?: PaginationConfig | false;
  pageIndex?: number;
  pageSize?: number;
  pageSizeOptions?: string[];
  onPageChange?: (pageIndex: number, pageSize?: number) => void;
  totalCount?: number;
  selectMode?: 'single' | 'multi';
  [_propName: string]: any
}

const SearchTable = (props: SearchTableProps) => {
  const {
    searchTableFilterDisplay,
    searchTableCellResizable,
    tableKey,
    filterKey,
    title,
    scheme,
    filterTrigger,
    filterDisplay,
    onFilter,
    onReload,
    onFormValueChange,
    headerRight,
    // 创建
    onClickCreate,
    formModalTitle,
    formModalVisible,
    formModalType = 'create',
    onCloseFormModal,
    onCreate,
    createLoading,
    udpateLoading,
    hideCreateButton,
    hideUpdateButton,
    // 编辑
    formDataSource,
    onClickUpdate,
    onUpdate,
    // 删除
    onRemove,
    removeWithoutPopconfirm,
    // 选择
    onSelect,
    selectMode = 'single',
    childrenColumnName,
    rowSelection,
    // 按钮文案
    createButtonText = defaultCreateText,
    updateButtonText = defaultUpdateText,
    removeButtonText = defaultRemoveText,
    createConfirmButtonText = okText,
    updateConfirmButtonText = okText,

    className,
    bodyStyle,
    dataSource,
    bodyMinHeight = defaultBodyMinHeight,
    bodyHeight,
    rowKey = defaultRowKey,
    scroll = { x: '100%' },
    // 分页
    pagination,
    pageIndex = 1,
    pageSize = 50,
    onPageChange,
    totalCount = 0,
    pageSizeOptions,
    ...restProps
  } = props;

  const {
    fieldsMap,
    columns,
    filterFields,
    createFields,
    updateFields
  } = useMemo(() => generFields(scheme), [scheme]);

  const Searcher = useMemo(() => {
    if (onFilter) {
      let fakeTitle = getType(title) === 'String' ?
        `${title}${searchFormTitleSuffix}` : <>{title}<span>{searchFormTitleSuffix}</span></>
      return <SearchForm
        title={fakeTitle}
        fields={filterFields}
        fieldsMap={fieldsMap}
        filterTrigger={filterTrigger}
        filterDisplay={filterDisplay}
        onFilter={onFilter}
        onReload={onReload}
        filterKey={filterKey}
      />
    }
    return null;
  }, [title, filterTrigger, filterDisplay, onFilter, onReload, filterFields, filterKey])

  const isTreeTable = useMemo(() => dataSource && dataSource.some(data => data[childrenColumnName || 'children']), [dataSource, childrenColumnName])

  const [modalType, setModalType] = useState(formModalType)
  const handlerClickCreate = useCallback(() => {
    setModalType('create')
    onClickCreate && onClickCreate()
  }, [onClickCreate])
  const handlerCloseModal = useCallback(() => {
    onCloseFormModal && onCloseFormModal()
  }, [onCloseFormModal])
  useEffect(() => setModalType(formModalType), [formModalType])

  // 选择功能
  const [selectedRowKeys, selectedRows, setSelectedRowKeys, fakeRowSelection] = useRowSelection({
    rowSelection,
    onSelect,
    onUpdate,
    onRemove,
    dataSource,
    rowKey,
    selectMode,
    childrenColumnName,
  })

  const formDetail = useMemo(() => formDataSource || (modalType === 'update' ? selectedRows[0] : {}), [formDataSource, selectedRows, modalType])

  const confirmRemove = useCallback(() => setSelectedRowKeys([]), [])
  const handlerClickRemove = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    onRemove && onRemove(selectedRowKeys, selectedRows, confirmRemove)
  }, [selectedRowKeys, selectedRows, onRemove])

  const handlerClickUpdate = useCallback((e?: any) => {
    if (e) {
      e.stopPropagation();
      e.nativeEvent.stopImmediatePropagation();
    }
    setModalType('update')
    onClickUpdate && onClickUpdate(selectedRowKeys, selectedRows)
  }, [selectedRowKeys, selectedRows, onClickUpdate])

  const handlerCreate = useCallback((params) => {
    onCreate && onCreate(params)
  }, [onCreate])

  const handlerUpdate = useCallback((params) => {
    onUpdate && onUpdate(params, selectedRowKeys, selectedRows)
  }, [selectedRowKeys, selectedRows, onUpdate])

  const finalColumns = useMemo(() => {
    let [fakeColumn] = columns;
    if (selectedRowKeys.length !== 1 || (fakeColumn.render && fakeColumn.render.name !== 'actionIconRender')) return columns;
    const actionIconRender = (text: any) => (
      <div className="dynamic_action_button_wrap">
        <div className="dynamic_action_text">{text}</div>
        {onClickUpdate && <Icon type="edit" className="dynamic_action_icon" onClick={handlerClickUpdate} />}
        {onRemove && (removeWithoutPopconfirm ? (
          <Icon type="delete" className="dynamic_action_icon" onClick={handlerClickRemove} />
        ) : (
            <Popconfirm title={confirmRemoveText} okText={okText} cancelText={cancelText} onConfirm={handlerClickRemove}>
              <Icon type="delete" className="dynamic_action_icon" />
            </Popconfirm>
          ))}
      </div>
    )
    if (onClickUpdate || onRemove) {
      fakeColumn.render = actionIconRender;
    }
    return columns;
  }, [columns, selectedRowKeys, onClickUpdate, onRemove])

  // 分页
  const fakePagination = usePagination({
    pagination,
    pageIndex,
    pageSize,
    onPageChange,
    totalCount,
    pageSizeOptions,
    tableKey
  });

  const HeaderRight: ReactNode = (
    (onFilter || (!hideCreateButton && onCreate) || (!hideUpdateButton && onUpdate) || onRemove || headerRight) &&
    <>
      {headerRight}
      {(onFilter && filterDisplay !== 'tile') && Searcher}
      {!hideCreateButton && onCreate && (
        <Tooltip title={createButtonText}>
          <Button size="small" icon="plus" className="marginh5" onClick={() => handlerClickCreate()}></Button>
        </Tooltip>
      )}
      {!hideUpdateButton && onUpdate && (
        <Tooltip title={updateButtonText}>
          <Button size="small" disabled={selectedRowKeys.length != 1} icon="edit" className="marginh5" onClick={() => handlerClickUpdate()}></Button>
        </Tooltip>
      )}
      {onRemove && (
        removeWithoutPopconfirm ? (
          <Tooltip title={removeButtonText}>
            <Button size="small" disabled={isEmpty(selectedRowKeys)} type="danger" icon="delete" className="marginh5" onClick={handlerClickRemove}></Button>
          </Tooltip>
        ) : (
            <Tooltip title={removeButtonText}>
              <Popconfirm title={confirmRemoveText} okText={okText} cancelText={cancelText} onConfirm={handlerClickRemove}>
                <Button size="small" disabled={isEmpty(selectedRowKeys)} type="danger" icon="delete" className="marginh5"></Button>
              </Popconfirm>
            </Tooltip>
          )
      )}
    </>
  )

  return (
    <div className={styles.searchTable}>
      {
        !!onFilter && filterDisplay === 'tile' && Searcher
      }
      <Table
        title={title}
        columns={finalColumns}
        headerRight={HeaderRight}
        dataSource={dataSource}
        resizeCell={searchTableCellResizable}

        expandIcon={(_prop: any) => CustomExpandIcon(_prop, isTreeTable)}
        rowSelection={fakeRowSelection}
        childrenColumnName={childrenColumnName}

        className={classnames(styles.table, className)}
        bodyStyle={{
          ...bodyStyle,
          height: !isEmpty(dataSource) && bodyHeight,
          minHeight: !isEmpty(dataSource) && !bodyHeight && bodyMinHeight
        }}
        rowKey={rowKey}
        scroll={scroll}
        pagination={fakePagination}
        {...restProps}
      />
      <FormModal
        values={formDetail}
        title={formModalTitle || (modalType === 'create' ? createButtonText : updateButtonText)}
        visible={formModalVisible}
        fields={modalType === 'create' ? createFields : updateFields}
        fieldsMap={fieldsMap}
        formType={modalType}
        onFormValueChange={onFormValueChange}
        okText={modalType === 'create' ? createConfirmButtonText : updateConfirmButtonText}
        cancelText={cancelText}
        onSubmit={modalType === 'create' ? handlerCreate : handlerUpdate}
        onCancel={handlerCloseModal}
        confirmLoading={modalType === 'create' ? createLoading : udpateLoading}
      />
    </div>
  )
}

export default connect(({ settings }: any) => ({
  searchTableFilterDisplay: settings.MAIN_CONFIG.searchTableFilterDisplay,
  searchTableCellResizable: settings.MAIN_CONFIG.searchTableCellResizable,
}))(SearchTable)
