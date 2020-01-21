import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react'
import { Row, Col, Tooltip } from 'antd'
import styles from './index.less'
import ReactResizeDetector from 'react-resize-detector'
import moment from 'moment'
import { Icon } from 'gantd'
import classnames from 'classnames'
import SnapShot from './snapshot.png'
import ChartCard from './components/chartcard'


import numeral from 'numeral'
import { ConfigBar, ConfigWrap, registerModel } from '@/widgets/utils'
import ConfigPanel from './ConfigPanel'
import { reducer } from '@/utils/utils'
import { fetchApi, updateApi } from './service'
import Field from './components/field'

import { Pie, MiniBar, MiniArea, Trend, MiniProgress } from '@/components/chart'


export interface VisitDataType {
  x: string;
  y: number;
}
const visitData: VisitDataType[] = [];
const beginDay = new Date().getTime();

const fakeY = [7, 5, 4, 2, 4, 7, 5, 6, 5, 9, 6, 3, 1, 5, 3, 6, 5];
for (let i = 0; i < fakeY.length; i += 1) {
  visitData.push({
    x: moment(new Date(beginDay + 1000 * 60 * 60 * 24 * i)).format('YYYY-MM-DD'),
    y: fakeY[i],
  });
}

const modelRegisterKey = ''

const Widget = (props: any) => {
  const {
    itemHeight, editMode, widgetKey, handleDeleteWidget
  } = props;

  const [configVisible, setConfigVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useReducer(reducer, {
    type: 'area'
  })

  const {
    type
  } = state;

  //发起请求
  const fetch = useCallback(async () => {
    setLoading(true)
    const response = await fetchApi({ widgetKey });
    if (!response) {
      setLoading(false)
      return
    }
    const data = JSON.parse(response.bigData)
    dispatch({
      type: 'save',
      payload: {
        ...data
      }
    })
    setLoading(false)
  }, [widgetKey])



  //更新数据
  const update = useCallback(async (payload: any, callback: Function) => {
    setLoading(true)
    const { data } = payload;
    await updateApi({
      widgetKey,
      data
    });
    dispatch({
      type: 'save',
      payload: {
        ...data
      }
    })
    callback && callback()
    setLoading(false)
  }, [widgetKey])

  useEffect(() => {
    fetch()
  }, [])

  const getRender = useMemo(() => {
    const area = <ChartCard
      bordered={false}
      title={tr('访问量')}
      action={
        <Tooltip
          title={
            tr('介绍')
          }
        >
          <Icon type="info-circle" />
        </Tooltip>
      }
      total={numeral(8846).format('0,0')}
      footer={
        <Field
          label={
            tr('日访问量')
          }
          value={numeral(1234).format('0,0')}
        />
      }
      contentHeight={itemHeight - 135}
    >
      <MiniArea color="#975FE4" data={visitData} height={itemHeight - 135} />
    </ChartCard>


    const bar = <ChartCard
      bordered={false}
      title={tr('支付笔数')}
      action={
        <Tooltip
          title={
            tr('达标指数') + ':' + tr('今日支付笔数超过一万')
          }
        >
          <Icon type='info-circle' />
        </Tooltip>
      }
      total={numeral(6560).format('0,0')}
      footer={
        <Field
          label={
            tr('转化率')
          }
          value="60%"
        />
      }
      contentHeight={itemHeight - 135}
    >
      <MiniBar data={visitData} height={itemHeight - 135} />
    </ChartCard>

    const progress = <ChartCard
      bordered={false}
      title={
        tr('转化率')
      }
      action={
        <Tooltip
          title={
            tr('转化率')
          }
        >
          <Icon type='info-circle' />
        </Tooltip>
      }
      total="78%"
      footer={
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <Trend flag="up" style={{ marginRight: 16 }}>
            {tr('周同比')}
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            {tr('日同比')}
            <span className={styles.trendText}>11%</span>
          </Trend>
        </div>
      }
      contentHeight={itemHeight - 135}
    >
      <MiniProgress percent={78} strokeWidth={8} target={80} color="#13C2C2" />
    </ChartCard>

    const pie = <ChartCard
      bordered={false}
      title={
        tr('项目进度')
      }
      action={
        <Tooltip
          title={
            tr('项目进度')
          }
        >
          <Icon type='info-circle' />
        </Tooltip>
      }
      total="64%"
      footer={
        <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
          <Trend flag="up" style={{ marginRight: 16 }}>
            {tr('周同比')}
            <span className={styles.trendText}>12%</span>
          </Trend>
          <Trend flag="down">
            {tr('日同比')}
            <span className={styles.trendText}>11%</span>
          </Trend>
        </div>
      }
      contentHeight={itemHeight - 135}
    >
      <Pie
        animate={false}
        inner={0.55}
        tooltip={false}
        margin={[0, 0, 0, 0]}
        percent={0.64 * 100}
        height={itemHeight - 135}
      />
    </ChartCard>


    let result = <></>
    switch (type) {
      case 'area':
        result = area
        break;
      case 'bar':
        result = bar
        break;
      case 'progress':
        result = progress
        break;
      case 'pie':
        result = pie
        break;
      default:
        break;
    }
    return result
  }, [itemHeight, type])

  return (
    <div
      className={classnames('full', styles.Widget)}
    >

      {getRender}
      <ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} setVisible={setConfigVisible} />
      <ConfigWrap visible={configVisible} setVisible={setConfigVisible} widgetKey={widgetKey} width={400}>
        <ConfigPanel state={state} widgetKey={widgetKey} fetch={fetch} update={update} handleClose={() => { setConfigVisible(false) }} />
      </ConfigWrap>
    </div>
  )
}



export default Widget

export { SnapShot, modelRegisterKey }
