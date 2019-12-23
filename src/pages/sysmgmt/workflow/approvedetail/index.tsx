import React, { useMemo } from 'react'
import { connect } from 'dva'
import { TabsProps } from 'antd/lib/tabs'
import { Card, Icon } from 'gantd'
import { resolveLocationQuery, getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import ApproveTaskPanel from '@/components/specific/workflow/approvetaskpanel'

const DEFAULT_TAB_PROPS: TabsProps = {
  tabPosition: 'top',
  animated: false,
}

/**
 * 审批流程详情页
 */
export default connect(({ user, settings }: any) => ({
  userId: user.currentUser.id,
  userLoginName: user.currentUser.userLoginName,
  MAIN_CONFIG: settings.MAIN_CONFIG
}))((props: any) => {
  const {
    location,
    userLoginName,
    MAIN_CONFIG
  } = props

  // 容器高度
  const wrapperHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
  // 内容高度
  const height = useMemo(() => {
    return `calc(${wrapperHeight} - 35px)`
  }, [wrapperHeight])

  const params = useMemo(() => {
    return resolveLocationQuery(location.query)
  }, [JSON.stringify(location.query)])
  const { resourceName } = params

  const dynamicCmpProps = useMemo(() => {
    const { processId, taskId = '', feedback, taskType } = params
    return {
      processId,
      taskId,
      userLoginName,
      feedback,
      taskType,
      width: '100%',
      height
    }
  }, [userLoginName, params, height])

  return (
    <Card
      title={(<>
        <Icon.Ant type='left' className='margin5' onClick={() => window.history.back()} />
        {`${tr('流程运行过程 - ')}${resourceName}`}
      </>)}
      className='specialCardHeader'
      bodyStyle={{ padding: 0 }}
    >
      <ApproveTaskPanel {...dynamicCmpProps} tabProps={DEFAULT_TAB_PROPS} />
    </Card>
  )
})
