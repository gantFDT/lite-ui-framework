import React, { useState } from 'react';
import { Icon } from 'antd';
import { SmartModal } from '@/components/specific'
import UIConfig from '@/components/specific/uiconfig'
import styles from './index.less'
const Page = (props: any) => {
  const { settings, UIConfigVisible, closeUIConfig } = props;
  const [height, setHeight] = useState(720)
  const close = () => {
    closeUIConfig()
  }
  return (
    <SmartModal
      id={'uiconfig' + '_modal_normal'}
      visible={UIConfigVisible}
      title={<><Icon type="control" /><span className="gant-margin-h-5">{tr('界面设置')}</span></>}
      onCancel={close}
      itemState={{
        width: 1200,
        height
      }}
      footer={null}
      className={styles.modalBody}
      isModalDialog
      maxZIndex={12}
      onSizeChange={(width, height) => {
        setHeight(height)
      }}
    >
      <UIConfig settings={settings} tabPosition='left' height={height - 125} />
    </SmartModal>
  )
}

export default Page