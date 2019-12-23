import React from 'react'
import { connect, Model } from 'dva'
import { Alert, Button, message } from 'antd'

const Page = (props: any) => {
  const { COMMON_CONFIG: {
    showStorageClear
  } } = props.config
  const handleClear = () => {
    localStorage.clear()
    message.success(tr('清理成功'))
    setTimeout(() => { window.location.reload() }, 500)
  }

  return <>
    <Alert
      message={tr('缓存清理')}
      description={
        tr('本地缓存包含用户界面配置信息') + '、 ' +
        tr('用户在本软件的浏览历史') + '、 ' +
        tr('菜单的收缩状态') + '、 ' +
        tr('表格的列宽度') + '、 ' +
        tr('智能查询和智能表格的自定义视图和筛选器') + '' +
        '……' + ',' +
        tr('如果您在使用过程中发生异常') + ', ' +
        tr('可以清理本地缓存试试')
      }
      type="info"
      showIcon
    />
    <Button style={{ width: '100%', marginTop: '10px' }} onClick={() => handleClear()}>{tr('清理本地缓存')}</Button>
  </>
}



export default connect(
  ({ config }: { config: Model }) => (
    {
      config
    }
  )
)(Page)