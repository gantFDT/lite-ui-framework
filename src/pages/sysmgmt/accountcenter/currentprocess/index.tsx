import React, { useCallback, useState, useEffect, useMemo } from 'react'
import { Button, Tooltip, message } from 'antd';
import { Card } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartSearch, SmartTable } from '@/components/specific'
import { smartSearchSchema, smartTableSchema, searchPanelId } from './schema'
import { SettingsProps } from '@/models/settings'
import { UserProps } from '@/models/user'
import { getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, showInfoMsg } from '@/utils/utils'
import { ModelProps } from './model'
import { SendToDashboard } from '@/components/specific/dashboard/components'
import { doBatchApprovalApi } from './service'
import DispatchLogModal from '@/components/specific/workflow/dispatchlogmodal'

const DEFAULT_PROCESSIDS_TASKIDS: [string[], string[]] = [[], []]

const Page = (props: any) => {
  const pageName: string = 'sysmgmtCurrentProcess';

  const {
    MAIN_CONFIG, route, userId,
    data,
    fetch, reload,
    listLoading,
    menu,
  } = props;

  //以下4项是发送到仪表板所需要维护的数据
  const [searchView, setSearchView] = useState({})
  const [filterViewParams, setFilterViewParams] = useState([])
  const [filterInfo, setFilterInfo] = useState([]);
  const [smartTalbeViewConfig, setSmartTalbeViewConfig] = useState({});

  const [selectedRowKeys, setRowKeys] = useState([]);
  const [selectedRows, setRows] = useState([]);

  const [searchFormHei, setSearchFormHei] = useState(0);
  const [approveLoading, setApproveLoading] = useState(false)
  const [dispatchLogModalVisible, setDispatchLogModalVisible] = useState(false)
  const [processIds, taskIds] = useMemo(() => {
    if (selectedRows.length === 0) return DEFAULT_PROCESSIDS_TASKIDS
    return selectedRows.reduce((res: [string[], string[]], item: any) => {
      const { id, processId } = item
      res[0].push(processId)
      res[1].push(id)
      return res
    }, [[], []])
  }, [selectedRows])

  const onSearchViewChange = useCallback((searchViewParams: any) => {
    setSearchView(searchViewParams)
  }, [])

  //smart高度改变
  const onSearchFormSizeChange = useCallback(({ height, width }) => {
    setSearchFormHei(height)
  }, [setSearchFormHei])

  //选中
  const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  //执行转派
  const handleTransTask = useCallback(() => {
    setDispatchLogModalVisible(true)
  }, [])

  //过滤
  const handleSearch = useCallback((params, isInit, filterViewParams) => {
    setFilterInfo(params);
    setFilterViewParams(filterViewParams)
    if (isInit) {
      return
    }
    reload(params)
  }, [reload])

  //初始化数据
  useEffect(() => {
    fetch();
  }, [])

  const bodyHeight = getTableHeight(MAIN_CONFIG, searchFormHei + TABLE_HEADER_HEIGHT + 1.5 * CARD_BORDER_HEIGHT, false)

  // 转派成功
  const onDispatched = useCallback(() => {
    reload({})
  }, [])

  // 批量处理
  const handleBatchApproval = useCallback(async () => {
    if (selectedRowKeys.length === 0) {
      message.warn(tr('请选择一条审批任务'))
    }
    setApproveLoading(true)
    try {
      message.loading(tr('任务处理中...'), 0)
      const msg = await doBatchApprovalApi(selectedRowKeys)
      message.destroy()
      showInfoMsg(msg)
      reload({})
    } catch (error) {
    }
    setApproveLoading(false)
  }, [selectedRowKeys])

  useEffect(() => {
    setRowKeys([])
    setRows([])
  }, [listLoading])

  return (<Card
    bodyStyle={{ padding: '0px' }}
  >
    <SmartSearch
      searchPanelId={searchPanelId}
      userId={userId}
      title={<Title route={route} />}
      schema={smartSearchSchema}
      isCompatibilityMode
      onSearch={handleSearch}
      onSizeChange={onSearchFormSizeChange}
      headerProps={{
        className: 'specialHeader'
      }}
      onViewChange={onSearchViewChange}
    />
    <SmartTable
      tableKey={`${pageName}:${userId}`}
      rowKey="id"
      schema={smartTableSchema}
      dataSource={data}
      loading={listLoading}
      rowSelection={{
        type: 'checkbox',
        selectedRowKeys,
        onChange: handleSelect,
        showFooterSelection: false
      }}
      bodyHeight={bodyHeight}
      onViewChange={(config: any) => setSmartTalbeViewConfig(config)}
      headerRight={<>
        <SendToDashboard
          type='SmartTable'
          name={tr('待处理任务')}
          configParams={{
            domain: pageName,
            searchMode: 'normal',
            queryUrl: '/workflowProcess/findProcessTasks',
            searchPanelId,
            searchViewConfig: searchView,
            initParams: filterViewParams,
            searchSchemaPath: 'sysmgmt/accountcenter/currentprocess/schema',
            filterInfo,
            columnsPath: 'sysmgmt/accountcenter/currentprocess/schema',
            tableViewConfig: smartTalbeViewConfig,
          }}
        />
        <Tooltip title={tr("批量审批")}>
          <Button
            size="small"
            icon="solution"
            type="default"
            className="marginh5"
            disabled={_.isEmpty(selectedRows)}
            onClick={handleBatchApproval}
            loading={approveLoading}
          >
            {tr('批量审批')}
          </Button>
        </Tooltip>
        <Tooltip title={tr("转派任务")}>
          <Button
            size="small"
            icon="retweet"
            type="default"
            className="marginh5"
            disabled={_.isEmpty(selectedRows)}
            onClick={handleTransTask}
          >
            {tr('转派任务')}
          </Button>
        </Tooltip>
      </>}
    />
    <DispatchLogModal
      processIds={processIds}
      taskIds={taskIds}
      visible={dispatchLogModalVisible}
      onClose={() => setDispatchLogModalVisible(false)}
      onDispatched={onDispatched}
    />
  </Card>)
}

export default connect(
  ({ sysmgmtCurrentProcess, settings, loading, user, menu }: { sysmgmtCurrentProcess: ModelProps, settings: SettingsProps, loading: any, user: UserProps, menu: any }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
    userLoginName: user.currentUser.userLoginName,
    menu,
    ...sysmgmtCurrentProcess,
    listLoading: loading.effects['sysmgmtCurrentProcess/fetch'] || loading.effects['sysmgmtCurrentProcess/reload']
  }),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch', 'reload'].forEach(method => {
      let stateName = '';
      if (method === 'fetch') {
        stateName = 'data'
      }
      mapProps[method] = (data: object) => {
        dispatch({
          type: `sysmgmtCurrentProcess/${method}`,
          payload: data,
          stateName
        })
      }
    })
    return mapProps
  }
)(Page)

