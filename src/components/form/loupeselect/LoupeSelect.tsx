import React, { useState, useCallback, useEffect } from 'react';
// import { isEqual } from 'lodash';
import ModalView from './ModalView';
import BaseSelect from './BaseSelect';

const LoupeSelect = (props: any) => {
    const {
        dropdownClassName,
        value,
        multiple,
        listUsers,
        listUsersByAuth,
        listUsersFilters,
        renderReadElement,
        valueProp,
        labelProp,
        confirmLoading,
        onChange,
        onSizeChange,
        addonAfter,
        dispatch,
        withAuth,
        viewProps,
        ...restProps
    } = props;

    const [visible, setVisible] = useState(false);
    // const [_viewProps, setViewProps] = useState(viewProps);

    // useEffect(() => {
    //     if (!isEqual(viewProps, _viewProps)) {
    //         setViewProps(viewProps)
    //     }
    // }, [viewProps, _viewProps, setViewProps])

    //改变弹窗状态
    const changeVisibleState = useCallback((visible = false) => {
        setVisible(visible);
    }, [])

    //弹窗onOK事件
    const handleOk = useCallback((selectedRowKeys: string[]) => {
        let ret: any = multiple ? selectedRowKeys : selectedRowKeys[0];
        onChange && onChange(ret)
        setVisible(false)
    }, [value, multiple])

    return <>
        <BaseSelect
            dropdownClassName={dropdownClassName}
            multiple={multiple}
            value={value}
            valueProp={valueProp}
            labelProp={labelProp}
            onChange={onChange}
            renderReadElement={renderReadElement}
            onLoupeClick={changeVisibleState.bind(null, true)}
            {...restProps}
        />
        <ModalView
            value={multiple ? value : value && [value]}
            visible={visible}
            valueProp={valueProp}
            labelProp={labelProp}
            multiple={multiple}
            confirmLoading={confirmLoading}
            onSizeChange={onSizeChange}
            onOk={handleOk}
            onCancel={changeVisibleState.bind(null, false)}
            {...viewProps}
        />
    </>
}
LoupeSelect.defaultProps = {
    multiple: false,
    valueProp: 'id',
    labelProp: 'name',
    viewProps: {}
}

export default LoupeSelect;