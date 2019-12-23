import React, { useCallback, useRef } from 'react'
import { SearchForm } from '@/components/specific'
import { connect } from 'dva'
import { Button, InputNumber } from 'antd'
import { BlockHeader, Select } from 'gantd'
import schema from './schema'

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

const initParams = {
  text: '文本',
  code: true,
  custom1: "2",
  custom2: -2,
  date: '19-12-06',
  group: "ruHtFc9x60OjMLKqxy0",
  money: "100.00",
  number: 3,
  select: "2",
  userName: 10
}

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

  const onValueChagne = useCallback((value: any, filterValue: any) => {
    console.log('onValueChagne', value, filterValue)
  }, [])

  return (
    <>
      <SearchForm
        searchKey={`search_form_example：${userId}`}
        title='SearchForm'
        onSearch={(params) => console.log('SearchForm onSearch', params)}
        onSizeChange={({ height, width }) => console.log(`SearchForm size:height=${height} width=${width}`)}
        ref={smartSearchRef}
        extra={(
          <>
            <Button size='small'>自定义按钮1</Button>
            <Button size='small'>自定义按钮2</Button>
          </>
        )}
        customComponents={customComponents}
        schema={schema}
        headerProps={{
          className: 'specialHeader'
        }}
        initParams={initParams}
        onValueChange={onValueChagne}
      />
      <BlockHeader
        title='通过ref暴露的方法对SearchForm进行操作示例'
        extra={<>
          <Button size="small" onClick={reset}>重置</Button>
          <Button size="small" onClick={search}>查询</Button>
        </>}
      />
      <SearchForm
        searchKey={`search_form_customBody_example：${userId}`}
        title='SearchForm'
        onSearch={(params) => console.log('SearchForm onSearch', params)}
        onSizeChange={({ height, width }) => console.log(`SearchForm size:height=${height} width=${width}`)}
        extra={(
          <>
            <Button size='small'>自定义按钮1</Button>
            <Button size='small'>自定义按钮2</Button>
          </>
        )}
        customComponents={customComponents}
        schema={schema}
        headerProps={{
          className: 'specialHeader'
        }}
        showCustomBody
        customBody={<div style={{ height: 200, fontSize: 16 }}>这里是自定义显示内容，当显示自定义内容时，筛选器，查询和重置按钮将会隐藏</div>}
      />
    </>
  )
})
