import React, { useCallback, useMemo } from 'react'
import { Icon, Button } from 'antd'
import classnames from 'classnames'
import styles from './index.less'
const ButtonGroup = Button.Group;
export interface PaginationProps {
  current: number
  pageSize: number
  total: number
  onChange: (page: number, pageSize: number) => void
}

/**
 * 迷你分页组件
 */
export default function Pagination(props: PaginationProps) {
  const {
    current = 0,
    pageSize = 1,
    total = 0,
    onChange
  } = props

  const allPage = useMemo(() => {
    return Math.ceil(total / pageSize)
  }, [pageSize, total])

  const leftClick = useCallback(() => {
    onChange && onChange(current - 1, pageSize)
  }, [current, pageSize])

  const rightClick = useCallback(() => {
    onChange && onChange(current + 1, pageSize)
  }, [current, pageSize])

  return (
    <ButtonGroup>
      <Button
        disabled={current === 0 || current === 1}
        onClick={leftClick}
        size="small"
        className={classnames(styles.left, styles.operate)}
      >
        <Icon type="left" />
      </Button>
      <Button size="small" className={classnames(styles.middle, styles.operate)}>{current}/{allPage}</Button>
      <Button
        size="small"
        disabled={total === 0 || current === Math.ceil(total / pageSize)}
        onClick={rightClick}
        className={classnames(styles.right, styles.operate)}
      >
        <Icon type="right" />
      </Button>
    </ButtonGroup>
  )
}
