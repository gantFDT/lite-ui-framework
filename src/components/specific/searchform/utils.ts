import { useState, useEffect, useCallback } from 'react'
import { SearchFormSchema } from './index'
import { getDateValue } from './subcomponents/filter/utils'

const DATE_FORMAT = 'YYYY-MM-DD'

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


// 获取schema中的默认值
export function getDefaultParams(schema: SearchFormSchema) {
  const tempDefaultParams = Object.entries(schema).reduce((res: any, [key, item]: [string, any]) => {
    const { options = {} } = item
    if (options.initialValue) {
      res[key] = options.initialValue
    }
    return res
  }, {})

  return tempDefaultParams
}

/**
 * 格式化初始参数
 * 目前主要处理为日期的字段
 */
export function formatInitParams(initParams: any, schema: SearchFormSchema) {
  const res = { ...initParams }
  // 找到schema中的日期字段列表
  Object.entries(schema).forEach(([key, item]: [string, any]) => {
    const { componentType, props = {} } = item
    let currentValue = res[key]
    // 处理日期
    if (['DatePicker'].includes(componentType)) {
      let format = DATE_FORMAT
      if (props.format) {
        format = props.format
      }
      currentValue = getDateValue(currentValue, format, false)
    }
    // 处理如期区间
    if (componentType === 'RangePicker' && !_.isEmpty(currentValue)) {
      let [start, end] = currentValue as [any, any]
      let format = DATE_FORMAT
      if (props.format) {
        format = props.format
      }
      currentValue = [getDateValue(start, format, false), getDateValue(end, format, false)]
    }
    res[key] = currentValue
  })
  return res
}
