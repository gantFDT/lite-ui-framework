import React from 'react';
import { Button, Drawer, Icon, Badge, Empty, Tooltip, List, notification } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Link from 'umi/link';
import classNames from 'classnames';
import Global from './global';
import styles from '../index.less';
import { jump } from '@/components/common'

const RECIPIENT_TYPE_ALL = 'all';           // 所有用户均可收到的消息类型【公告等消息】
const RECIPIENT_TYPE_USER = 'user';         // 某个用户可以收到【用户通知】
const RECIPIENT_TYPE_OBSERVER = 'obsvr';    // 某个观察者可以收到【接口处理进度】
const RECIPIENT_TYPE_CONNECTION = 'conn';   // 某个连接成功接收到【ws连接专用】

@connect(({ notification, login, settings }) => ({
    ...notification,
    MAIN_CONFIG: settings.MAIN_CONFIG,
    BASE_CONFIG: settings.BASE_CONFIG,
    userLoginName: login.userLoginName
}))
export default class Notification extends React.Component {
    ws = null;                  //websocket实例
    repeat = 0;                 //重连次数
    disReconnect = false;       //是否禁止重连
    pingTimeout = 5000;         //发送的心跳的间隔时间
    pongTimeout = 10000;        //接受服务器心跳回复的最大间隔时间,超过则判定断连
    reconnectTimeout = 3000;    //尝试重连的间隔时间
    pingMsg = 'ping';           //客户端心跳信息
    pongMsg = 'pong';           //服务端心跳信息
    repeatLimit = 99;           //重连次数上限,默认限制99

    state = {
        nowItemId: null,
    }
    componentDidMount() {
        // process.env.NODE_ENV === 'production' && this.init();
        // this.init()
    }
    //初始化
    init = () => {
        this.props.dispatch({ type: 'notification/fetch' });
        this.createWebSocket();
    }
    //启动websocket
    createWebSocket = () => {
        try {
            let paramStr = `userLoginName=${this.props.userLoginName}`;
            let protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
            let wsAddress = `${protocol}://${PROXY_TARGET.split('http://')[1]}/?${paramStr}`;
            this.ws = new WebSocket(wsAddress);
            this.initEventHandle(wsAddress);
        } catch (err) {
            this.reconnect();
            throw (err);
        }
    }
    //注册事件
    initEventHandle = (wsAddress) => {
        this.ws.onopen = () => {
            //成功连接后 重置重连计数并启动心跳检查
            this.repeat = 0;
            this.heartCheck();
            console.info("WebSocketClient: connected to notification server at " + wsAddress, new Date().toUTCString());
        }
        this.ws.onmessage = (e) => {
            this.received(e.data);
            //只要接受到服务端返回的消息则重置心跳检查机制
            this.heartCheck();
        };
        this.ws.onerror = this.onFailed;
        this.ws.onfailed = this.onFailed;
        this.ws.onclose = this.onFailed;
    }
    //接受消息时
    received = (dataStr) => {
        try {
            //忽略心跳回复信息
            if (dataStr == this.pongMsg) return;
            const data = eval(`(${dataStr})`);
            //存储服务端连接成功后的第一次响应返回的标识id
            if (data.recipientType == RECIPIENT_TYPE_CONNECTION) {
                Global.setConnectionId(data.recipientCode);
                return;
            } else if (data.recipientType == RECIPIENT_TYPE_USER || data.recipientType == RECIPIENT_TYPE_ALL) {
                notification.info({
                    key: data.id,
                    message: data.senderName || '',
                    description: data.title,
                    placement: 'bottomRight',
                    onClick: () => {
                        notification.close(data.id);
                        this.visibleChange(true);
                    }
                })
            } else if (data.recipientType == RECIPIENT_TYPE_OBSERVER) {
                this.props.dispatch({ type: 'notification/updateObserver', payload: { id: data.recipientCode, data } })
                return
            }
            this.addNotification(data);
        } catch (err) {
            console.warn('received error!!!', err)
            this.reconnect();
        }
    }
    //心跳检查(保持ws通讯)
    heartCheck = () => {
        this.heartReset();
        this.heartStart();
    }
    //重置计时周期
    heartReset = () => {
        this.pingTimeoutFn && clearTimeout(this.pingTimeoutFn);
        this.pongTimeoutFn && clearTimeout(this.pongTimeoutFn);
    }
    //开始检查
    heartStart = () => {
        if (this.disReconnect) return;
        this.pingTimeoutFn = setTimeout(() => {
            let connectionId = Global.getConnectionId();
            let msg = `{"userLoginName":"${this.props.userLoginName}","connectionId":"${connectionId}","content":"${this.pingMsg}"}`;
            this.ws.send(msg);
            this.pongTimeoutFn = setTimeout(() => { this.ws.close() }, this.pongTimeout);
        }, this.pingTimeout);
    }
    //ws连接中断
    onFailed = (e) => {
        this.reconnect();
        console.info('WebSocketClient: connection failed at' + new Date().toUTCString(), e);
    }
    //ws重连操作
    reconnect = () => {
        if (this.repeatLimit > 0 && this.repeatLimit <= this.repeat) return;
        if (this.lockReconnect || this.disReconnect) return;
        this.lockReconnect = true;
        this.repeat++;
        setTimeout(() => {
            console.info(`WebSocketClient: Try to reconnect... the ${this.repeat} times`);
            this.createWebSocket();
            this.lockReconnect = false;
        }, this.reconnectTimeout);
    }
    //主动断开连接
    disconnect = () => {
        this.disReconnect = true;
        this.heartReset();
        this.ws && this.ws.readyState == 1 && this.ws.close();
        this.ws = null;
    }
    //新增消息体
    addNotification = (data) => {
        this.props.dispatch({
            type: 'notification/receiveNew',
            payload: data
        })
    }
    //抽屉显影控制
    visibleChange = (visible = false) => {
        this.props.dispatch({
            type: 'notification/save',
            payload: { visible }
        })
    }
    //点击消息体操作
    handleItemClick = (item, e) => {
        e && e.stopPropagation();
        let id = item.id;
        this.setState({ nowItemId: id });
        if (item.status != '01') return;
        this.changeReadState([id]);
    }
    //改变消息状态为已读
    changeReadState = (ids) => {
        this.props.dispatch({
            type: 'notification/markReaded',
            payload: { ids }
        })
    }
    //删除对应消息
    handleRemove = (ids, e) => {
        e && e.stopPropagation();
        this.props.dispatch({
            type: 'notification/removeNotices',
            payload: { ids }
        })
    }
    //点击查看详情
    jumpToDetail = () => {
        this.visibleChange(false);
        setTimeout(() => {
            // router.push('/sysmgmt/othermodulemanage/notification');
            jump('notification')
        }, 500)
    }
    componentWillUnmount() {
        //销毁时断开ws连接
        this.disconnect()
    }

    render() {
        const { nowItemId } = this.state;
        const { visible, dataSource, unreadCount } = this.props;

        return (
            <React.Fragment>
                <Tooltip title={tr('消息通知')}>
                    <span className={styles.action} onClick={this.visibleChange.bind(null, true)}>
                        <Badge count={unreadCount}>
                            <Icon style={{ padding: 4 }} type="mail" />
                        </Badge>
                    </span>
                </Tooltip>
                <Drawer
                    title={<div className={styles.noticeDrawerTitle}>
                        <p>{tr('消息通知')}</p>
                        <Badge count={unreadCount} />
                    </div>}
                    closable={true}
                    visible={visible}
                    onClose={this.visibleChange.bind(null, false)}
                    placement="right"
                    bodyStyle={{ padding: 0 }}
                    width={300}
                >
                    {dataSource.length > 0 && <List
                        itemLayout="horizontal"
                        dataSource={dataSource}
                        renderItem={(item, key) => (
                            <List.Item
                                key={key}
                                className={item.id == nowItemId ? classNames(styles.noticeListItem, styles.noticeListItemActive) : styles.noticeListItem}
                                onClick={this.handleItemClick.bind(null, item)}>
                                <div>
                                    <div className={styles.noticeListTitle}>
                                        <h4>{item.title}</h4>
                                        {item.status == '01' && <Badge className={styles.itemUnReadPoint} color='blue' />}
                                    </div>
                                    <p className={styles.itemBaseInfo}>
                                        <span>{item.senderName}</span>
                                        <span>{item.senderTime}</span>
                                    </p>
                                    <p>{item.content}</p>
                                    {item.linkUri && <Link className={styles.linkView} to={item.linkUri} target='_blank' rel="noopener noreferrer nofollow">
                                        <Icon type="link" />
                                        <span>{item.linkName}</span>
                                    </Link>}
                                    {item.status == '00' && item.recipientType != 'all' && <div
                                        className={styles.deleteIcon}
                                        onClick={this.handleRemove.bind(null, [item.id])}
                                    >
                                        <Icon type='delete' />
                                    </div>}
                                </div>
                            </List.Item>
                        )}
                    />}
                    <div className={styles.noticeViewMore} onClick={this.jumpToDetail}>
                        <div>
                            <Icon type="file-search" style={{ fontSize: 36 }} />
                            <p>{tr('查看全部通知')}</p>
                        </div>
                    </div>
                </Drawer>
            </React.Fragment>
        )
    }
}