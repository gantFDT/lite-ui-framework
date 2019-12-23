import React, { useState, useCallback, useEffect } from 'react'
import { Input, Icon } from 'antd'
import ParamsModal from './ParamsModal'
import styles from '../../index.less'

const ParamsFormItem = (props: any) => {
  const {
    onChange,
    value
  } = props;

  const [visible, setVisible] = useState(false)
  const [paramsValue, setParamsValue] = useState('')

  useEffect(() => {
    if (value) {
      setParamsValue(value)
    }
  }, [value])

  const handlerParamsModel = useCallback(() => {
    setVisible(true)
  }, [])

  const handlerChange = useCallback((ret) => {
    onChange && onChange(ret)
    setVisible(false)
    setParamsValue(ret)
  }, [])

  return (
    <div>
      <Input
        readOnly
        className={styles.AddonAfterInput}
        value={paramsValue}
        addonAfter={<Icon type="form" onClick={handlerParamsModel} />}
      />
      <ParamsModal
        onCancel={() => setVisible(false)}
        onOk={handlerChange}
        originValue={value}
        visible={visible}
      />
    </div>
  )
}

export default ParamsFormItem