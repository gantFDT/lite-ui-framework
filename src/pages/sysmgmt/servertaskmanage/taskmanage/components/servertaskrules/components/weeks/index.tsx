import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { BlockHeader } from 'gantd'
import { Radio, Select, Checkbox, Alert } from 'antd'
const { Option } = Select;

const weeks = [
  tr('星期日'),
  tr('星期一'),
  tr('星期二'),
  tr('星期三'),
  tr('星期四'),
  tr('星期五'),
  tr('星期六'),
];

function WeeksCard({ originData, weeksCheckbox, dispatch }: any) {

  const [weeksChecked, setWeeksChecked] = useState('weeksRange')
  const [weeksSelect, setWeeksSelect] = useState([])

  useEffect(() => {
    if (!originData) return;
    if (originData.indexOf('*') > -1 || originData.indexOf('?') > -1) {
      setWeeksChecked('weeksRange')
    } else {
      setWeeksChecked('weeksSelect')
      let tempArr = originData.split(',')
      setWeeksSelect(tempArr)
    }
  }, [originData])

  const onCheckboxChange = useCallback((e) => {
    let checked = e.target.checked;
    dispatch({ type: 'save', payload: { weeksCheckbox: checked } })
  }, [])

  const handleChangeWeeksSelect = useCallback((value) => {
    setWeeksSelect(value)
    dispatch({ type: 'save', payload: { weeks: value.join(',') } })
  }, [])

  const getSelectedVal = useCallback(() => {
    if (!weeksSelect.length) return '';
    return weeksSelect.join(',');
  }, [weeksSelect])

  const weeksRadioChecked = useCallback((e) => {
    let value = e.target.value;
    setWeeksChecked(value)
    let weeks = value === "weeksSelect" ? getSelectedVal() : '*';
    dispatch({ type: 'save', payload: { weeks } })
  }, [weeksChecked])

  const isRangeChecked = useMemo(() => weeksChecked === 'weeksRange', [weeksChecked])

  return (
    <div style={{ width: '100%', marginTop: 10 }}>
      <BlockHeader
        type='line'
        title={<span>{tr('周')}</span>}
        extra={<Checkbox checked={weeksCheckbox} onChange={onCheckboxChange}>{tr("使用‘周’设置")}</Checkbox>}
      />
      <Alert message={tr("如果使用‘周’设置那么‘日’设置将失效")} type="info" showIcon />
      <Radio.Group
        value={weeksChecked}
        onChange={weeksRadioChecked}
      >
        <Radio
          style={{ display: 'block', marginTop: 10 }}
          value={'weeksRange'}
          disabled={!weeksCheckbox}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('每周')}</span>
        </Radio>
        <Radio
          style={{ display: 'block', marginTop: 10 }}
          disabled={!weeksCheckbox}
          value={'weeksSelect'}
        >
          <span style={{ display: 'inline-block', padding: '0 10px 0 0' }}>{tr('指定')}</span>
          <Select
            mode="multiple"
            style={{ width: 380 }}
            disabled={isRangeChecked}
            defaultValue={weeksSelect}
            value={weeksSelect}
            onChange={handleChangeWeeksSelect}
          >
            {weeks.map((item, key) => <Option key={key}>{item}</Option>)}
          </Select>
        </Radio>
      </Radio.Group>
    </div>
  )
}

export default React.memo(WeeksCard)
