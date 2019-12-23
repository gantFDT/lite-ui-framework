import React, { memo, useReducer, useCallback, useEffect } from 'react'
import { SmartModal } from '@/components/specific'
import { message } from 'antd'
import Minutes from './components/minutes'
import Hours from './components/hours'
import Days from './components/days'
import Months from './components/months'
import Weeks from './components/weeks'

const warnTexts = {
  mins: tr('请指定分'),
  hours: tr('请指定时'),
  days: tr('请指定日'),
  months: tr('请指定月'),
  weeks: tr('请指定周'),
}

function reducers(state: any, action: any) {
  const { type, payload } = action
  switch (type) {
    case "save":
      return { ...state, ...payload }
    case "reset":
      return { ...initalState }
  }
}

const initalState = {
  mins: '0/1',
  hours: '*',
  days: '*',
  months: '*',
  weeks: '?',
  weeksCheckbox: false,
}

function RulesModal(props: any) {
  const {
    visible,
    originValue,
    onCancel,
    onOk
  } = props;

  const [state, dispatch] = useReducer(reducers, initalState)
  const { mins, hours, days, weeks, months, weeksCheckbox } = state;

  useEffect(() => {
    visible && init()
  }, [visible])

  const init = useCallback(() => {
    if (!originValue) return;
    let arr = originValue.split(' ');
    if (arr.length) {
      dispatch({
        type: 'save',
        payload: {
          mins: arr[1],
          hours: arr[2],
          days: arr[3],
          months: arr[4],
          weeks: arr[5],
          weeksCheckbox: arr[5] !== '?',
        }
      })
    }
  }, [originValue])

  const handlerCancel = useCallback(() => {
    onCancel && onCancel()
  }, [onCancel])

  const handlerOk = useCallback(() => {
    let resDateStr = '';
    let allTypes = { mins, hours, days, weeks, months };
    for (let key in allTypes) {
      if (!allTypes[key]) {
        message.warn(warnTexts[key])
        return
      }
    }
    if (!weeksCheckbox) {
      let _days = days === '?' ? '*' : days;
      resDateStr = `0 ${mins} ${hours} ${_days} ${months} ?`
    } else {
      let _weeks = weeks === '?' ? '*' : weeks;
      resDateStr = `0 ${mins} ${hours} ? ${months} ${_weeks}`
    }
    onOk && onOk(resDateStr)
  }, [onOk, mins, hours, days, weeks, months, weeksCheckbox])

  return (
    <SmartModal
      id='rulesModal'
      title={tr('定时规则编辑器')}
      visible={visible}
      onCancel={handlerCancel}
      onOk={handlerOk}
      resizable={false}
      itemState={{ height: 720 }}
    >
      <Minutes originData={mins} dispatch={dispatch} />
      <Hours originData={hours} dispatch={dispatch} />
      <Days originData={days} dispatch={dispatch} weeksCheckbox={weeksCheckbox} />
      <Months originData={months} dispatch={dispatch} />
      <Weeks originData={weeks} dispatch={dispatch} weeksCheckbox={weeksCheckbox} />
    </SmartModal>
  )
}

export default memo(RulesModal)