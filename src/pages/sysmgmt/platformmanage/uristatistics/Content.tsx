import React from 'react'
import { SmartSearch, SmartTable } from '@/components/specific'
import { SmartSearchCompatibilityModeSchema } from '@/components/specific/smartsearch'


interface ContentProps {
  searchPanelId: string
  userId: string
  searchSchema: SmartSearchCompatibilityModeSchema
  onSearch: (params: any, isInit?: boolean) => void
  onSizeChange: ({ width, height }: any) => void
  tabbleSchema: any
  dataSource: any[]
  loading: boolean
  tableHeight: string
}

export default (props: ContentProps) => {
  const {
    searchPanelId,
    userId,
    searchSchema,
    onSearch,
    onSizeChange,
    tabbleSchema,
    dataSource,
    loading,
    tableHeight
  } = props
  return (
    <>
      <SmartSearch
        title=''
        searchPanelId={searchPanelId}
        userId={userId}
        schema={searchSchema}
        isCompatibilityMode
        onSearch={onSearch}
        onSizeChange={onSizeChange}
        showSplitLine={false}
      />
      <SmartTable
        tableKey={`${searchPanelId}:${userId}`}
        rowKey="id"
        schema={tabbleSchema}
        dataSource={dataSource}
        loading={loading}
        bodyHeight={tableHeight}
      />
    </>)
}
