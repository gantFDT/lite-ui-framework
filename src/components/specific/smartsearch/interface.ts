import { ReactNode } from "react"
import { OperatorType } from './operators'
import { GetFieldDecoratorOptions } from 'antd/lib/form/Form.d'

export type OrderType = 'ASC' | 'DESC'

// 分页信息
export interface PageInfo {
  beginIndex: number
  pageSize: number
}

// 基础字段
export interface BaseField {
  fieldName: string,
  title: string
}

// 基础可查询字段
export interface BaseSupportFilterField extends BaseField {
  componentType?: string
  props?: any
  options?: GetFieldDecoratorOptions // 表单验证的配置
}

// 可查询字段
export interface SupportFilterField extends BaseSupportFilterField {
  suppOperator?: OperatorType[]
  type: 'string' | 'number' | 'date' | 'boolean' | 'codelist' | 'object'
}

// 可排序字段
export interface SupportOrderField extends BaseField {
}

// 可选分页信息
export type SupportPageSize = string[]

// 基础搜索字段
export interface BaseSearchField {
  fieldName: string
}

// 搜索字段
export interface SearchField extends BaseSearchField {
  operator?: OperatorType
}

// 基础排序字段
export interface BaseOrderField {
  fieldName: string
}

// 排序字段
export interface OrderField extends BaseOrderField {
  orderType: OrderType
}

// UI配置
export interface UiConfigProps {
  searchType?: 'auto' | 'click'
}

// 普通渲染配置
export interface PanelConfig {
  searchFields: SearchField[]
  orderFields: OrderField[]
  uiConfig?: UiConfigProps
}

// 兼容模式渲染配置
export interface CompatibilityModePanelConfig {
  searchFields: BaseSearchField[]
  uiConfig?: UiConfigProps
}

// 基础视图
export interface BaseView {
  viewId: string // 唯一标识
  name: string
  version: string
  isSystem?: boolean
}

// 普通视图
export interface View extends BaseView {
  panelConfig: PanelConfig
}

// 兼容模式视图
export interface CompatibilityModeView extends BaseView {
  panelConfig: CompatibilityModePanelConfig
}

// 基础筛选器字段
export interface BaseFilterItem {
  fieldName: string
  value: any
}

// 筛选器字段
export interface FilterItem extends BaseFilterItem {
  operator: OperatorType
}

// 基础筛选器
export interface BaseFilter {
  dataName: string
  relateViewId: string
  relateViewVersion: string
  pageInfo?: PageInfo
}

// 普通筛选器
export interface Filter extends BaseFilter {
  filterItems: FilterItem[]
}

// 兼容模式筛选器
export interface CompatibilityModeFilter extends BaseFilter {
  filterItems: BaseFilterItem[]
}

// SmartSearch查询数据结构
export interface SearchData {
  whereList: { fieldName: string, operator: OperatorType, value: any }[]
  orderList: { fieldName: string, orderType: OrderType }[]
  pageInfo: PageInfo | undefined
}

// 传统查询数据结构
export interface FilterData {
  filterInfo: { [key: string]: any },
  orderInfo: { [key: string]: any },
  pageInfo: PageInfo | undefined
}

// 本地筛选器
export interface LocalFilter {
  dataName: string
  filterItems: FilterItem[]
  pageInfo?: PageInfo
  isLast?: boolean // 是否是上次查询
}

// 本地存储筛选器列表
export interface LocalFilterProps {
  [key: string]: Filter[]
}

// 兼容模式配置
export interface CompatibilityMode {
  open: boolean // 是否开启
  sortType: 'single' | 'multiple' // 兼容模式下排序字段类型
}

// 自定义组件
export interface CustomComponent {
  name: string // 组件名
  component: ReactNode // 自定义组件
}
