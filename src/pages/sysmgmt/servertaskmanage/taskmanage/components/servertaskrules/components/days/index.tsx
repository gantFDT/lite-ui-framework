import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Radio, Select } from 'antd'
import { BlockHeader } from 'gantd'
const { Option } = Select;
const times = 32;

function DaysCard({ weeksCheckbox, dispatch, originData }: any) {

  const [daysChecked, setDaysChecked] = useState('daysRange')
  const [daysSelect, setDaysSelect] = useState([])

  useEffect(() => {
    if (!originData) return;
    if (originData.indexOf('*') > -1 || originData.indexOf('?') > -1) {
      setDaysChecked('daysRange')
    } else {
      setDaysChecked('daysSelect')
      let tempArr = originData.split(',')
      setDaysSelect(tempArr)
    }
  }, [originData])

  const handleChangeDaysSelect = useCallback((value) => {
    setDaysSelect(value)
    dispatch({ type: 'save', payload: { days: value.join(',') } })
  }, [])

  const getSelectedVal = useCallback(() => {
    if (!daysSelect.length) return '';
    return daysSelect.join(',');
  }, [daysSelect])

  const daysRadioChecked = useCallback((e) => {
    let value = e.target.value;
    setDaysChecked(value)
    let days = value === "daysSelect" ? getSelectedVal() : '*';
    dispatch({ type: 'save', payload: { days } })
  }, [daysChecked])

  const isRangeChecked = useMemo(() => daysChecked === 'daysRange', [daysChecked])

  const daysSelectlist = useMemo(() => {
    let list = []
    for (let i = 1; i < times; i++) {
      list.push(<Option key={i}>{i}</Option>)
    }
    return list
  }, [times])

  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      <BlockHeader type='line' title={tr('日')} />
      <Radio.Group
        value={daysChecked}
        onChange={daysRadioChecked}
        style={{ display: 'block', width: '100%' }}
      >
        <Radio
          style={{ display: 'block', width: '100%' }}
          value={'daysRange'}
          disabled={weeksCheckbox}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('每日')}</span>
        </Radio>
        <Radio
          style={{ display: 'block', marginTop: 10, width: '100%' }}
          disabled={weeksCheckbox}
          value={'daysSelect'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('指定')}</span>
          <Select
            mode="multiple"
            style={{ width: 380 }}
            disabled={isRangeChecked}
            defaultValue={daysSelect}
            value={daysSelect}
            onChange={handleChangeDaysSelect}
          >
            {daysSelectlist}
          </Select>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default React.memo(DaysCard)
