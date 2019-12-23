
import React, { useState, Dispatch, useCallback } from 'react';

import { SmartModal } from '@/components/specific';
import { connect } from 'dva'

export interface CalRetModalProps {
  [propName: string]: any
}

const CalRetModal = (props: CalRetModalProps) => {

  const {
    modifyModel,
    calretVisible,
    calEndDate, 
    calStartDate,
    calculateDays: { totalDays, workingDays, unworkingDays } ,
  } = props;

  const handleOk = useCallback(() => {
    modifyModel({
      calretVisible:false
    })
  }, [])

  const handleCancel = useCallback(() => {
    modifyModel({
      calretVisible:false
    })
  }, [])



  return (
    <SmartModal
      id='CalRetModal'
      title={tr("计算结果")}
      visible={calretVisible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
      itemState={{
        width:450,
        height:300
      }}
    >
      <div>
        <p>{tr(`从${calStartDate}至${calEndDate}`)}</p>
        <p>{tr(`总天数：${totalDays}`)}</p>
        <p>{tr(`工作日天数：${workingDays}`)}</p>
        <p>{tr(`非工作日天数：${unworkingDays}`)}</p>
      </div>
    </SmartModal>
  )
}


export default connect(
  ({ calendarmanage , loading }: any) => ({
    ...calendarmanage
  }),
  (dispatch: Dispatch<any>) => ({
    modifyModel: (payload: any) => dispatch({ type: 'calendarmanage/save', payload }),

  }))(CalRetModal)

