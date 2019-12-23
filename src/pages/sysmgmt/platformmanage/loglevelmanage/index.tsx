import React, { useEffect, useMemo, useCallback } from 'react'
import { Tooltip, Button, Select, Row, Col, Form } from 'antd'
import { BlockHeader, Table, Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { getContentHeight, CARD_BORDER_HEIGHT, TABLE_HEADER_HEIGHT, TABLE_TITLE_HEIGHT, BLOCK_HEADER_HEIGHT } from '@/utils/utils'
import { CurrentLog, Level, LEVELS, Appender, LevelType } from './model'
import LevelAdd from './LogLevelModal'
import styles from './index.less'

const { Option } = Select

const CurrentLogs = ['DEBUG', 'ORIGINAL']

/**
 * 平台管理-日志级别调整
 */
export default connect(({ settings, logLevelManage, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  currentLog: logLevelManage.currentLog,
  loggersInfo: logLevelManage.loggersInfo,
  tableEditStatus: logLevelManage.tableEditStatus,
  currentLogLoading: loading.effects['logLevelManage/getCurrentTargetDataSource'] || loading.effects['logLevelManage/changeCurrentTargetDataSource'],
  loggersInfoLoading: loading.effects['logLevelManage/getLoggersInfo'],
  setLoggerLevelLoading: loading.effects['logLevelManage/setLoggerLevel'],
  setAppenderFilterLevelLoading: loading.effects['logLevelManage/setAppenderFilterLevel']
}))((props: any) => {
  const {
    MAIN_CONFIG,
    dispatch,
    currentLog,
    loggersInfo,
    currentLogLoading,
    loggersInfoLoading,
    setLoggerLevelLoading,
    setAppenderFilterLevelLoading,
    tableEditStatus,
    route
  } = props

  const tableHeight = useMemo(() => {
    const tempHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + BLOCK_HEADER_HEIGHT + 42 + 2 * TABLE_TITLE_HEIGHT + 2 * TABLE_HEADER_HEIGHT + 3 * CARD_BORDER_HEIGHT)
    return `calc(${tempHeight} / 2)`
  }, [MAIN_CONFIG])
  const { levels, appenders } = loggersInfo

  const getData = (isFresh?: boolean) => {
    let addProps1 = {
      stateName: 'currentLog'
    }
    if (isFresh) {
      delete addProps1['stateName']
    }
    dispatch({
      type: 'logLevelManage/getCurrentTargetDataSource',
      ...addProps1
    })
    if (isFresh || appenders.length === 0 || levels.length === 0) {
      dispatch({
        type: 'logLevelManage/getLoggersInfo'
      })
    }
  }

  useEffect(() => {
    getData()
  }, [])

  const onCurrentLogChange = (value: CurrentLog) => {
    dispatch({
      type: 'logLevelManage/changeCurrentTargetDataSource',
      payload: {
        currentLog: value
      }
    })
  }

  const onAddLogLevelSubmit = (params: any, hideModal: Function) => {
    dispatch({
      type: 'logLevelManage/setLoggerLevel',
      payload: {
        level: params,
        type: 'add',
        hideModal
      }
    })
  }

  const onLogLevelChange = useCallback((name: string, value: LevelType, cb: () => void) => {
    dispatch({
      type: 'logLevelManage/setLoggerLevel',
      payload: {
        level: {
          name,
          level: value
        },
        type: 'update',
        callback: cb
      }
    })
  }, [])

  const showLoggerLevelColumns = useMemo(() => {
    return loggerLevelColumns.map((item: any) => {
      const { dataIndex } = item
      const newItem = { ...item }
      if (dataIndex === 'level') {
        newItem.editConfig = {
          render: (text: string, record: Level) => {
            return (
              <LevelSelect
                value={text}
                onChange={onLogLevelChange.bind(null, record.name)}
              />
            )
          }
        }
      }
      return newItem
    })
  }, [])

  const onAppenderLevelChange = useCallback((appender: Appender, value: LevelType, cb: () => void) => {
    dispatch({
      type: 'logLevelManage/setAppenderFilterLevel',
      payload: {
        appender: {
          ...appender,
          filterLevel: value
        },
      },
      callback: cb
    })
  }, [])

  const showAppenderColumns = useMemo(() => {
    return appenderColumns.map((item: any) => {
      const { dataIndex } = item
      const newItem = { ...item }
      if (dataIndex === 'filterLevel') {
        newItem.editConfig = {
          render: (text: string, record: Appender) => {
            return (
              <LevelSelect
                value={text}
                onChange={onAppenderLevelChange.bind(null, record)}
              />
            )
          }
        }
      }
      return newItem
    })
  }, [])

  return (
    <Card
      bodyStyle={{ padding: 10 }}
      title={<Title route={route} />}
      className='specialCardHeader'
      extra={(
        <Tooltip title={tr('刷新')}>
          <Button size='small' icon='reload' loading={currentLogLoading || loggersInfoLoading} onClick={getData.bind(null, true)} />
        </Tooltip>
      )}
    >
      <BlockHeader
        type='line'
        title={tr('日志级别')}
      />
      <Form>
        <Row>
          <Col span={24} className={styles['form-container']}>
            <Form.Item
              label={tr('当前数据库日志级别')}
              labelAlign='left'
              labelCol={{ span: 6 }}
              wrapperCol={{ span: 4 }}
            >
              <Select
                // size='small'
                placeholder={tr('未设置')}
                loading={currentLogLoading}
                value={currentLog}
                onChange={onCurrentLogChange}
              >
                {CurrentLogs.map(item => <Option key={item}>{item}</Option>)}
              </Select>
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <BlockHeader
        type='line'
        title={tr('JAVA日志级别信息')}
        extra={<LevelAdd
          loading={setLoggerLevelLoading}
          onSubmit={onAddLogLevelSubmit}
          names={levels.map(({ name }: Level) => name)}
        />}
      />
      <Table
        editable={tableEditStatus}
        rowKey='name'
        loading={loggersInfoLoading || setLoggerLevelLoading}
        dataSource={levels}
        columns={showLoggerLevelColumns}
        scroll={{ y: tableHeight }}
      />
      <BlockHeader
        type='line'
        title={tr('JAVA日志输出器')}
      />
      <Table
        editable={tableEditStatus}
        rowKey='name'
        loading={loggersInfoLoading || setAppenderFilterLevelLoading}
        dataSource={appenders}
        columns={showAppenderColumns}
        scroll={{ y: tableHeight }}
      />
    </Card>
  )
})

const LevelSelect = (props: any) => {
  return (
    <Select size='small' style={{ width: '100%' }} {...props}>
      {LEVELS.map(item => <Select.Option key={item}>{item}</Select.Option>)}
    </Select>
  )
}

const loggerLevelColumns = [
  {
    title: tr('名称'),
    dataIndex: 'name'
  },
  {
    title: tr('等级'),
    dataIndex: 'level',
    editConfig: {
      render: (text: string) => {
        return <LevelSelect value={text} />
      }
    }
  }
]

const appenderColumns = [
  {
    title: tr('名称'),
    dataIndex: 'name'
  },
  {
    title: tr('输出源'),
    dataIndex: 'appender'
  },
  {
    title: tr('过滤等级'),
    dataIndex: 'filterLevel',
  }
]
