import React, { useCallback } from 'react'
import { Icon, Popover, Tooltip } from 'antd'
import { BlockHeader } from 'gantd'
import { getIconNameByFileName, getFileUnit } from '@/utils/utils'
import styles from './index.less'

interface AttachmentListProps {
  attachmentList: any[] // 附件列表
  showTitle?: boolean // 是否显示标题
  editAble?: boolean // 是否允许删除
  onDelete?: (id: string) => void  // 删除回调
}

/**
 * 附件列表组件
 * @param props 
 */
export default function AttachmentList(props: AttachmentListProps) {
  const {
    attachmentList,
    showTitle = true,
    editAble = false,
    onDelete
  } = props

  const downFile = (url: string) => {
    location.href = '/api/' + url
  }

  const deleteFile = (id: string) => {
    onDelete && onDelete(id)
  }

  const AttachmentList = useCallback(() => {
    let res = attachmentList.length > 0 ? (
      <>
        {showTitle && <BlockHeader title={tr('附件')} />}
        {attachmentList.map(({ id, name, size, url }: any) => {
          return (
            <span key={id}>
              <Popover
                placement='topLeft'
                overlayClassName={styles.customPopover}
                content={(
                  <div>
                    <Tooltip title={tr('下载')}>
                      <Icon
                        type='download'
                        onClick={downFile.bind(null, url)}
                      />
                    </Tooltip>
                    {editAble && (
                      <Tooltip title={tr('删除')}>
                        <Icon
                          type='delete'
                          onClick={deleteFile.bind(null, id)}
                        />
                      </Tooltip>
                    )}
                  </div>
                )}
                trigger={editAble ? 'click' : 'hover'}
              >
                <span className={styles.fileContainer}>
                  <a key={url} href={'/api/' + url} className={styles.fileWrapper}>
                    <Icon type={getIconNameByFileName(name)} />
                    <span className={styles.fileName}>{name}</span>
                    <span >({getFileUnit(size)})</span>
                  </a>
                </span>
              </Popover>
              <br />
            </span>
          )
        })}
      </>
    ) : <></>
    return res
  }, [attachmentList])

  return (
    <AttachmentList />
  )
}
