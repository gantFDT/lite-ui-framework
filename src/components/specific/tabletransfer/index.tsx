import React, { useRef, useCallback, useState, useMemo } from 'react'
import { Transfer } from 'antd'
import { Table } from 'gantd'
import _ from 'lodash'
import SearchForm, { SearchFormSchema } from '@/components/specific/searchform'
import classnames from 'classnames'
import styles from './index.less'

export type Direction = 'left' | 'right' | string

export type Pageinfo = {
  beginIndex: number // 分页起始位置
  pageSize: number // 分页大小
}

// 两边table内的私有配置
export interface TableTransferInnerProps {
  title: string // 显示的标题
  loading?: boolean // table的loading状态
  pagination?: {
    total: number // 数据总条数
  } & Pageinfo
  extraSearchProps?: any // 额外的SearchForm配置
  extraTableProps?: any // 额外的table配置
}

export interface BaseTableTransferProps {
  transKey: string // 该组件的唯一标识，SearchForm组件和Table组件内容会用到
  rowKey: string // 每行数据的唯一标识
  schema?: SearchFormSchema // SearchForm的schena配置,传入该属性则表示会显示SearchForm组件
  columns: any[] // table的列
  left: TableTransferInnerProps // 左边部分的配置
  right: TableTransferInnerProps // 右边部分的配置
  dataSource: any[] // table的数据源（包含两边table所有的数据）
  targetKeys: string[] // 右边选中的数据keys，由rowKey来指定对应数据项
  onSearch?: (direction: Direction, params: any, pageInfo: PageInfo) => void // 触发查询的回调,分页改变或者点击查询按钮会触发
  onChange: (targetKeys: string[], direction: Direction, moveKeys: string[]) => void // 穿梭数据的回调
}

export interface TableTransferProps extends BaseTableTransferProps {
  height: string | number // 整个组件的高度
  width: string | number // 整个组件的宽度
}

export type TableTransferAllProps = keyof TableTransferProps

const TABLE_TITLE_HEIGHT = 40
const TABLE_HEADER_HEIGHT = 32
const TABLE_PAGE_HEIGHT = 34
const LIST_HEIGHT_PADDING = 0

/**
 * 表格穿梭框组件
 */
export default (props: TableTransferProps) => {
  const {
    transKey,
    rowKey,
    schema,
    columns,
    left,
    right,
    dataSource,
    targetKeys,
    height,
    width,
    onSearch,
    onChange
  } = props

  const showSearchForm = !_.isEmpty(schema)
  const leftSearchFormRef = useRef({ search: null } as any)
  const rightSearchFormRef = useRef({ search: null } as any)
  const leftPageRef = useRef({} as Pageinfo)
  const rightPageRef = useRef({} as Pageinfo)
  const [searchFormSize, setSearchFormSize] = useState({ width: 0, height: 0 })
  const { height: searchHeight } = searchFormSize
  const tableWrapperWidth = useMemo(() => {
    return typeof width === 'number' ? (width - 40 - 4) / 2 : `calc(calc(${width} - 44px) / 2)`
  }, [width])

  const onSearch_ = useCallback((direction: Direction, params: any) => {
    onSearch && onSearch(direction, params, (direction === 'left' ? leftPageRef : rightPageRef).current)
  }, [onSearch])

  const SelectedText = (props: { length: number }) => <span className={styles.selectedText}>（{tr(`已选中${props.length}个`)}）</span>

  return (
    <Transfer
      rowKey={record => record[rowKey]}
      dataSource={dataSource}
      targetKeys={targetKeys}
      className={styles['table-transfer']}
      onChange={onChange}
      style={{ width: width }}
    >
      {({
        direction,
        filteredItems,
        onItemSelectAll,
        onItemSelect,
        selectedKeys,
        disabled: listDisabled,
      }) => {
        const props_ = direction === 'left' ? left : right
        const {
          title,
          loading,
          pagination = {},
          extraSearchProps = {},
          extraTableProps = {}
        } = props_

        // 是否包含分页
        const withPage = !_.isEmpty(pagination)

        // 计算table高度
        const tableHeight = `calc(${typeof height === 'number' ? height + 'px' : height} - ${searchHeight + (showSearchForm ? 0 : TABLE_TITLE_HEIGHT) + TABLE_HEADER_HEIGHT + (withPage ? TABLE_PAGE_HEIGHT : 0) + LIST_HEIGHT_PADDING}px)`

        let extraTableProps_ = {
          ...extraTableProps
        }

        // 有分页
        if (withPage) {
          let pageRef = direction === 'left' ? leftPageRef : rightPageRef
          const { pageSize, beginIndex, total } = pagination as any
          pageRef.current = {
            beginIndex: 0,
            pageSize
          }
          extraTableProps_['pagination'] = {
            pageSize,
            total,
            current: Math.ceil((beginIndex + 1) / pageSize),
            onChange: (page: number, pageSize: number) => {
              pageRef.current = {
                beginIndex: (page - 1) * pageSize,
                pageSize
              }
              const { current: { search } } = direction === 'left' ? leftSearchFormRef : rightSearchFormRef
              if (search) {
                search()
              } else {
                onSearch && onSearch(direction, {}, pageRef.current)
              }
            }
          }
        }

        // 不显示SearchForm
        if (!showSearchForm) {
          extraTableProps_.title = (<>
            {title}
            <SelectedText length={selectedKeys.length} />
          </>)
        }

        return (
          <>
            {showSearchForm && (
              <SearchForm
                {...extraSearchProps}
                searchKey={transKey + direction}
                ref={direction === 'left' ? leftSearchFormRef : rightSearchFormRef}
                schema={schema}
                title={(
                  <>
                    {title}
                    <SelectedText length={selectedKeys.length} />
                  </>
                )}
                onSearch={onSearch_.bind(null, direction)}
                onSizeChange={setSearchFormSize}
              />
            )}
            <div
              style={{ overflowX: 'auto', width: tableWrapperWidth }}
              className={classnames({ [styles['table-transfer-table-wrapper']]: !showSearchForm })}>
              <Table
                hideVisibleMenu
                {...extraTableProps_}
                tableKey={transKey + direction}
                rowkey={rowKey}
                loading={loading}
                columns={columns}
                dataSource={filteredItems}
                scroll={{
                  y: tableHeight
                }}
                selectMode='multi'
                onSelect={() => { }}
                rowSelection={{
                  clickable: true,
                  showFooterSelection: false,
                  selectedRowKeys: selectedKeys,
                  onChange: (selectedRowKeys: string[]) => {
                    const isNull = selectedRowKeys.length === 0
                    if (isNull || selectedRowKeys.length > selectedKeys.length) {
                      const resSelect = isNull ? selectedKeys : selectedRowKeys
                      const selected = isNull ? false : true
                      onItemSelectAll(resSelect, selected)
                    } else {
                      let cancelSelectedKeys = _.difference(selectedKeys, selectedRowKeys)
                      onItemSelect(cancelSelectedKeys[0], false)
                    }
                  }
                }}
              />
            </div>
          </>
        )
      }}
    </Transfer>)
}

