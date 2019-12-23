import React, { useState } from 'react'
import { Button, Alert, Popover, Input } from 'antd'
import { Card } from 'gantd'
import { getSystemDateString, getSystemDate } from '@/utils/date'
import { generateUuid, getModelData } from '@/utils/utils'





const Page = (props: any) => {
  const [description, setDescription] = useState('')
  const [path, setPath] = useState('')

  return <Card title="分割型面板" bodyStyle={{ padding: 10 }}>
    <Alert
      message="打印的信息"
      description={description}
      type="info"
      showIcon
    />
    <Button
      className="margin10"
      size="small"
      onClick={async () => {
        const str = await getSystemDate()
        setDescription(str)
      }}
    >
      获取系统时间
    </Button>
    <Button
      className="margin10"
      size="small"
      onClick={async () => {
        const str = await getSystemDateString('YYYY/MM/DD ')
        setDescription(str)
      }}
    >
      获取系统自定义格式化时间
    </Button>
    <Button
      className="margin10"
      size="small"
      onClick={async () => {
        const str = generateUuid()
        setDescription(str)
      }}
    >
      生成uuid
    </Button>
    <Popover
      title='获取model中数据'
      overlayStyle={{ width: 400 }}
      placement='bottom'
      content={(
        <>
          <Input size='small' className='marginv5' placeholder='路径(path),例如："config" 或者 "config.SYSMGMT_CONFIG.workflow"' onChange={(e) => setPath(e.target.value)} />
          <br />
          <Button
            size='small'
            type='primary'
            disabled={!path}
            onClick={() => {
              let res = '未获对应数据或者对应数据为undefined'
              try {
                const data = getModelData(path)
                res = typeof data === 'object' ? JSON.stringify(data, null) : (data || res)
              } catch (error) {
                res = error.message
              }
              setDescription(res)
            }}>获取</Button>
        </>
      )}
      trigger='click'
    >
      <Button
        className="margin10"
        size="small"
      >
        获取model中数据
      </Button>
    </Popover>

  </Card>
}

export default Page
