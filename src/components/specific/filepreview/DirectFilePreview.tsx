import React, { useCallback, useState, Dispatch } from 'react';
import { connect } from 'dva'
import { SmartModal } from '@/components/specific'
import { Empty, Button } from 'antd'
export interface DirectFilePreviewProps {
  [propName: string]: any
}


const DirectFilePreview = (props: DirectFilePreviewProps) => {
  const { state , dispatch } = props;
  const { dirVisible ,currentPreviewFile:{ content , name }} = state


  const closePreViewModal = () => {
    dispatch({ payload: { dirVisible: false } })
  }
  return (<div
    style={{ maxWidth: '40px' }}
  >
    <SmartModal
      visible={dirVisible}
      title={`文件 ${name} 预览`}
      onCancel={closePreViewModal}
      footer={[
        <Button size="small" onClick={closePreViewModal}>{tr('关闭')}</Button>
      ]}
    >
      <div>{content ? <div dangerouslySetInnerHTML={{ __html: content }}></div> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}</div>
    </SmartModal>
  </div>)

}

export default connect(
  ({}: any) => ({
  }),
  (dispatch: Dispatch<any>) => ({

  })
)(DirectFilePreview)

