import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Select } from 'antd'
import { connect } from 'dva'
const { Option } = Select;

const SelectorFormItem = (props: any) => {
  const {
    listServerNameselector,
    onChange,
    listServerName,
  } = props;

  const [defaultValue,setDefaultValue] = useState(tr('请选择'))

  useEffect(() => { listServerName() }, [])

  const handleFilterSelectorChange = useCallback((ret) => {
    onChange && onChange(ret)
  },[])
  


  const menuList = useMemo(() => {
    let NameSelectList = [...listServerNameselector]
    return (
      <Select defaultValue={defaultValue} style={{ width: '100%' }} onChange={handleFilterSelectorChange}>
        {
          NameSelectList.map((item) => {
            return (
              <Option value={item.code} key={item.code} style={{ width: '100%' }}>{item.name}</Option>
            )
          })
        }
      </Select>
    )
  }, [listServerNameselector])


  return (
    <div>
      {menuList}
    </div>
  )
}

export default connect(
  ({ servermgt }: any) => ({
    listServerNameselector: servermgt.listServerNameselector
  }),
  (dispatch: Dispatch<any>) => ({
    listServerName: (payload: any) => dispatch({ type: 'servermgt/listServerName', payload })
  })
)(SelectorFormItem);