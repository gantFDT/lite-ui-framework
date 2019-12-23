import React, { useCallback, useState, Dispatch } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva'
import { getUserIdentity } from '@/utils/utils'

export interface InDataProps {
  [propName: string]: any
}

const InData = (props: InDataProps) => {
  const { id , clientLogList } = props;
  const downloadInData = useCallback(() => {
  let renderInfo = clientLogList.find( item => item.id === id)
  if (renderInfo) {
    const { bizSerialNum } = renderInfo
    const url = `/api/integration/downloadLogData?logId=${id}&dataName=${bizSerialNum}`
    const { userToken, userLoginName, userLanguage } = getUserIdentity();
    location.href  = `${url}?userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  }else{
    return 
  }
    
  },[])

  return (<Icon type='download' onClick={() => downloadInData()} />)
}

export default connect(
  ({ clientLogManage }: any) => ({
    ...clientLogManage,
  }),
  (dispatch: Dispatch<any>) => ({

  })
)(InData)

