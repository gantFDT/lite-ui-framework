import React, { useMemo } from 'react'
import { Popover } from 'antd'
import { Table } from 'gantd'
import Link from 'umi/link'
import { getUserInfo } from '@/utils/user'
import tableSchema from './schema'

export interface Owner {
  userLoginName: string
  userName: string
  selected?: boolean
}

export interface OwnerColumnProps {
  owners: Owner[]
  viewDetail?: boolean // 显示详情
}

/**
 * 操作候选人列组件
 */
export default (props: OwnerColumnProps) => {
  const {
    owners,
    viewDetail = true
  } = props

  const [userNames, dataSource, showDetail] = useMemo(() => {
    let userNames = owners.map(item => item.userName).join(',')
    let dataSource = owners
      .filter(item => item.userLoginName !== 'TASK_OWNER_SKIP')
      .map(item => {
        const { userLoginName } = item
        let user = getUserInfo(null, userLoginName) || {} as any
        const { organizationId = '' } = user

        return {
          userLoginName,
          organizationId
        }
      })
    let showDetail = dataSource.length > 0 && viewDetail
    return [userNames, dataSource, showDetail]
  }, [owners, viewDetail])

  return (
    showDetail
      ? (
        <Popover
          title={tr('用户信息')}
          overlayStyle={{ width: 700 }}
          placement='left'
          content={(
            <Table
              rowKey='userLoginName'
              dataSource={dataSource}
              columns={tableSchema}
              scroll={{
                y: 250
              }}
            />
          )}
          trigger='click'
        >
          <Link to='#'>{userNames}</Link>
        </Popover>
      )
      : <span>{userNames}</span >
  )
}
