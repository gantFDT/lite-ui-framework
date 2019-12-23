import React, { useState, useMemo, useCallback } from 'react'
import { Icon, Input } from 'antd'
import SelectorModal from './SelectorModal'
import styles from './style.less'

export interface FuncItemProps {
  type: string
  name: string
  content: string
  parameter: string[]
  script: string
}

export interface InnerFuncItemProps {
  callbackName: string
  serviceName: string
  callbaclDescription: string
  parameter: {
    name: string
    value: string
  }[]
}

const SelectorFormItem = (props: any) => {
  const {
    value,
    onChange
  } = props;

  const [visible, setVisible] = useState(false)

  const handlerChange = useCallback((data: any) => {
    onChange && onChange({
      ...data,
      functions: data.functions.map((R: InnerFuncItemProps) => ({
        type: "bean",
        name: R.callbackName,
        content: R.serviceName,
        parameter: R.parameter.reduce((T: any, C: any) => ({
          ...T,
          [C.name]: C.value
        }), {}),
        script: ""
      }))
    })
    setVisible(false)
  }, [onChange])

  const formatValue = useMemo(() => {
    return {
      ...value,
      functions: value && value.functions ? value.functions.map((R: FuncItemProps) => ({
        callbackName: R.name,
        serviceName: R.content,
        parameter: Object.entries(R.parameter).map(([K, V]) => ({
          name: K,
          value: V
        }))
      })) : []
    }
  }, [value])

  const showValue = useMemo(() => {
    if (value && value.type) {
      if (value.type === 'user')
        return `${tr('用户集合')}[${value.userList.map((U: any) => U.userName).join(',')}]`;
      return `${tr('函数值')}[${value.functions.map((F: any) => F.name).join(',')}]`;
    }
    return '[]'
  }, [value]);

  return (
    <div className={styles.selector}>
      <div className={styles.selectWrap} onClick={() => setVisible(true)}>
        <Input readOnly value={showValue} className="text-overflow-hidden" />
        <Icon className={styles.searchIcon} type="search" />
      </div>

      <SelectorModal
        onCancel={() => setVisible(false)}
        onOk={handlerChange}
        value={formatValue}
        visible={visible}
      />
    </div>
  )
}

export default SelectorFormItem;