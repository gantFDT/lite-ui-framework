import React, { useEffect, useMemo } from 'react'
import { Row, Col, Tooltip, Button } from 'antd'
import { Table, BlockHeader, Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { getContentHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, TABLE_TITLE_HEIGHT } from '@/utils/utils'
import { EventClass } from './model'

const LEFT_SPAN = 10
const RIGHT_SPAN = 14

/**
 * 平台管理-业务事件
 */
export default connect(({ settings, eventManage, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  eventClasses: eventManage.eventClasses,
  eventClassesLoading: loading.effects['eventManage/getEventClasses'],
  selectedEventClassKeys: eventManage.selectedEventClassKeys,
  classEvents: eventManage.classEvents,
  classEventLoading: loading.effects['eventManage/getClassEvents'],
  selectedClassEventKeys: eventManage.selectedClassEventKeys,
  eventListners: eventManage.eventListners,
  eventListnerLoading: loading.effects['eventManage/getEventListners']
}))((props: any) => {
  const { MAIN_CONFIG,
    dispatch,
    eventClasses,
    eventClassesLoading,
    selectedEventClassKeys,
    classEvents,
    classEventLoading,
    selectedClassEventKeys,
    eventListners,
    eventListnerLoading,
    route
  } = props

  const eventClassTableHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + TABLE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT + 2 * CARD_BORDER_HEIGHT)
  const commonHeight = useMemo(() => {
    const tempHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + 2 * TABLE_TITLE_HEIGHT + 2 * TABLE_HEADER_HEIGHT + 8 * CARD_BORDER_HEIGHT)
    return `calc(${tempHeight} / 2)`
  }, [MAIN_CONFIG])

  // 获取事件对象列表
  const getEventClasses = () => {
    dispatch({ type: 'eventManage/getEventClasses' })
  }

  useEffect(() => {
    if (eventClasses.length > 0) return
    getEventClasses()
  }, [])

  const onEventClassTableSelectChange = (selectedRowKeys: string[]) => {
    if (selectedRowKeys.length === 0) return
    dispatch({
      type: 'eventManage/getClassEvents',
      payload: { beanName: selectedRowKeys[0] }
    })
  }

  const onClassEventTableSelectChange = (selectedRowKeys: string[]) => {
    if (selectedRowKeys.length === 0) return
    dispatch({
      type: 'eventManage/getEventListners',
      payload: { eventName: selectedRowKeys[0] }
    })
  }

  return (
    <Card
      title={<Title route={route} />}
      bodyStyle={{ padding: '10px' }}
      className='specialCardHeader'
      extra={(
        <Tooltip title={tr('刷新')}>
          <Button loading={eventClassesLoading} size='small' icon='reload' onClick={getEventClasses} />
        </Tooltip>
      )}
    >
      <Row gutter={10}>
        <Col span={LEFT_SPAN}>
          <BlockHeader
            type='line'
            title={tr('事件对象列表')}
          />
          <Table
            rowKey='beanName'
            loading={eventClassesLoading}
            dataSource={eventClasses}
            columns={EventClassColumns}
            scroll={{ y: eventClassTableHeight }}
            rowSelection={{
              clickable: true,
              type: 'radio',
              selectedRowKeys: selectedEventClassKeys,
              onChange: onEventClassTableSelectChange
            }}
          />
        </Col>
        <Col span={RIGHT_SPAN}>
          <BlockHeader
            type='line'
            title={tr('发起事件列表')}
          />
          <Table
            rowKey='eventName'
            loading={classEventLoading}
            dataSource={classEvents}
            columns={ClassEventColumns}
            scroll={{ y: commonHeight }}
            rowSelection={{
              clickable: true,
              type: 'radio',
              selectedRowKeys: selectedClassEventKeys,
              onChange: onClassEventTableSelectChange
            }}
            emptyDescription={tr('请先选择事件对象')}
          />
          <div style={{ height: '10px' }} />
          <BlockHeader
            type='line'
            title={tr('事件监听列表')}
          />
          <Table
            rowKey='listenerName'
            loading={eventListnerLoading}
            dataSource={eventListners}
            columns={EventListnerColumns}
            scroll={{ y: commonHeight }}
            emptyDescription={tr('请先选择发起事件')}
          />
        </Col>
      </Row>
    </Card>
  )
})

const EventClassColumns = [
  {
    title: 'className & beanName',
    dataIndex: 'beanName',
    render: (text: string, eventClass: EventClass) => {
      const { beanName, className } = eventClass
      return (
        <>
          <div>
            <strong>ClassName:&nbsp;</strong>
            <Tooltip title={className}>{className}</Tooltip>
          </div>
          <div>
            <strong>BeanName:&nbsp;</strong>
            <Tooltip title={beanName}>{beanName}</Tooltip>
          </div>
        </>
      )
    }
  }
]

const TextRender = (value: string | string[]) => <Tooltip title={value}><span>{Array.isArray(value) ? value.join(',') : value}</span></Tooltip>

const ClassEventColumns = [
  {
    title: 'eventName',
    dataIndex: 'eventName',
    width: 200,
    render: TextRender
  },
  {
    title: 'beforeArgs',
    dataIndex: 'beforeArgs',
    width: 450,
    render: TextRender
  },
  {
    title: 'afterArgs',
    dataIndex: 'afterArgs',
    width: 400,
    render: TextRender
  },
  {
    title: 'description',
    dataIndex: 'description',
    width: 300,
    render: TextRender
  }
]

const EventListnerColumns = [
  {
    title: 'listenerName',
    dataIndex: 'listenerName',
    width: 600,
    render: TextRender
  },
  {
    title: 'after',
    dataIndex: 'after',
    width: 50,
    render: (value: boolean) => <span>{`${value}`}</span>
  },
  {
    title: 'description',
    dataIndex: 'description',
    width: 300,
    render: TextRender
  },
  {
    title: 'enabled',
    dataIndex: 'enabled',
    width: 70,
    render: (value: boolean) => <span>{`${value}`}</span>
  }
]
