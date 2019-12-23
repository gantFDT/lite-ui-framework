import React, { useCallback, useState, Dispatch } from 'react';
import { Popover } from 'antd';
import { connect } from 'dva'
import { FilePreview } from '@/components/specific'
export interface MailColumnProps {
  [propName: string]: any
}


const MailColumn = (props: MailColumnProps) => {

  const { id, mailTemplateList } = props;
  const renderInfo = mailTemplateList.find(item => item.id == id);
  const _content = renderInfo && renderInfo.content ? renderInfo.content : ''
  const _name = renderInfo && renderInfo.name ? renderInfo.name : ''
  let content = {content:_content,name:_name}
  
  return (<div>
    <FilePreview noIcon={true} showText={<div style={{display:'inline',cursor:'pointer'}}>{_name}</div>} file={content} directShow={true} />
  </div>)

}

export default connect(
  ({ mailtemplate }: any) => ({
    ...mailtemplate,
  }),
  (dispatch: Dispatch<any>) => ({

  })
)(MailColumn)

