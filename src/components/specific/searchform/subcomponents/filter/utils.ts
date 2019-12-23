import { View } from '../../../smartsearch/interface'
import { Filter, FilterItem } from '../../interface'
import moment from 'moment'
import _ from 'lodash'
import { OperatorType } from '../../../smartsearch/operators'
import { SearchFormSchema } from '../../index'

const DATE_FORMAT = 'YYYY-MM-DD'

interface ResolveValueProps {
  params: any // 查询条件
  schema: SearchFormSchema
  handleNull?: boolean // 特性处理IS_NOT_NULL与IS_NULL
  type: 'search' | 'filter' // 操作类型
  isNormalSearch: boolean // 是否是普通查询(非SmartSearch查询)
  isCompatibilityMode?: boolean // 是否是兼容模式
}

// 获取对应的视图的筛选器列表
export const getFiltersOfView = (view: View, filters: Filter[]) => {
  const { viewId, version } = view
  return filters.filter(item => {
    const { relateViewId, relateViewVersion } = item
    return viewId === relateViewId && version === relateViewVersion
  })
}

// 处理Date类型数据
export const getDateValue = (value: any, format: string, needFormat = true) => {
  let value_
  if (value instanceof moment) {
    value_ = needFormat ? value.format(format) : value
  } else if (typeof value === 'string') {
    value_ = needFormat ? moment(value, format).format(format) : moment(value, format)
  }
  return value_
}

/**
 * 解析查询参数
 * @param props
 */
export const resolveValue = (props: ResolveValueProps) => {
  const { params, schema, type: resolveType, isNormalSearch, isCompatibilityMode } = props
  // 处理值
  let res: FilterItem[] = Object.entries(params).map(([key, value]) => {
    let fieldName = ''
    let operator: OperatorType = 'EMPTY'
    let value_ = value
    if (key.includes(':')) {
      let arr = key.split(':')
      fieldName = arr[0]
      operator = arr[1] as OperatorType
    } else {
      fieldName = key
    }
    // 当前字段
    let currentFiled = schema[key] || {}
    const { CUSTOM_TYPE: type, componentType = 'Input', props = {} } = currentFiled

    // // 处理日期
    // if (componentType === 'DatePicker') {
    //   let format = DATE_FORMAT
    //   if (props.format) {
    //     format = currentFiled.props.format
    //   }
    //   value_ = getDateValue(value, format)
    // }

    // // 处理日期区间
    // if (componentType === 'RangePicker' && !_.isEmpty(value)) {
    //   let [start, end] = value as [any, any]
    //   let format = DATE_FORMAT
    //   if (props.format) {
    //     format = currentFiled.props.format
    //   }
    //   value_ = [getDateValue(start, format), getDateValue(end, format)]
    // }

    // 处理SmartSearch相关
    if (!isNormalSearch) {
      // 处理IS_NOT_NULL与IS_NULL
      if (['IS_NOT_NULL', 'IS_NULL'].includes(operator)) {
        value_ = value !== false ? null : false
      }

      // 仅在查询时处理
      if (resolveType === 'search') {
        // 处理IN与NOT_IN
        if (['IN', 'NOT_IN'].includes(operator) && value) {
          if (['string', 'number'].includes(type) && typeof value === 'string') {
            value_ = value.split(/,|，/)
          }
          if (type === 'number' && typeof value === 'number') {
            value_ = [value]
          }
        }
        // 处理金额
        if (componentType === 'InputMoney' && value && typeof value === 'string') {
          value_ = value.replace(/,|，/g, '')
        }
      }
    }

    return {
      fieldName,
      operator,
      value: value_
    }
  })

  // 过滤掉无效值
  res = res.filter(({ value, operator }) => {
    // 空字符串
    if (typeof value === 'string' && value.trim() === '') {
      return false
    }
    // 处理IN与NOT_IN
    if (['IN', 'NOT_IN'].includes(operator) && ((Array.isArray(value) && value.length === 0) || !value)) {
      return false
    }
    // 仅在查询时过滤
    if (resolveType === 'search') {
      if (['IS_NOT_NULL', 'IS_NULL'].includes(operator) && value === false) {
        return false
      }
    }
    return value !== undefined
  })

  // 普通查询模式与高级查询(兼容)模式下查询
  if ((isCompatibilityMode && resolveType === 'search') || isNormalSearch) {
    res = res.reduce((tempRes: any, { value, fieldName }: any) => {
      tempRes[fieldName] = value
      return tempRes
    }, {})
  }

  return res
}

/**
 * 根据filterItems获取对应值
 * @param data
 */
export function getValues(data: any[] | any, schema: SearchFormSchema, isCompatibilityMode: boolean | undefined) {
  let values = {}
  if (_.isEmpty(data)) return values
  // 高级查询
  if (Array.isArray(data)) {
    data.map(item => {
      const { fieldName, operator, value, props = {} } = item
      // let dateFormat = DATE_FORMAT
      // if (props.format) {
      //   dateFormat = props.format
      // }
      const propsName = operator && !isCompatibilityMode ? `${fieldName}:${operator}` : fieldName
      // let currentFiled = schema[propsName]
      // const isDate = currentFiled && currentFiled.componentType && currentFiled.componentType === 'DatePicker'
      // const value_ = isDate && value ? moment(value, dateFormat) : value
      values[propsName] = value
    })
  } else {
    // 普通查询
    values = { ...data as any }
    // // 找到类型为DatePicker的字段
    // let dateFields = Object.entries(schema).filter(([key, item]) => {
    //   return item.componentType === 'DatePicker'
    // })
    // dateFields.forEach(([key, dateItem]) => {
    //   let dateFormat = DATE_FORMAT
    //   const { props = {} } = dateItem
    //   if (props.format) {
    //     dateFormat = props.format
    //   }
    //   let date = data[key]
    //   values[key] = date ? moment(date, dateFormat) : undefined
    // })
  }

  return values
}

/**
 * 移除对象中值为undefine的属性
 * @param obj
 */
function deleteObjectUndefinedValue(obj: object) {
  let copyObj = { ...obj }
  Object.entries(copyObj).forEach(([key, value]) => {
    if (value === undefined) {
      delete copyObj[key]
    }
  })
  return copyObj
}

/**
 * 比较两个对象的属性不为undefine的部分是否相等
 * @param obj1
 * @param obj2
 */
export function isEqualImpl(obj1: object, obj2: object) {
  let copyObj1 = deleteObjectUndefinedValue(obj1)
  let copyObj2 = deleteObjectUndefinedValue(obj2)
  return _.isEqual(copyObj1, copyObj2)
}
