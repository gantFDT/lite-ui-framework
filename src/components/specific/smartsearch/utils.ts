import { useState, useEffect, useCallback } from 'react'
import _, { pick as _pick, isEmpty } from 'lodash'
import { allOperators, typeOperators, Operator } from './operators'
import { SearchField, View, CompatibilityModeView, SupportFilterField, FilterItem } from './interface'
import { SearchFormSchema } from '../searchform/index'

/**
 * 获取获取与更新本地数据的勾子
 * @param searchKey 唯一的key
 * @param initValue 初始默认值
 */
export function useLocalStorage<T>(searchKey: string, initValue: T): [T, (params: T) => void] {
  const [localData, setLocalData] = useState<T>(initValue)

  const getLocaLStorageData = () => {
    let localDataString = localStorage.getItem(searchKey)
    let localFields = localDataString ? JSON.parse(localDataString) : initValue
    setLocalData(localFields)
  }

  useEffect(() => {
    getLocaLStorageData()
  }, [searchKey])

  const setLocalStorage = useCallback((list: T) => {
    setLocalData(list)
    localStorage.setItem(searchKey, JSON.stringify(list))
  }, [])

  return [localData, setLocalStorage]
}

/**
 * 通过操作符key的列表获取操作符列表
 * @param keys 操作符key的列表
 */
export function getOperatorsByOperateKey(keys: string[]): Operator[] {
  return Object.values(_pick(allOperators, keys))
}

/**
 * 通过数据类型获取对应操作符列表或者操作符key列表
 * @param type 数据类型
 */
export function getOperatorsByDataType(type: string, isKeys: boolean = false) {
  if (isKeys) {
    return typeOperators[type]
  }
  return getOperatorsByOperateKey(typeOperators[type])
}

/**
 * 通过suppOperator和type获取对应操作符列表
 * @param type 数据类型
 */
export function getOperatorsBySupportAndType(suppOperator: Array<string>, type: string) {
  let operators = suppOperator ? _.filter(suppOperator, item => _.includes(typeOperators[type], item)) : typeOperators[type]
  return getOperatorsByOperateKey(operators)
}

/**
 * 生成uuid
 */
export function guid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = Math.random() * 16 | 0,
      v = c == 'x' ? r : (r & 0x3 | 0x8)
    return v.toString(16)
  })
}

/**
 * 获取正常情况初始查询条件
 * @param earchFields 查询字段
 * @param isCompatibilityMode 是否是兼容模式
 */
export function getNormalInitSearchParams(earchFields: SearchField[], isCompatibilityMode = false): any {
  let res = earchFields.filter(({ operator = 'EMPTY' }) => ['IS_NOT_NULL', 'IS_NULL'].includes(operator)).map(item => {
    const { fieldName, operator } = item
    return {
      fieldName,
      operator,
      value: null
    }
  })
  if (isCompatibilityMode) {
    res = res.reduce((tempRes: any, item: any) => {
      const { fieldName, value } = item
      tempRes[fieldName] = value
      return tempRes
    }, {})
  }
  return res
}

/**
 * 将数组的排序字段转换为对象排序字段
 * @param orderList
 * @param isCompatibilityMode
 */
export function getOrderInfo(orderList: any[], isCompatibilityMode = false): any[] | Object {
  let res = orderList
  if (isCompatibilityMode) {
    res = orderList.reduce((tempRes: any, item: any) => {
      const { fieldName, orderType } = item
      tempRes[fieldName] = orderType
      return tempRes
    }, {})
  }
  return res
}

/**
 * 获取适用于SearchForm的schema
 * @param supportFilterFields
 * @param searchFields
 */
export function getSchema(supportFilterFields: SupportFilterField[], searchFields: SearchField[]) {
  const schema: any = {}
  if (isEmpty(supportFilterFields) || isEmpty(searchFields)) return schema
  const filedsSchema: any = {}
  supportFilterFields.map(fieldItem => {
    const { type, ...itemField } = fieldItem
    filedsSchema[fieldItem.fieldName] = {
      ...itemField,
      CUSTOM_TYPE: type
    }
  })
  searchFields.map(item => {
    const { fieldName, operator = undefined } = item
    const currentFieldObj = filedsSchema[fieldName]
    if (!isEmpty(currentFieldObj)) {
      const fieldName_ = operator ? `${fieldName}:${operator}` : fieldName
      let componentType = currentFieldObj['componentType']
      let addProps = currentFieldObj['props'] || {}
      let isInOrNotIn = ['IN', 'NOT_IN'].includes(operator)

      if (['Select', 'CodeList'].includes(componentType) && isInOrNotIn) {
        addProps.mode = 'multiple'
      } else {
        delete addProps.mode
      }

      if (['UserSelector', 'GroupSelector', 'RoleSelector', 'UserGroupSelector'].includes(componentType) && isInOrNotIn) {
        addProps.multiple = true
      } else {
        delete addProps.multiple
      }

      if (['IS_NULL', 'IS_NOT_NULL'].includes(operator)) {
        componentType = 'SmartSearchSwitch'
      }

      schema[fieldName_] = {
        ...currentFieldObj,
        operator,
        componentType,
        props: addProps
      }
    }
  })

  return schema
}

/**
 * 如果某个视图在指定视图列表中，则返回视图列表中的视图，并根据类型设置isSystem属性
 * @param views
 * @param view
 */
export function isViewInViews(views: Array<View | CompatibilityModeView> = [], view: View | CompatibilityModeView, type: 'system' | 'custom') {
  const tempView = views.find(item => {
    const { version, viewId } = item
    const { version: initVersion, viewId: initViewId } = view
    return version === initVersion && viewId === initViewId
  })
  if (tempView) {
    tempView.isSystem = type === 'system'
  }

  return tempView
}

// 获取searchform schema中的默认值
export function getDefaultParams(schema: SearchFormSchema): FilterItem[] {
  const tempDefaultParams = Object.entries(schema).reduce((res: any, [key, item]: [string, any]) => {
    const { options = {}, fieldName, operator = 'EMPTY' } = item
    if (options.initialValue) {
      res.push({
        fieldName,
        value: options.initialValue,
        operator
      })
    }
    return res
  }, [])

  return tempDefaultParams
}
