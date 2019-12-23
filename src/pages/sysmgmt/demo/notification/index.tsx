import React, { useState, useCallback, useRef } from 'react';
import { connect } from 'dva';
import { Button, Tabs } from 'antd';
import { Card } from 'gantd';
import { tr, Title } from '@/components/common';
import FormSchema from '@/components/form/schema';
import { getContentHeight, CARD_BORDER_HEIGHT } from '@/utils/utils'
import { normalSchema, withLinkSchema } from './schema';
import { sendNotificationApi, sendLinkNotificationApi } from '@/services/notification';
import { NotificationProgress } from '@/components/specific'
const { TabPane } = Tabs;
const { ProgressWithRef } = NotificationProgress;

export default connect(({ settings }: any) => ({
    MAIN_CONFIG: settings.MAIN_CONFIG,
}))((props: any) => {
    const { MAIN_CONFIG, route } = props;
    const [tabKey, setTabKey] = useState('1');
    const [visible, setVisible] = useState(false);

    const normalRef: any = useRef(null);
    const linkRef: any = useRef(null);
    const progressRef: any = useRef(null);

    const onReset = useCallback(async (type) => {
        let refTarget = type == 'normal' ? normalRef : linkRef;
        if (!refTarget.current) return;
        refTarget.current.resetFields();
    }, [])

    const onSubmit = useCallback(async (type) => {
        let refTarget = type == 'normal' ? normalRef : linkRef;
        let api = type == 'normal' ? sendNotificationApi : sendLinkNotificationApi;
        if (!refTarget.current) return;
        const { errors, values: formValues } = await refTarget.current.validateForm();
        if (errors) return;
        await api(formValues);
    }, [])

    const height = getContentHeight(MAIN_CONFIG, 40 + CARD_BORDER_HEIGHT)
    return (
        <Card
            bodyStyle={{ padding: 0 }}
            title={<Title route={route} />}
            className='specialCardHeader'
            bodyStyle={{ height: height }}
        >
            <Tabs activeKey={tabKey} onChange={(key) => { setTabKey(key) }}>
                <TabPane tab={tr('发送普通实时通知')} key="1">
                    <FormSchema
                        schema={normalSchema}
                        wrappedComponentRef={normalRef}
                    />
                    <Button className='margin5' size='small' onClick={onReset.bind(null, 'normal')}>{tr('重置')}</Button>
                    <Button className='margin5' size='small' type='primary' onClick={onSubmit.bind(null, 'normal')}>{tr('发送')}</Button>
                </TabPane>
                <TabPane tab={tr('发送带链接地址的实时通知')} key="2">
                    <FormSchema
                        schema={withLinkSchema}
                        wrappedComponentRef={linkRef}
                    />
                    <Button className='margin5' size='small' onClick={onReset.bind(null, 'link')}>{tr('重置')}</Button>
                    <Button className='margin5' size='small' type='primary' onClick={onSubmit.bind(null, 'link')}>{tr('发送')}</Button>
                </TabPane>
                <TabPane tab={tr('模拟20秒处理进度实时通知')} key="3">
                    <Button
                        className='margin5'
                        size='small'
                        type='primary'
                        onClick={() => { setVisible(true) }}
                    >{tr('开始模拟-(状态提升触发)')}</Button>
                    <Button
                        className='margin5'
                        size='small'
                        type='primary'
                        onClick={() => { progressRef.current.showProgress() }}
                    >{tr('开始模拟-(ref方法触发)')}</Button>
                </TabPane>
            </Tabs>
            <NotificationProgress
                visible={visible}
                url='/testNotification/process20s'
                callback={(res: any) => {
                    const { response, error } = res;
                    console.log('response=', response)
                    console.log('error=', error)
                    setVisible(false)
                }} />
            <ProgressWithRef
                viewRef={progressRef}
                url='/testNotification/process20s'
                callback={(res: any) => {
                    console.log('res', res)
                }}
            />
        </Card>
    )
})