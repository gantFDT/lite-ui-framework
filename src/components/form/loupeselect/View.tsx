import React, { useCallback, ReactNode, useMemo } from 'react';
import { Table } from 'gantd';
import { isEmpty } from 'lodash';
import { SearchForm } from '@/components/specific';
import { BaseTailContent } from '@/components/specific/selectors/components/TailContent';

interface SelectorPanelProps {
    searchFormTitle?: string | ReactNode,
    onCancel?: () => void,
    onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    [propName: string]: any
}

const View = (props: SelectorPanelProps) => {
    const {
        viewKey,
        searchFormTitle,
        initParams,
        schema,
        uiSchema,
        onSearch,
        onSizeChange,

        columns,
        tableHeight,
        selectedRowKeys,
        selectedRows,
        dataSource,
        multiple,
        valueProp,
        labelProp,
        loading,
        onSelect,
        setSelectedText,
        getCheckboxProps,
        ...restProps
    } = props;

    const handlerSelect = useCallback((selectedRowKeys, selectedRows) => {
        onSelect && onSelect(selectedRowKeys, selectedRows)
    }, [])

    //当前已选中项信息
    const tailText = useMemo(() => {
        if (!setSelectedText) {
            return selectedRows.map((i: any) => i[labelProp]).join('、');
        }
        return setSelectedText(selectedRowKeys, selectedRows);
    }, [selectedRowKeys, selectedRows, labelProp, setSelectedText])

    return (
        <div>
            {!isEmpty(schema) && <SearchForm
                searchKey={`loupeSelectSearchForm:${viewKey}`}
                title={searchFormTitle}
                initParams={initParams}
                onSearch={onSearch}
                uiSchema={uiSchema}
                schema={schema}
                onSizeChange={onSizeChange}
            />}
            <Table
                tableKey={`loupeSelectTableForm:${viewKey}`}
                columns={columns}
                rowKey={valueProp}
                hideVisibleMenu
                dataSource={dataSource}
                loading={loading}
                scroll={{ x: '100%', y: tableHeight }}
                tail={() => <BaseTailContent text={tailText} />}
                rowSelection={{
                    type: multiple ? 'checkbox' : 'radio',
                    selectedRowKeys: selectedRowKeys,
                    onChange: handlerSelect,
                    clickable: true,
                    getCheckboxProps
                }}
                {...restProps}
            />
        </div>
    )
}

View.defaultProps = {
    multiple: false,
    schema: {},
    uiSchema: {},
    value: [],
    valueProp: 'id',
    labelProp: 'name',
    tableHeight: 'auto',
}
export default View