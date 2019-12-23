import React, { useState, useCallback, useEffect, useMemo } from 'react'
import { Modal, Form } from 'antd'
import { pick } from 'lodash'
import { getLocale } from 'umi/locale'

import { Input, EditStatus } from 'gantd'
import { IconHouse, tr } from '@/components/common'
import { SmartModal } from '@/components/specific'
import { getRealIcon } from '@/utils/utils'
import { TYPESMAP } from './menutypes'
import LanguageInput from '@/components/form/languageinput'


const locale = getLocale()
const localeMap = {
  'zh-CN': 'zh_CN',
  'en-US': 'en',
}
const systemLocale = localeMap[locale]

const defaultConfig = {
  withParent: false,
  withPath: false,
  withCode: false,
  withRecord: false,
  withRecordType: false,
  withIcon: false,
}
const menuTypeConfig = [
  { withIcon: true },
  { withPath: true, withIcon: true },
  { withParent: true, withIcon: true },
  { withParent: true, withPath: true, withIcon: true },
  { withCode: true },
  { withParent: true, withPath: true, withIcon: true },
  { withRecordType: true, withIcon: true },
  { withParent: true, withPath: true, withRecord: true, withIcon: true },
]


const MenuModal = ({ edit, form: { validateFields, getFieldDecorator, resetFields }, selected = {}, onCreate, update, type, menuType, visible, title, ...props }) => {

  const [loading, setloading] = useState(false)
  const {
    withParent,
    withPath,
    withCode,
    withRecord,
    withRecordType,
    withIcon,
  } = useMemo(() => ({ ...defaultConfig, ...menuTypeConfig[menuType] }), [menuType])


  const onOk = useCallback(() => {
    validateFields((err, value) => {
      if (err) return
      setloading(true)
      if (!edit) { // 创建
        const data = {
          ...value,
          type: TYPESMAP[type][+withPath],
          parentResourceId: withParent ? selected.id : "ROOT"
        }
        onCreate(data, () => setloading(false))
      } else {
        update({ ...selected, ...value })
      }
    })
  })

  useEffect(() => {
    resetFields()
  }, [visible])
  useEffect(() => setloading(false), [visible])

  const nameMap = useMemo(() => {
    if (edit) {
      try {
        return JSON.parse(selected.name)
      }
      catch{
        return {}
      }
    }
    return {}
  }, [selected, edit])


  // 计算title
  const computedTitle = useMemo(() => {
    if (!edit) return title
    return tr('编辑') + '-' + nameMap[systemLocale]
  }, [title, nameMap])

  return (
    <SmartModal
      {...props}
      id='menuModal'
      title={computedTitle}
      visible={visible}
      itemState={{
        width: 600,
        height: 500,
      }}
      onSubmit={onOk}
      confirmLoading={loading}
      destroyOnClose
    >
      <Form layout='vertical'>
        <Form.Item label={tr('名称')}>
          {
            getFieldDecorator('name', {
              // initialValue: edit ? { value: nameMap[systemLocale], locale: systemLocale } : { locale: systemLocale },
              initialValue: edit ? selected.name : '',
              rules: [
                {
                  required: true,
                  message: tr('请填写名称')
                }
              ]
            })(
              <LanguageInput cacheId={edit ? selected.id : 'empty'} />
            )
          }
        </Form.Item>
        {
          withPath ? (
            <Form.Item label={tr('操作地址')} required>
              {
                getFieldDecorator('path', {
                  initialValue: edit ? selected.path : '',
                  rules: [
                    {
                      required: true,
                      message: tr('请填写操作地址')
                    }
                  ]
                })(
                  <Input name='path' edit={EditStatus.EDIT} />
                )
              }
            </Form.Item>
          ) : null
        }
        {
          withRecordType ? (
            <Form.Item label={tr('记录类型')} required>
              {
                getFieldDecorator('path', {
                  initialValue: edit ? selected.path : '',
                  rules: [
                    {
                      required: true,
                      message: tr('请填写记录类型')
                    }
                  ]
                })(
                  <Input name='path' edit={EditStatus.EDIT} />
                )
              }
            </Form.Item>
          ) : null
        }
        {
          withRecord ? (
            <Form.Item label={tr('记录操作类型')} required>
              {
                getFieldDecorator('transactionCode', {
                  initialValue: edit ? selected.transactionCode : '',
                  rules: [
                    {
                      required: true,
                      message: tr('请填写记录类型')
                    }
                  ]
                })(
                  <Input name='transactionCode' edit={EditStatus.EDIT} />
                )
              }
            </Form.Item>
          ) : null
        }
        {
          // 只在移动端菜单添加页面的时候展示
          withCode ? (
            <Form.Item label={tr('页面编码')} required>
              {
                getFieldDecorator('path', {
                  initialValue: edit ? getRealIcon(selected.path) : '',
                  rules: [
                    {
                      required: true,
                      message: tr('请填写页面编码')
                    }
                  ]
                })(
                  <Input name='path' edit={EditStatus.EDIT} />
                )
              }
            </Form.Item>
          ) : null
        }
        {
          withIcon ? (
            <Form.Item label={tr('图标')}>
              {
                getFieldDecorator('icon', {
                  initialValue: edit ? selected.icon : '',
                })(
                  <IconHouse />
                )
              }
            </Form.Item>
          ) : null
        }
        <Form.Item label={tr('描述')}>
          {
            getFieldDecorator('description', {
              initialValue: edit ? selected.description : '',
            })(
              <Input.TextArea edit={EditStatus.EDIT} />
            )
          }
        </Form.Item>
      </Form>
    </SmartModal>
  )
}

export default Form.create({

})(MenuModal)