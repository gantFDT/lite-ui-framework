import React, { useState } from 'react'
import { EditStatus, SwitchStatus, Card } from 'gantd'
import { Icon } from 'antd'
import { getContentHeight } from '@/utils/utils'
import { CodeList } from '@/components/form'

const Page = props => {
  const minHeight = getContentHeight(MAIN_CONFIG)

  const [edit, setedit] = useState(EditStatus.CANCEL)
  const [value, setValue] = useState(true)
  return (
    <Card
      title={<>
        <Icon
          type="left"
          onClick={() => { window.history.back() }}
        />
        Codelist-COMMON_BOOLEAN_TYPE 布尔枚举
      </>}
      style={{ minHeight }}
    >
      <div style={{ lineHeight: '40px' }}>
        <CodeList type="COMMON_BOOLEAN_TYPE" edit={edit} value={value} onChange={setValue} onSave={(id, value, cb) => cb()} />
      </div>
    </Card>
  )
}

export default Page
