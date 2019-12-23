import React from 'react'
import { Button, Card } from 'antd'
import { connect } from 'dva'
import { SettingsProps } from '@/models/settings'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { success, error, warn, syserror } from './services'

const SUCCESS_TEXT = tr('ajax成功提示')
const WARNING_TEXT = tr('ajax警告提示')
const ERROR_TEXT = tr('ajax错误提示')
const SYSERROR_TEXT = tr('sys-error')

const style = {
  margin: 5,
}
interface AjaxInfo extends SettingsProps {

}

const AjaxInfo = (props: AjaxInfo) => {
  const { MAIN_CONFIG } = props
  const height = getContentHeight(MAIN_CONFIG, CARD_BORDER_HEIGHT)
  return (
    <Card bodyStyle={{ padding: 1, height }}>
      <Button style={style} onClick={() => success()}>{SUCCESS_TEXT}</Button>
      <Button style={style} onClick={() => warn()}>{WARNING_TEXT}</Button>
      <Button style={style} type='danger' onClick={() => error()}>{ERROR_TEXT}</Button>
      <Button style={style} type='danger' onClick={() => syserror()}>{SYSERROR_TEXT}</Button>
    </Card>
  )
}

export default connect(
  ({ settings }: { settings: SettingsProps }) => ({
    ...settings,
  })
)(AjaxInfo)
