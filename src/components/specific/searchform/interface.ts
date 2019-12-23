import { ReactNode } from "react"

export type OrderType = 'ASC' | 'DESC'

// 分页信息
export interface PageInfo {
  beginIndex: number
  pageSize: number
}


// 筛选器字段
export interface FilterItem {
  fieldName: string
  operator: OperatorType
  value: any
}

// 筛选器
export interface Filter {
  dataName: string
  relateViewId: string
  relateViewVersion: string
  filterItems: FilterItem[]
  pageInfo?: PageInfo
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
