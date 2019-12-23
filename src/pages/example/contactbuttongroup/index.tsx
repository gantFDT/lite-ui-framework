import React from 'react'
import { Card } from 'antd';
import { connect } from 'dva'
import ContactButtonGroup from '@/components/common/contactbuttongroup';

const customModalZindex = 1031;
function ContanctButtonGroupDemo({ userId }: any) {

    return (<Card
        style={{ width: 240 }}
        bodyStyle={{ padding: 0 }}
        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
    >
        <ContactButtonGroup id={userId} modalZindex={customModalZindex} />
    </Card>)
}

export default connect(
    ({ user }: any) => ({ userId: user.currentUser.id })
)(ContanctButtonGroupDemo)