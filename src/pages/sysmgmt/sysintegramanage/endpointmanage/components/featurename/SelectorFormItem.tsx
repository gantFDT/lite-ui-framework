import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react'
import { Select } from 'antd'
import { connect } from 'dva'
const { Option } = Select;

const SelectorFormItem = (props: any) => {
  const {
    listFeatureNameselector,
    onChange,
    value,
    listFeatureName,
    endpointId, systemId
  } = props;

  console.log('listFeatureNameselector',listFeatureNameselector)
  useEffect(() => { listFeatureName({ endpointId, systemId }) }, [])

  const handleFilterSelectorChange = useCallback((val) => {
    const feature = listFeatureNameselector.find((item: { code: string }) => item.code === val)
    if (feature && onChange) {
      onChange({
        value: val,
        name: feature.name,
        businessCode: feature.businessCode
      })
    }
  }, [listFeatureNameselector])

  const selectValue = useMemo(() => value && value.value, [value])

  const menuList = useMemo(() => {
    return (
      <Select placeholder={tr('请选择')} style={{ width: '100%' }} onChange={handleFilterSelectorChange} value={selectValue}>
        {
          listFeatureNameselector.map((item: { code: string, name: string }) => {
            return (
              <Option value={item.code} key={item.code} style={{ width: '100%' }}>{item.name}</Option>
            )
          })
        }
      </Select>
    )
  }, [listFeatureNameselector, selectValue])


  return (
    <div>
      {menuList}
    </div>
  )
}

export default connect(
  ({ servermgt }: any) => ({
    listFeatureNameselector: servermgt.listFeatureNameselector
  }),
  (dispatch: Dispatch<any>) => ({
    listFeatureName: (payload: any) => dispatch({ type: 'servermgt/listFeatureName', payload })
  })
)(SelectorFormItem);