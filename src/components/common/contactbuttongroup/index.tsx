import React, { useState, useCallback, useMemo, useRef } from 'react';
import { Row, Col, Icon, Tooltip, Button, Switch, notification } from 'antd';
import classnames from 'classnames';
import { SmartModal } from '@/components/specific';
import FormSchema from '@/components/form/schema';
import { normalSchema, withLinkSchema } from './schema';
import { getUserInfo } from '@/utils/user';
import { sendNotificationApi, sendLinkNotificationApi } from '@/services/notification';
import styles from './styles.less';

export interface userInfoProps {
    userLoginName: string,
    userName?: string,
    email?: string,
    mobil?: string,
}

export interface ContactButtonGroupProps {
    id?: string | number,
    userInfo: userInfoProps,
    modalZindex?: number
}

export default function ContactButtonGroup(props: ContactButtonGroupProps) {

    const { id, userInfo, modalZindex } = props;

    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState(false);
    const [withLink, setWithLink] = useState(false);

    const formRef: any = useRef(null);

    const info = useMemo(() => {
        return id ? getUserInfo(id) : userInfo;
    }, [id, userInfo])

    const { userLoginName, userName, email, mobil }: any = info;

    const changeVisibleState = useCallback((visible = false) => {
        setVisible(visible)
    }, [])

    const preventStop = useCallback((stop = false, e) => {
        stop && e && e.preventDefault();
    }, [])

    const onSubmit = useCallback(async () => {
        if (!formRef.current) return;
        const { errors, values: formValues } = await formRef.current.validateForm();
        if (errors) return;
        setLoading(true);
        let _values = { ...formValues, loginUserNames: [userLoginName] };
        let api = withLink ? sendLinkNotificationApi : sendNotificationApi;
        try {
            await api(_values);
            setLoading(false);
            setVisible(false);
            notification.success({ message: tr('消息发送成功') });
        } catch (err) {
            console.warn('error', err)
            setLoading(false);
        }
    }, [userLoginName, withLink])

    const schema = useMemo(() => {
        return withLink && withLinkSchema || normalSchema
    }, [withLink])

    return <>
        <Row style={{ height: '100%', borderTop: '1px solid rgba(125,125,125,0.2)' }}>
            <a onClick={changeVisibleState.bind(null, true)}>
                <Tooltip title={tr("即时消息")}>
                    <Col span={8} className={styles.iconStyle}>
                        <Icon type="message" />
                    </Col>
                </Tooltip>
            </a>
            <a href={`mailto:${email}?subject=主题&amp;body=内容`} onClick={preventStop.bind(null, email ? false : true)} >
                <Tooltip title={tr("发邮件")}>
                    <Col span={8} className={email ? styles.iconStyle : classnames(styles.iconStyle, styles.iconDisabled)} style={{ cursor: email ? 'pointer' : 'not-allowed' }}>
                        <Icon type="mail" />
                    </Col>
                </Tooltip>
            </a>
            <a href={`tel:${mobil}`} onClick={preventStop.bind(null, mobil ? false : true)} >
                <Tooltip title={tr("打电话")}>
                    <Col span={8} className={mobil ? styles.iconStyle : classnames(styles.iconStyle, styles.iconDisabled)} style={{ cursor: mobil ? 'pointer' : 'not-allowed' }}>
                        <Icon type="phone" />
                    </Col>
                </Tooltip>
            </a>
        </Row>
        <SmartModal
            id='userNotificationModal'
            title={userName ? `${tr('即时消息')}-${userName}` : tr('即时消息')}
            visible={visible}
            maxZIndex={modalZindex}
            onCancel={changeVisibleState.bind(null, false)}
            footer={
                <div>
                    <Switch
                        style={{ float: 'left' }}
                        checked={withLink}
                        onChange={(checked) => { setWithLink(checked) }}
                        checkedChildren={tr('链接模式')}
                        unCheckedChildren={tr('普通模式')}
                    />
                    <Button
                        size="small"
                        onClick={changeVisibleState.bind(null, false)}
                    >{tr('取消')}</Button>
                    <Button
                        size="small"
                        type='primary'
                        className='btn-solid'
                        loading={loading}
                        onClick={onSubmit}
                    >{tr('发送')}</Button>
                </div>
            }
        >
            <FormSchema
                wrappedComponentRef={formRef}
                schema={schema}
            />
        </SmartModal>
    </>
}

ContactButtonGroup.defaultProps = {
    userInfo: {}
}