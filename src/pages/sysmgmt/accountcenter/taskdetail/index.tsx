import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { connect } from 'dva'
import { Card, Icon } from 'gantd'
import { resolveLocationQuery, getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { getCodeName } from '@/utils/codelist'
import { ContextMenu } from '@/components/specific'
import ApproveTaskPanel from '@/components/specific/workflow/approvetaskpanel'
import _ from 'lodash'

export interface MenuOptions {
  mode: 'inline' | 'horizontal'
  collapsed: boolean
}

const DEFAULT_KEY = 'workflowDetailModal'
const TASK_NAME_MAPS = {
  current: tr('流程审批'),
  'current-approved': tr('流程审批'),
  history: tr('审批信息'),
  myStart: tr('审批信息')
}
const DEFAULT_MENU_OPTIONS: MenuOptions = {
  mode: 'horizontal',
  collapsed: false
}

/**
 * 任务详情页
 */
export default connect(({ user, settings }: any) => ({
  userId: user.currentUser.id,
  userLoginName: user.currentUser.userLoginName,
  MAIN_CONFIG: settings.MAIN_CONFIG
}))((props: any) => {
  const {
    location,
    userLoginName,
    MAIN_CONFIG,
    dispatch
  } = props

  // 容器高度
  const wrapperHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
  // 菜单高度
  const [menuHeight, setMenuHeight] = useState(0)
  // 内容高度
  const height = useMemo(() => {
    return menuHeight ? `calc(${wrapperHeight} - ${menuHeight}px)` : wrapperHeight
  }, [wrapperHeight, menuHeight])
  const [title, setTitle] = useState('')

  const params = useMemo(() => {
    return resolveLocationQuery(location.query)
  }, [JSON.stringify(location.query)])
  const { resourceName, moduleName } = params

  const getCodeNameImpl = useCallback(async () => {
    const typeName = await getCodeName('FW_WORKFLOW_BUSINESS_TYPE', moduleName)
    setTitle(`${typeName || ''} - ${resourceName}`)
  }, [])

  useEffect(() => {
    getCodeNameImpl()
  }, [resourceName, moduleName])

  const dynamicCmpProps = useMemo(() => {
    const { processId, taskId = '', feedback, taskType, resourceUri, variables } = params
    const uri = typeof resourceUri === 'string' ? resourceUri.split(':') : []
    const variablesObj = !Array.isArray(variables) ? {} : variables.reduce((res: any, item: any) => {
      const { variableName, variableValue } = item
      res[variableName] = variableValue
      return res
    }, {})
    return {
      processId,
      taskId: taskId,
      userLoginName,
      feedback: feedback,
      taskType,
      recTypeId: parseInt(uri[2], 10),
      recId: parseInt(uri[3], 10),
      variables: variablesObj,
      width: '100%',
      height: height,
      refresh: taskType === 'current' ? (() => dispatch({ type: 'sysmgmtCurrentProcess/reload', payload: {} })) : (() => { })
    }
  }, [userLoginName, params, height])

  const menuData = useMemo(() => {
    const { taskType } = dynamicCmpProps
    return [
      {
        name: TASK_NAME_MAPS[taskType],
        icon: null,
        component: <ApproveTaskPanel {...dynamicCmpProps} key={taskType} />
      }
    ]
  }, [dynamicCmpProps])

  const onMenuStateChange = useCallback((mode: 'inline' | 'horizontal', collapsed: boolean, target: HTMLElement) => {
    const { clientHeight } = target
    setMenuHeight(mode === 'horizontal' ? clientHeight : 0)
  }, [])

  return (
    <Card
      bodyStyle={{ padding: 0 }}
      title={(<>
        <Icon.Ant type='left' className='margin5' onClick={() => window.history.back()} />
        {title}
      </>)}
      className='specialCardHeader'>
      <ContextMenu
        title={null}
        category={`${dynamicCmpProps.recTypeId}`}
        contextMenuKey={DEFAULT_KEY}
        menuData={menuData}
        isShowFooter={false}
        menuOptions={DEFAULT_MENU_OPTIONS}
        dynamicCmpProps={dynamicCmpProps}
        minHeight={wrapperHeight}
        onMenuStateChange={onMenuStateChange}
      />
    </Card>
  )
})
