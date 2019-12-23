import React, { useState, useMemo, useCallback } from 'react'
import { Icon, Input } from 'antd'
import SelectorModal from './SelectorModal'
import styles from './style.less'
import { withEditorContext } from '@/components/common/ggeditor'

const SelectorFormItem = (props: any) => {
  const {
    graph,
    value,
    onChange,
  } = props;

  const itemMap = graph.get("itemMap");

  const [visible, setVisible] = useState(false)

  const handlerChange = useCallback((data: any[]) => {
    onChange && onChange(data)
    setVisible(false)
  }, [onChange])

  const formatValue = useMemo(() => {
    if(value){
      return value.filter(V => !!itemMap[V.id]).map(V => ({
        "id": V.id,
        "name": itemMap[V.id].getModel().label
      }))
    }
    return []
  },[value, itemMap])
  
  const showValue = useMemo(() => {
    if (Array.isArray(value)) {
      return '[' + value.filter(V => !!itemMap[V.id]).map(V => itemMap[V.id].getModel().label).join(',') + ']'
    }
    return '[]'
  }, [value, itemMap]);

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

export default withEditorContext(SelectorFormItem);