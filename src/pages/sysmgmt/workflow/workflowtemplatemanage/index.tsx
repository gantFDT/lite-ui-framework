import React, { useCallback, useState, useMemo, useEffect, Dispatch } from 'react'
import { Button } from 'antd';
import { debounce } from 'lodash'
import { Card } from 'gantd'
import { connect } from 'dva';
import { Title } from '@/components/common';
import { SmartTable, SmartSearch } from '@/components/specific'
import { searchSchema, tableSchema } from './schema'
import SmartModal from '@/components/specific/smartmodal'
import FlowChat from '@/components/specific/workflow/flowchart'
import { getUserIdentity, getTableHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, MODAL_HEADER_HEIGHT, MODAL_PADDING_HEIGHT } from '@/utils/utils'
import { TemplateInfo, TemplateTimeout, StartProcessModal } from './components'
import { EXPORT_URL } from './service'

const pageName: string = 'workflowTemplate';
const INIT_CHART_ITEM_STATE = {
  width: 960,
  height: 600,
}

const Page = (props: any) => {
  const {
    MAIN_CONFIG,
    route,
    userId,
    data,
    listFlowTemp,
    listSubFlowTemp,
    deployTemplate,
    listLoading,
    listSubLoading,
    deployLoading,
    updateLoading,
    updateTemplate,
    modifyTemplate,
    modifyLoading,
    modifyTimeoutLoading,
    modifyTemplateTimeout
  } = props;

  const [selectedRowKeys, setRowKeys] = useState<string[]>([]);
  const [selectedRows, setRows] = useState<any[]>([]);
  const [searcherSize, setSearcherSize] = useState({ height: 0, width: 0 });
  const [flowModelVisible, setFlowModelVisible] = useState(false);
  const [flowSize, setFlowSize] = useState<any>(INIT_CHART_ITEM_STATE);
  const [deployModalVisible, setDeployModalVivible] = useState(false)
  const [updateModalVisible, setUpdateModalVivible] = useState(false)
  const [modifyModalVisible, setModifyModalVivible] = useState(false)
  const [tiemoutModalVisibe, setTimeoutModalVisible] = useState(false)
  const [approveTaskPanelModalVisible, setApproveTaskPanelModalVisible] = useState(false)
  const bodyHeight = getTableHeight(MAIN_CONFIG, searcherSize.height + TABLE_HEADER_HEIGHT + CARD_BORDER_HEIGHT, false);
  const [expandedRowKeys, setExpandedRowKeys] = useState<any[]>([])
  const [contentId, setContentId] = useState('')

  const [selectedRow, notAllowOpt] = useMemo(() => {
    const tempRow: any = selectedRows[0] || {}
    const { status } = tempRow
    return [tempRow, status !== '活动']
  }, [selectedRows])

  const handlerSelect = useCallback((selectedRowKeys: string[], selectedRows: any[]) => {
    setRowKeys(selectedRowKeys)
    setRows(selectedRows)
  }, [setRowKeys, setRows])

  const handlerExpand = useCallback((expanded: boolean, record: any) => {
    const { id } = record
    if (expanded) {
      if (!record.children.length) {
        listSubFlowTemp({ node: id })
      }
      setExpandedRowKeys([...expandedRowKeys, id])
    } else {
      setExpandedRowKeys(expandedRowKeys.filter(item => item !== id))
    }
  }, [expandedRowKeys])

  const handlerSearch = useCallback((params: any, isInit: boolean) => {
    if (isInit && data.length > 0) return
    listFlowTemp(params)
  }, [])

  const showFlowModal = useCallback((id) => {
    setContentId(id)
    setFlowModelVisible(true);
  }, [])

  const handlerModalSizeChange = useCallback(debounce((width: number, height: number) => {
    setFlowSize({ width, height })
  }, 200), [])

  const fakeSchema = useMemo(() => {
    tableSchema[0].render = (text: string, record: any) => <a onClick={() => showFlowModal(record.contentId)}>{text}</a>
    return [...tableSchema]
  }, [tableSchema])

  useEffect(() => {
    return () => {
      setRowKeys([])
      setRows([])
      setExpandedRowKeys([])
    }
  }, [listLoading])

  // 发布
  const onDeploy = useCallback(async (params: any) => {
    try {
      await deployTemplate(params)
      setDeployModalVivible(false)
    } catch (error) {
      console.error('onDeploy error', error)
    }
  }, [])

  // 更新
  const onUpdate = useCallback(async (params: any) => {
    const payload = {
      fileEntityId: params.fileEntityId,
      id: selectedRow.id
    }
    try {
      await updateTemplate(payload)
      setUpdateModalVivible(false)
    } catch (error) {
      console.error('onUpdate error', error)
    }
  }, [selectedRow])

  // 更新模板
  const onModify = useCallback(async (params: any) => {
    const payload = {
      name: params.name,
      customOwner: params.strategy === true ? 'on' : '',
      id: selectedRow.id,
      category: selectedRow.category
    }
    try {
      await modifyTemplate(payload)
      setModifyModalVivible(false)
    } catch (error) {
      console.error('onModify error', error)
    }
  }, [selectedRow])

  // 更新超时阈值
  const onModifyTimeout = useCallback(async (params: any[]) => {
    const payload = {
      templateId: selectedRow.id,
      thresholds: params
    }
    try {
      await modifyTemplateTimeout(payload)
      setTimeoutModalVisible(false)
    } catch (error) {
      console.error('onModifyTimeout error', error)
    }
  }, [selectedRow])

  // 导出
  const onExport = useCallback(() => {
    const { userToken, userLoginName, userLanguage } = getUserIdentity()
    const { contentId, nameVersion } = selectedRow
    window.location.href = `${EXPORT_URL}?templateContentId=${contentId}&templateName=${nameVersion}&userLanguage=${userLanguage}&userLoginName=${userLoginName}&userToken=${encodeURIComponent(userToken)}`
  }, [selectedRow])

  return (
    <>
      <Card
        loading={false}
        bodyStyle={{ padding: '0px' }}
      >
        <SmartSearch
          isCompatibilityMode
          searchPanelId={pageName}
          userId={userId}
          title={<Title route={route} />}
          schema={searchSchema}
          onSearch={handlerSearch}
          onSizeChange={setSearcherSize}
          headerProps={{
            className: 'specialHeader'
          }}
        />
        <SmartTable
          tableKey={`${pageName}: ${userId} `}
          rowKey="id"
          schema={fakeSchema}
          dataSource={data}
          loading={listLoading || listSubLoading}
          expandedRowKeys={expandedRowKeys}
          onExpand={handlerExpand}
          rowSelection={{
            type: 'radio',
            selectedRowKeys,
            onChange: handlerSelect
          }}
          pagination={false}
          bodyHeight={bodyHeight}
          headerRight={(<>
            <Button
              icon="plus-circle"
              className="marginh5"
              size="small"
              type='primary'
              onClick={() => setDeployModalVivible(true)}
            >
              {tr('发布流程模板')}
            </Button>
            <Button
              icon="interaction"
              className="marginh5"
              type='primary'
              size="small"
              disabled={notAllowOpt}
              onClick={() => setUpdateModalVivible(true)}
            >
              {tr('更新流程模板')}
            </Button>
            <Button
              icon="edit"
              className="marginh5"
              size="small"
              type='primary'
              disabled={notAllowOpt}
              onClick={() => setModifyModalVivible(true)}
            >
              {tr('编辑流程信息')}
            </Button>
            <Button
              icon="control"
              className="marginh5"
              size="small"
              type='primary'
              disabled={notAllowOpt}
              onClick={() => setTimeoutModalVisible(true)}
            >
              {tr('设置超时阈值')}
            </Button>
            <Button
              icon="export"
              className="marginh5"
              size="small"
              type='primary'
              disabled={selectedRows.length === 0}
              onClick={onExport}
            >
              {tr('导出流程模板')}
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <Button
                icon="code"
                className="marginh5"
                size="small"
                type='primary'
                disabled={notAllowOpt}
                onClick={() => setApproveTaskPanelModalVisible(true)}
              >
                {tr('实验_启动流程')}
              </Button>
            )}
          </>)}
        />
      </Card>
      <SmartModal
        id='flowTempModal'
        title={`${tr('流程模板')} - ${selectedRow.nameVersion}`}
        visible={flowModelVisible}
        itemState={INIT_CHART_ITEM_STATE}
        footer={null}
        onCancel={() => { setFlowModelVisible(false) }}
        onSizeChange={handlerModalSizeChange}
      >
        <FlowChat
          contentId={contentId}
          width={flowSize.width - 2 * MODAL_PADDING_HEIGHT}
          height={flowSize.height - MODAL_HEADER_HEIGHT - 2 * MODAL_PADDING_HEIGHT}
        />
      </SmartModal>
      <TemplateInfo
        title={tr('发布流程模板')}
        visible={deployModalVisible}
        type='deploy'
        onClose={() => setDeployModalVivible(false)}
        onSubmit={onDeploy}
        btnLoading={deployLoading}
      />
      <TemplateInfo
        title={`${tr('更新流程模板')} -${selectedRow.name || ''} `}
        visible={updateModalVisible}
        type='update'
        onClose={() => setUpdateModalVivible(false)}
        onSubmit={onUpdate}
        btnLoading={updateLoading}
      />
      <TemplateInfo
        title={`${tr('编辑流程模板')} -${selectedRow.name || ''} `}
        visible={modifyModalVisible}
        type='modify'
        onClose={() => setModifyModalVivible(false)}
        onSubmit={onModify}
        btnLoading={modifyLoading}
        values={{
          name: selectedRow.name,
          strategy: selectedRow.customOwner === 'on'
        }}
      />
      <TemplateTimeout
        id={selectedRow.id || ''}
        title={selectedRow.name || ''}
        visible={tiemoutModalVisibe}
        onClose={() => setTimeoutModalVisible(false)}
        onSubmit={onModifyTimeout}
        btnLoading={modifyTimeoutLoading}
      />
      {process.env.NODE_ENV === 'development' && (
        <StartProcessModal
          visible={approveTaskPanelModalVisible}
          onClose={() => setApproveTaskPanelModalVisible(false)}
          templateKey={selectedRow.key}
        />
      )}
    </>
  )
}

export default connect(
  ({ workflowTemplate, loading, settings, user }: any) => ({
    ...workflowTemplate,
    userId: user.currentUser.id,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    listLoading: loading.effects[`${pageName}/listFlowTemp`],
    listSubLoading: loading.effects[`${pageName}/listSubFlowTemp`],
    deployLoading: loading.effects[`${pageName}/deployTemplate`],
    updateLoading: loading.effects[`${pageName}/updateTemplate`],
    modifyLoading: loading.effects[`${pageName}/modifyTemplate`],
    modifyTimeoutLoading: loading.effects[`${pageName}/modifyTemplateTimeout`],
  }),
  (dispatch: Dispatch<any>) => ([
    'listFlowTemp',
    'listSubFlowTemp',
    'deployTemplate',
    'updateTemplate',
    'modifyTemplate',
    'modifyTemplateTimeout'
  ].reduce((total, cur) => ({
    ...total,
    [cur]: (payload: any) => dispatch({ type: `${pageName}/${cur}`, payload })
  }), {}))
)(Page)
