import React, { useState, useMemo, useCallback, Dispatch } from 'react'
import { Button, Tooltip, Modal } from 'antd'
import { connect } from 'dva'
import { SmartTable, SmartSearch, SmartModal } from '@/components/specific'
import { Card } from 'gantd'
import { smartTableSchema, smartSearchSchema, formModalSchema, customFileds } from './schema'
import { tr } from '@/components/common/formatmessage'
import TaskLogModal from './components/tasklogmodal'
import { Title } from '@/components/common'
import { cloneDeep } from 'lodash'
import { getTableHeight, TABLE_HEADER_HEIGHT } from '@/utils/utils'

const searchUISchema = {
  "ui:col": 8,
  "ui:labelCol": {},
  "ui:wrapperCol": {}
}

interface TaskListProps {
  [propName: string]: any
}

function TaskList(props: TaskListProps) {
  const pageKey: string = 'taskListTable'
  const {
    route,
    userId,
    primaryColor,
    MAIN_CONFIG,

    taskListParams,
    taskList,
    taskListTotal,
    taskListLoading,
    createLoading,
    updateLoading,

    taskLogList,
    taskLogParams,
    taskLogListTotal,
    logListLoading,

    getTaskList,
    createTask,
    removeTask,
    updateTask,
    testTask,
    getTaskLogList,
    resetLogParams,
    save,
  } = props;

  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);
  const [formModalType, setFormModalType] = useState('create');
  const [formVisible, setFormVisible] = useState(false);
  const [logVisible, setLogVisible] = useState(false);
  const [searchFormHei, setSearchFormHei] = useState(0);

  const onRefresh = useCallback(() => {
    getTaskList(taskListParams)
  }, [taskListParams])

  const handlerSelect = useCallback((selectedRowKeys: any, selectedRows: any) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [])

  const handleSearch = useCallback(({ filterInfo, pageInfo }, init) => {
    if (init && taskList.length) return;
    getTaskList({ filterInfo: { ...filterInfo, filterModel: true }, pageInfo })
  }, [taskList, getTaskList])

  const onPageChange = useCallback((beginIndex, pageSize) => {
    const newParams = { ...taskListParams, pageInfo: { beginIndex, pageSize } }
    save({ taskListParams: newParams })
  }, [taskListParams])

  const handlerRemove = useCallback(() => {
    let nowItem = taskList.find((item: any) => item.id == selectedRowKeys[0]);
    Modal.confirm({
      title: tr('请确认'),
      content: <span>{tr('是否删除选择的定时任务')} <span style={{ color: primaryColor }}>{nowItem && nowItem.name || tr('当前选择项')}</span></span>,
      onOk: () => {
        return new Promise((resolve, reject) => {
          removeTask({ id: selectedRowKeys[0] }, () => {
            setRowKeys([]);
            setRows([]);
            resolve();
          })
        }).catch(() => console.log('Oops errors!'));
      },
      cancelText: tr('取消'),
      okText: tr('确定'),
      okType: 'danger',
      okButtonProps: { size: 'small' },
      cancelButtonProps: { size: 'small' }
    });
  }, [taskList, selectedRowKeys])

  const onSubmit = useCallback((values: any) => {
    if (formModalType == 'create') {
      const { active } = values;
      values.active = active || false;
    }
    let cb = () => { setFormVisible(false) }
    formModalType === 'create' ? createTask(values, cb) : updateTask(values, cb)
  }, [formModalType])

  const openModal = useCallback((modalType) => {
    setFormModalType(modalType)
    setFormVisible(true);
  }, [])

  const handlerTestTask = useCallback(() => {
    testTask({ id: selectedRowKeys[0] })
  }, [selectedRowKeys])

  const handlerReadLog = useCallback(() => {
    setLogVisible(true)
  }, [])

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  const bodyHeight = useMemo(() => {
    return getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT)
  }, [searchFormHei])

  const hasRowSelected = useMemo(() => selectedRowKeys && selectedRowKeys.length, [selectedRowKeys])

  const headerRight = useMemo(() => (
    <>
      <Tooltip title={tr("新增定时任务")}>
        <Button size="small" onClick={openModal.bind(null, 'create')} icon='plus' />
      </Tooltip>
      <Tooltip title={tr("编辑定时任务")}>
        <Button size="small" onClick={openModal.bind(null, 'update')} icon='edit' disabled={!hasRowSelected} />
      </Tooltip>
      <Tooltip title={tr("删除定时任务")}>
        <Button size="small" icon='delete' type='danger' onClick={handlerRemove} disabled={!hasRowSelected} />
      </Tooltip>
      <Tooltip title={tr("测试定时任务")}>
        <Button size="small" onClick={handlerTestTask} icon='experiment' disabled={!hasRowSelected} />
      </Tooltip>
      <Tooltip title={tr("查看任务日志")}>
        <Button size="small" icon='read' onClick={handlerReadLog} disabled={!hasRowSelected} />
      </Tooltip>
      <Tooltip title={tr("刷新")}>
        <Button size="small" icon='reload' loading={taskListLoading} onClick={onRefresh} />
      </Tooltip>
    </>
  ), [hasRowSelected, taskListLoading, handlerRemove, handlerTestTask, onRefresh])

  const formModalTitle = useMemo(() => {
    if (formModalType === 'create') return tr('新增定时任务');
    let item = selectedRows.length && selectedRows[0] || {};
    return `${tr('编辑定时任务')}-${item.name || ''}`
  }, [formModalType, selectedRows])

  const _formModalSchema = useMemo(() => {
    if (formModalType === 'create') return formModalSchema
    let schema = cloneDeep(formModalSchema);
    delete schema.propertyType.serviceName;
    return schema;
  }, [formModalType])

  const values = useMemo(() => {
    let selectedId = selectedRowKeys[0];
    if (formModalType === 'create' || !selectedId) return {}
    let target = taskList.find((item: any) => item.id == selectedId)
    return target || {}
  }, [selectedRowKeys, taskList, formModalType])

  return (<>
    <Card className="specialCardHeader" bodyStyle={{ padding: 0 }}>
      <SmartSearch
        searchPanelId={pageKey}
        userId={userId}
        title={<Title route={route} />}
        schema={smartSearchSchema}
        isCompatibilityMode
        headerProps={{ className: 'specialHeader' }}
        onSearch={handleSearch}
        onSizeChange={onSearchFormSizeChange}
        uiSchema={searchUISchema}
        totalCount={taskListTotal}
        pageInfo={{
          pageSize: taskListParams.pageInfo.pageSize,
          beginIndex: taskListParams.pageInfo.beginIndex
        }}
      />
      <SmartTable
        tableKey={`${pageKey}: ${userId} `}
        rowKey="id"
        schema={smartTableSchema}
        dataSource={taskList}
        rowSelection={{
          type: 'radio',
          selectedRowKeys,
          onChange: handlerSelect
        }}
        headerRight={headerRight}
        bodyHeight={bodyHeight}
        loading={taskListLoading}
        pageSize={taskListParams.pageInfo.pageSize}
        pageIndex={taskListParams.pageInfo.beginIndex}
        // onReload={onRefresh}
        onPageChange={onPageChange}
        totalCount={taskListTotal}
        pageSizeOptions={['50', '100', '150', '200']}
      />
    </Card>
    <SmartModal
      id='taskManageModal'
      title={formModalTitle}
      visible={formVisible}
      values={values}
      itemState={{ height: 530 }}
      onCancel={() => { setFormVisible(false) }}
      onSubmit={onSubmit}
      confirmLoading={createLoading || updateLoading}
      schema={_formModalSchema}
      formSchemaProps={{ customFileds }}
    />
    <TaskLogModal
      taskId={selectedRowKeys[0]}
      userId={userId}
      visible={logVisible}
      loading={logListLoading}
      fetchFn={getTaskLogList}
      resetFn={resetLogParams}
      dataSource={taskLogList}
      params={taskLogParams}
      total={taskLogListTotal}
      onCancel={() => { setLogVisible(false) }}
    />
  </>)
}

export default connect(
  ({ taskManage, settings, user, loading }: any) => ({
    ...taskManage,
    ...settings,
    userId: user.currentUser.id,
    primaryColor: settings.MAIN_CONFIG.primaryColor,
    taskListLoading: loading.effects['taskManage/getTaskList'],
    createLoading: loading.effects['taskManage/createTask'],
    updateLoading: loading.effects['taskManage/updateTask'],
    logListLoading: loading.effects['taskManage/getTaskLogList']
  }),
  (dispatch: Dispatch<any>) => {
    const mapProps = {};
    ['getTaskList', 'createTask', 'updateTask', 'removeTask', 'testTask',
      'createUser', 'updateUser', 'removeUser', 'resetUserlist',
      'getTaskLogList', 'resetLogParams', 'save'
    ].forEach(method => {
      mapProps[method] = (payload: object, callback: Function, final: Function) => {
        dispatch({
          type: `taskManage/${method}`,
          payload,
          callback,
          final
        })
      }
    })
    return mapProps
  }
)(TaskList);
