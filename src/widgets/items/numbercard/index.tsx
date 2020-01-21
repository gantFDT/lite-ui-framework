import React, { useState, useEffect, useCallback, useMemo, useReducer } from 'react'
import { Row, Col, Tooltip, Dropdown, Menu } from 'antd';
import styles from './index.less'
import moment from 'moment'
import { Icon } from 'gantd'
import classnames from 'classnames'
import SnapShot from './snapshot.png'
import { ConfigBar, ConfigWrap, registerModel } from '@/widgets/utils'
import numeral from 'numeral';
import { fetchApi, updateApi } from './service';
import { reducer } from '@/utils/utils'
import ConfigPanel from './ConfigPanel'

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

const menu = (
  <Menu>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.alipay.com/">
        1st menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.taobao.com/">
        2nd menu item
      </a>
    </Menu.Item>
    <Menu.Item>
      <a target="_blank" rel="noopener noreferrer" href="http://www.tmall.com/">
        3rd menu item
      </a>
    </Menu.Item>
  </Menu>
);

const Widget = (props: any) => {
  const number = Math.ceil(Math.random() * 10000);
  const {
    itemHeight, editMode, widgetKey, handleDeleteWidget
  } = props;
  const [loading, setLoading] = useState(false)
  const [configVisible, setConfigVisible] = useState(false)
  const [state, dispatch] = useReducer(reducer, {
    title: '标题',
    icon: 'alipay',
    backgroundImage: 'linear-gradient(to right, #fff 0%, #fff 100%)'
  })

  const {
    title,
    icon,
    backgroundImage
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
  const update = useCallback(async (payload: any, callback: Function = () => setConfigVisible(false)) => {
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
    return <>
      <div className={styles.top}>
        <div className={styles.title}>
          {title}
        </div>


        <Dropdown overlay={menu} placement="bottomRight" trigger={['click']}>
          <div className={styles.icon}>
            <Icon type='more' />
          </div>
        </Dropdown>
      </div>
      <div className={styles.bottom}>
        <div className={classnames('omit-1', styles.number)}>
          {number}
        </div>
        <div className={styles.icon}>
          <Icon type={icon} />
        </div>
      </div>
    </>
  }, [title, icon, number])

  return (
    <div
      className={classnames('full', styles.Widget)}
      style={{ backgroundImage }}
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
