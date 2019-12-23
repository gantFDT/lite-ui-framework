import React, { useCallback, useState, useMemo, useRef, useEffect } from 'react'
import { Modal, Form, Input, Button, Icon, message, Popover, Tooltip } from 'antd'
import moment from 'moment'
import _isEqual from 'lodash/isEqual'
import _ from 'lodash'
import { Pagination } from '@/components/list'
import { Filter as InFilter, View, PageInfo, LocalFilterProps, LocalFilter } from '../../../smartsearch/interface'
import Panel from './Panel'
import { getFiltersOfView, getValues, isEqualImpl, resolveValue } from './utils'
import { getOrderInfo } from '../../../smartsearch/utils'
import { SearchFormSchema } from '../../index'

interface FilterProps {
  isNormalSearch: boolean // 是否是普通查询(非SmartSearch查询)
  formRef: any
  params: any // 当前查询的值
  setParams: Function // 更改当前查询值
  onSearch: Function // 查询回调
  activeView: View // 当前视图
  customFilters: LocalFilterProps | any[]// 自定义筛选器
  onCustomFiltersChange: Function  // 改变自定义筛选器
  systemFilters: InFilter[] // 系统筛选器器
  pageInfo?: PageInfo,
  totalCount: number | undefined,
  hidePrintBtn?: boolean
  filterRef: any,
  isCustomSearch: boolean // 是否自动查询
  isCompatibilityMode?: boolean // 是否是兼容模式
  schema: SearchFormSchema
  defaultParams: any
}

const NAME_DATE_FORMAT = 'MM/DD HH:mm'
const LAST_FILTER_NAME = tr('上次查询')
const TEMP_FILTER_NAME = tr('临时查询')

export default function Filter(props: FilterProps) {
  const {
    isNormalSearch,
    formRef,
    params,
    setParams,
    onSearch,
    customFilters = [],
    onCustomFiltersChange,
    systemFilters = [],
    activeView,
    pageInfo,
    totalCount,
    hidePrintBtn,
    filterRef,
    isCustomSearch,
    isCompatibilityMode,
    schema,
    defaultParams
  } = props
  const currentFormRef = useRef(formRef)
  const [showModal, setShowModal] = useState<boolean>(false)
  const [filterName, setFilterName] = useState<string>(moment().format(NAME_DATE_FORMAT))
  const [currentFilter, setCurrentFilter] = useState<InFilter | LocalFilter>({} as InFilter)
  const pageInfoRef = useRef<PageInfo | undefined>(pageInfo)
  const paramsRef = useRef({})
  const activeViewRef = useRef(activeView)
  const onClickRef = useRef<any>(null)
  const isCustomSearchRef = useRef(isCustomSearch)
  const resetFormRef = useRef<any>(null)

  // 监听formRef的变化
  useMemo(() => {
    currentFormRef.current = formRef
  }, [formRef])

  // 监听isCustomSearch的变化
  useMemo(() => {
    isCustomSearchRef.current = isCustomSearch
  }, [isCustomSearch])

  // 当前页数
  const currentPage = useMemo(() => {
    if (!pageInfo || totalCount === undefined) return
    if (totalCount === 0) return 0
    let current = 1
    const { pageSize, beginIndex } = pageInfo
    if (beginIndex < pageSize) {
      return current
    }
    return Math.ceil((beginIndex + 1) / pageSize)
  }, [pageInfo, totalCount])

  // 当前视图对应的系统筛选器列表与用户筛选器列表
  const [activeViewSystemFilters, activeViewCustomFilters] = useMemo(() => {
    if (isNormalSearch) {
      return [[], customFilters]
    }
    // 系统
    let tempSystemFilters = getFiltersOfView(activeView, systemFilters)
    // 用户
    let tempCustomFilters = customFilters[activeView.viewId + '|' + activeView.version] || []
    return [tempSystemFilters, tempCustomFilters]
  }, [activeView, systemFilters, customFilters])


  const isResetAndMemoDisable = useMemo(() => {
    return Object.entries(params).every(([key, value]) => { return typeof value === 'undefined' || value === defaultParams[key] })
  }, [params, defaultParams])

  const addFilterImpl = useCallback((filter: LocalFilter) => {
    const isExistLast = activeViewCustomFilters.filter((item: any) => item.isLast).length > 0
    if (filter.isLast) {
      activeViewCustomFilters.splice(0, isExistLast ? 1 : 0, filter)
    } else if (isExistLast) {
      activeViewCustomFilters.splice(1, 0, filter)
    } else {
      activeViewCustomFilters.unshift(filter)
    }
    if (isNormalSearch) {
      onCustomFiltersChange && onCustomFiltersChange(activeViewCustomFilters)
    } else {
      const { viewId, version } = activeView
      onCustomFiltersChange && onCustomFiltersChange({
        ...customFilters,
        [viewId + '|' + version]: [...activeViewCustomFilters]
      })
    }
  }, [activeView, activeViewCustomFilters, customFilters])

  const addFilter = useCallback(() => {
    let tempFilterItems = resolveValue({
      params,
      schema,
      type: 'filter',
      isCompatibilityMode,
      isNormalSearch
    })
    let existSameName = activeViewCustomFilters.some((item: InFilter) => item.dataName === filterName)
    let existSameParams = activeViewCustomFilters.filter((item: LocalFilter) => _isEqual(item.filterItems, tempFilterItems) && !item.isLast).map((item: InFilter) => item.dataName)
    if (existSameName) {
      message.warning(tr('已存在相同名称的筛选器'))
      return
    }
    if (existSameParams.length > 0) {
      message.warning(tr(`已存在相同查询条件的筛选器:【${existSameParams}】`))
      return
    }
    let filter: LocalFilter = {
      dataName: filterName,
      filterItems: tempFilterItems,
      pageInfo
    }
    addFilterImpl(filter)
    setShowModal(false)
  }, [params, filterName, activeViewCustomFilters, pageInfo, addFilterImpl, isCompatibilityMode, isNormalSearch, schema])

  const removeFilter = useCallback((item: InFilter) => {
    const newFilters = activeViewCustomFilters.filter((filter: InFilter) => !_.isEqual(filter, item))
    if (isNormalSearch) {
      onCustomFiltersChange && onCustomFiltersChange(newFilters)
    } else {
      const { viewId, version } = activeView
      let resCustomFilters = {
        ...customFilters,
        [viewId + '|' + version]: [...newFilters]
      }
      if (newFilters.length == 0) {
        delete resCustomFilters[viewId + '|' + version]
      }
      onCustomFiltersChange && onCustomFiltersChange(resCustomFilters)
    }
  }, [customFilters, activeView, isNormalSearch])

  // 验证表单
  const validateFields = useCallback(async () => {
    const { validateFields } = currentFormRef.current
    if (!validateFields) {
      return true
    }
    let validateRes: any = await validateFields()
    if (_.isEmpty(validateRes.errors)) {
      return true
    } else {
      return false
    }
  }, [])


  // 查询具体实现
  const onSearchImpl = useCallback(({ params, pageInfo, isFilter = false, passRecordFilter = false }: any) => {
    paramsRef.current = params
    let searchParams: any = {}
    if (isNormalSearch) {
      searchParams = resolveValue({
        params,
        schema,
        type: 'search',
        isCompatibilityMode,
        isNormalSearch
      })
    } else {
      let extraProps: any = {}
      if (!isCompatibilityMode) {
        extraProps.orderList = getOrderInfo(activeView.panelConfig.orderFields.map(item => ({ fieldName: item.fieldName, orderType: item.orderType })), isCompatibilityMode)
      }
      searchParams = {
        [isCompatibilityMode ? 'filterInfo' : 'whereList']: resolveValue({
          params,
          schema,
          type: 'search',
          isNormalSearch,
          isCompatibilityMode
        }),
        ...extraProps,
        pageInfo
      }
    }

    // 执行查询
    let filterItems = isNormalSearch ? searchParams : resolveValue({
      params,
      schema,
      type: 'filter',
      isNormalSearch,
      isCompatibilityMode
    })
    onSearch && onSearch(searchParams, false, filterItems)

    // 是否跳过记录筛选器
    if (passRecordFilter) return

    // 记录本次查询为上次查询
    let tempFilter: LocalFilter = {
      dataName: LAST_FILTER_NAME,
      filterItems: filterItems,
      pageInfo,
      isLast: true
    }
    // 比较这次查询是否是某个筛选器
    if (!isFilter) {
      let matchingFilters: any[] = [...activeViewCustomFilters, ...activeViewSystemFilters].filter((item: LocalFilter | InFilter) => _.isEqual(item.filterItems, filterItems) && _.isEqual(item.pageInfo, pageInfo))
      if (matchingFilters.length > 0) {
        const [first, second] = matchingFilters
        let tempFilter: any = first
        if (first.isLast && second) {
          tempFilter = second
        }
        setCurrentFilter(tempFilter)
      } else {
        setCurrentFilter({ dataName: TEMP_FILTER_NAME } as LocalFilter)
      }
    }
    addFilterImpl(tempFilter)
  }, [onSearch, addFilterImpl, activeView, activeViewCustomFilters, activeViewSystemFilters, isNormalSearch, isCompatibilityMode, schema])

  // 重置表单与当前筛选器
  const resetForm = useCallback(async (isSearch = false) => {
    const { resetFields } = currentFormRef.current
    if (!resetFields) {
      return
    }
    resetFields && resetFields()
    let params: any = {}
    if (!isNormalSearch) {
      const { panelConfig: { searchFields = [] } } = activeView
      let tempFilterItems = searchFields.map(item => {
        const { fieldName, operator } = item
        return {
          fieldName,
          operator: operator,
          value: undefined
        }
      })
      params = getValues(tempFilterItems, schema, isCompatibilityMode)
      activeViewRef.current = activeView
    }
    params = { ...params, ...defaultParams }
    setCurrentFilter({} as LocalFilter)
    setParams(params)
    if (isSearch && await validateFields()) {
      onSearchImpl({
        params,
        pageInfo,
        passRecordFilter: true
      })
    }
  }, [activeView, schema, onSearch, isCompatibilityMode, defaultParams, onSearchImpl, pageInfo])

  useMemo(() => {
    resetFormRef.current = resetForm
  }, [resetForm])

  // 查询按钮点击
  const onSearchClick = useCallback(async (page?: number | boolean, pageSize?: number) => {
    if (await validateFields()) {
      let newPageInfo = typeof page === 'boolean' ? pageInfo : { ...pageInfo, beginIndex: 0 }
      if (typeof page !== undefined && pageSize !== undefined) {
        newPageInfo = {
          pageSize,
          beginIndex: (page - 1) * pageSize
        }
        pageInfoRef.current = newPageInfo
      }
      onSearchImpl({
        params,
        pageInfo: newPageInfo
      })
    }
  }, [params, pageInfo, onSearchImpl])

  // 切换筛选器
  const onSwitchFilter = useCallback((filter: InFilter | LocalFilter) => {
    const { resetFields, setFieldsValue } = currentFormRef.current
    const newParams = getValues(filter.filterItems, schema, isCompatibilityMode)
    const newPageInfo = filter.pageInfo || pageInfoRef.current ? { ...(filter.pageInfo || pageInfoRef.current), beginIndex: 0 } : undefined
    setCurrentFilter(filter)
    pageInfoRef.current = newPageInfo
    onSearchImpl({
      params: newParams,
      pageInfo: newPageInfo,
      isFilter: true
    })
    // 重置
    resetFields && resetFields()
    // 给form设值
    setFieldsValue && setFieldsValue(newParams)
  }, [onSearchImpl, schema, isCompatibilityMode])

  useMemo(() => {
    onClickRef.current = onSearchClick
  }, [onSearchClick])

  // 监听视图改变
  useMemo(() => {
    const resetForm = resetFormRef.current
    resetForm()
  }, [schema])

  // 监听分页改变
  useMemo(() => {
    const { current: onSearchClick } = onClickRef
    if (!pageInfo || _.isEqual(pageInfo, pageInfoRef.current)) {
      return
    }
    // 标识这是外部改变了分页，无需将beginIndex设置为0
    onSearchClick(true)
    pageInfoRef.current = pageInfo
  }, [pageInfo])

  // 监听查询条件改变
  useMemo(() => {
    const { current: onSearchClick } = onClickRef
    if (isEqualImpl(params, paramsRef.current)) {
      return
    }
    if (isCustomSearchRef.current) {
      onSearchClick()
    }
  }, [params])

  const modalStatusChange = useCallback(() => {
    if (!showModal) {
      setFilterName(moment().format(NAME_DATE_FORMAT))
    }
    setShowModal(!showModal)
  }, [showModal])

  const FILTERS = useMemo(() => {

    return (
      <div style={{ margin: '-10px' }}>
        {!isNormalSearch && activeViewSystemFilters.length > 0 && (
          <Panel
            title={tr('系统筛选器')}
            filters={activeViewSystemFilters}
            filterType='system'
            switchActiveFilter={onSwitchFilter}
          />
        )}
        <Panel
          title={isNormalSearch ? tr('筛选器') : tr('我的筛选器')}
          filters={activeViewCustomFilters}
          filterType='custom'
          switchActiveFilter={onSwitchFilter}
          removeFilter={removeFilter}
          extra={(<Tooltip title={tr('添加')}>
            <Button size="small" disabled={isResetAndMemoDisable} icon="plus" onClick={modalStatusChange} />
          </Tooltip>)}
        />
      </div>
    )
  }, [activeView, activeViewSystemFilters, activeViewCustomFilters, removeFilter, onSwitchFilter, isResetAndMemoDisable, modalStatusChange])

  //开发环境是否显示打印按钮
  const showPrintBtnInDev = useMemo(() => {
    return process.env.NODE_ENV === 'development' && !hidePrintBtn
  }, [hidePrintBtn])

  useEffect(() => {
    if (filterRef) {
      filterRef.current = {
        reset: () => resetForm(true),
        search: onSearchClick
      }
    }
  }, [resetForm, onSearchClick])

  return (
    <>
      <Modal
        title={tr('添加筛选器')}
        visible={showModal}
        onOk={addFilter}
        onCancel={modalStatusChange}
        okButtonProps={{ size: 'small' }}
        cancelButtonProps={{ size: 'small' }}
        centered
        zIndex={1006}
      >
        <Form layout='horizontal'>
          <Form.Item label={tr('名称')}>
            <Input value={filterName} onChange={(e) => setFilterName(e.target.value)} />
          </Form.Item>
        </Form>
      </Modal>
      <Tooltip title={tr('查询')}>
        <Button size="small" icon="search" onClick={onSearchClick} />
      </Tooltip>
      <Popover content={FILTERS} placement='bottomRight'>
        <Button size="small"  >{tr(currentFilter.dataName || '筛选器')} <Icon type="down" /></Button>
      </Popover>
      <Tooltip title={tr('重置')}>
        <Button size="small" disabled={isResetAndMemoDisable} icon="undo" onClick={resetForm} />
      </Tooltip>
      {totalCount !== undefined && (
        <Pagination
          simple
          pageSize={pageInfo.pageSize}
          current={currentPage}
          total={totalCount}
          onChange={onSearchClick}
        />
      )}
      {/* {!isNormalSearch && showPrintBtnInDev && < Tooltip placement="topRight" title={tr('在控制台中打印当前视图的JSON数据信息,只会在开发环境显示此按钮')}>
        <Button size="small" icon='printer' onClick={() => {
          console.log('====================================');
          console.log(activeView)
          console.log(JSON.stringify(activeView))
          console.log('====================================');
          message.success(tr('F12打开开发者工具进行查看'))
        }}>
        </Button>
      </Tooltip>} */}
    </>
  )
}
