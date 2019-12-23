import React, { useCallback, useState } from 'react'
import Link from 'umi/link'
import { Popover, Spin } from 'antd'
import _ from 'lodash'
import { getStepDescriptionByProcessIdApi, getStepDescriptionByTemplateKeyApi } from '../service'

export interface TaskNameColumnProps {
  name: string
  stepId: string
  value: string
  type: 'processId' | 'templateKey'
}

/**
 * 任务名称列组件
 */
export default (props: TaskNameColumnProps) => {
  const {
    name,
    stepId,
    value,
    type
  } = props
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(false)

  const getStepDescriptionByProcessId = useCallback(async () => {
    let description = tr('[没有说明信息]')
    setLoading(true)
    let getFunc = type === 'templateKey' ? getStepDescriptionByTemplateKeyApi : getStepDescriptionByProcessIdApi
    try {
      let res = await getFunc(value, stepId)
      if (!_.isEmpty(res)) {
        description = res.replace(/\n/g, '<br/>')
      }
    } catch (error) {
      console.log('getStepDescriptionByProcessId error\
      n', error)
    }
    setLoading(false)
    setDescription(description)
  }, [type, value, stepId, description])

  const onVisibleChange = useCallback((visible: boolean) => {
    if (visible && !description) {
      getStepDescriptionByProcessId()
    }
  }, [getStepDescriptionByProcessId])

  return (
    <Popover
      title={`${tr('审批任务 - ')}${name}`}
      content={(
        <div style={{ textAlign: loading ? 'center' : 'left' }}>
          <Spin spinning={loading} />
          {description}
        </div>
      )}
      trigger='click'
      onVisibleChange={onVisibleChange}
      overlayStyle={{ width: '480px' }}
      placement='right'
    >
      <Link to='#'>{name}</Link>
    </Popover>
  )
}
