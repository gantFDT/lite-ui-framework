import React, { useCallback, useRef, useMemo, useContext, memo, useEffect } from 'react';
import { SchemaForm } from 'gantd';
import { ResizableModal, ResizableProvider, ModalContext } from 'gantd/lib/modal';
import { UISchema, TitleSchema, Schema, Props as SchemaProps } from 'gantd/lib/schema-form';
import { spanCalculate } from '@/utils/utils';

const defaultSpan = 24; //默认栅格占位格数
const defaultValues = {}; //默认回填数据值
const defaultMaxZIndex = 999;//默认最大堆叠等级

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
    itemState?: initalState,
    onSubmit?: (values: object) => void,
    onSizeChange?: (width: number, height: number) => void,
    customCalculate?: (width: number) => void,
    formSchemaProps?: SchemaProps,
    children?: React.ReactElement[] | React.ReactElement | undefined,
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
        onSizeChange,
        customCalculate,
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
            onOk={schema ? handleSubmit : onSubmit}
            bodyStyle={schema && { padding: 0 }}
            isModalDialog
            canMaximize={canMaximize}
            canResize={canResize}
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
    maxZIndex: defaultMaxZIndex,
    values: defaultValues,
    formSchemaProps: {}
}
export default SmartModal;