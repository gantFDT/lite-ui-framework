import React, { useState, useMemo, useCallback, useEffect } from 'react'
import { BlockHeader } from 'gantd'
import { Radio, InputNumber, Select } from 'antd'
const { Option } = Select;
const times = 60;

function MinutesCard({ originData, dispatch }: any) {

  const [minutesStart, setMinutesStart] = useState(0)
  const [minutesEnd, setMinutesEnd] = useState(1)
  const [minutesSelect, setMinutesSelect] = useState([])
  const [minsChecked, setMinsChecked] = useState('minsRange')

  useEffect(() => {
    if (!originData) return;
    if (originData.indexOf('/') > -1) {
      setMinsChecked('minsRange')
      let temp = originData.split('/')
      let start = temp[0];
      let end = temp[1];
      setMinutesStart(start)
      setMinutesEnd(end)
    } else {
      setMinsChecked('minsSelect')
      let tempArr = originData.split(',')
      setMinutesSelect(tempArr)
    }
  }, [originData])

  const getSelectedVal = useCallback(() => {
    if (!minutesSelect.length) return '';
    return minutesSelect.join(',');
  }, [minutesSelect])

  const onChangeRangesMin = useCallback((isStart, num) => {
    isStart ? setMinutesStart(num) : setMinutesEnd(num);
    dispatch({ type: 'save', payload: { mins: isStart ? `${num}/${minutesEnd}` : `${minutesStart}/${num}` } })
  }, [minutesStart, minutesEnd])

  const handleChangeMinsSelect = useCallback((value) => {
    setMinutesSelect(value)
    dispatch({ type: 'save', payload: { mins: value.join(',') } })
  }, [setMinutesSelect])

  const minsRadioChecked = useCallback((e) => {
    let value = e.target.value;
    setMinsChecked(value)
    let mins = value === "minsSelect" ? getSelectedVal() : `${minutesStart}/${minutesEnd}`;
    dispatch({ type: 'save', payload: { mins } })
  }, [minsChecked, minutesStart, minutesEnd, getSelectedVal])

  const isRangeChecked = useMemo(() => minsChecked === 'minsRange', [minsChecked])

  const minsSelectlist = useMemo(() => {
    let list = []
    for (let i = 0; i < times; i++) {
      list.push(<Option key={i}>{i}</Option>)
    }
    return list
  }, [times])

  return (
    <div style={{ width: '100%' }}>
      <BlockHeader type='line' title={tr('分')} />
      <Radio.Group
        value={minsChecked}
        onChange={minsRadioChecked}
      >
        <Radio
          style={{ display: 'block' }}
          value={'minsRange'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('周期')}</span>
          <span>{tr('从')}</span>
          <InputNumber
            min={0}
            max={59}
            disabled={!isRangeChecked}
            value={minutesStart}
            defaultValue={minutesStart}
            onChange={onChangeRangesMin.bind(null, true)}
            className="marginh10"
          />
          <span>{tr('分开始')},{tr('每')}</span>
          <InputNumber
            min={0}
            max={59}
            disabled={!isRangeChecked}
            value={minutesEnd}
            defaultValue={minutesEnd}
            onChange={onChangeRangesMin.bind(null, false)}
            className="marginh10"
          />
          <span>{tr('分钟执行一次')}</span>
        </Radio>
        <Radio
          style={{ display: 'block', marginTop: 10 }}
          value={'minsSelect'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('指定')}</span>
          <Select
            mode="multiple"
            style={{ width: 380 }}
            disabled={isRangeChecked}
            value={minutesSelect}
            defaultValue={minutesSelect}
            onChange={handleChangeMinsSelect}
          >
            {minsSelectlist}
          </Select>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default React.memo(MinutesCard)
