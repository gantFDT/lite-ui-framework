import React, { useState, useCallback, ReactNode, useEffect, useMemo } from 'react'
import { SmartModal } from '@/components/specific'
import { tr } from '@/components/common/formatmessage'
import View from './View'
import { MODAL_HEADER_HEIGHT, MODAL_PADDING_HEIGHT, MODAL_FOOTER_HEIGHT } from '@/utils/utils'

interface ModalViewProps {
    title?: string | ReactNode,
    visible: boolean,
    confirmLoading?: boolean,
    onCancel?: () => void,
    onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    [propName: string]: any
}

function ModalView(props: ModalViewProps) {
    const {
        viewKey,
        wrapClassName,
        title,
        visible,
        zIndex,
        itemState,
        value,
        dataSource,
        multiple,
        valueProp,
        labelProp,
        confirmLoading,
        viewProps,
        onModalVisibleChange,
        onSizeChange,
        onOk,
        onCancel,
        getCheckboxProps,
        ...restProps
    } = props;

    const [selectedRowKeys, setSelectedRowKeys] = useState([]);
    const [selectedRows, setSelectedRows] = useState([]);
    const [modalHei, setModalHei] = useState(0);
    const [searchFormHei, setSearchFormHei] = useState(0);

    useEffect(() => {
        onModalVisibleChange && onModalVisibleChange(visible);
    }, [visible])

    useEffect(() => {
        visible && setDefaultValue()
    }, [visible])

    //回填value值
    const setDefaultValue = useCallback(() => {
        value.length && setSelectedRowKeys(value);
    }, [value, dataSource])

    const handleSelect = useCallback((selectedRowKeys, selectedRows) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
    }, [])

    //点击确定回调
    const handlerOk = useCallback(() => {
        onOk && onOk(selectedRowKeys, selectedRows)
    }, [selectedRowKeys, selectedRows, onOk])

    //点击取消回调
    const handlerCancel = useCallback(() => {
        onCancel && onCancel()
    }, [onCancel])

    //弹窗大小变化回调
    const onModalSizeChange = useCallback((width, height) => {
        setModalHei(height)
    }, [])

    //searchForm大小变化回调
    const onSearchFormSizeChange = useCallback(({ width, height }) => {
        setSearchFormHei(height)
    }, [])

    const _tableHeight = useMemo(() => {
        const TABLE_COLUMNS = 30;
        const TABLE_PAGINATION = 32;
        const TABLE_EXTRA_BORDER = 1;
        const EXTRA = TABLE_COLUMNS + TABLE_PAGINATION + TABLE_EXTRA_BORDER;
        let result = modalHei - searchFormHei - MODAL_HEADER_HEIGHT - MODAL_PADDING_HEIGHT - MODAL_FOOTER_HEIGHT - EXTRA;
        return result;
    }, [modalHei, searchFormHei])

    return (
        <SmartModal
            id={`loupeSelectModal:${viewKey}`}
            wrapClassName={wrapClassName}
            title={title}
            visible={visible}
            zIndex={zIndex}
            itemState={itemState}
            confirmLoading={confirmLoading}
            onCancel={handlerCancel}
            onOk={handlerOk}
            onSizeChange={onModalSizeChange}
        >
            <View
                viewKey={viewKey}
                multiple={multiple}
                value={value}
                tableHeight={_tableHeight}
                valueProp={valueProp}
                labelProp={labelProp}
                dataSource={dataSource}
                selectedRowKeys={selectedRowKeys}
                selectedRows={selectedRows}
                onSelect={handleSelect}
                getCheckboxProps={getCheckboxProps}
                onSizeChange={onSearchFormSizeChange}
                {...restProps}
            />
        </SmartModal>
    )
}

ModalView.defaultProps = {
    value: [],
    title: tr('弹窗标题'),
    itemState: { width: 640, height: 520 },
    loading: false,
    zIndex: 1007
}

export default ModalView;
