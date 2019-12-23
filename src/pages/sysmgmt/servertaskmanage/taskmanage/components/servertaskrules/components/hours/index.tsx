import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { Radio, Select } from 'antd'
import { BlockHeader } from 'gantd'
const { Option } = Select;
const times = 24;

function HoursCard({ originData, dispatch }: any) {

  const [hoursChecked, setHoursChecked] = useState('hoursRange')
  const [hoursSelect, setHoursSelect] = useState([])

  useEffect(() => {
    if (!originData) return;
    if (originData.indexOf('*') > -1) {
      setHoursChecked('hoursRange')
    } else {
      setHoursChecked('hoursSelect')
      let tempArr = originData.split(',')
      setHoursSelect(tempArr)
    }
  }, [originData])

  const handleChangeHoursSelect = useCallback((value) => {
    setHoursSelect(value)
    dispatch({ type: 'save', payload: { hours: value.join(',') } })
  }, [])

  const getSelectedVal = useCallback(() => {
    if (!hoursSelect.length) return '';
    return hoursSelect.join(',');
  }, [hoursSelect])

  const hoursRadioChecked = useCallback((e) => {
    let value = e.target.value;
    setHoursChecked(value)
    let hours = value === "hoursSelect" ? getSelectedVal() : '*';
    dispatch({ type: 'save', payload: { hours } })
  }, [getSelectedVal])

  const isRangeChecked = useMemo(() => hoursChecked === 'hoursRange', [hoursChecked])

  const hoursSelectlist = useMemo(() => {
    let list = []
    for (let i = 0; i < times; i++) {
      list.push(<Option key={i}>{i}</Option>)
    }
    return list
  }, [times]
  )

  return (
    <div style={{ width: '100%' }}>
      <BlockHeader type='line' title={tr('时')} />
      <Radio.Group
        value={hoursChecked}
        onChange={hoursRadioChecked}
      >
        <Radio
          style={{ display: 'block' }}
          value={'hoursRange'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('每小时')}</span>
        </Radio>
        <Radio
          style={{ display: 'block', marginTop: 10 }}
          value={'hoursSelect'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('指定')}</span>
          <Select
            mode="multiple"
            style={{ width: 380 }}
            disabled={isRangeChecked}
            defaultValue={hoursSelect}
            value={hoursSelect}
            onChange={handleChangeHoursSelect}
          >
            {hoursSelectlist}
          </Select>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default React.memo(HoursCard)
