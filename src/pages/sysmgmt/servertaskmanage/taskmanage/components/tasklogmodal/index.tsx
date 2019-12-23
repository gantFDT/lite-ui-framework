import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Table, Icon } from 'gantd';
import { map } from 'lodash';
import { getCodeNameSync, getCodeList } from '@/utils/codelist';
import { SearchForm, SmartModal } from '@/components/specific'
import { logSearchFormSchema, logTableColumns } from '../../schema'

const pageKey = 'tasklogmodal'
const searchUISchema = {
  "ui:col": 8,
  "ui:labelCol": {},
  "ui:wrapperCol": {}
}

const ServiceList = (props: any) => {
  const {
    userId,
    visible,
    taskId,
    dataSource,
    params,
    total,
    loading,
    fetchFn,
    resetFn,
    onCancel,
  } = props

  const [modalHei, setModalHei] = useState(0);
  const [codeType, setCodeType] = useState([]);
  const { pageInfo, filterInfo } = params;

  useEffect(() => {
    visible ? initFetch() : resetFn()
  }, [visible])

  useEffect(() => {
    getCodeType()
  }, [])

  const initFetch = useCallback(() => {
    fetchFn({ filterInfo: { ...filterInfo, timerTaskId: taskId }, pageInfo })
  }, [taskId, pageInfo, filterInfo])

  const getCodeType = useCallback(async () => {
    const codeList = await getCodeList('FW_TASK_TRIGGER_TYPE');
    setCodeType(codeList);
  }, [])

  const onSearch = useCallback((values) => {
    fetchFn({ filterInfo: { ...filterInfo, ...values }, pageInfo })
  }, [pageInfo, filterInfo])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    fetchFn({ ...params, pageInfo: { beginIndex: beginIndex - 1, pageSize } })
  }, [params])

  //smart高度改变
  const onSizeChange = useCallback((width, height) => {
    setModalHei(height)
  }, [])

  const tableHei = useMemo(() => {
    return modalHei - 41 - 20 - 40 - 86 - 30 - 32
  }, [modalHei])

  const columns = useMemo(() => {
    return map(logTableColumns, (item) => {
      if (item.key == 'triggerType') {
        return { ...item, render: (text: string) => getCodeNameSync(codeType, text) }
      } else { return item }
    })
  }, [logTableColumns, codeType])
  
  return (
    <SmartModal
      id='tasklogmodal'
      visible={visible}
      title={tr('执行日志')}
      itemState={{ width: 640 }}
      onSizeChange={onSizeChange}
      onCancel={onCancel}
      footer={null}
    >
      <SearchForm
        title={tr('定时任务执行日志查询条件')}
        searchKey={pageKey}
        uiSchema={searchUISchema}
        schema={logSearchFormSchema}
        onSearch={onSearch}
      />
      <Table
        tableKey={`${pageKey}:${userId}`}
        columns={columns}
        rowKey='id'
        hideVisibleMenu
        loading={loading}
        dataSource={dataSource}
        scroll={{ x: '100%', y: tableHei }}
        pagination={{
          pageSizeOptions: ['50', '100', '150', '200'],
          total: total, //总条数
          current: pageInfo.beginIndex + 1, //当前页数
          pageSize: pageInfo.pageSize, //每页显示数
          onChange: onPageChange,
        }}
      />
    </SmartModal>
  )
}

export default ServiceList