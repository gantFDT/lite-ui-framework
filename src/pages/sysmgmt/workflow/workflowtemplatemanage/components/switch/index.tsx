import React from 'react'
import { Switch as AntSwitch } from 'antd'

export default (props: any) => {
  const {
    value,
    ...resProps
  } = props
  return (<AntSwitch checked={value} {...resProps} />)
}
