import React, { useState, useCallback, useEffect } from 'react'
import { Select } from 'antd'
import { findTimingTaskAPI } from '../../service';
const { Option } = Select;

const SelectorFormItem = (props: any) => {
  const [dataSource, setDataSource] = useState([]);

  useEffect(() => {
    query()
  }, [])

  const query = useCallback(async () => {
    try {
      const res = await findTimingTaskAPI({});
      setDataSource(res);
    } catch (err) { console.log(err) }
  }, [])

  return (
    <Select placeholder={tr('请选择')} style={{ width: '100%' }} {...props}>
      {dataSource.map((item: any) => <Option
        value={item.serviceName}
        key={item.handleName}
        style={{ width: '100%' }}
      >{item.handleName}</Option>)}
    </Select>
  )
}

export default SelectorFormItem