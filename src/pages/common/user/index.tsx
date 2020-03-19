import React from 'react';
import { Icon, Button } from 'antd';
import { connect } from 'dva'
import { Header, Card } from 'gantd'
import { getContentHeight } from '@/utils/utils'

const Page = (props: any) => {
  const { match: { params: { id } }, MAIN_CONFIG } = props
  const minHeight = getContentHeight(MAIN_CONFIG, 40 + 3);
  return (<Card
    bodyStyle={{ padding: 0, height: minHeight, display:'flex',alignItems:'center',justifyContent:'center' }}
    title={
      <>
        <Button
          size="small"
          icon='left'
          className='gant-margin-h-5'
          onClick={() => window.history.back()}
        />
        <Icon type="user" /> {tr('用户详情')}
      </>
    }
  >
    <h1>空页面示例</h1>
  </Card >
  )
}


export default connect(({ user, settings, loading }: { user: any, settings: any, loading: any }) => ({
  currentUser: user.currentUser,
  ...settings
}))(Page)



