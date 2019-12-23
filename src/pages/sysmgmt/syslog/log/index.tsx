import React, { useMemo, useEffect, useCallback, useState } from 'react'
import { Card } from 'antd'
import { connect } from 'dva'
import { Dispatch, AnyAction } from 'redux';
import { useImmer } from 'use-immer'

import { Title } from '@/components/common'
import { SmartTable, SmartSearch, SmartModal } from '@/components/specific'
import { ModelState, StateItem, initialStateItem, QueryParam } from './model'
import { scheme, searchSchemaMap } from './scheme';
import Types from './types'
import { RouterTypes } from '@/models/connect';
import { getTableHeight, TABLE_HEADER_HEIGHT, MainConfigProps } from '@/utils/utils'

const initPageInfo: PageInfo = {
  beginIndex: 0,
  pageSize: 50,
}

export type QueryType = (options: QueryParam, stateName: string) => void
export type saveType = (options: ModelState) => void

interface DispatchProps {
  query: QueryType,
  save: saveType
}

interface ConnectProps {
  syslog: ModelState,
  loading: boolean,
  currentUser: { id: string },
  MAIN_CONFIG: MainConfigProps
}

export interface LogProps extends ConnectProps, DispatchProps, RouterTypes {
  type: Types
}

// 组件
const Log = (props: LogProps) => {
  const { type, query, MAIN_CONFIG, currentUser, syslog, loading, route } = props
  const [searchHeight, setsearchHeight] = useState(0)
  const data = useMemo(() => (syslog[type] || initialStateItem) as StateItem, [type, syslog]);
  const [pageInfo, setpageInfo] = useImmer({ ...initPageInfo, ...data.param.pageInfo, })
  const currentPage = useMemo(() => pageInfo.beginIndex / pageInfo.pageSize + 1, [pageInfo])
  const [infomodal, setinfomodal] = useState(null as React.ReactNode)

  const showMailContent = useCallback(
    (e, record) => {
      const modal = <SmartModal
        id='mailcontentmodal'
        visible
        title={tr('邮件内容') + '-' + record.field1}
        isModalDialog
        itemState={{ width: 450, height: 440 }}
        footer={null}
        onCancel={() => setinfomodal(null)}
      >
        <div dangerouslySetInnerHTML={{ __html: record.field6 }}></div>
      </SmartModal>
      setinfomodal(() => modal)
      e.stopPropagation()
    },
    [],
  )
  const withIndexSchemes = useMemo(() => {
    const computedScheme = [
      {
        width: 50,
        title: tr('序号'),
        fieldName: 'xh',
        render: (text: any, record: object, index: number) => pageInfo.beginIndex + index + 1,
      },
      ...scheme[type],
    ]
    if (type === Types.Mail) {
      computedScheme.forEach(item => {
        if (item.fieldName === 'field6') {
          item.render = (text: string, record: object) => (
            <span style={{ color: 'var(--link-color)', cursor: 'default' }} onClick={(e) => showMailContent(e, record)}>{tr('点击查看')}</span>
          )
        }
      })
    }
    return computedScheme
  }, [scheme, type, pageInfo.beginIndex])
  const onPageChange = useCallback((page: number, pageSize: number) => setpageInfo(info => ({ pageSize, beginIndex: (page - 1) * pageSize })), [])


  const onSearchFormSizeChange = useCallback(({ height }) => { setsearchHeight(height) }, [])
  const bodyHeight = getTableHeight(MAIN_CONFIG, searchHeight + TABLE_HEADER_HEIGHT)
  // 搜索
  const onSearch = useCallback(
    (param, isFirst) => {
      setpageInfo(info => param.pageInfo)
      param.filterInfo.logType = type
      query(param, isFirst ? `${type}.content` : '')
    },
    [type],
  )
  return (
    <Card bodyStyle={{ padding: 0 }} >
      <SmartSearch
        searchPanelId={`${type}log`}
        userId={currentUser.id}
        title={<Title route={route} />}
        schema={searchSchemaMap[type]}
        onSearch={onSearch}
        onSizeChange={onSearchFormSizeChange}
        pageInfo={pageInfo}
        totalCount={data.totalCount}
        isCompatibilityMode
        headerProps={{
          className: 'specialHeader'
        }}
        showBottomLine
      />
      <SmartTable
        tableKey={`${type}log`}
        schema={withIndexSchemes}
        bodyHeight={bodyHeight}
        dataSource={data.content}
        loading={loading}
        pagination={{
          current: currentPage,
          pageSize: pageInfo.pageSize,
          total: data.totalCount,
          onChange: onPageChange,
          onShowSizeChange: onPageChange,
          // hideOnSinglePage: true,
        }}
      />
      {infomodal}
    </Card>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<AnyAction>) => {
  const dispatchProps: DispatchProps = {
    query: (payload: QueryParam, stateName: string) => {
      dispatch({
        type: "syslog/queryLog",
        payload,
        stateName,
      })
    },
    save: (payload: ModelState) => {
      dispatch({
        type: "syslog/save",
        payload,
      })
    },
  }

  return dispatchProps
}

export default connect(
  ({ syslog, loading, user, settings }: any): ConnectProps => ({
    currentUser: user.currentUser,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    syslog,
    loading: loading.effects['syslog/queryLog'],
  }),
  mapDispatchToProps,
)(Log)
