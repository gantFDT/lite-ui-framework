import React, { useCallback, useRef, useMemo, useContext, memo, useEffect } from 'react';
import { Button } from 'antd';
import { SchemaForm, Modal } from 'gantd';
import { UISchema, TitleSchema, Schema, Props as SchemaProps } from 'gantd/lib/schema-form';
import { spanCalculate } from '@/utils/utils';
const { ResizableModal, ResizableProvider, ModalContext } = Modal;

const defaultSpan = 24; //默认栅格占位格数
const defaultFooterStyle = { display: 'flex', justifyContent: 'space-between' }
export interface initalState {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    zIndex?: number;
    visible?: boolean;
    maximize?: boolean;
}
export interface SchemaAllProps {
    schema?: Schema,
    uiSchema?: UISchema,
    titleConfig?: TitleSchema,
    values?: object,
}
export interface FormContentProps extends SchemaAllProps {
    formRef: any,
    span: number
}
export interface FormModalProps extends SchemaAllProps {
    readonly id: string,
    canResize?: boolean,
    canMaximize?: boolean,
    maxZIndex?: number,
    minWidth?: number,
    minHeight?: number,
    itemState?: initalState,
    onSubmit?: (values: object) => void,
    onCancel: () => void,
    onSizeChange?: (width: number, height: number) => void,
    customCalculate?: (width: number) => void,
    formSchemaProps?: SchemaProps,
    children?: React.ReactElement[] | React.ReactElement | undefined,
    footerLeftExtra?: React.ReactDOM,
    footerRightExtra?: React.ReactDOM,
    disabled?: boolean,
    okBtnSolid?: boolean,
    okText?: string,
    cancelText?: string,
    confirmLoading?: boolean,
    [propsname: string]: any
}

const FormContent = memo((props: FormContentProps): React.ReactElement => {
    const {
        formRef,
        schema,
        uiSchema = {},
        titleConfig,
        values = {},
        span = defaultSpan,
        ...restProps
    } = props;

    return <SchemaForm
        wrappedComponentRef={formRef}
        data={values}
        schema={schema}
        uiSchema={{
            "ui:labelCol": {},
            "ui:wrapperCol": {},
            "ui:col": { span: span },
            ...uiSchema
        }}
        titleConfig={{
            "title:visible": false,
            ...titleConfig
        }}
        {...restProps}
    />
})

const ContextContent = (props: any): React.ReactElement => {
    const {
        id,
        onSizeChange,
        schema,
        customContent = <React.Fragment />,
        customCalculate,
        ...restProps
    } = props;
    const { state: { modals } } = useContext(ModalContext);
    const { width, height } = modals[id];

    useEffect(() => {
        onSizeChange && onSizeChange(width, height)
    }, [width, height]);

    if (!schema) return customContent;
    let fn = customCalculate || spanCalculate;
    let span = useMemo(() => fn(width), [width]);
    return <FormContent schema={schema} span={span} {...restProps} />
}

const SmartModal = function (props: FormModalProps): React.ReactElement {
    const {
        id,
        itemState,
        maxZIndex,
        canResize,
        canMaximize,
        schema,
        uiSchema,
        titleConfig,
        values,
        minWidth,
        minHeight,
        children,
        formSchemaProps,
        onSubmit,
        onCancel,
        onSizeChange,
        customCalculate,
        footerLeftExtra,//默认的footer左侧插槽
        footerRightExtra,//默认的footer右侧插槽
        disabled,       //提交按钮是否禁用
        okBtnSolid,     //提交按钮是否实心
        okText,         //确定按钮文案
        cancelText,     //取消按钮文案
        confirmLoading, //弹窗加载状态
        ...restProps
    } = props;

    const formRef: any = useRef(null);

    const handleSubmit = useCallback(async () => {
        if (!formRef.current) return;
        const { errors, values: formValues } = await formRef.current.validateForm();
        if (errors) return;
        onSubmit && onSubmit({ ...values, ...formValues })
    }, [values, onSubmit])

    return <ResizableProvider
        maxZIndex={maxZIndex}
        minWidth={minWidth}
        minHeight={minHeight}
    >
        <ResizableModal
            id={id}
            itemState={itemState}
            bodyStyle={schema && { padding: 0 }}
            isModalDialog
            canMaximize={canMaximize}
            canResize={canResize}
            onCancel={onCancel}
            footer={<div style={footerLeftExtra ? defaultFooterStyle : {}}>
                {footerLeftExtra && <div>{footerLeftExtra}</div>}
                <div>
                    {footerRightExtra}
                    <Button size="small" onClick={onCancel}>{cancelText}</Button>
                    <Button
                        size="small"
                        type='primary'
                        className={okBtnSolid ? 'btn-solid' : ''}
                        loading={confirmLoading}
                        disabled={disabled}
                        onClick={schema ? handleSubmit : onSubmit}
                    >{okText}</Button>
                </div>
            </div>}
            {...restProps}
        >
            <ContextContent
                id={id}
                formRef={formRef}
                schema={schema}
                values={values}
                customContent={children}
                uiSchema={uiSchema}
                titleConfig={titleConfig}
                onSizeChange={onSizeChange}
                customCalculate={customCalculate}
                {...formSchemaProps}
            />
        </ResizableModal>
    </ResizableProvider>
}
SmartModal.defaultProps = {
    maxZIndex: 999,         //默认最大堆叠等级
    values: {},             //默认回填数据值
    formSchemaProps: {},
    disabled: false,
    okBtnSolid: false,
    okText: tr('确定'),
    cancelText: tr('取消'),
    footerLeftExtra: null,
    footerRightExtra: null,
}
export default SmartModal;

