import React, { useCallback, useEffect, useState } from 'react'
import { Form, Select, Input, Button, Row, Col, message } from 'antd'
import _ from 'lodash'
import { getLocale } from 'umi/locale'

import { connect } from 'dva'
import { tr } from '@/components/common/formatmessage'
import { RichTextEditor } from '@/components/form'
import { SmartModal } from '@/components/specific';
import styles from './index.less'

const InputGroup = Input.Group;
const { Option } = Select;
const locale = getLocale();
const COL_SPAN = 20
interface RichTextModalProps {
  [propName: string]: any
}

function RichTextModal(props: RichTextModalProps) {

  const {
    dataSource = {},
    visible,
    modalType,
    MAIN_CONFIG,
    onCreate,
    onCancel,
    form: { getFieldDecorator, validateFieldsAndScroll, getFieldsValue }
  } = props
  const { headerHeight } = MAIN_CONFIG

  const [mailName, setMailName] = useState(dataSource.name)
  const [mailKey, setMailKey] = useState(dataSource.key)
  const [mailType, setMailType] = useState(dataSource.category)
  const [content, setContent] = useState('')

  useEffect(() => {
    setMailName(dataSource.name)
    setMailKey(dataSource.key)
    setMailType(dataSource.category)
  }, [dataSource])


  const handlerSubmit = _.debounce((): any => {
    validateFieldsAndScroll((errors: any, formatValues: object) => {
      if (errors) return;
      const values = getFieldsValue()
      const { mailName, mailKey, mailType } = values
      if (mailName && mailKey && mailType) {
        let params = {
          category: mailType,
          content,
          imageIds: [],
          key: mailKey,
          name: mailName
        }
        modalType === 'create' ? null : params = {
          ...params,
          id: dataSource.id
        }
        onCreate(params)
      } else {
        return message.warning(tr('请完善邮件模版信息！'))
      }
    })
  }, 300)

  useEffect(() => {
    const _content = dataSource.content ? dataSource.content : ''
    setContent(_content)
  }, [dataSource])

  return (
    <SmartModal
      itemState={{
        width: 960,
        height: 560
      }}
      id='rechtextmodal'
      destroyOnClose
      visible={visible}
      title={modalType === 'create' ? tr('发布邮件模版') : `${tr('更新邮件模版')}--${dataSource.name}`}
      bodyStyle={{ padding: "10px" }}
      onCancel={onCancel}
      footer={
        <>
          <Button size="small" onClick={onCancel}>{tr('取消')}</Button>
          <Button
            size="small"
            type='primary'
            onClick={handlerSubmit}
          >{tr("保存")}
          </Button>
        </>
      }
    >
      <Row type='flex' justify='center'>
        <Col span={COL_SPAN}>
          <Form>
            <Row gutter={24}>
              <Col span={8}>
                <Form.Item label='邮件模版名称'>
                  {getFieldDecorator('mailName', {
                    rules: [{ required: true, message: '请输入邮件模版名称' }],
                    initialValue: mailName
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='邮件模版key'>
                  {getFieldDecorator('mailKey', {
                    rules: [{ required: true, message: '请输入邮件模版key' }],
                    initialValue: mailKey
                  })(
                    <Input />
                  )}
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item label='邮件类型'>
                  {getFieldDecorator('mailType', {
                    rules: [{ required: true, message: '邮件类型' }],
                    initialValue: mailType
                  })(
                    <Select>
                      <Option value="SYSTEM_MAIL">{tr('系统邮件')}</Option>
                      <Option value="WORK_MAIL">{tr('工作邮件')}</Option>
                    </Select>
                  )}
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col span={COL_SPAN}>
          <RichTextEditor
            content={content}
            onChange={setContent}
            api='/mailTemplate/weUpload'
          />
        </Col>
      </Row>
    </SmartModal>
  )

}

export default connect(({ settings }: any) => ({
  ...settings
}))(Form.create()(RichTextModal))



