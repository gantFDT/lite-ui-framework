import React, { ReactNode, useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Config, Switch } from './subcomponents'
import { ViewPicker } from '@/components/specific'
import { DefaultView } from '@/components/specific/viewpicker'
import { getActiveDefaultView } from '@/components/specific/viewpicker/utils'
import _ from 'lodash'
import moment from 'moment'
import { Input } from 'antd'
import classnames from 'classnames'
import { Pagination } from '@/components/list'
import { generateUuid } from '@/utils/utils'
import { useLocalStorage, getNormalInitSearchParams, getOrderInfo, getSchema, isViewInViews, getDefaultParams } from './utils'
import styles from './index.less'
import { BaseSupportFilterField, SupportFilterField, SupportOrderField, View, CompatibilityModeView, Filter as FilterProps, CompatibilityModeFilter, PageInfo, SearchData, UiConfigProps, LocalFilterProps, FilterData, CustomComponent, FilterItem } from './interface'
import { getViewsApi, updateViewsApi } from './service'
import { UISchema } from 'schema-form-g'
import SearchForm from '../searchform'
import { getValues, resolveValue } from '../searchform/subcomponents/filter/utils'

export interface SmartSearchSchema {
  supportFilterFields: SupportFilterField[] // 支持查询字段
  supportOrderFields: SupportOrderField[] // 支持排序字段
  systemViews: View[] // 系统视图
  systemFilters?: FilterProps[] // 系统筛选器
}

export interface SmartSearchCompatibilityModeSchema {
  supportFilterFields: BaseSupportFilterField[] // 支持查询字段
  systemViews: CompatibilityModeView[] // 系统视图
  systemFilters?: CompatibilityModeFilter[] // 系统筛选器
}

export interface SmartSearchProps {
  searchPanelId: string // 高级查询器唯一标识id
  userId: string // 用户id
  title: string | ReactNode // 标题
  mode?: 'simple' | 'advanced' | 'advancedOnly' // 模式
  schema: SmartSearchSchema | SmartSearchCompatibilityModeSchema // 字段配置
  pageInfo?: PageInfo // 分页信息
  totalCount?: number // 数据总条数
  hidePrintBtn?: boolean,//是否显示视图打印按钮(在dev环境下)
  placeholder?: string // 简易查询的placeholder
  onSimpleSearch?: (params: any, isInit?: boolean) => void // 简易查询回调
  onSearch: (params: SearchData | FilterData, isInit: boolean, filterParams: FilterItem[]) => void // 点击查询的回调
  configModalSize?: { width: number, height: number } // 配置弹框的大小
  onSizeChange?: (params: { width: number, height: number }) => void
  ref?: any
  extra?: ReactNode // 自定义操作
  isCompatibilityMode?: boolean // 是否是兼容模式
  customComponents?: CustomComponent[] // 自定义组件列表
  uiSchema?: UISchema // 自定义uiSchema配置
  headerProps?: any  // BlockHeader组件自定义配置
  showBottomLine?: boolean // 是否显示底部border
  showSplitLine?: boolean // 是否显示分割线
  onViewChange?: (view: View | CompatibilityModeView) => void // 视图切换的回调
  initView?: View | CompatibilityModeView // 自定义初始视图
  initParams?: FilterItem[] // 初始查询参数
  onValueChange?: (value: FilterItem[], filterValue: any) => void // 输入值改变的回调
}

interface SaveViewProps {
  views: View[] // 视图列表
  type: 'save' | 'saveAs' | 'setDefault' | 'rename' | 'delete'
  hideModal: Function // 隐藏弹窗的回调
  clearFilterView?: View // 需要清除筛选器
  operateView?: View // 当前操作的视图
  defaultView?: DefaultView // 默认视图
}

// 存入localstorage的前缀
export const STORAGE_PREFIX = 'smart_search_'
const STORAGE_PREFIX_FILTER = STORAGE_PREFIX + 'filter:'
const DEFAULT_VIEW_PREFIX_FILTER = STORAGE_PREFIX + 'defaultView:'
const VIEW_VERSION_FORMAT = 'YYYY-MM-DD HH:mm:SSSS'

const INIT_UI_CONFIG: UiConfigProps = {
  searchType: 'click'
}

const INIT_CUSTOM_COMPONENTS: CustomComponent[] = []

const INIT_ANY_OBJECT: any = {}
const INIT_ANY_ARRAY: any[] = []

export default React.forwardRef((props: SmartSearchProps, ref: any) => {
  const {
    searchPanelId = '',
    userId = '',
    title,
    onSearch,
    configModalSize = { width: 520, height: 520 },
    onSizeChange,
    schema,
    pageInfo,
    totalCount,
    hidePrintBtn = false,
    mode = 'simple',
    placeholder = tr('请输入查询内容'),
    onSimpleSearch,
    extra,
    isCompatibilityMode = false,
    customComponents = INIT_CUSTOM_COMPONENTS,
    uiSchema = INIT_ANY_OBJECT,
    headerProps,
    showBottomLine = true,
    showSplitLine = true,
    onViewChange,
    initView,
    initParams = INIT_ANY_ARRAY,
    onValueChange
  } = props
  const [filters, setFilters] = useLocalStorage<LocalFilterProps>(STORAGE_PREFIX_FILTER + searchPanelId + userId, {} as LocalFilterProps)
  const [defaultView, setDefaultView] = useLocalStorage<DefaultView>(DEFAULT_VIEW_PREFIX_FILTER + searchPanelId + userId, {} as DefaultView)
  const [customViews, setCustomViews] = useState([] as View[])
  const [companyViews, setCompanyViews] = useState([] as View[])
  const formatedSchema: SmartSearchSchema | SmartSearchCompatibilityModeSchema = useMemo(() => {
    return schema
  }, [schema])
  const { supportFilterFields, supportOrderFields = [], systemViews = [], systemFilters = [] } = formatedSchema as (SmartSearchSchema | SmartSearchCompatibilityModeSchema)
  const [activeView, setActiveView] = useState<View>(!_.isEmpty(initView) ? initView : (systemViews.length > 0 ? { ...systemViews[0], isSystem: true } : ({} as View)))
  const [saveLoading, setSaveLoading] = useState(false)
  const [saveAsLoading, setSaveAsLoading] = useState(false)
  const [renameLoading, setRenameLoading] = useState(false)
  const [updateViewLoading, setUpdateViewLoading] = useState(false)
  const { panelConfig: { searchFields, uiConfig = INIT_UI_CONFIG } } = activeView
  const [activeMode, setActiveMode] = useState(isCompatibilityMode || mode === 'advancedOnly' ? 'advanced' : mode)
  const activeModeRef = useRef(isCompatibilityMode || mode === 'advancedOnly' ? 'advanced' : mode)
  const [searchKeyword, setSearchKeyword] = useState('')
  const simpleSearchRef = useRef({} as any)
  const pageInfoRef = useRef(pageInfo)
  const [isSimpleInputFocus, setIsSimpleInputFocus] = useState(false)
  const [currentSystemViews, setCurrentSystemViews] = useState(systemViews)

  // searchForm schema 与 默认参数
  const [searchFormSchema, defaultParams] = useMemo(() => {
    const formSchema = getSchema(supportFilterFields, searchFields)
    const defaultParams = getDefaultParams(formSchema)
    return [formSchema, defaultParams]
  }, [supportFilterFields, searchFields])
  const [currentInitParams, setCurrentInitParams] = useState(() => {
    return _.isEmpty(initParams) ? {} : getValues(initParams, searchFormSchema, isCompatibilityMode)
  })

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

  // 改变当前视图
  const changeActiveView = useCallback((view: View, isInit = false) => {
    const { panelConfig: { uiConfig } } = view
    if (!uiConfig) {
      view.panelConfig.uiConfig = INIT_UI_CONFIG
    } else {
      view.panelConfig.uiConfig = {
        ...INIT_UI_CONFIG,
        ...uiConfig
      }
    }
    setActiveView(view)
    onViewChange && onViewChange(view)
    if (!isInit) {
      setCurrentInitParams({})
    }
  }, [onViewChange])



  // 获取自定义和企业视图列表
  const getCustomAndCompanyViews = useCallback(async () => {
    // if (activeMode === 'simple') {
    //   onSimpleSearch && onSimpleSearch({
    //     keyword: undefined,
    //     pageInfo
    //   })
    // }
    let localDataString = localStorage.getItem(DEFAULT_VIEW_PREFIX_FILTER + searchPanelId + userId)
    let defaultView: DefaultView = localDataString ? JSON.parse(localDataString) : {}
    // 自定义
    let tempCustomViews = await getViewsApi({
      dataId: searchPanelId,
      dataType: 'CustomView'
    })
    // 企业
    // let tempCompanyViews = await getViewsApi({
    //   dataId: searchPanelId,
    //   dataType: 'CompanyView'
    // })
    let tempCompanyViews: any[] = []
    let tempSystemViews: any[] = [...currentSystemViews]
    let initParams_

    let activeDefaultView = undefined
    if (!_.isEmpty(initView)) {
      // 判断传入的初始视图是否某个系统视图
      activeDefaultView = isViewInViews(tempSystemViews, initView, 'system')
      // 判断传入的初始视图是否某个自定义视图
      if (!activeDefaultView) {
        activeDefaultView = isViewInViews(tempCustomViews, initView, 'custom')
      }
      // 如果初始视图不在自定义视图中，则将其加入到系统视图中
      if (!activeDefaultView) {
        let tempView = {
          ...initView,
          isSystem: true
        }
        tempSystemViews.push(tempView)
        activeDefaultView = tempView
      }
      initParams_ = getValues(initParams, searchFormSchema, isCompatibilityMode)
      setCurrentInitParams(initParams_)
    }

    if (!activeDefaultView) {
      activeDefaultView = getActiveDefaultView({
        systemViews: tempSystemViews,
        companyViews: tempCompanyViews,
        customViews: tempCustomViews,
        defaultView
      })
    }

    changeActiveView(activeDefaultView, true)
    setCustomViews(tempCustomViews)
    setCompanyViews(tempCompanyViews)
    setCurrentSystemViews(tempSystemViews)
    let extraProps: any = {}

    // 不是兼容模式添加排序字段
    if (!isCompatibilityMode) {
      extraProps.orderList = getOrderInfo(activeDefaultView.panelConfig.orderFields, isCompatibilityMode)
    }
    // 初始视图与初始查询参数都不为空
    if (!_.isEmpty(initView) && !_.isEmpty(initParams_)) {
      extraProps[isCompatibilityMode ? 'filterInfo' : 'whereList'] = resolveValue({
        params: initParams_,
        schema: searchFormSchema,
        type: 'search',
        isNormalSearch: false,
        isCompatibilityMode
      })
    } else {
      let resParams = getNormalInitSearchParams(activeDefaultView.panelConfig.searchFields, isCompatibilityMode)
      if (!_.isEmpty(defaultParams)) {
        let defaultParams_ = resolveValue({
          params: getValues(defaultParams, searchFormSchema, isCompatibilityMode),
          schema: searchFormSchema,
          type: 'search',
          isNormalSearch: false,
          isCompatibilityMode
        })
        resParams = { ...resParams, ...defaultParams_ }
      }
      extraProps[isCompatibilityMode ? 'filterInfo' : 'whereList'] = resParams
    }
    // 初始查询
    onSearch && onSearch({ ...extraProps, pageInfo }, true, initParams)
  }, [searchPanelId, systemViews, defaultView, activeMode])

  useEffect(() => {
    getCustomAndCompanyViews()
  }, [])

  // 调接口更新视图
  const viewSaveImpl = useCallback(async (props: SaveViewProps) => {
    const { type, views, hideModal, clearFilterView, operateView, defaultView } = props
    let tempClearFilterView = clearFilterView
    let saveLoadngFunc: Function | undefined
    switch (type) {
      case 'save':
        saveLoadngFunc = setSaveLoading
        break
      case 'saveAs':
        saveLoadngFunc = setSaveAsLoading
        break
      case 'delete':
        saveLoadngFunc = setUpdateViewLoading
        tempClearFilterView = operateView
        break
      case 'rename':
        saveLoadngFunc = setRenameLoading
        break
    }
    saveLoadngFunc && saveLoadngFunc(true)
    try {
      await updateViewsApi({
        dataId: searchPanelId,
        dataType: 'CustomView',
        views
      })
      setCustomViews(views)
      // 清除相关联筛选器
      if (tempClearFilterView) {
        const { viewId, version } = tempClearFilterView
        let newFilters = { ...filters }
        delete newFilters[viewId + '|' + version]
        setFilters(newFilters)
      }
      // 当前视图
      if (operateView && operateView.viewId === activeView.viewId) {
        setActiveView(operateView)
      }
      hideModal && hideModal()
      // 默认视图
      if (defaultView) {
        setDefaultView(defaultView)
        setActiveView(views.filter(item => item.viewId === defaultView.viewId)[0])
      }
    } catch (error) {

    } finally {
      saveLoadngFunc && saveLoadngFunc(false)
    }
  }, [activeView, systemViews, filters])

  // 某个视图更新
  const onViewSave = useCallback((view: View, hideModal: Function) => {
    let isNeedClearFilter = false
    let operateView
    let newCustomViews = customViews.map(item => {
      const { viewId } = item
      let tempView = item
      if (viewId === view.viewId && !_.isEqual(view, item)) {
        tempView = view
        if (!_.isEqual(view.panelConfig.searchFields, item.panelConfig.searchFields)) {
          tempView.version = moment().format(VIEW_VERSION_FORMAT)
          isNeedClearFilter = true
        }
        if (_.isEqual(view.viewId, activeView.viewId)) {
          operateView = tempView
        }
      }
      return {
        ...tempView
      }
    })
    if (_.isEqual(newCustomViews, customViews)) {
      hideModal && hideModal()
    } else {
      viewSaveImpl({
        views: newCustomViews,
        type: 'save',
        hideModal,
        clearFilterView: isNeedClearFilter ? view : undefined,
        operateView
      })
    }
  }, [customViews, activeView])

  // 另存视图
  const onViewSaveAs = useCallback((data, hideModal: Function) => {
    let newCustomViews: View[] = []
    const { values: { name, isDefault }, searchFields, orderFields, uiConfig = INIT_UI_CONFIG } = data
    let newView: View = {
      viewId: generateUuid(32, 16),
      name,
      version: moment().format(VIEW_VERSION_FORMAT),
      panelConfig: {
        searchFields,
        orderFields,
        uiConfig
      }
    }
    newCustomViews = customViews.map(item => {
      return {
        ...item
      }
    })
    newCustomViews.push(newView)
    viewSaveImpl({
      views: newCustomViews,
      type: 'saveAs',
      hideModal,
      operateView: newView,
      defaultView: isDefault ? {
        type: 'custom',
        viewId: newView.viewId
      } : undefined
    })
  }, [customViews])

  const activeModeUpdate = useCallback(() => {
    setActiveMode(activeMode === 'simple' ? 'advanced' : 'simple')
    activeModeRef.current = activeMode === 'simple' ? 'advanced' : 'simple'
  }, [activeMode])

  const simpleSearch = useCallback((page?: number | boolean, pageSize?: number) => {
    let newPageInfo = typeof page === 'boolean' ? pageInfo : { ...pageInfo, beginIndex: 0 }
    if (typeof page === 'number' && typeof pageSize === 'number') {
      newPageInfo = {
        pageSize,
        beginIndex: (page - 1) * pageSize
      }
      pageInfoRef.current = newPageInfo
    }
    onSimpleSearch && onSimpleSearch({
      searchKeyword: searchKeyword,
      pageInfo: newPageInfo
    })
  }, [searchKeyword, pageInfo, activeMode])


  const onSearchKeywordChange = useCallback((e) => {
    const value = e.target.value
    setSearchKeyword(value)
  }, [onSimpleSearch, pageInfo])

  useMemo(() => {
    simpleSearchRef.current = simpleSearch
  }, [simpleSearch])

  useMemo(() => {
    if (activeModeRef.current === 'simple' && !_.isEqual(pageInfo, pageInfoRef.current)) {
      pageInfoRef.current = pageInfo
      let func = simpleSearchRef.current
      // 标识这是外部改变了分页，无需将beginIndex设置为0
      func && func(true)
    }
  }, [pageInfo])

  useEffect(() => {
    if (activeModeRef.current === 'simple' && ref) {
      ref.current = {
        reset: () => setSearchKeyword(''),
        search: simpleSearchRef.current
      }
    }
  })

  const noConfigViews = useMemo(() => {
    return (
      <ViewPicker
        viewName={activeView.name}
        viewId={activeView.viewId}
        defaultView={defaultView}
        customViews={customViews}
        companyViews={companyViews}
        systemViews={currentSystemViews}
        switchActiveView={changeActiveView}
        updateView={viewSaveImpl}
        renameLoading={renameLoading}
        loading={updateViewLoading}
        splitLine={true}
        onDefaultViewChange={setDefaultView}
      />
    )
  }, [activeView.name, customViews, currentSystemViews, setCustomViews, renameLoading, updateViewLoading, defaultView, viewSaveImpl])

  const config = useMemo(() => {
    return (
      <Config
        activeView={activeView}
        viewSelector={noConfigViews}
        supportOrderFields={supportOrderFields}
        supportFilterFields={supportFilterFields}
        configModalSize={configModalSize}
        onSave={onViewSave}
        loading={saveLoading}
        onSaveAs={onViewSaveAs}
        saveAsLoading={saveAsLoading}
        isCompatibilityMode={isCompatibilityMode}
      />
    )
  }, [activeView, noConfigViews, supportOrderFields, supportFilterFields, configModalSize, onViewSave, saveLoading, onViewSaveAs, saveAsLoading, isCompatibilityMode])

  const titleRef = useRef(null)
  const views = useMemo(() => {
    return (
      <ViewPicker
        viewName={activeView.name}
        viewId={activeView.viewId}
        defaultView={defaultView}
        customViews={customViews}
        companyViews={companyViews}
        systemViews={currentSystemViews}
        switchActiveView={changeActiveView}
        updateView={viewSaveImpl}
        renameLoading={renameLoading}
        loading={updateViewLoading}
        splitLine={showSplitLine}
        onDefaultViewChange={setDefaultView}
        config={config}
        getPopupContainer={() => titleRef.current || document.body}
      />
    )
  }, [activeView.name, customViews, currentSystemViews, setCustomViews, renameLoading, updateViewLoading, defaultView, viewSaveImpl, config, showSplitLine, titleRef])

  const title_ = useMemo(() => {
    return (
      <div ref={titleRef}>
        {title}
        {isCompatibilityMode || mode === 'advancedOnly' ? null : (
          <div className={styles.queryBtn} onClick={activeModeUpdate}>{tr(activeMode === 'simple' ? '切换为高级查询视图' : '切换为简单查询视图')}</div>
        )}
        {activeMode === 'advanced' && (
          views
        )}
      </div>
    )
  }, [title, views, activeMode, activeModeUpdate])

  const simpleSearchInputFocusStatusChange = useCallback((res: boolean) => {
    setIsSimpleInputFocus(res)
  }, [])

  // 自定义组件列表
  const customComponents_ = useMemo(() => {
    return [...customComponents, {
      name: "SmartSearchSwitch",
      component: Switch
    }]
  }, [customComponents])

  return (
    <SearchForm
      searchKey={searchPanelId + userId}
      ref={ref}
      title={title_}
      schema={searchFormSchema}
      activeView={activeView}
      customFilters={filters}
      onCustomFiltersChange={setFilters}
      systemFilters={systemFilters}
      onSearch={onSearch}
      pageInfo={pageInfo}
      totalCount={totalCount}
      extra={
        <>
          {extra}
          {
            activeMode === 'simple' && totalCount !== undefined && (
              <Pagination
                simple
                pageSize={pageInfo.pageSize}
                current={currentPage}
                total={totalCount}
                onChange={simpleSearch}
              />
            )
          }
        </>
      }
      customComponents={customComponents_}
      isCompatibilityMode={isCompatibilityMode}
      showCustomBody={activeMode === 'simple'}
      customBody={(
        <Input.Search
          className={classnames('margin10', [styles['simple-search-input']], {
            [styles['simple-search-input-focus']]: isSimpleInputFocus
          })}
          value={searchKeyword}
          placeholder={placeholder}
          enterButton
          style={{ width: '50%' }}
          onChange={onSearchKeywordChange}
          onSearch={simpleSearch}
          onFocus={simpleSearchInputFocusStatusChange.bind(null, true)}
          onBlur={simpleSearchInputFocusStatusChange.bind(null, false)}
        />
      )}
      showBottomLine={showBottomLine}
      headerProps={headerProps}
      uiSchema={uiSchema}
      hidePrintBtn={hidePrintBtn}
      onSizeChange={onSizeChange}
      isCustomSearch={uiConfig.searchType === 'auto'}
      initParams={currentInitParams}
      onValueChange={onValueChange}
    />
  )
})
