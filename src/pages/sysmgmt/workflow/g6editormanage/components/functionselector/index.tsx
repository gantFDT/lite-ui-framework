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
    valueProp = 'serviceName',
    onChange,
    radioOptions,
    serviceName
  } = props;

  const [visible, setVisible] = useState(false)

  const handlerChange = useCallback((valueData: any) => {
    let finalValue: any = {}
    finalValue.functions = valueData.functions.map((R: InnerFuncItemProps) => ({
      type: "bean",
      name: R.callbackName,
      content: R.serviceName,
      parameter: R.parameter.reduce((T: any,C: any)=>({
        ...T,
        [C.name]: C.value
      }),{}),
      script: ""
    }));
    switch (serviceName) {
      case 'LogicCondition':
        if (valueData.type === 'OR' || valueData.type === 'AND') {
          finalValue.type = 'function';
          finalValue.logicValue = true;
          finalValue.functionRelation = valueData.type;
        }else{
          finalValue = {
            functions: [],
            type: "logicValue",
            logicValue: valueData.type,
            functionRelation: "OR"
          }
        }
        break;
      case 'Condition':
        if (valueData.type === 'default') {
          finalValue = {
            functions: [],
            type: "default",
            logicValue: true,
            functionRelation: "OR"
          }
        }else{
          finalValue.type = 'function';
          finalValue.logicValue = true;
          finalValue.functionRelation = valueData.type;
        }
        break;
      default:
        finalValue.type = "function"
    }
    onChange && onChange(finalValue)
    setVisible(false)
  }, [onChange, serviceName])

  const formatValue = useMemo(() => {
    let finalValue: any = {}
    switch (serviceName) {
      case 'LogicCondition':
        finalValue.type = value.type === 'logicValue' ? value.logicValue : value.functionRelation;
        break;
      case 'Condition':
        finalValue.type = value.type === 'default' ? 'default' : value.functionRelation;
        break;
      default:
        finalValue.type = 'default';
    }
    finalValue.functions = value && value.functions ? value.functions.map((R: FuncItemProps) => ({
      callbackName: R.name,
      serviceName: R.content,
      parameter: Object.entries(R.parameter).map(([K, V])=>({
        name: K,
        value: V
      }))
    })) : []
    return finalValue
  },[value, serviceName])
  
  const showValue = useMemo(() => {
    let valuePrefix: string = '';
    switch (serviceName) {
      case 'LogicCondition':
        if(value.type === 'logicValue') return value.logicValue.toString().toUpperCase();
        valuePrefix = value.functionRelation + tr('逻辑关系函数');
        break;
      case 'Condition':
        if(value.type === 'default') return tr('默认');
        valuePrefix = value.functionRelation + tr('逻辑关系函数');
        break;
    }
    if (value && value.functions && Array.isArray(value.functions)) {
      return valuePrefix + '[' + value.functions.map((V: FuncItemProps) => V.name).join(',') + ']'
    }
    return valuePrefix + '[]'
  }, [value, serviceName]);

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
        valueProp={valueProp}
        visible={visible}
        radioOptions={radioOptions}
        serviceName={serviceName}
      />
    </div>
  )
}

export default SelectorFormItem;