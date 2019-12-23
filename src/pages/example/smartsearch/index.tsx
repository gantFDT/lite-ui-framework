import React, { useCallback, useRef, useState } from 'react'
import { SmartSearch } from '@/components/specific'
import { connect } from 'dva'
import { Button, InputNumber } from 'antd'
import { Select, Card } from 'gantd'
import schema from './schema'
import compatibilityModeSchema from './schema2'
import { Title } from '@/components/common'
import { Pagination } from '@/components/list'
import { initView, initParams, compatibilityModeInitView, compatibilityModeInitParams } from './init'

const customComponents = [
  {
    name: 'Custom1',
    component: Select
  },
  {
    name: 'Custom2',
    component: InputNumber
  }
]

export default connect(({ user }: any) => ({
  userId: user.currentUser.id
}))((props: any) => {
  const { userId } = props
  const smartSearchRef = useRef({} as any)

  const reset = useCallback(() => {
    if (smartSearchRef.current && smartSearchRef.current.reset) {
      smartSearchRef.current.reset()
    }
  }, [])

  const search = useCallback(() => {
    if (smartSearchRef.current && smartSearchRef.current.search) {
      smartSearchRef.current.search()
    }
  }, [])

  const [current, setSurrent] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const onPageChange = (page: number, pageSize: number) => {
    setSurrent(page)
    setPageSize(pageSize)
  }

  const onValueChange = useCallback((value, filterValue) => {
    console.log('onValueChange', value, filterValue)
  }, [])

  return (
    <Card title={<Title />}>
      <SmartSearch
        mode='advanced'
        searchPanelId='smart_search_example'
        userId={userId}
        title={tr('SmartSearch 普通模式')}
        schema={schema}
        onSearch={(params, isInit, filterParams) => console.log('SmartSearch onSearch', params, isInit, filterParams)}
        onSimpleSearch={(params, isInit) => console.log('onSimpleSearch', params, isInit)}
        onSizeChange={({ height, width }) => console.log(`SmartSearch size:height=${height} width=${width}`)}
        ref={smartSearchRef}
        totalCount={100}
        pageInfo={{ pageSize: 10, beginIndex: 0 }}
        extra={(
          <>
            <Button size='small'>{tr('自定义按钮1')}</Button>
            <Button size='small'>{tr('自定义按钮2')}</Button>
          </>
        )}
        customComponents={customComponents}
        headerProps={{
          className: 'specialHeader'
        }}
        onViewChange={(view: any) => console.log('SmartSearch 普通模式 view', view)}
        initView={initView}
        initParams={initParams}
        onValueChange={onValueChange}
      />
      <Button size="small" onClick={reset}>{tr('重置')}</Button>
      <Button size="small" onClick={search}>{tr('查询')}</Button>
      <Pagination
        current={current}
        pageSize={pageSize}
        total={30}
        onChange={onPageChange}
      />
      <br />
      <SmartSearch
        searchPanelId='smart_search_example_isCompatibilityMode'
        isCompatibilityMode
        userId={userId}
        title={tr('SmartSearch 兼容模式')}
        schema={compatibilityModeSchema}
        onSearch={(params, isInit, filterParams) => console.log('SmartSearch isCompatibilityMod onSearch', params, isInit, filterParams)}
        onSimpleSearch={(params, isInit) => console.log('onSimpleSearch isCompatibilityMod', params, isInit)}
        onSizeChange={({ height, width }) => console.log(`SmartSearch isCompatibilityMod size:height=${height} width=${width}`)}
        totalCount={100}
        pageInfo={{ pageSize: 10, beginIndex: 0 }}
        extra={(
          <>
            <Button size='small'>{tr('自定义按钮1')}</Button>
            <Button size='small'>{tr('自定义按钮2')}</Button>
          </>
        )}
        headerProps={{
          className: 'specialHeader'
        }}
        customComponents={customComponents}
        onViewChange={(view: any) => console.log('SmartSearch 兼容模式 view', view)}
        initParams={compatibilityModeInitParams}
        initView={compatibilityModeInitView}
        onValueChange={onValueChange}
      />
    </Card>
  )
})
