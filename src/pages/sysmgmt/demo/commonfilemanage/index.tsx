import React, { useState } from 'react'
import { Checkbox } from 'antd'
import { Card } from 'gantd'
import { connect } from 'dva'
import { FileManagement } from '@/components/specific'
import { tr, Title } from '@/components/common'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

/**
 * 多文件上传示例页面
 */
export default connect(({ settings }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
}))((props: any) => {
  const { MAIN_CONFIG, route } = props
  const height = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
  const [addAble, setAddAble] = useState<boolean>(true)
  const [officeAble, setOfficeAble] = useState(false)
  const [downloadAble, setDownloadAble] = useState<boolean>(true)
  const [editAble, setEditAble] = useState<boolean>(true)
  const [deleteAble, setDeleteAble] = useState<boolean>(true)
  const [previewAble, setPreviewAble] = useState<boolean>(true)
  const [switchAble, setSwitchAble] = useState<boolean>(true)

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      title={<Title route={route} />}
      extra={(
        <>
          <Checkbox checked={officeAble} onChange={e => setOfficeAble(e.target.checked)}>{tr('允许处理office文档')}</Checkbox>
          <Checkbox checked={addAble} onChange={e => setAddAble(e.target.checked)}>{tr('允许添加文档')}</Checkbox>
          <Checkbox checked={downloadAble} onChange={e => setDownloadAble(e.target.checked)}>{tr('允许下载')}</Checkbox>
          <Checkbox checked={editAble} onChange={e => setEditAble(e.target.checked)}>{tr('允许编辑')}</Checkbox>
          <Checkbox checked={deleteAble} onChange={e => setDeleteAble(e.target.checked)}>{tr('允许删除')}</Checkbox>
          <Checkbox checked={previewAble} onChange={e => setPreviewAble(e.target.checked)}>{tr('允许预览')}</Checkbox>
          <Checkbox checked={switchAble} onChange={e => setSwitchAble(e.target.checked)}>{tr('允许切换视图')}</Checkbox>
        </>)}
      className='specialCardHeader'
    >
      <FileManagement
        officeAble={officeAble}
        addAble={addAble}
        downloadAble={downloadAble}
        editAble={editAble}
        deleteAble={deleteAble}
        previewAble={previewAble}
        switchAble={switchAble}
        height={height}
      />
    </Card>
  )
})
