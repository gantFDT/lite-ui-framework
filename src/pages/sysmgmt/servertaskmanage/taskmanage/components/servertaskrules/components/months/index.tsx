import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { BlockHeader } from 'gantd'
import { Radio, Select } from 'antd'
const { Option } = Select;
const times = 13;

function MonthsCard({ originData, dispatch }: any) {

  const [monthsChecked, setMonthsChecked] = useState('monthsRange')
  const [monthsSelect, setMonthsSelect] = useState([])

  useEffect(() => {
    if (!originData) return;
    if (originData.indexOf('*') > -1) {
      setMonthsChecked('monthsRange')
    } else {
      setMonthsChecked('monthsSelect')
      let tempArr = originData.split(',')
      setMonthsSelect(tempArr)
    }
  }, [originData])

  const getSelectedVal = useCallback(() => {
    if (!monthsSelect.length) return '';
    return monthsSelect.join(',');
  }, [monthsSelect])

  const handleChangeMonthsSelect = useCallback((value) => {
    setMonthsSelect(value)
    dispatch({ type: 'save', payload: { months: value.join(',') } })
  }, [])

  const monthsRadioChecked = useCallback((e) => {
    let value = e.target.value;
    setMonthsChecked(value)
    let months = value === "monthsSelect" ? getSelectedVal() : '*';
    dispatch({ type: 'save', payload: { months } })
  }, [getSelectedVal])

  const isRangeChecked = useMemo(() => monthsChecked === 'monthsRange', [monthsChecked])

  const monthsSelectlist = useMemo(() => {
    let list = []
    for (let i = 1; i < times; i++) {
      list.push(<Option key={i}>{i}</Option>)
    }
    return list
  }, [times])

  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      <BlockHeader type='line' title={tr('月')} />
      <Radio.Group
        value={monthsChecked}
        onChange={monthsRadioChecked}
      >
        <Radio
          style={{ display: 'block' }}
          value={'monthsRange'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('每月')}</span>
        </Radio>
        <Radio
          style={{ display: 'block', marginTop: 10 }}
          value={'monthsSelect'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('指定')}</span>
          <Select
            mode="multiple"
            style={{ width: 380 }}
            disabled={isRangeChecked}
            defaultValue={monthsSelect}
            value={monthsSelect}
            onChange={handleChangeMonthsSelect}
          >
            {monthsSelectlist}
          </Select>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default React.memo(MonthsCard)
