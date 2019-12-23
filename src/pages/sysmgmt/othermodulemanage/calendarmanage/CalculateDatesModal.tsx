import React, { useState, useMemo, useCallback } from 'react';

import { Form, DatePicker ,DatePicker} from 'antd';
import { SmartModal } from '@/components/specific';
import moment from 'moment'
const { RangePicker } = DatePicker;
export interface CalculateDatesProps {
  [propName: string]: any
}

const CalculateDatesForm = (props: CalculateDatesProps) => {

  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)

  const {
    form: { getFieldDecorator, validateFieldsAndScroll },
    visible,
    calChange,
    calCancel
  } = props;

  const handleOk = useCallback(() => {
    validateFieldsAndScroll((errors, values) => {
      if (errors) return;
      const params = {
        startDate: values.RangeDate[0].format('YYYY-MM-DD'),
        endDate: values.RangeDate[1].format('YYYY-MM-DD')
      }
      calChange && calChange(params)
    })
  }, [])

  const handleCancel = useCallback(() => {
    calCancel && calCancel()
  }, [])


  const onChange = useCallback((dates, dateStrings) => {
    let _startDate = dates[0]
    let _endDate = dates[1]
    setStartDate(_startDate) 
    setEndDate(_endDate)
  }, [setStartDate, setEndDate]);

  const formItemLayout = {
    labelCol: 24,
    wrapperCol: 24
  }


  return (
    <SmartModal
      id='calendarmodal'
      title={tr("计算日期")}
      visible={visible}
      onOk={handleOk}
      onCancel={handleCancel}
      destroyOnClose={true}
      cancelText={tr('退出')}
      okText={tr('计算')}
      okButtonProps={{ size: 'small' }}
      cancelButtonProps={{ size: 'small' }}
      itemState={{
        width:450,
        height:200
      }}
    >
      <Form layout={'vertical'} >
        <Form.Item label={tr('时间范围')} labelCol={{ span: 24 }} wrapperCol={{ span: 24 }}>
          {getFieldDecorator('RangeDate', {
            rules: [
              {
                required: true,
                message: tr('必须选择时间范围')
              }
            ]
          })(
            <RangePicker
              onChange={onChange}
              renderExtraFooter={() => null}
              style={{width:'100%'}}
            />
          )}
        </Form.Item>
      </Form>
    </SmartModal>
  )
}

export default Form.create()(CalculateDatesForm)

