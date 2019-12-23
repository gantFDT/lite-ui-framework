import React, { useContext } from 'react'
import { SizeContext } from '@/utils/context'

/**
 * 动态菜单组件示例1
 */
export default (props: any) => {
  const {
    processId,
    taskId,
    feedback,
    recId,
    recTypeId,
    taskType,
    userLoginName,
    variables,
    onClose,
    refresh,
    width,
    height
  } = props

  return (
    <div style={{ width, height, border: 'var(--border-width-base) var(--border-style-base) var(--border-color-split)', padding: '10px' }}>
      <h3>{tr('下面是上下文菜单对应渲染组件可以接收到的参数列表（该组件路径：src\pages\example\workflowdetailmodal\menucomponentexample.tsx）')}</h3>
      <p><b>processId:</b>{processId}</p>
      <p><b>taskId:</b>{taskId}</p>
      <p><b>feedback:</b>{feedback}</p>
      <p><b>recId:</b>{recId}</p>
      <p><b>recTypeId:</b>{recTypeId}</p>
      <p><b>taskType:</b>{taskType}</p>
      <p><b>userLoginName:</b>{userLoginName}</p>
      <p><b>variables:</b>{JSON.stringify(variables)}</p>
      <p><b>refresh:</b>{typeof refresh}</p>
      <p><b>width:</b>{width}</p>
      <p><b>height:</b>{height}</p>
    </div>
  )
}
