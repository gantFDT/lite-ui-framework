import React, { useCallback, useState } from 'react'
import { Card } from 'antd'
import { CloudDownload } from '@ant-design/icons';

import AddModal from './addmodal'

const { Meta } = Card

const containerStyle = {
  width: '100%',
  height: '140px',
  padding: 12,
  paddingBottom: 0,
}
const snapshotStyle = {
  width: '100%',
  height: '100%',
  backgroundSize: '100% auto',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'top center',
  transition: 'all .2s'
}
const bodyStyle = {
  padding: 12
}

export default ({ snapshot, path, ...props }) => {

  const [visible, setvisible] = useState(false)
  const onClick = useCallback(
    () => {
      setvisible(true)
    },
    [],
  )
  return (
    <>
      <Card
        cover={
          <div style={containerStyle}>
            {snapshot ? <div style={{ ...snapshotStyle, backgroundImage: `url(data:image/png;base64,${snapshot})` }} /> : null}
          </div>
        }
        actions={[<CloudDownload onClick={onClick} />]}
        bodyStyle={bodyStyle}
      >
        <Meta title={path} description="www.instagram.com" />
      </Card>
      <AddModal visible={visible} title='添加模板' onCancel={() => setvisible(false)} path={`/${path}`} />
    </>
  )
}

