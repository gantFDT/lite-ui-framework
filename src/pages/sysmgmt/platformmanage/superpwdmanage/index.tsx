import React, { useMemo } from 'react'
import { connect } from 'dva'
import { Card } from 'gantd'
import { Title } from '@/components/common'
import { PwdForm } from '@/pages/sysmgmt/account/settings/components/EditPwd'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

/**
 * 平台管理-设置超级管理员密码
 */
export default connect(({ settings, superPwdManage, loading }: any) => ({
  MAIN_CONFIG: settings.MAIN_CONFIG,
  oldPassword: superPwdManage.oldPassword,
  newPassword: superPwdManage.newPassword,
  confirmPassword: superPwdManage.confirmPassword,
  loading: loading.effects['superPwdManage/updateIP2AdminPassword']
}))((props: any) => {
  const {
    MAIN_CONFIG,
    route,
    oldPassword,
    newPassword,
    confirmPassword,
    loading,
    dispatch
  } = props

  const contentHeight = useMemo(() => {
    return getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
  }, [MAIN_CONFIG])

  return (
    <Card
      title={<Title route={route} />}
      bodyStyle={{ padding: 10, height: contentHeight }}
      className='specialCardHeader'
    >
      <PwdForm
        showBottomBtn
        oldPassword={oldPassword}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        loading={loading}
        dispatch={dispatch}
        dispatchType='superPwdManage/updateIP2AdminPassword'
      />
    </Card>
  )
})
