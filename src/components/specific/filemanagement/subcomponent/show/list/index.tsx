import React, { ReactNode, useCallback } from 'react'
import { Icon, Tooltip, List, Checkbox, Pagination, Row, Col, Empty } from 'antd'
import { BlockHeader } from 'gantd'
import classnames from 'classnames'
import _ from 'lodash'
import { ContextMenuTrigger } from 'react-contextmenu'
import { FileOperateProps } from '@/components/specific/filemanagement'
import { getIconImageByFileName, isImageByFilename, getImageByPreviewId } from '@/utils/utils'
import Image from '../../image'
import styles from './index.less'
import { useHeight } from '../../../utils'

interface ListShowProps extends FileOperateProps {
  state: any,
  dispatch: Function,
  headerRight: ReactNode,
  findFiles: Function
  height: string
  title: string | ReactNode
  headerProps: any
  isDir: boolean
  files: any[]
}

/**
 * list形式展示文件列表
 * @param props
 */
export default function ListShow(props: ListShowProps) {
  const {
    state,
    dispatch,
    headerRight,
    findFiles,
    downloadAble,
    deleteAble,
    editAble,
    previewAble,
    height,
    title,
    headerProps,
    isDir,
    files
  } = props
  const { pageSize, total, findFileLoading, pageIndex, selectedRowKeys, checkboxState } = state
  const { checkAll, indeterminate } = checkboxState
  const height_ = useHeight(height, 'list', isDir)

  const pageOnchange = useCallback((page: number, pageSize: number) => {
    findFiles({ newBeginIndex: (page - 1) * pageSize })
  }, [findFiles])

  const onShowSizeChange = useCallback((current: number, size: number) => {
    findFiles({ newBeginIndex: 0, newPageSize: size })
  }, [findFiles])

  const onSelectionChange = useCallback((id: string, e: Event) => {
    e.stopPropagation()
    if (isDir) {
      dispatch(({ payload: { selectedRowKeys: [id] } }))
      return
    }
    let newSelectedRowKeys = [...selectedRowKeys]
    let newCheckAll = false
    let newIndeterminate = false
    if (selectedRowKeys.includes(id)) {
      _.remove(newSelectedRowKeys, (item: string) => item === id)
    } else {
      newSelectedRowKeys.push(id)
    }
    if (files.length === newSelectedRowKeys.length) {
      newCheckAll = true
      newIndeterminate = false
    } else if (newSelectedRowKeys.length === 0) {
      newCheckAll = false
      newIndeterminate = false
    } else {
      newCheckAll = false
      newIndeterminate = true
    }
    dispatch({
      payload: {
        selectedRowKeys: newSelectedRowKeys,
        checkboxState: {
          checkAll: newCheckAll,
          indeterminate: newIndeterminate
        }
      }
    })
  }, [isDir, selectedRowKeys, files])

  const checkAllImpl = useCallback(() => {
    dispatch({
      payload: {
        selectedRowKeys: files.map((item: any) => item.id),
        checkboxState: {
          checkAll: true,
          indeterminate: false
        }
      }
    })
  }, [files])

  const cancelCheckAllImpl = useCallback(() => {
    dispatch({
      payload: {
        selectedRowKeys: [],
        checkboxState: {
          checkAll: false,
          indeterminate: false
        }
      }
    })
  }, [])

  const onCheckboxChange = useCallback((e: any) => {
    if (e.target.checked) {
      checkAllImpl()
    } else {
      if (indeterminate) {
        checkAllImpl()
      } else {
        cancelCheckAllImpl()
      }
    }
  }, [checkAllImpl, cancelCheckAllImpl, indeterminate])

  const onContextMenu = useCallback((id: string, e: Event) => {
    e.target.currentFileId = id
  }, [])

  return (
    <>
      <BlockHeader
        type=''
        size='big'
        title={title}
        extra={headerRight}
        {...headerProps}
      />
      <div
        style={{ height: height_ }}
        className={styles.listWrapper}
      >
        <List
          grid={{
            gutter: 4,
            xs: 2,
            sm: 4,
            md: 6,
            lg: 8,
            xl: 8,
            xxl: 12
          }}
          loading={findFileLoading}
          dataSource={files}
          renderItem={(item: any): ReactNode => {
            const { name, id, type, preview } = item
            const isSelected = selectedRowKeys.includes(id)
            let itemClassName = classnames({
              [styles.listItem]: true,
              [styles.listItemUnselect]: !isSelected,
              [styles.listItemSelected]: isSelected
            })
            let isFolder = type === 'folder'
            let extraProps: any = {}
            if (isFolder && isDir) {
              extraProps.onClick = () => dispatch({ payload: { dirId: id } })
            }
            let isImage = preview && isImageByFilename(name)
            return (
              <ContextMenuTrigger
                id="file-management-menu-context"
                disable={!downloadAble && !deleteAble && !editAble && !previewAble}>
                <List.Item
                  className={classnames(styles.listItemWrapper, {
                    [styles.listItemWrapperDir]: isDir && isFolder
                  })}
                  {...extraProps}
                >
                  <div
                    className={itemClassName}
                    onContextMenu={onContextMenu.bind(null, id)}
                  >
                    <div
                      className={styles.checkIcon}
                      onClick={(e) => onSelectionChange(id, e)}
                    >
                      <Icon type='check-circle' theme={isSelected ? 'filled' : 'outlined'} />
                    </div>
                    {isImage
                      ? (
                        <Image url={getImageByPreviewId(id)} className={styles.image} />
                      )
                      : (<img src={getIconImageByFileName(name, type === 'folder')} />)}
                    <Tooltip title={name} placement="bottom">
                      <div className={styles.fileName}>{name}</div>
                    </Tooltip>
                  </div>
                </List.Item>
              </ContextMenuTrigger>
            )
          }}
          locale={{
            emptyText: (
              <div className="aligncenter" style={{ height: `calc(${height_} - 32px)` }}>
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
              </div>
            )
          }}
        />
      </div>
      {
        !isDir && (
          <Row type='flex' justify='space-between' className={styles.pageRow}>
            <Col>
              <div className={styles.headerWrapper}>
                <div className={styles.headerCheckbox}>
                  <Checkbox
                    indeterminate={indeterminate}
                    checked={checkAll}
                    onChange={onCheckboxChange}
                  >
                    {checkAll ? tr('取消全选') : tr('全选')}
                  </Checkbox>
                  <span>{selectedRowKeys.length !== 0 ? tr(`已选择 ${selectedRowKeys.length} 个文件`) : ''}</span>
                </div>
              </div>
            </Col>
            <Col>
              <Pagination
                size='small'
                pageSize={pageSize}
                total={total}
                current={pageIndex}
                onChange={pageOnchange}
                onShowSizeChange={onShowSizeChange}
                showSizeChanger={true}
                showQuickJumper={true}
                pageSizeOptions={['8', '24', '40', '56', '72', '88']}
                showTotal={(total, range) => tr(`${range[0]}-${range[1]}, 共${total}条`)}
              /></Col>
          </Row>
        )
      }
    </>
  )
}
