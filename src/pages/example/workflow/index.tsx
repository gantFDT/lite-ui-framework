import React, { useState, useCallback } from 'react'
import { Button, Input, Tooltip } from 'antd'
import { connect } from 'dva'
import { Card } from 'gantd'
import { Title } from '@/components/common'
import { MiniTaskApprovePanel } from '@/components/specific'
import OwnerSelectorModal from '@/components/specific/workflow/ownerselector/Modal'
import FlowChat from '@/components/specific/workflow/flowchart'

const selectedLoginNames = ['wf01', 'wf02']
const ownerList = [{ userLoginName: 'WF_TASK_OWNER_ALL', userId: 'temp' }]
const ownerList2 = [{ userLoginName: 'wf01', userId: 1 }, { userLoginName: 'wf02', userId: 2 }, { userLoginName: 'wf03', userId: 3 }, { userLoginName: 'wf04', userId: 4 }]

/**
 * 工作流相关组件示例
 */
export default connect(({ user }: any) => ({
  userLoginName: user.currentUser.userLoginName
}))((props: any) => {
  const [taskId, setTaskId] = useState('')
  const [processId, setProcessId] = useState('')
  const [templateKey, setTemplateKey] = useState('')
  const [ownerSelectorModalVisible, setOwnerSelectorModalVisible] = useState(false)
  const [miniTaskApprovePanelVisible, setMiniTaskApprovePanelVisible] = useState(false)
  const [flowChatVisible, setFlowChartVisible] = useState(false)

  const onTaskIdChange = useCallback((e: any) => {
    const tempId = e.target.value
    setTaskId(tempId)
    if (!tempId) {
      setMiniTaskApprovePanelVisible(false)
    }
  }, [])

  const onProcessIdChange = useCallback((e: any) => {
    const tempId = e.target.value
    setProcessId(tempId)
    if (!tempId && !templateKey) {
      setFlowChartVisible(false)
    }
  }, [templateKey])

  const onTemplateKeyChange = useCallback((e: any) => {
    const tempId = e.target.value
    setTemplateKey(tempId)
    if (!tempId && !processId) {
      setFlowChartVisible(false)
    }
  }, [processId])


  return (
    <Card
      bodyStyle={{ padding: 10 }}
      title={<Title />}
    >
      <Input placeholder='taskId' value={taskId} onChange={onTaskIdChange} className='marginv10' />
      <Input placeholder='processId' value={processId} onChange={onProcessIdChange} className='marginv10' />
      <Input placeholder='templateKey' value={templateKey} onChange={onTemplateKeyChange} className='marginv10' />
      <Button size='small' onClick={() => setOwnerSelectorModalVisible(true)} className='marginv10'>{tr('显示候选人选择器组件')}</Button>
      <Tooltip title='只有输入当前用户正确的taskId,mini审批组件才能真正的显示'>
        <Button disabled={!taskId} className='marginh10' size='small' onClick={() => setMiniTaskApprovePanelVisible(!miniTaskApprovePanelVisible)}>{miniTaskApprovePanelVisible ? '隐藏' : '显示'}mini审批组件</Button>
      </Tooltip>
      <Tooltip title='需输入processId或者templateKey'>
        <Button disabled={!processId && !templateKey} className='marginh10' size='small' onClick={() => setFlowChartVisible(!flowChatVisible)}>{flowChatVisible ? '隐藏' : '显示'}流程图组件</Button>
      </Tooltip>
      <OwnerSelectorModal
        ownerList={ownerList2}
        selectedLoginNames={selectedLoginNames}
        visible={ownerSelectorModalVisible}
        onCancel={() => setOwnerSelectorModalVisible(false)}
        onOk={() => setOwnerSelectorModalVisible(false)}
      />
      {miniTaskApprovePanelVisible && (
        <MiniTaskApprovePanel
          title='mini审批组件示例'
          taskId={taskId}
          processId={processId}
          hiddenOnManual={false}
          headerProps={{
            type: '1'
          }}
          onApproved={(restaskId) => console.log('onApproved', restaskId)}
        />
      )}
      {flowChatVisible && (
        <FlowChat
          height='300px'
          width='100%'
          processId={processId}
          templateKey={templateKey}
        />
      )}
    </Card>
  )
})
