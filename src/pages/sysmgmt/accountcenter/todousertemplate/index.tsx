import React, { useEffect, useMemo, useCallback, useState } from 'react'
import { Row, Col, Tooltip, Button, Radio } from 'antd'
import { Table, BlockHeader, Card } from 'gantd'
import { connect } from 'dva'
import { Title } from '@/components/common'
import { getContentHeight, TABLE_HEADER_HEIGHT, CARD_BORDER_HEIGHT, TABLE_TITLE_HEIGHT, confirmUtil } from '@/utils/utils'
import { getWorkflowConfig } from '@/components/specific/workflow/utils'
import FlowChart from '@/components/specific/workflow/flowchart'
import TaskNameColumn from '@/components/specific/workflow/tasknamecolumn'
import { removeTaskUserTemplateApi, modifyMultiTaskUserTemplateApi } from './service'
import { PAGE_KEY } from './model'
import { templateColumn, detailColumn } from './schema'
import styles from './index.less'
import EditModal from './components/editmodal'

const LEFT_SPAN = 8
const RIGHT_SPAN = 16
const EMPTY_DESCRIPTION = tr('请先选择待办用户模板')

/**
 * 个人中心-待办用户模板
 */
export default connect(({ settings, todoUserTemplate, loading }: any) => ({
  ...todoUserTemplate,
  MAIN_CONFIG: settings.MAIN_CONFIG,
  fetchLoading: loading.effects[`${PAGE_KEY}/fetch`],
  classEventLoading: loading.effects[`${PAGE_KEY}/getClassEvents`],
  eventListnerLoading: loading.effects[`${PAGE_KEY}/getEventListners`]
}),
  (dispatch: any) => {
    const mapProps = {};
    ['fetch'].forEach(method => {
      mapProps[method] = (payload: Object) => {
        dispatch({
          type: `${PAGE_KEY}/${method}`,
          payload
        })
      }
    })
    return mapProps
  })((props: any) => {
    const { MAIN_CONFIG,
      fetch,
      sourceTemplates,
      templates,
      fetchLoading,
      route
    } = props
    const [selectedTemplateId, setSelectedTemplateId] = useState('')
    const [removeLoading, setRemoveLoading] = useState(false)
    const [editModalVisible, setEditModalVisible] = useState(false)
    const [editLoading, setEditLoading] = useState(false)
    const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([])

    const isSingle = useMemo(() => {
      const { todoUserTemplate } = getWorkflowConfig() || ({} as any)
      return todoUserTemplate === 'single'
    }, [])

    const [templateKey, taskUsers, selectedTitle, templateName] = useMemo(() => {
      const selectedTemplate: any = sourceTemplates.find((item: any) => item.id === selectedTemplateId) || {}
      const { wfTemplateKey, taskUsers: tempTaskUsers, wfTemplateName, wfTemplateVersion, name, } = selectedTemplate
      return [wfTemplateKey, tempTaskUsers || [], wfTemplateKey ? ` - ${wfTemplateName}_V${wfTemplateVersion}${isSingle ? '' : ` - ${name}`}` : '', name]
    }, [selectedTemplateId, sourceTemplates, isSingle])

    const todoUserTemplateTableHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + TABLE_TITLE_HEIGHT + TABLE_HEADER_HEIGHT + 2 * CARD_BORDER_HEIGHT)
    const [rightTableHeight, flowChartHeight] = useMemo(() => {
      const tempHeight = getContentHeight(MAIN_CONFIG, 40 + 20 + 2 * TABLE_TITLE_HEIGHT + 2 * TABLE_HEADER_HEIGHT + 8 * CARD_BORDER_HEIGHT)
      const tableHeight = `calc(${tempHeight} / 2)`
      return [tableHeight, `calc(${tableHeight} + ${TABLE_TITLE_HEIGHT - 4.5 * CARD_BORDER_HEIGHT}px)`]
    }, [MAIN_CONFIG])

    const loadData = useCallback(() => {
      fetch({ isSingle })
      setSelectedTemplateId('')
    }, [])

    useEffect(() => {
      if (sourceTemplates.length > 0) return
      loadData()
    }, [])

    // 待办用户列表table额外的配置
    const extraTableProps = useMemo(() => {
      const extra: any = {}
      if (isSingle) {
        extra.rowSelection = {
          type: 'radio',
          clickable: true,
          selectedRowKeys: selectedTemplateId ? [selectedTemplateId] : [],
          onChange: (selectedRowKeys: any) => {
            setSelectedTemplateId(selectedRowKeys[0])
          },
        }
      } else {
        extra.expandedRowRender = (record: any) => {
          const { data } = record
          return (
            <Radio.Group value={selectedTemplateId} onChange={(e) => setSelectedTemplateId(e.target.value)}>
              {data.map((item: any) => <Radio className={styles.radio} value={item.id}>{item.name}</Radio>)}
            </Radio.Group>
          )
        }

        extra.onExpand = (expand: boolean, record: any) => {
          const { customName } = record
          if (expand) {
            setExpandedRowKeys([...expandedRowKeys, customName])
          } else {
            setExpandedRowKeys(expandedRowKeys.filter(item => item !== customName))
          }
        }

        extra.expandRowByClick = true

        extra.expandedRowKeys = expandedRowKeys
      }
      return extra
    }, [templates, isSingle, selectedTemplateId, expandedRowKeys])

    // 待办用户列表tableSchema
    const showTableSchema = useMemo(() => {
      let temp: any[] = detailColumn
      return temp.map((item: any) => {
        const { dataIndex } = item
        if (dataIndex === 'stepName') {
          item.render = (name: string, record: any) => {
            const { stepId } = record
            return (
              <TaskNameColumn
                name={name}
                type='templateKey'
                value={templateKey}
                stepId={stepId}
              />
            )
          }
        }
        return item
      })
    }, [templateKey])

    // 删除实现
    const onRemoveImpl = useCallback(async () => {
      setRemoveLoading(true)
      try {
        await removeTaskUserTemplateApi(selectedTemplateId, isSingle)
        loadData()
      } catch (error) {
        console.error('removeTaskUserTemplateApi error', error)
      }
      setRemoveLoading(false)
    }, [selectedTemplateId, isSingle])

    // 删除modal
    const onRemove = useCallback(() => {
      confirmUtil({
        content: `${tr('是否删除待办用户模板')}: ${selectedTitle.slice(3)}`,
        onOk: onRemoveImpl,
        okLoading: removeLoading
      })
    }, [selectedTemplateId, selectedTitle, onRemoveImpl, removeLoading])

    // 编辑
    const onEditImpl = useCallback(async (userTemplateName: string) => {
      setEditLoading(true)
      try {
        await modifyMultiTaskUserTemplateApi({
          userTemplateId: selectedTemplateId,
          userTemplateName
        })
        loadData()
        setEditModalVisible(false)
      } catch (error) {
        console.error('modifyMultiTaskUserTemplateApi error', error)
      }
      setEditLoading(false)
    }, [selectedTemplateId])

    // 展开/收缩所有
    const handerAllExpand = useCallback(() => {
      setExpandedRowKeys(expandedRowKeys.length === 0 ? templates.map((item: any) => item.customName) : [])
    }, [templates, expandedRowKeys])

    return (
      <Card
        title={<Title route={route} />}
        bodyStyle={{ padding: '10px' }}
        className='specialCardHeader'
      >
        <Row gutter={10}>
          <Col span={LEFT_SPAN}>
            <BlockHeader
              type='line'
              title={tr('待办用户模板')}
              extra={(
                <>
                  {!isSingle && (
                    <Tooltip title={tr('修改名称')}>
                      <Button
                        disabled={!selectedTemplateId}
                        size='small'
                        icon='edit'
                        onClick={() => setEditModalVisible(true)}
                      />
                    </Tooltip>
                  )}
                  <Tooltip title={tr('删除模板')}>
                    <Button disabled={!selectedTemplateId} size='small' icon='delete' type='danger' onClick={onRemove} />
                  </Tooltip>
                  {!isSingle && (
                    <Tooltip title={expandedRowKeys.length > 0 ? tr('收缩所有') : tr('展开所有')}>
                      <Button size='small' icon={expandedRowKeys.length > 0 ? 'minus-square' : 'plus-square'} onClick={handerAllExpand} />
                    </Tooltip>
                  )}
                  <Tooltip title={tr('刷新')}>
                    <Button size='small' icon='reload' loading={fetchLoading} onClick={loadData} />
                  </Tooltip>
                </>
              )}
            />
            <Table
              tableKey={`${PAGE_KEY}_template`}
              rowKey={isSingle ? 'id' : 'customName'}
              loading={fetchLoading}
              dataSource={templates}
              columns={templateColumn}
              scroll={{ y: todoUserTemplateTableHeight }}
              {...extraTableProps}
            />
          </Col>
          <Col span={RIGHT_SPAN}>
            <BlockHeader
              type='line'
              title={`${tr('详细信息')}${selectedTitle}`}
            />
            <Table
              rowKey={`${PAGE_KEY}_taskUsers`}
              dataSource={taskUsers}
              columns={showTableSchema}
              scroll={{ y: rightTableHeight }}
              emptyDescription={EMPTY_DESCRIPTION}
            />
            <div style={{ height: '10px' }} />
            <BlockHeader
              type='line'
              title={`${tr('流程图')}${selectedTitle}`}
            />
            <FlowChart
              height={flowChartHeight}
              width='100%'
              templateKey={templateKey}
              emptyDescription={EMPTY_DESCRIPTION}
            />
          </Col>
        </Row>
        <EditModal
          visible={editModalVisible}
          onClose={() => setEditModalVisible(false)}
          loading={editLoading}
          onOk={onEditImpl}
          name={templateName}
        />
      </Card>
    )
  })
