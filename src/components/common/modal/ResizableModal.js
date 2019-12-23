import React, { useContext, useEffect, useMemo, useCallback, memo } from 'react';
import { Button } from 'antd';
import classnames from 'classnames';
import { Modal } from 'antd';
import { Icon } from 'gantd';
import { getKey } from '@/utils/utils';
import { useDrag, useResize, usePrev } from './Hooks';
import { ModalContext } from './Context';
import { getModalState } from './Reducer';
import styles from './styles.less';

const modalStyle = { margin: 0, paddingBottom: 0 };
const cancelTextDefault = tr('取消');
const okTextDefault = tr('确认');

function ModalInner(props) {
    const {
        id,             //弹窗唯一标识
        itemState,      //单个弹窗的自定义属性
        visible,        //弹窗标题
        title,          //弹窗标题
        style,          //弹窗额外样式
        wrapClassName,  //弹窗层自定义class
        canMaximize,    //是否可以最大化
        canResize,      //是否可以拖动
        confirmLoading, //弹窗加载状态
        isModalDialog,  //是否为模态窗口
        disabled,       //提交按钮是否禁用
        okBtnSolid,     //提交按钮是否实心
        cancelText,     //取消按钮文案
        okText,         //提交按钮文案
        onCancel,       //取消按钮回调
        onOk,           //提交按钮回调
        children,       //自定义弹窗内容
        ...restProps    //弹窗组件接受的其他antd支持的属性值
    } = props;

    const { dispatch, state } = useContext(ModalContext);
    const modalState = getModalState(state, id);
    const visiblePrev = usePrev(visible)

    useEffect(() => {
        dispatch({ type: 'mount', id, itemState })
        return () => dispatch({ type: 'unmount', id })
    }, [])

    useEffect(() => {
        const backtop = document.querySelector('.ant-back-top');
        if (backtop) {
            if (visible && visiblePrev && visible === visiblePrev) {
                backtop.style.opacity = '0'
            } else if (!visible && !visiblePrev && visible === visiblePrev) {
                setTimeout(function () {
                    backtop.style.opacity = '1'
                }, 200);
            }
        }
        if (visible !== visiblePrev) {
            if (visible) {
                dispatch({ type: 'show', id })
            } else {
                dispatch({ type: 'hide', id })
            }
        }
    }, [visible, visiblePrev, id])

    const { zIndex, x, y, width, height, maximize, maximized } = modalState

    const _style = useMemo(() => ({ ...style, ...modalStyle, top: y, left: x, height }), [y, x, height])

    const onFocus = useCallback(() => dispatch({
        type: 'focus', id
    }), [id])

    const onDrag = useCallback(payload => dispatch({
        type: 'drag', id, ...payload
    }), [id])

    const onResize = useCallback(payload => dispatch({
        type: 'resize', id, ...payload
    }), [id])

    const toggleMaximize = useCallback(() => {
        if (!canMaximize) return;
        dispatch({ type: maximize ? 'reset' : 'max', id })
    }, [id, maximize, canMaximize])

    const onMouseDrag = useDrag(x, y, onDrag)
    const onMouseResize = useResize(x, y, width, height, onResize)
    const titleElement = useMemo(
        () => <div
            className={styles.resizableModalTitle}
            style={canMaximize ? { marginRight: 70 } : { marginRight: 30 }}
            onMouseDown={onMouseDrag}
            onClick={onFocus}
            onDoubleClick={toggleMaximize}
        >
            {title}
        </div>, [onMouseDrag, onFocus, toggleMaximize, title, canMaximize],
    )
    const combineWrapClassName = useMemo(() => {
        return classnames(
            styles.resizableModalWrapper,
            isModalDialog ? styles['resizableModalDialog'] : styles['resizableModalDefault'],
            wrapClassName
        )
    }, [isModalDialog])

    return <Modal
        wrapClassName={combineWrapClassName}
        title={titleElement}
        width={width}
        visible={visible}
        zIndex={zIndex}
        style={_style}
        mask={isModalDialog}
        maskClosable={isModalDialog}
        destroyOnClose
        onCancel={onCancel}
        footer={<div>
            <Button size="small" onClick={onCancel}>{cancelText}</Button>
            <Button
                size="small"
                type='primary'
                className={okBtnSolid ? 'btn-solid' : ''}
                loading={confirmLoading}
                disabled={disabled}
                onClick={onOk}
            >{okText}</Button>
        </div>}
        {...restProps}
    >
        <div className={styles.resizableModalContent} onClick={onFocus}>
            {children}
        </div>
        {canMaximize && <div className={styles.maximizeAnchor} onClick={toggleMaximize}>
            {maximize ? <Icon className={styles.resetIcon} type='icon-zuidahua' /> : <i className={styles.maximizeIcon} />}
        </div>}
        {canResize && !maximize && <div className={styles.resizeAnchor} onMouseDown={onMouseResize}><i></i></div>}
    </Modal>
}

ModalInner.defaultProps = {
    itemState: {},
    style: {},
    canMaximize: true,
    canResize: true,
    isModalDialog: false,
    disabled: false,
    okBtnSolid: false,
    cancelText: cancelTextDefault,
    okText: okTextDefault,
    onCancel: _ => _,
    onOk: _ => _,
}

export const ResizableModal = memo(ModalInner);
