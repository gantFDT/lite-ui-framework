import React, { Component } from 'react'
import { Modal } from 'antd'
import KeyCode from "./keyGroup"
import addEventListener from "add-dom-event-listener"
const KEY_EVENT = 'keydown';

const reg = /^on(Alt|Ctrl|Meta|Shift){0,4}([A-Z][a-z]*)+$/

export { default as withFocusKeyEvent } from './withFocusKeyEvent';

export default class WithKeyEvent extends Component {
    loginTimeout = 60 * 60 * 8
    count = 0

    componentDidMount() {
        this.startTask()
        this._watchKeyDown();
        this._watchMouse();
    }
    
    //是否启动定时任务
    startTask=()=>{
        const allModels = window['g_app']['_models']
        const config = _.find(allModels, (item) => {
            return item.namespace == 'config'
        })
        const {
            state: {
                COMMON_CONFIG: {
                    startTaskRunner,
                    loginTimeout
                }
            }
        } = config
        if(startTaskRunner){
            //定时任务列表
            this.loginTimeout = loginTimeout
            this.setIntervalHandler = setInterval(this.startLoginTimeout, 1000)
        }
    }

    _validPropName = (e, keyName) => {
        // 验证属性名
        if (reg.test(keyName) && KeyCode.checkKeyGroup(e, keyName)) {
            return true
        }
        return false
    }

    //开始登陆超时计时
    startLoginTimeout = () => {
        this.count++;
        if (this.count >= this.loginTimeout) {
            clearInterval(this.setIntervalHandler)
            Modal.warning({
                title: tr("会话失效"),
                content: tr("当前会话已失效") + tr('请重新登录') + "！",
                okText: tr("退出"),
                onOk: this.props.logout
            })

        }
    }

    _watchKeyDown = () => {
        // 监听按键
        this.handler = addEventListener(window.document, KEY_EVENT, (e) => {
            this.count = 0
            Object.keys(this.props).filter(key => this._validPropName(e, key)).forEach(key => {
                this.props[key](e);
            })
        });
    }
    
    _watchMouse = () => {
        this.mouseHandler = addEventListener(window.document, 'mousemove', (e) => {
            this.count = 0
        })
    }

    componentWillUnmount() {
        // 卸载事件监听
        this.handler.remove();
        this.mouseHandler.remove();
        clearInterval(this.setIntervalHandler)
    }

    render() {
        return (
            <>{this.props.children}</>
        )
    }
}