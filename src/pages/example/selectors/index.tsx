import React from 'react'
import { Collapse } from 'antd'
import Group from './Group'
import User from './User'
import Role from './Role'
import UserGroup from './UserGroup'
const { Panel } = Collapse

function Demo() {
    return <>
        <Collapse defaultActiveKey={['1']} accordion>
            <Panel header={tr('组织选择器demo')} key="1">
                <Group />
            </Panel>
            <Panel header={tr('用户选择器demo')} key="2">
                <User />
            </Panel>
            <Panel header={tr('角色选择器demo')} key="3">
                <Role />
            </Panel>
            <Panel header={tr('用户组选择器demo')} key="4">
                <UserGroup />
            </Panel>
        </Collapse>
    </>
}
export default Demo