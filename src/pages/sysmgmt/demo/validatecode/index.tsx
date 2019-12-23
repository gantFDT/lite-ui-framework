import React, { useEffect, useCallback, useState } from 'react'
import { Button, Card } from 'antd'
import { connect } from 'dva'
import { SettingsProps } from '@/models/settings'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { getValidateCodeApi } from './services'

const style = {
  display: 'block',
  width: 150,
  height: 40
}
interface ValidateCodeProps extends SettingsProps {

}

const ValidateCode = (props: ValidateCodeProps) => {
  const { MAIN_CONFIG } = props
  const height = getContentHeight(MAIN_CONFIG, CARD_BORDER_HEIGHT)

  const [vCode, setVCode] = useState('');

  const refreshValidateCode = useCallback(() => {
    getValidateCodeApi({
      codeCount: 4,
      imageHeight: style.height,
      imageWidth: style.width
    }).then(ret => {
      setVCode(ret.content)
    })
  },[])
  
  useEffect(() => {
    refreshValidateCode()
  }, [refreshValidateCode])

  return (
    <Card bodyStyle={{ padding: 20, height }}>
      <Button onClick={() => refreshValidateCode()}>{tr('刷新验证码')}</Button>
      <img style={style} src={'data:image/jpeg;base64,' + vCode} alt={tr('验证码')}/>
    </Card>
  )
}

export default connect(
  ({ settings }: { settings: SettingsProps }) => ({
    ...settings,
  })
)(ValidateCode)
