import React, { useState, useCallback, useRef, useEffect, useMemo } from 'react';
import { getModelData,findDomParentNode } from '@/utils/utils'

// localStorage相关
export function useLocalStorage<T>(storageKey: string, initalValue: T, valueKey?: string): [T, (params: T) => void] {
  const valueParse = (str: string, key?: string) => {
    let jsonData = JSON.parse(str);
    return key ? jsonData[key] || initalValue : jsonData;
  }
  const getLocaLStorageData = (init: any, key?: string) => {
    try {
      let localDataString = localStorage.getItem(storageKey);
      return localDataString ? valueParse(localDataString, key) : init;
    } catch (err) { return init }
  }
  const [localData, setLocalData] = useState<T>(getLocaLStorageData(initalValue, valueKey));
  const localRef = useRef(localData);

  useEffect(() => {
    localRef.current = localData;
  }, [localData])

  const setLocalStorage = useCallback((list: T) => {
    let newData = Object.assign({}, localRef.current, list);
    setLocalData(newData);
    if (valueKey) {
      let _localData = getLocaLStorageData({});
      newData = { ..._localData, [valueKey]: newData };
    }
    localStorage.setItem(storageKey, JSON.stringify(newData));
  }, [])

  return [localData, setLocalStorage];
}

/**
 * 获取上传文件限制大小，以及提示信息
 */
export function useFileSize(msg: string = tr('上传文件大小超过系统规定上限')): [number, string] {
  return useMemo(() => {
    const BASE_UPLOAD_FILE_SIZE = getModelData('config.COMMON_CONFIG.uploadFileSize')
    return [BASE_UPLOAD_FILE_SIZE * 1024 * 1024, `${msg}(${BASE_UPLOAD_FILE_SIZE}M)`]
  }, [])
}


/**
*用与行内编辑检测field是否执行失去焦点
*使用此方法前提是如果选择器包含modal,必须在组件内维护model依赖链，即getContainer={thisRef.current}
* @param {object} ref  field ref
* @param {Function} onBlur  失去焦点触发
*/
export const useCheckBlur = (ref: object, onBlur: Function) => {
  const onEventClick = useCallback((event) => {
    const targetEle = event.target;
    if ((ref['current'] && ref['current'].contains(targetEle)) || findDomParentNode(targetEle, 'ant-select-dropdown')) { return }
    onBlur && onBlur();
  }, [onBlur, ref])
  useEffect(() => {
    window.addEventListener("mousedown", onEventClick);
    return () => window.removeEventListener("mousedown", onEventClick);
  }, [onEventClick])
}
