import React, { useState, useRef } from 'react';
import { Button } from 'antd'
import { SplitPane } from '@/components/layout'
import { Card, BlockHeader } from 'gantd'
import { connect } from 'dva'
import { UserProps } from '@/models/user'
import { SettingsProps } from '@/models/settings'
import SimpleTable from '../simpletable'
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'

const Page = (props: any) => {
  const { MAIN_CONFIG, userId } = props;
  const bodyHeight = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT);
  const [leftWidthPercent, setLeftWidthPercent] = useState(0.3)
  const [rightWidthPercent, setRightWidthPercent] = useState(0)
  const thisRef: any = useRef();
  const onSizeChange = (size) => {
    console.log(size)
  }

  //下述方法为数据双向绑定，性能上会有损失，不建议使用
  // const expandRight = ()=>{
  // setLeftWidthPercent(0)
  // setRightWidthPercent(0.3)
  // }
  // const onSizeChange = (size)=>{
  //   const {leftWidthPercent,rightWidthPercent} = size;
  //   setLeftWidthPercent(leftWidthPercent)
  //   setRightWidthPercent(rightWidthPercent)
  // }

  return (
    <Card title="分割型面板" bodyStyle={{ padding: 0 }}>
      <SplitPane
        leftWidthPercent={leftWidthPercent}
        rightWidthPercent={rightWidthPercent}
        onSizeChange={onSizeChange}
        ref={thisRef}
        height={bodyHeight}
        leftPane={
          <div>
            {/* <BlockHeader title="左边" bottomLine={true} /> */}
            <div style={{ padding: 10 }}>
              <SimpleTable title="左边" />
            </div>
          </div>
        }
        centerPane={
          <div>
            <BlockHeader title="中间操作" bottomLine={true}
              extra={<>
                <Button size="small" onClick={() => { thisRef['current'].expandLeft() }}>展左</Button>
                <Button size="small" onClick={() => { thisRef['current'].collapseLeft() }}>收左</Button>
                <Button size="small" onClick={() => { thisRef['current'].expandRight() }}>展右</Button>
                <Button size="small" onClick={() => { thisRef['current'].collapseRight() }}>收右</Button>

                <Button size="small" onClick={() => { thisRef['current'].collapseLeft(); thisRef['current'].expandRight() }}>收左同时展右</Button>

              </>}
            />
            <div style={{ padding: 10 }}>
              <SimpleTable title="中间" />
            </div>
          </div>
        }
        rightPane={
          <div>
            {/* <BlockHeader title="右边" bottomLine={true} /> */}
            <div style={{ padding: 10 }}>
              <SimpleTable title="右边" />
            </div>
          </div>
        }

      />
    </Card>
  )
};

export default connect(
  ({ settings, user }: { settings: SettingsProps, user: UserProps }) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
    userId: user.currentUser.id,
  })
)(Page)
