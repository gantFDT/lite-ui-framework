import React, { useState } from 'react'
import { EditStatus, SwitchStatus, Card } from 'gantd'
import { Icon, Button } from 'antd'
import { ImageUpload, FileUpload } from '@/components/form'
import { SingleFileUpload } from '@/components/specific'
import { getContentHeight } from '@/utils/utils'

const Page = props => {
  const minHeight = getContentHeight(MAIN_CONFIG)
  const [edit, setedit] = useState(EditStatus.CANCEL)
  const [images, setimages] = useState([])

  return (
    <Card
      title={(
        <>
          <Icon
            type="left"
            onClick={() => { window.history.back() }}
          />
          {tr('Upload 图片上传/文件上传')}
        </>
      )}
      style={{ minHeight }}
    >
      <FileUpload />
      <div>
        <Button size="small" icon='edit' onClick={() => { setedit(SwitchStatus) }}>{tr('切换编辑状态')}</Button>
        <Button size="small" icon='save' onClick={() => { setedit(EditStatus.SAVE) }} type='primary'>{tr('确定')}</Button>
      </div>
      <ImageUpload value={images} onChange={setimages} edit={edit} />
      <br />
      <SingleFileUpload
        btnText='SingleFileUpload 圆形 点击上传'
        onSuccess={(file) => console.log('上传文件信息', file)}
        extraBtnProps={{
          icon: 'upload',
          type: 'primary'
        }}
        tooltip='点击上传'
        extraTooltipProps={{
          placement: 'left'
        }}
      />
      <SingleFileUpload
        btnText='SingleFileUpload 线型 点击上传'
        onSuccess={(file) => console.log('上传文件信息', file)}
        extraBtnProps={{
          icon: 'upload',
          type: 'primary'
        }}
        tooltip='点击上传'
        extraTooltipProps={{
          placement: 'left'
        }}
        type='line'
      />
    </Card>
  )
}

export default Page
