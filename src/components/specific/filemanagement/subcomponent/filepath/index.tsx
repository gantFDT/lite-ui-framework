import React, { useCallback } from 'react'
import styles from './index.less'

interface Path {
  name: string
  id: string
}

interface FilePathProps {
  path: Path[]
  dispatch: Function
}

/**
 * 目录路径
 * @param props
 */
export default (props: FilePathProps) => {
  const {
    path,
    dispatch
  } = props

  if (path.length === 0) {
    return <span className={styles.normal}>{tr('全部文件')}</span>
  }

  const onBack = useCallback(() => {
    let path_ = path[path.length - 2]
    dispatch({ payload: { dirId: path_ ? path_.id : undefined, selectedRowKeys: [] } })
  }, [dispatch, path])

  const onAll = useCallback(() => {
    dispatch({ payload: { dirId: undefined, selectedRowKeys: [] } })
  }, [dispatch])

  const onPath = useCallback((dirId: string) => {
    dispatch({ payload: { dirId, selectedRowKeys: [] } })
  }, [dispatch])

  return (
    <span className={styles.wrapper}>
      <a onClick={onBack}>{tr('返回上一级')}</a>
      <span> | </span>
      <a onClick={onAll}>{tr('全部文件')}</a>
      <span> > </span>
      {path.map(({ name, id }: any, index: number) => {
        return index === path.length - 1
          ? <span className={styles.normal}>{name}</span>
          : <span onClick={onPath.bind(null, id)}><a>{name}</a> > </span>
      })}
    </span>
  )
}
