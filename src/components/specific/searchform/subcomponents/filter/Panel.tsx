import React, { useCallback, ReactNode } from 'react'
import { Tag, Row, Col, Empty } from 'antd'
import _ from 'lodash'
import { Filter, LocalFilter } from '../../interface'
import styles from './index.less'
import { Header } from 'gantd'

interface PanelProps {
  filterType: 'system' | 'custom' // 筛选器类型
  title: string // 标题
  filters: (Filter & LocalFilter)[]// 筛选器列表
  switchActiveFilter: Function // 切换筛选器的回调
  removeFilter?: Function // 移除筛选器的回调
  extra?: ReactNode // 自定义操作按钮
}

export default (props: PanelProps) => {
  const {
    title,
    filters,
    filterType,
    switchActiveFilter,
    removeFilter,
    extra = null
  } = props

  const onFilterChange = useCallback((item: Filter, e: any) => {
    switchActiveFilter && switchActiveFilter(item)
  }, [switchActiveFilter])

  const onRemoveFilter = useCallback((item: Filter, e: any) => {
    e.stopPropagation()
    removeFilter && removeFilter(item)
  }, [removeFilter])

  if (filters.length === 0 && filterType !== 'custom') {
    return null
  }

  return (
    <>
      <div className={styles.panel}>
        <Header
          title={title}
          type="none"
          extra={extra}
        />
        <Row gutter={8} className={styles.content} type='flex'>
          {filters.length === 0 && (
            <Col span={24}>
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  tr('暂无筛选器')
                }
              >
              </Empty>
            </Col>)}
          {filters.map((item, index) => {
            const { dataName, name, isLast } = item
            return (
              <Col
                key={(dataName || name) + index}
                className={styles.item}
                onClick={onFilterChange.bind(null, item)}
              >
                <Tag
                  className={styles.tag}
                  closable={filterType === 'custom' && !isLast}
                  onClose={onRemoveFilter.bind(null, item)}
                >{dataName || name}</Tag>
              </Col>
            )
          })}
        </Row>
      </div>
    </>
  )
}
