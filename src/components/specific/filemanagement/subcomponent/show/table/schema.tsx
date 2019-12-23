import React from 'react'
import { getFileUnit } from '@/utils/utils'
import { UserColumn } from '@/components/specific'

export default [
  {
    title: tr('文档名称'),
    align: 'left',
    dataIndex: 'name',
    width: 360,
    // sorter: (a: any, b: any) => { return a.name.length - b.name.length }
  },
  {
    title: tr('文件大小'),
    dataIndex: 'size',
    width: 120,
    // sorter: (a: any, b: any) => parseInt(a.size) - parseInt(b.size),
    render: (size: number, { type }: any) => type === 'folder' ? null : <span>{getFileUnit(size)}</span>
  },
  {
    title: tr('上传者'),
    dataIndex: 'createUserId',
    width: 150,
    render: (createUserId: string) => <UserColumn id={createUserId} />,
    // sorter: (a: any, b: any) => a.createUserId - b.createUserId
  },
  {
    title: tr('上传时间'),
    dataIndex: 'createDate',
    width: 160,
    // sorter: (a: any, b: any) => {
    //   let t1 = new Date(a.createDate).getTime()
    //   let t2 = new Date(b.createDate).getTime()
    //   return t1 - t2
    // }
  },
  {
    title: tr('描述'),
    width: 390,
    dataIndex: 'description',
    // sorter: (a: any, b: any) => {
    //   let str1 = a.description
    //   let str2 = b.description
    //   if (typeof str1 === 'string' && typeof str2 === 'string') {
    //     return str1.length - str2.length
    //   } else if (typeof str1 === 'string' && !str2) {
    //     return 1
    //   } else if (typeof str2 === 'string' && !str1) {
    //     return -1
    //   } else {
    //     return 0
    //   }
    // }
  }
]
