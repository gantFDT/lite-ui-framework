import React, { useCallback, useEffect, useState, useMemo, useRef } from 'react'
import _ from 'lodash'
import TableTransfer, { TableTransferInnerProps, Direction, Pageinfo } from '@/components/specific/tabletransfer'
import { getUserInfo } from '@/utils/user'
import { findByIdsExcludeIdsApi } from '../service'
import { searchSchema, tableColumn } from './schema'

export interface Owner {
  userId: string | number
  userLoginName: string
}

export interface BaseOwnerSelctorProps {
  selectedLoginNames: string[] // 已选中的用户名列表
  ownerList?: Owner[] // 可供选择的候选人列表
  isAllUser?: boolean // 是否选择所有人 当没有设置ownerList时，可以设isAllUser为true
}

export interface OwnerSelctorProps extends BaseOwnerSelctorProps {
  onChange: (selectedUsers: any[]) => void // 切换数据
  height: string | number // 整个组件高度
  width: string | number // 整个组件高度
  transKey: string // 组件唯一id
}

const DEFAULT_ARRAY: any[] = []
const INIT_PAGE_INFO = {
  pageSize: 50,
  beginIndex: 0,
  total: 0
}
const DEFAULT_COMMON = {
  extraSearchProps: {
    uiSchema: {
      'ui:col': 8
    }
  }
}
const DEFAULT_LEFT: TableTransferInnerProps = {
  ...DEFAULT_COMMON,
  title: tr('未选择用户'),
}
const DEFAULT_RIGHT: TableTransferInnerProps = {
  ...DEFAULT_COMMON,
  title: tr('已选择用户'),
}

/**
 * 候选人选择器面板
 */
export default (props: OwnerSelctorProps) => {
  const {
    selectedLoginNames = DEFAULT_ARRAY,
    ownerList = DEFAULT_ARRAY,
    isAllUser = false,
    onChange,
    height = 527,
    width,
    transKey
  } = props

  // 加载状态
  const [leftLoading, setLeftLoading] = useState(false)
  const [rightLoading, setRightLoading] = useState(false)
  // 列表数据
  const [leftData, setLeftData] = useState([])
  const [rightData, setRightData] = useState([])
  const leftDataRef = useRef<any[]>([])
  const rightDataRef = useRef<any[]>([])
  // 列表id
  const leftIdsRef = useRef<string[]>([])
  const rightIdsRef = useRef<string[]>([])
  // 分页
  const [leftPageInfo, setLeftPageInfo] = useState(INIT_PAGE_INFO)
  const leftPageInfoRef = useRef(INIT_PAGE_INFO)
  const [rightPageInfo, setRightPageInfo] = useState(INIT_PAGE_INFO)
  const rightPageInfoRef = useRef(INIT_PAGE_INFO)
  // 是否是所有用户
  const isAllUserRef = useRef(isAllUser)
  // 查询参数
  const leftParamsRef = useRef({})
  const rightParmasRef = useRef({})
  // 已选择所有用户
  const selectedUsersRef = useRef<any[]>([])

  // 请求数据
  const getData = useCallback(async (type: Direction | string, params: any = {}, pageInfo: Pageinfo) => {
    let loadingFunc = type === 'left' ? setLeftLoading : setRightLoading
    let setDataFunc = type === 'left' ? setLeftData : setRightData
    let dataRef: any = type === 'left' ? leftDataRef : rightDataRef
    let setPageFunc = type === 'left' ? setLeftPageInfo : setRightPageInfo
    let pageRef = type === 'left' ? leftPageInfoRef : rightPageInfoRef
    let paramsRef = type === 'left' ? leftParamsRef : rightParmasRef

    loadingFunc(true)

    let extraParams: any = {}

    if (type === 'left') {
      extraParams.onlyActive = true
      let isAllUser = isAllUserRef.current
      extraParams[isAllUser ? 'excludeIds' : 'ids'] = isAllUser ? [] : leftIdsRef.current
    } else {
      extraParams['ids'] = rightIdsRef.current
    }

    try {
      let res: any = await findByIdsExcludeIdsApi({
        filterInfo: {
          filterModel: true,
          ...extraParams,
          ...params
        },
        pageInfo: { beginIndex: pageInfo.beginIndex, pageSize: pageInfo.pageSize }
      })
      const { content, totalCount } = res
      // 存在列表数据
      setDataFunc(content)
      dataRef.current = content
      // 存储分页信息
      let newPageInfo = { ...pageInfo, total: totalCount }
      setPageFunc(newPageInfo)
      pageRef.current = newPageInfo
      // 记录查询参数
      paramsRef.current = params
    } catch (error) {

    }
    loadingFunc(false)
  }, [])

  const initFunc = useCallback(async () => {
    // 获得已选择用户ids
    let getUserInfos = selectedLoginNames.map(item => getUserInfo(null, item))
    let selectedUsers: any[] = await Promise.all(getUserInfos)
    selectedUsersRef.current = selectedUsers
    let rightIds = selectedUsers.map((item: any) => item.id)
    // 获取可选择用户id
    let leftIds = ownerList.map((item: any) => item.userId)
    leftIds = _.difference(leftIds, rightIds)
    // 判断是否是全部用户
    let isAllUser_ = isAllUser || ownerList.length > 0 && ownerList[0].userLoginName === 'WF_TASK_OWNER_ALL'
    isAllUserRef.current = isAllUser_
    leftIdsRef.current = leftIds
    rightIdsRef.current = rightIds
    getData('left', leftParamsRef.current, leftPageInfoRef.current)
    getData('right', rightParmasRef.current, INIT_PAGE_INFO)
  }, [selectedLoginNames, ownerList, isAllUser])

  useEffect(() => {
    initFunc()
  }, [initFunc])

  const dataSource = useMemo(() => {
    return _.unionBy([...leftData, ...rightData], 'id')
  }, [leftData, rightData])

  // 穿梭数据
  const onDataChange = useCallback((targetKeys: any[], direction: Direction, moveKeys: string[]) => {
    let leftData = leftDataRef.current
    let resSelectedUsers = []
    const selectedUsers = selectedUsersRef.current
    if (direction === 'right') {
      let moveUsers = leftData.filter((item) => moveKeys.includes(item.id))
      resSelectedUsers = [...selectedUsers, ...moveUsers]
    } else {
      resSelectedUsers = selectedUsers.filter((item) => !moveKeys.includes(item.id))
    }
    onChange && onChange(resSelectedUsers)
    setLeftLoading(true)
    setRightLoading(true)
  }, [])

  const onSearch = useCallback((direction: Direction, params: any, pageInfo: Pageinfo) => {
    getData(direction, params, pageInfo)
  }, [])

  return (
    <TableTransfer
      transKey={transKey}
      rowKey='id'
      dataSource={dataSource}
      targetKeys={rightData.map((item: any) => item.id)}
      schema={searchSchema}
      columns={tableColumn}
      height={height}
      width={width}
      left={{
        ...DEFAULT_LEFT,
        loading: leftLoading,
        pagination: {
          ...leftPageInfo
        }
      }}
      right={{
        ...DEFAULT_RIGHT,
        loading: rightLoading,
        pagination: {
          ...rightPageInfo
        }
      }}
      onSearch={onSearch}
      onChange={onDataChange}
    />
  )
}
