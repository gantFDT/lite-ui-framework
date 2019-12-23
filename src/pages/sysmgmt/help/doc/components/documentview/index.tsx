import React, { useRef, useCallback } from 'react'
import { Row, Col, Typography, Button, Empty, Tooltip, Modal } from 'antd'
import { Card } from 'gantd'
import _ from 'lodash'
import { SingleFileUpload } from '@/components/specific'
import { AttachmentList } from '..'
import styles from './index.less'

const { Title, Text, Paragraph } = Typography

interface DocumentViewProps {
  editAble?: boolean // 是否可编辑
  loading: boolean | undefined // 文档加载状态
  minHeight: number | string // 最小高度
  topicId?: string // 当前查看文档的id
  viewDoc: any // 当前查看文档
  dispatch?: Function //
  onDelete?: Function // 删除的会回调
  onEdit?: Function // 编辑按钮点击回调
  onImport?: Function // 调入按钮点击回调
  onExport?: Function // 导出按钮点击回调
}

/**
 * 文档查看组件
 * @param props
 */
export default function DocumentView(props: DocumentViewProps) {
  const {
    editAble = false,
    loading,
    minHeight,
    topicId,
    viewDoc,
    dispatch = () => { },
    onEdit = () => { },
    onImport = () => { },
    onExport = () => { },
  } = props

  const { topicName, updateDate, userName, viewHelpContent, attachmentList, topicStatus, isEmpty } = viewDoc
  const docRef = useRef<HTMLDivElement>(null)

  // 打印
  const handlePrint = useCallback(() => {
    const iFrame = document.createElement('iframe')
    iFrame.setAttribute('style', 'position:absolute;left:-100%;top:-100%;')
    document.body.appendChild(iFrame)
    const win: Window = iFrame.contentWindow as Window
    const doc = win.document
    doc.body.appendChild((docRef.current as HTMLDivElement).cloneNode(true))
    doc.onreadystatechange = () => {
      if (doc.readyState === 'complete') {
        win.print()
        win.close();
        (iFrame.parentNode as HTMLDivElement).removeChild(iFrame)
      }
    }
  }, [docRef])

  // 改变主题显隐状态
  const changeTopicStatus = () => {
    dispatch({
      type: 'helpDocManage/alterHelpTopicShowStatus',
      payload: {
        topicId,
        topicStatus: topicStatus === 1 ? 0 : 1
      }
    })
  }

  // 删除文档
  const deleteDoc = () => {
    Modal.confirm({
      title: tr('提示'),
      content: tr('确定要删除这篇文档？'),
      okText: tr('删除'),
      okType: 'danger',
      cancelText: tr('取消'),
      centered: true,
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' },
      onOk: () => {
        dispatch({
          type: 'helpDocManage/deleteDoc',
          payload: {
            topicId
          }
        })
      }
    })
  }

  return (
    <Card style={{ minHeight, padding: '20px' }} loading={loading}>
      {
        !topicName
          ? (<div style={{ height: `calc(${minHeight} - 62px)` }} className={styles.emptyWrapper}>
            <Empty description={isEmpty ? tr('当前主题下暂无帮助文档') : tr('请在左边选择要查看的文档')} />
          </div>)
          : (<Typography>
            <Row type='flex' justify='space-between' align='middle'>
              <Col span={16}>
                <Title>{topicName}</Title>
              </Col>
              <Col span={8} >
                <div className={styles.operates}>
                  {editAble && (
                    <Tooltip title={tr(topicStatus === 1 ? '隐藏该主题' : '展示该主题')}>
                      <Button size="small"
                        icon={topicStatus === 1 ? 'eye-invisible' : 'eye'}
                        onClick={changeTopicStatus}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title={tr('打印')}>
                    <Button size="small"
                      icon='printer'
                      onClick={handlePrint.bind(null, topicName)}
                    />
                  </Tooltip>
                  {editAble && (
                    <Tooltip title={tr('导出')}>
                      <Button size="small"
                        icon='export'
                        onClick={onExport.bind(null, 'single')}
                      />
                    </Tooltip>
                  )}
                  {editAble && (
                    <SingleFileUpload
                      tooltip={tr('导入')}
                      onSuccess={(file) => onImport(file, true)}
                      tempFile
                      extraBtnProps={{
                        icon: 'import'
                      }}
                    />
                  )}
                  {editAble && (
                    <Tooltip title={tr('删除')}>
                      <Button size="small"
                        icon='delete'
                        onClick={deleteDoc}
                        type='danger'
                      />
                    </Tooltip>
                  )}
                  {editAble && (
                    <Tooltip title={tr('编辑')}>
                      <Button size="small"
                        icon='edit'
                        onClick={onEdit.bind(null)}
                      />
                    </Tooltip>
                  )}
                </div>
              </Col>
            </Row>
            <Paragraph>
              <Text>{tr('最后编辑于')} <Text strong>{updateDate}</Text>，{tr('编辑者')}：<Text strong> {userName}</Text></Text>
            </Paragraph>
            <div
              className={styles.richtext}
              ref={docRef}
              dangerouslySetInnerHTML={{ __html: viewHelpContent }}
            />
            <AttachmentList
              attachmentList={attachmentList}
            />
          </Typography>)
      }
    </Card>
  )
}
