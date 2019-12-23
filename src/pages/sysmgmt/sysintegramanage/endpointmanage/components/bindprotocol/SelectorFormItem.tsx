import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Select } from 'antd'
import { connect } from 'dva'
const { Option } = Select;

const BindProtocol = (props: any) => {
  const {
    listBindProtocolselector,
    onChange,
    value,
    listBindProtocol,
  } = props;
  const [defaultValue, setDefaultValue] = useState(value)

  useEffect(() => {
    let data = null
    if(Array.isArray(value)){
      data = value.map(name=>name.toString())
    }else{
      data = value&&value.toString()
    }

    setDefaultValue(data)
  } ,[value,setDefaultValue])



  useEffect(() => {
    listBindProtocol({ type: 'FW_INTEGRATION_ENDPOINT_TYPE' })
  }, [listBindProtocol])

  const handleFilterSelectorChange = useCallback((ret) => {
    setDefaultValue(ret)
    onChange && onChange(ret)
  }, [])

  const menuList = useMemo(() => {
    let bindProtocolSelectList = [...listBindProtocolselector]
    return (
      <Select
        defaultValue={defaultValue}
        style={{ width: '100%' }}
        onChange={handleFilterSelectorChange}>
        {
          bindProtocolSelectList.map((item) => {
            return (
              <Option value={item.value} key={item.id} style={{ width: '100%' }}>{item.name}</Option>
            )
          })
        }
      </Select>
    )
  }, [listBindProtocolselector])


  return (
    <div>
      {menuList}
    </div>
  )
}



export default connect(
  ({ servermgt }: any) => ({
    listBindProtocolselector: servermgt.listBindProtocolselector,
  }),
  (dispatch: Dispatch<any>) => ({
    listBindProtocol: (payload: any) => dispatch({ type: 'servermgt/listBindProtocol', payload })
  })
)(BindProtocol)