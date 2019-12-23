import React from 'react'
import { Progress, Alert } from 'antd'
import FilenameColumn from '../filenamecolumn'

// 文件上传状态与process组件状态的关系映射
const UPLOAD_PROGRESS_STATUS_MAP = {
  uploading: 'active',
  done: 'success',
  error: 'exception'
}

export default [
  {
    title: tr('文档名称'),
    align: 'left',
    dataIndex: 'name',
    width: 200,
    render: (name: string) => <FilenameColumn name={name} width={200} />
  },
  {
    title: tr('文档描述'),
    dataIndex: 'description',
    width: 200
  },
  {
    title: tr('文件大小'),
    dataIndex: 'size',
    width: 100
  },
  {
    title: tr('状态'),
    dataIndex: 'state',
    width: 150,
    render: (state: any) => {
      const { isTurnRight, status, percent, errorMsg } = state
      const resStatus = !isTurnRight ? UPLOAD_PROGRESS_STATUS_MAP[state.status] : status
      return (
        <>
          {isTurnRight
            ? <span>{resStatus ? tr('保存成功') : tr('保存失败')}</span>
            : (
              <>
                {errorMsg
                  ? <Alert showIcon type='error' message={errorMsg} />
                  : <Progress percent={percent} status={resStatus} />}
              </>
            )}
        </>
      )
    }
  },
  {
    title: tr('操作'),
    dataIndex: 'operate',
    width: 100
  }
]
