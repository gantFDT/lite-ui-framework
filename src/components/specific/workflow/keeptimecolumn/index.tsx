import React, { useCallback, useState, useEffect } from 'react'
import _ from 'lodash'
import { calculateWorkingTimesApi } from '../service'
import { getWorkflowConfig } from '../utils'

export interface KeepTimeColumnProps {
  startTime: string
  endTime: string
}

/**
 * 持续时间列组件
 */
export default (props: KeepTimeColumnProps) => {
  const {
    startTime,
    endTime,
  } = props
  const [time, setTime] = useState('')

  const calculateWorkingTimes = useCallback(async () => {
    const config = getWorkflowConfig()
    const { showWorkingKeepTime } = config
    let minutes = 0
    let workingTimes = 0
    let str = ''
    try {
      if (showWorkingKeepTime && startTime) {
        workingTimes = await calculateWorkingTimesApi(startTime, endTime)
      } else if (startTime) {
        let start = new Date(startTime).getTime()
        let end = new Date(endTime).getTime()
        workingTimes = end - start
      }
      minutes = Math.floor(workingTimes / (60 * 1000))

      if (minutes < 1) {
        str = tr('<1分钟');
      } else {
        if (minutes > 60) {
          var h = Math.floor(minutes / 60);
          var m = minutes % 60;
          str = h + tr('小时') + m +
            tr('分钟');
        } else {
          str = minutes + tr('分钟');
        }
      }
    } catch (error) {
      console.log('calculateWorkingTimes error\
      n', error)
    }
    setTime(str)
  }, [])

  useEffect(() => {
    if (endTime) {
      calculateWorkingTimes()
    }
  }, [])

  return (
    <span>{time}</span>
  )
}
