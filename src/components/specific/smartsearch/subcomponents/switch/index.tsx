import React, { useState, useEffect } from 'react'
import { Switch, Icon } from 'antd'

export default function CoustomSwitch(props: any) {

  const { value, onChange } = props;
  const [check, setCheck] = useState(value !== false)
  useEffect(() => {
    if (value === false) setCheck(false)
    else setCheck(true)
  }, [value])
  const switchChange = (checked: boolean) => {
    if (checked) return onChange(null);
    onChange(checked)
  }
  return (
    <div>
      <Switch
        checkedChildren={<Icon type="check" />}
        unCheckedChildren={<Icon type="close" />}
        onChange={switchChange}
        checked={check}
      />
    </div>
  )
}
