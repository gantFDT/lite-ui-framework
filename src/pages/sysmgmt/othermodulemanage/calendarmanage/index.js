import React, { Component } from 'react';
import { connect } from 'dva';
import { Card } from 'gantd'
import moment from 'moment'

import { Dropdown, Menu, Popover, Modal, Button, Row, Col, Select, Calendar, Tooltip, Icon, Empty } from 'antd';

import classnames from 'classnames'
import NoteModal from './NoteModal'
import CalculateDatesModal from './CalculateDatesModal'
import CalRetModal from './CalRetModal'
import styles from './index.less'
import { Title, tr } from '@/components/common';
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

const monthParams = (() => {
  const monthFilter = {}
  for (let i = 1; i < 13; i++) {
    monthFilter[`month${i}`] = [];
  }
  return monthFilter
})

@connect(({ calendarmanage, settings, loading }) => ({
  ...calendarmanage,
  ...settings,
  loading: loading.effects['calendarmanage/getMarkDate'],
}))
class WorkCalendar extends Component {
  state = {
    monthFilter: monthParams(),
    value: moment().format("YYYY"),
  }

  monthsFilter = (markData) => {
    const _monthFilter = monthParams()

    for (let m = 1; m < 13; m++) {
      markData.forEach(month => {
        const dataMonth = month.markDate.split(' ')[0].split('-')[1] * 1
        if (dataMonth == m) {
          const hasData = _monthFilter[`month${m}`].find(mon => mon.id == month.id)
          hasData ? null : _monthFilter[`month${m}`].push(month)
        }
      })
    }
    const newMonths = _.cloneDeep(_monthFilter)
    this.setState({
      monthFilter: newMonths
    })
  }

  componentDidMount() {
    this.getMarkData()
  }

  // 获取当前年的
  getMarkData = (payload) => {
    const { dispatch, currentYear: year } = this.props
    dispatch({
      type: 'calendarmanage/getMarkDate',
      payload: payload || {
        endDate: `${year}-12-31`,
        startDate: `${year}-01-01`
      }
    })
  }

  componentWillReceiveProps(nextProps) {
    const { markData } = nextProps
    this.monthsFilter(markData)
    // const { calStartDate, calEndDate, calculateDays: { totalDays, workingDays, unworkingDays } } = nextProps
    // if (calStartDate) {
    //   Modal.info({
    //     title: tr('信息'),
    //     content: (<div>
    //       <p>{tr(`从${calStartDate}至${calEndDate}`)}</p>
    //       <p>{tr(`总天数：${totalDays}`)}</p>
    //       <p>{tr(`工作日天数：${workingDays}`)}</p>
    //       <p>{tr(`非工作日天数：${unworkingDays}`)}</p>
    //     </div>),
    //     onOk() { }
    //   });
    // }


  }

  // 弹框回调
  noteChange = (value) => {
    this.props.dispatch({
      type: 'calendarmanage/save',
      payload: {
        visible: false
      }
    })
    if (!value) return;
    const { dispatch, cellType, cellValue, markType } = this.props
    const { note } = value

    if (!markType) {
      dispatch({
        type: 'calendarmanage/setMarkDate',
        payload: {
          date: cellValue,
          note: note || '',
          type: cellType === 'isHoliday' ? "1" : "0"
        }
      })
    } else {
      dispatch({
        type: 'calendarmanage/unsetMarkDate',
        payload: {
          date: cellValue
        }
      })
    }

  }

  // 月份的某一天点击
  dateCellClick = ({ type, _value, markType }) => {
    const { dispatch } = this.props
    dispatch({
      type: 'calendarmanage/save',
      payload: {
        visible: true,
        cellType: type,
        cellValue: _value,
        markType
      }
    })

  }

  // 获取月 里面的天 单元格list
  getListData = (value, currentDate) => {
    const date = value.date()
    const { markData } = this.props
    const listData = []
    const _value = value.format('YYYY-MM-DD')
    const _key = _value + currentDate.month()
    let isHoliday = false
    // 已设置为休息日
    const markDataFilter = markData.find(date => {
      return date.markDate.split(' ')[0] === _value
    })
    let markNote = ''
    let markType = ''
    if (markDataFilter) {
      markNote = markDataFilter ? markDataFilter.markNote : ''
      markType = markDataFilter ? markDataFilter.markType : ''
    }
    // 星期几
    switch (value.weekday()) {
      case 0:
        isHoliday = !!(markDataFilter && markDataFilter.markType == 0)
        break;
      case 1:
        isHoliday = !!(markDataFilter && markDataFilter.markType == 0)
        break;
      case 2:
        isHoliday = !!(markDataFilter && markDataFilter.markType == 0)
        break;
      case 3:
        isHoliday = !!(markDataFilter && markDataFilter.markType == 0)
        break;
      case 4:
        isHoliday = !!(markDataFilter && markDataFilter.markType == 0)
        break;
      case 5:
        isHoliday = !(markDataFilter && markDataFilter.markType == 1)
        break;
      case 6:
        isHoliday = !(markDataFilter && markDataFilter.markType == 1)
        break;

      default:
        break;
    }

    const type = isHoliday ? 'isHoliday' : 'unHoliday'
    const iconStyle = isHoliday ? { color: "red", textAlign: 'center' } : { color: "#000", textAlign: 'center' }
    listData.push((

      <div
        key={_key}
        style={iconStyle}
      >
        <Popover
          placement="right"
          content={
            (<div
              onClick={this.dateCellClick.bind(this, { type, _value, markType })}
            >
              {isHoliday ? tr("设置为工作日") : tr("设置为休息日")}
             </div>)
          }
        >
          {
            markNote ?
              <Tooltip title={tr(markNote)}>
                {currentDate.month() != value.month() ? null : date}
              </Tooltip> : <span>{currentDate.month() != value.month() ? null : date}</span>
          }
        </Popover>

      </div>
    ))
    return listData || [];
  }

  // 渲染月份里面的天单元格
  dateCellRender = (value, currentDate) => {
    const listData = this.getListData(value, currentDate);
    return (
      <div>
        {listData.map(item => item)}
      </div>
    );
  }

  // 每个月的头部渲染
  monthCellHeaderRender = (value) => {
    const month = value.month() + 1;
    return (
      <div className={styles.monthCell}>
        {month < 10 ? tr(`0${month}`) : tr(`${month}`)}
      </div>
    );
  }

  // 处理月的数据
  getMonthData = (value) => {
    const monthList = []
    const _m = value.month() + 1
    const s = new Date()
    const _key = value.format('YYYY-MM-DD') + s.getMilliseconds()
    monthList.push(
      <div key={_key}>
        <Calendar
          className={styles.claHead}
          align='center'
          key={_key}
          mode='month'
          value={value}
          dateFullCellRender={(date) => this.dateCellRender(date, value)}
          headerRender={() => this.monthCellHeaderRender(value)}
        />
      </div>
    )
    return monthList || []
  }

  // 渲染年 里面的月单元格
  monthCellRender = (value) => {
    const mList = this.getMonthData(value);
    return (
      <Card style={{ margin: '0 5px 5px 0' }}>
        {mList.map(item => item)}
      </Card>
    )
  }

  // 切换年份
  onPanelChange = (_year, newYear) => {
    const year = newYear == 'year' ? _year.format('YYYY') : _year
    this.setState({
      value: moment(year, 'YYYY').toDate(),
    });
    const { dispatch } = this.props
    const payload = {
      endDate: `${year}-12-31`,
      startDate: `${year}-01-01`
    }
    this.getMarkData(payload)
    dispatch({
      type: 'calendarmanage/save',
      payload: {
        currentYear: year
      }
    })
  }



  // 页面外围最大的panel 的header
  pageHeaderRender = () => {
    const { value } = this.state;
    const { dispatch, currentYear: year, route } = this.props

    const yearOptions = [];
    for (let i = year - 5; i < year + 5; i += 1) {
      yearOptions.push(
        <Menu.Item
          key={i}
          value={i}
          onClick={() => this.onPanelChange(i, i)}
        >
          {i}
        </Menu.Item>,
      );
    }

    return (
      <Card
        title={<Title route={route} />}
        extra={
          <Row type="flex" justify="start">
            <Col style={{ padding: '0 20px 0 0' }}>
              <Button.Group size="small">
                <Button icon="left" onClick={() => this.onPanelChange(year - 1, year - 1)} />
                <Dropdown
                  overlay={
                    <Menu
                      size="small"
                    >
                      {yearOptions}
                    </Menu>
                  }
                >
                  <Button onClick={e => { e.preventDefault() }}>
                    {String(year)}<Icon type="down" />
                  </Button>
                </Dropdown>

                <Button icon="right" onClick={() => this.onPanelChange(year + 1, year + 1)} />
              </Button.Group>
            </Col>
            <Col style={{ padding: '0 20px 0 0' }}>
              <Button size="small" onClick={() => this.props.dispatch({ type: 'calendarmanage/save', payload: { calcVisible: true } })}>{tr('计算日期')}</Button>
            </Col>
          </Row>
        }
        className="specialCardHeader"
        bodyStyle={{
          padding: '0',
        }}
      />
    )
  }

  // 计算日期
  calChange = (dates) => {
    this.props.dispatch({
      type: 'calendarmanage/calculateDays',
      payload: {
        ...dates
      }
    })

  }

  // 计算日期
  calCancel = () => {
    this.props.dispatch({
      type: 'calendarmanage/save',
      payload: {
        calculateDays: {},
        calStartDate: '',
        calEndDate: '',
        calcVisible: false
      }
    })

  }

  render() {
    const {
      visible,
      MAIN_CONFIG,
      route,
      calcVisible,
      calretVisible,
      dispatch,
      currentYear: year,
    } = this.props

    const { value } = this.state
    const bodyHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)



    const yearOptions = [];
    for (let i = year - 5; i < year + 5; i += 1) {
      yearOptions.push(
        <Menu.Item
          key={i}
          value={i}
          onClick={() => this.onPanelChange(i, i)}
        >
          {i}
        </Menu.Item>,
      );
    }
    return (
      <Card
        title={<Title route={route} />}
        extra={<>
          <Button.Group size="small" className='marginh5'>
            <Button icon="left" onClick={() => this.onPanelChange(year - 1, year - 1)} />
            <Dropdown
              overlay={
                <Menu
                  size="small"
                >
                  {yearOptions}
                </Menu>
              }
            >
              <Button onClick={e => { e.preventDefault() }}>
                {String(year)}<Icon type="down" />
              </Button>
            </Dropdown>

            <Button icon="right" onClick={() => this.onPanelChange(year + 1, year + 1)} />
          </Button.Group>
          <Button className='marginh5' size="small" onClick={() => this.props.dispatch({ type: 'calendarmanage/save', payload: { calcVisible: true } })}>{tr('计算日期')}</Button>
               </>
        }
        className={classnames(styles.page, "specialCardHeader")}
        bodyStyle={{
          padding: '0',
        }}
      >
        <CalculateDatesModal
          visible={calcVisible}
          calChange={this.calChange}
          calCancel={this.calCancel}
        />
        <NoteModal
          noteChange={this.noteChange}
          visible={visible}
        />
        <CalRetModal />
        <div style={{ background: '#fff', height: bodyHeight, overflowY: 'auto' }}>
          <Calendar
            mode='year'
            value={moment(value)}
            // headerRender={() => this.pageHeaderRender()}
            headerRender={false}
            className={styles.calenderMan}
            onPanelChange={this.onPanelChange}
            monthFullCellRender={this.monthCellRender}
          />
        </div>
      </Card>
    );
  }
}

export default WorkCalendar;
