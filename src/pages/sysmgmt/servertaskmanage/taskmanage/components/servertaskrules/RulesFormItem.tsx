import React, { useState, useCallback, useEffect } from 'react'
import { Input, Icon } from 'antd'
import RulesModal from './RulesModal'
import styles from '../../index.less'


const RulesFormItem = (props: any) => {
  const {
    onChange,
    value
  } = props;

  const [visible, setVisible] = useState(false)
  const [rulesValue, setRulesValue] = useState('0 0/1 * * * ?')

  useEffect(() => {
    if (value) {
      setRulesValue(value)
    } else {
      setRulesValue('0 0/1 * * * ?')
      onChange && onChange('0 0/1 * * * ?')
    }
  }, [value])

  const handlerRulesModel = useCallback((ret) => {
    setVisible(true)
  }, [])

  const handlerChange = useCallback((ret) => {
    onChange && onChange(ret)
    setVisible(false)
    setRulesValue(ret)
  }, [])

  const onCancel = useCallback(() => {
    setVisible(false)
  },[])

  return (
    <div>
      <Input
        className={styles.AddonAfterInput}
        readOnly
        value={rulesValue}
        addonAfter={<Icon type="form" onClick={handlerRulesModel} />}
        defaultValue={rulesValue}
      />
      <RulesModal
        onCancel={onCancel}
        originValue={rulesValue}
        onOk={handlerChange}
        visible={visible}
      />
    </div>
  )
}

export default RulesFormItem