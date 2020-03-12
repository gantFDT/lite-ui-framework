import React, { ReactNode, useRef, useState, useCallback, useEffect, useMemo, KeyboardEvent } from 'react'
import { Header } from 'gantd'
import _ from 'lodash'
import ReactResizeDetector from 'react-resize-detector'
import { UISchema } from 'gantd/lib/schema-form'
import classnames from 'classnames'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form.d'
import { Form, Filter } from './subcomponents'
import { useLocalStorage, getDefaultParams } from './utils'
import styles from './index.less'
import { View, Filter as FilterProps, PageInfo, SearchData, FilterData, CustomComponent } from '../smartsearch/interface'
import wrapperStyles from '../viewpicker/wrapper.less'
import { resolveValue } from './subcomponents/filter/utils'

export interface SearchFormSchema {
  [key: string]: {
    title: string // 字段显示名称
    props?: any // 组件参数
    options?: GetFieldDecoratorOptions // form的option配置
    componentType?: string // 组件类型
    [key: string]: any
  }
}

export interface SearchFormProps {
  searchKey: string // 查询的唯一id,例如（操作+用户id）
  title: string | ReactNode // 标题
  schema: SearchFormSchema
  onSearch: (params: SearchData | FilterData) => void // 点击查询的回调
  onSizeChange?: (params: { width: number, height: number }) => void
  ref?: any
  extra?: ReactNode // 自定义操作
  customComponents?: CustomComponent[] // 自定义组件列表
  uiSchema?: UISchema // 自定义uiSchema配置
  showBottomLine?: boolean
  showCustomBody?: boolean // 显示自定义表单内容，这件隐藏通过schema显示的内容
  customBody?: ReactNode // 显示自定义表单内容
  isCustomSearch?: boolean // 是否自动查询
  headerProps?: any // BlockHeader组件自定义配置
  initParams?: any // 初始查询参数
  onValueChange?: (value: any, filterValue: any) => void // 输入值改变的回调
  // 以下属性仅服务于SmartSearch组件
  hidePrintBtn?: boolean,//是否显示视图打印按钮(在dev环境下)
  pageInfo?: PageInfo // 分页信息
  totalCount?: number // 数据总条数
  activeView?: View // 当前视图
  customFilters?: any // 自定义筛选器列表
  onCustomFiltersChange?: (filters: any) => void // 筛选器改变后的回调
  systemFilters?: FilterProps[] // 系统筛选器
  isCompatibilityMode?: boolean // 是否是兼容模式
}

// 存入localstorage的前缀
export const STORAGE_PREFIX = 'search_form_'
const STORAGE_PREFIX_FILTER = 'filter:'
const INIT_ANY_OBJECT: any = {}
const INIT_ANY_ARRAY: any[] = []

export default React.forwardRef((props: SearchFormProps, ref: any) => {
  const {
    searchKey,
    title,
    onSearch,
    onSizeChange,
    pageInfo,
    totalCount,
    hidePrintBtn = false,
    extra,
    customComponents = INIT_ANY_ARRAY,
    uiSchema = INIT_ANY_OBJECT,
    showBottomLine = true,
    showCustomBody = false,
    customBody,
    schema,
    isCustomSearch = false,
    activeView = INIT_ANY_OBJECT,
    systemFilters = INIT_ANY_ARRAY,
    isCompatibilityMode,
    headerProps = INIT_ANY_OBJECT,
    customFilters = INIT_ANY_OBJECT,
    onCustomFiltersChange = () => { },
    initParams = INIT_ANY_OBJECT,
    onValueChange
  } = props

  const searchRef = useRef(null)
  ref = ref || searchRef
  // 是否是普通查询(非SmartSearch查询)
  const isNormalSearch = _.isEmpty(activeView)
  const [params, setParams] = useState<any>({})
  const [filters, setFilters] = useLocalStorage<any[]>(`${STORAGE_PREFIX}${STORAGE_PREFIX_FILTER}` + searchKey, [])
  const wrapperRef = useRef<HTMLDivElement>({ clientHeight: 0, clientWidth: 0 } as HTMLDivElement)
  const formRef = useRef<any>({ props: { form: {} } })
  const defaultParams = useMemo(() => {
    let tempParams = getDefaultParams(schema)
    setParams(tempParams)
    return tempParams
  }, [schema])

  // 初始查询参数
  const initParamsRef = useRef(initParams)
  useMemo(() => {
    initParamsRef.current = initParams
  }, [initParams])

  const onValuesChange = useCallback(_.debounce((values: any, allValues: any) => {
    setParams(allValues)
  }, (isCustomSearch ? 1000 : 0)), [isCustomSearch])

  const [customFilters_, onCustomFiltersChange_] = useMemo(() => {
    let tempFilters = isNormalSearch ? filters : customFilters
    let tempOnCustomFiltersChange = isNormalSearch ? setFilters : onCustomFiltersChange
    return [tempFilters, tempOnCustomFiltersChange]
  }, [isNormalSearch, filters, customFilters])

  // 动态计算宽高
  useEffect(() => {
    const { clientWidth: width, clientHeight: height } = wrapperRef.current
    onSizeChange && onSizeChange({ width, height })
  }, [wrapperRef.current])

  const onEnter = useCallback((e: KeyboardEvent<HTMLDivElement>) => {
    const { keyCode, altKey, ctrlKey, metaKey, shiftKey } = e
    if (keyCode === 13 && !altKey && !ctrlKey && !metaKey && !shiftKey) {
      if (ref && ref.current) {
        const { search } = ref.current
        search && search()
      }
    }
  }, [])

  // 初始化设值
  useEffect(() => {
    const { props: { form: { setFieldsValue } } } = formRef.current
    const initParams = initParamsRef.current
    if (!_.isEmpty(initParams) && setFieldsValue) {
      setFieldsValue(initParams)
    }
  }, [schema])

  // 监听查询值改变
  useEffect(() => {
    if (onValueChange) {
      let filterItems = resolveValue({
        params,
        schema,
        type: 'filter',
        isCompatibilityMode,
        isNormalSearch
      })
      let searchItems = resolveValue({
        params,
        schema,
        type: 'search',
        isCompatibilityMode,
        isNormalSearch
      })
      onValueChange && onValueChange(filterItems, searchItems)
    }
  }, [params, schema, isNormalSearch, isCompatibilityMode, onValueChange])

  const onResize = useCallback((width: number, height: number) => {
    let newSize = { width, height }
    onSizeChange && onSizeChange(newSize)
  }, [])

  return (
    <div
      ref={wrapperRef}
      onKeyDown={onEnter}
      className={classnames(styles.wrapper, wrapperStyles['view-picker-wrapper'])}
      tabIndex={0}
    >
      <ReactResizeDetector handleWidth handleHeight onResize={onResize}>
        <Header
          type=''
          title={title}
          size='big'
          bottomLine
          extra={(
            <>
              {extra}
              {!showCustomBody && (
                <>
                  <Filter
                    isNormalSearch={isNormalSearch}
                    formRef={formRef.current.props.form}
                    params={params}
                    setParams={setParams}
                    onSearch={onSearch}
                    activeView={activeView}
                    customFilters={customFilters_}
                    onCustomFiltersChange={onCustomFiltersChange_}
                    systemFilters={systemFilters}
                    pageInfo={pageInfo}
                    totalCount={totalCount}
                    hidePrintBtn={hidePrintBtn}
                    filterRef={ref}
                    isCustomSearch={isCustomSearch}
                    isCompatibilityMode={isCompatibilityMode}
                    schema={schema}
                    defaultParams={defaultParams}
                  />
                </>
              )}
            </>
          )}
          {...headerProps}
        />
        <div
          className={classnames(styles.formBody, {
            [styles.borderBottom]: showBottomLine,
            [styles.formBodyHidden]: showCustomBody,
          })}
        >
          <Form
            formRef={formRef}
            onValuesChange={onValuesChange}
            customComponents={customComponents}
            uiSchema={uiSchema}
            schema={schema}
            defaultParams={defaultParams}
          />
        </div>
        <div
          className={classnames(styles.formBody, {
            [styles.borderBottom]: showBottomLine,
            [styles.formBodyHidden]: !showCustomBody,
          })}
        >
          {customBody}
        </div>
      </ReactResizeDetector>
    </div >
  )
})
