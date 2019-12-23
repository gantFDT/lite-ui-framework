import React, { useRef, useEffect, useCallback, useMemo } from 'react'
import { message } from 'antd'
import E from 'wangeditor'
import { isEqual as _isEqual } from 'lodash'
import classnames from 'classnames'
import isEqual from 'lodash/isEqual'
import { getUserIdentity, getModelData } from '@/utils/utils'
import { menus, lang } from './config'
import styles from './index.less'

interface RichTextEditorProps {
  content: string // 富文本内容
  onChange?: (html: string) => void // 编辑输入改变的回调
  className?: string // 自定义样式
  api?: string // 后端上传图片的地址
}

interface Result {
  data: {
    data: string[]
    errno: number
  },
  state: string
  success: boolean
}

/**
 * 富文本编辑器组件
 */
export default (props: RichTextEditorProps) => {
  const {
    content = '',
    onChange,
    className = '',
    api = ''
  } = props
  const contentRef = useRef(content)
  const editorWrapperRef = useRef(null)
  const editorRef = useRef<any>({})
  const onChangeRef = useRef(onChange)
  const headers = useMemo(getUserIdentity, [])

  const onChange_ = useCallback((html: string) => {
    contentRef.current = html
    const onChange = onChangeRef.current
    onChange && onChange(html)
  }, [])

  useEffect(() => {
    const editor = new E(editorWrapperRef.current)
    if (process.env.NODE_ENV === 'development') {
      editor.customConfig.debug = true
    }
    editorRef.current = editor
    editor.customConfig.menus = menus
    editor.customConfig.onchange = onChange_
    editor.customConfig.uploadImgShowBase64 = false
    editor.customConfig.lang = lang
    if (api) {
      editor.customConfig.uploadImgServer = `/api${api}`
      editor.customConfig.uploadImgHeaders = headers
      editor.customConfig.uploadImgMaxSize = getModelData('config.COMMON_CONFIG.uploadFileSize') * 1024 * 1024
      // 自定义上传图片错误提示
      editor.customConfig.customAlert = () => {
        message.warning(tr('上传图片失败'))
      }
      editor.customConfig.uploadImgHooks = {
        customInsert: (insertImg: (url: string) => void, result: Result, editor: any) => {
          const { data: { data, errno } } = result
          if (Array.isArray(data) && errno === 0) {
            data.forEach((url) => { insertImg(`/api/${url}`) })
          }
        }
      }
    }
    editor.create()
    editor.txt.html(content)
  }, [])

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useEffect(() => {
    const content_ = contentRef.current
    if (!isEqual(content, content_)) {
      editorRef.current.txt.html(content)
      contentRef.current = content
    }
  }, [content])

  return <div ref={editorWrapperRef} className={classnames(styles.editor, className)} />
}
