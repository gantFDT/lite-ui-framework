import React, { useState, useCallback } from 'react'
import { connect } from 'dva'
import { Input } from 'antd'
import { Card } from 'gantd'
import { Title } from '@/components/common'
import { RichTextEditor } from '@/components/form'
import styles from './index.less'

export default connect(({ user }: any) => ({
  userId: user.currentUser.id
}))((props: any) => {
  const { route } = props
  const [content, setContent] = useState('<p>初始内容,上面的textarea中，可以看到编辑的HTML</p>')

  const onChange = useCallback((html: string) => {
    setContent(html)
  }, [])

  return (
    <Card title={<Title route={route} />}>
      <Input.TextArea readOnly style={{ height: 200 }} value={content} onChange={(e) => setContent(e.target.value)} />
      <br />
      <br />
      <RichTextEditor
        content={content}
        onChange={onChange}
        className={styles.editor}
        api='/help/weUpload'
      />
    </Card>)
})
