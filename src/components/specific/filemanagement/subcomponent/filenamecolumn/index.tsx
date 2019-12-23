import React, { useCallback } from 'react'
import classnames from 'classnames'
import { getIconImageByFileName } from '@/utils/utils'
import styles from './index.less'


interface FilenameColumnProps {
  name: string // 文件名
  width: number // 列宽
  record?: any // 业务对象
  dispatch?: Function
}

const INIT_ANY_OBJECT = {}
const FOLDER_TPYE = 'folder'

/**
 * 文件名列
 */
export default (props: FilenameColumnProps) => {
  const {
    name,
    width = 200,
    record = INIT_ANY_OBJECT,
    dispatch
  } = props
  const { type, id } = record

  const onNameClick = useCallback((e: any) => {
    if (type === FOLDER_TPYE) {
      e.stopPropagation()
      dispatch && dispatch({ payload: { dirId: id, selectedRowKeys: [] } })
    }
  }, [type, dispatch, id])

  return (
    <div className={classnames(styles.filenameWrapper, { [styles.filenameWrapperHover]: type === FOLDER_TPYE })}>
      <img src={getIconImageByFileName(name, type === 'folder')} />
      <div
        className={styles.filenameText}
        style={{ maxWidth: `${width}px` }}
        onClick={onNameClick}>{name}</div>
    </div>
  )
}
