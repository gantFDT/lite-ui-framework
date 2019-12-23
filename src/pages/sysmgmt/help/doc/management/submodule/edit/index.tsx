import React, { useState, useEffect, useCallback } from 'react'
import { Input, Button, Row, Col, Modal, message, Spin } from 'antd'
import { Card, BlockHeader } from 'gantd'
import _ from 'lodash'
import { RichTextEditor } from '@/components/form'
import { SingleFileUpload } from '@/components/specific'
import { AttachmentList } from '../../../components'
import { Topic } from '../../model'
import { HELP_ATTACHMENT_UPLOAD_URL } from '../../../service'
import styles from './index.less'

export interface EditProps {
  editing: boolean // 是否编辑态
  dispatch: Function
  minHeight: any // 最小高度
  topic: Topic
  loading: boolean // 发布状态
  headerHeight: number | string // 头部高度
}

const COL_SPAN = 18

/**
 * 文档编辑模块
 * @param props
 */
export default function Edit(props: EditProps) {
  const {
    editing,
    dispatch,
    minHeight,
    topic,
    loading
  } = props

  const [title, setTitle] = useState<string>(topic.title)
  const [attachmentList, setAttachmentList] = useState<any[]>(topic.attachmentList)
  const [content, setContent] = useState<string>('')

  // 取消编辑实现
  const cancelImpl = () => {
    dispatch({
      type: 'helpDocManage/updateState',
      payload: { editing: false }
    })
  }

  // 取消编辑
  const cancelEdit = () => {
    const isTitleChange = !_.isEqual(title, topic.title)
    const isContentChange = !_.isEqual(content, topic.helpEditValue)
    const isAttachmentListChange = !_.isEqual(attachmentList, topic.attachmentList)
    if (isTitleChange || isContentChange || isAttachmentListChange) {
      Modal.confirm({
        title: tr('提示'),
        content: tr('是否放弃编辑的内容？'),
        okText: tr('是'),
        onOk: cancelImpl,
        centered: true,
        okButtonProps: { size: 'small' },
        cancelButtonProps: { size: 'small' },
        cancelText: tr('否')
      })
    } else {
      cancelImpl()
    }
  }

  // 标题改变
  const inputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { target: { value } } = e
    setTitle(value)
  }

  // 发布
  const docSubmit = _.debounce((): any => {
    if (!title) {
      return message.warning(tr('请完善文档主题！'))
    } else if (!content) {
      return message.warning(tr('请完善文档内容！'))
    }
    dispatch({
      type: 'helpDocManage/saveDoc',
      payload: {
        title,
        helpEditValue: content,
        attachmentList
      }
    })
  }, 300)

  useEffect(() => {
    const { title, attachmentList, helpEditValue } = topic
    setTitle(title)
    setAttachmentList(attachmentList)
    setContent(helpEditValue)
  }, [topic])

  // 文件删除
  const onFileDelete = (id: string) => {
    let newAttachmentList = attachmentList.filter((item: any) => item.id !== id)
    setAttachmentList(newAttachmentList)
  }

  // 文件上传
  const onSingleFileUpload = (file: any) => {
    setAttachmentList([...attachmentList, file])
  }

  // 富文本内容改变
  const onRichTextChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  return (
    <Spin
      spinning={loading || false}
      tip={tr('文档发布中')}
      size='large'
    >
      <Card style={{ display: editing ? '' : 'none', minHeight, paddingTop: '20px' }}>
        <Row type='flex' justify='center'>
          <Col span={COL_SPAN}>
            <BlockHeader
              title={tr(topic.topicId ? '编辑' : '新增')}
              extra={(
                <div className={styles.operates}>
                  <Button size="small" onClick={cancelEdit}>{tr('返回')}</Button>
                  <Button loading={loading} size="small" type='primary' onClick={docSubmit}>{tr('发布')}</Button>
                </div>
              )}
            />
          </Col>
          <Col span={COL_SPAN}>
            <Input
              className={styles.input}
              placeholder={tr('文档主题标题')}
              autoFocus={editing}
              value={title}
              onChange={inputOnChange}
            />
          </Col>
          <Col span={COL_SPAN}>
            <RichTextEditor
              content={topic.helpEditValue}
              onChange={onRichTextChange}
              className={styles.editor}
              api='/help/weUpload'
            />
          </Col>
          <Col span={COL_SPAN} className={styles.input}>
            <BlockHeader
              title={tr('附件')}
              extra={(
                <SingleFileUpload
                  btnText={tr('附件上传')}
                  uploadUrl={HELP_ATTACHMENT_UPLOAD_URL}
                  onSuccess={onSingleFileUpload}
                  extraBtnProps={{
                    type: 'primary',
                    icon: 'upload'
                  }}
                />
              )}
            />
            <AttachmentList
              attachmentList={attachmentList}
              showTitle={false}
              editAble
              onDelete={onFileDelete}
            />
          </Col>
        </Row>
      </Card>
    </Spin>
  )
}
