import React from 'react'

export const templateColumn = [
  {
    title: tr('名称'),
    dataIndex: 'customName',
  }
]

export const detailColumn = [
  {
    title: tr('任务名称'),
    dataIndex: 'stepName',
    width: 150
  },
  {
    title: tr('操作候选人'),
    dataIndex: 'displayUserName',
    render: (text: string, record: any) => {
      const { owners = [] } = record
      const displayUserName = owners.reduce((res: string, owner: any) => {
        const { userName } = owner
        res = res.length > 0 ? `${res},${userName}` : userName
        return res
      }, '')
      return <div>{displayUserName}</div>
    }
  }
]
