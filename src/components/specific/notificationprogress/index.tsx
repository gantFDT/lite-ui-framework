import React, { useState, useEffect, useCallback, useMemo } from 'react';
import NotificationGlobal from '@/components/layout/globalheader/notification/global';
import ProgressModal from '@/components/common/progressmodal';
import { randomString } from '@/utils/utils'
import request from '@/utils/request';
import { connect } from 'dva';

const inital = { progress: 0, content: '' }

interface ProgressProp {
    url: string,
    visible: boolean,
    options?: object,
    extra?: object,
    type?: 'circle' | 'line',
    topContent?: string | React.ReactNode,
    callback?: ({ response, error }: { response?: any, error?: Error }) => void,
    [propName: string]: any
}

function Progress(props: ProgressProp) {
    const {
        url,
        options,
        extra,
        type,
        visible,
        topContent,
        dispatch,
        callback,
        onClose,
        observers,
        ...restProps
    } = props;

    const [observerId, setObserverId] = useState(randomString(24));
    const connectionId = NotificationGlobal.getConnectionId();

    useEffect(() => {
        visible && fetch()
    }, [visible])

    useEffect(() => {
        return () => detachObserver()
    }, [])

    const detachObserver = useCallback(() => {
        dispatch({ type: 'notification/removeObserver', payload: observerId })
        onClose && onClose();
    }, [observerId])

    const fetch = useCallback(async () => {
        if (!connectionId) {
            console.warn('websocket已断开连接,请求未正常发起')
            return
        }
        try {
            const extraHeaders = { observerId, connectionId };
            let optionsHeaders = options && options['headers'] || {};
            const response = await request(url, { ...options, headers: { ...optionsHeaders, ...extraHeaders } }, extra);
            callback && callback({ response });
            detachObserver();
        } catch (error) {
            console.warn(error)
            callback && callback({ error });
            detachObserver();
        }
    }, [url, options, extra, callback, detachObserver, connectionId])


    const data = useMemo(() => {
        return observers[observerId] || inital
    }, [observers, observerId])

    return <ProgressModal
        type={type}
        status={data.progress == 100 ? 'success' : 'active'}
        visible={connectionId ? visible : false}
        percent={Math.ceil(data.progress)}
        topContent={topContent}
        bottomContent={<div>{data.content}</div>}
        onClose={() => { }}
        {...restProps}
    />
}
Progress.defaultProps = {
    visible: false,
    type: 'line',
    topContent: `${tr('正在进行业务操作')}，${tr('请等待')}...`,
    options: { method: 'POST', data: {} },
    extra: {}
}

const NotificationProgress = connect(({ notification }: any) => ({
    observers: notification.observers,
}))(Progress);

export interface ProgressWithRefProp {
    viewRef: any,
}
class ProgressWithRef extends React.Component<ProgressWithRefProp> {
    state = {
        visible: false
    }
    static defaultProps = {
        viewRef: {}
    }
    componentDidMount() {
        this.props.viewRef.current = this;
    }

    showProgress = () => this.setState({ visible: true });

    close = () => this.setState({ visible: false });

    render() {
        return <NotificationProgress
            {...this.props}
            visible={this.state.visible}
            onClose={this.close}
        />
    }
}
NotificationProgress.ProgressWithRef = ProgressWithRef;
export default NotificationProgress;
