import React from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'
import { FileManagement } from '@/components/specific'
import { Title } from '@/components/common'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

/**
 * 平台管理-office文件在线管理页面
 */
export default connect(({ settings }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
}))((props: any) => {
  const { MAIN_CONFIG, route } = props
  const height = getContentHeight(MAIN_CONFIG, CARD_BORDER_HEIGHT)

  return (
    <Card bodyStyle={{ padding: 0 }}>
      <FileManagement
        title={<Title route={route} />}
        height={height}
        officeAble
        headerProps={{
          className: 'specialHeader'
        }}
      />
    </Card>
  )
})
