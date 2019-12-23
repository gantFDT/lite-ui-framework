import React, { useCallback, useEffect, useMemo, ReactNode, forwardRef } from 'react';
import { connect } from 'dva';
import { Table } from 'gantd';
import { SearchForm } from '@/components/specific';
import TailContent from '../components/TailContent';
import { tr } from '@/components/common/formatmessage';

const searchUISchema = {
    "ui:col": 12,
    "ui:labelCol": {},
    "ui:wrapperCol": {}
}

const searchFormschema = {
    roleCode: {
        title: tr('角色代码'),
    },
    roleName: {
        title: tr('角色名称'),
    }
}
const columns = [{
    title: tr('角色代码'),
    dataIndex: 'roleCode',
    key: 'roleCode',
},
{
    title: tr('角色名称'),
    dataIndex: 'roleName',
    key: 'roleName',
},
{
    title: tr('描述'),
    dataIndex: 'roleDesc',
    key: 'roleDesc',
}]

interface SelectorPanelProps {
    title?: string | ReactNode,
    visible: boolean,
    multiple?: boolean,
    onChange?: (rowKeys: string[], rows: any[]) => void,
    onCancel?: () => void,
    onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    confirmLoading: boolean,
    ref?: any,
    [propName: string]: any
}

const SelectorView = forwardRef((props: SelectorPanelProps, ref: any) => {
    const {
        userId,
        loading,
        visible,
        value,
        valueProp,
        multiple,
        modalHei,
        tableHei,
        selectedRowKeys,
        onChange,
        setSelectedItem,
        dispatch,
        withAuth,
        listRole4selector,
        listRole4selectorParams,
        listRole4selectorTotal,
        listRole4selectorCurrent,
    } = props;

    useEffect(() => {
        if (typeof visible === 'boolean') {
            visible && initFetch()
        } else {
            initFetch()
        }
    }, [visible])

    const initFetch = useCallback(() => {
        fetch()
        value.length && setSelectedItem(value, [])
    }, [value])

    const fetch = useCallback((params: object = {}, page: number = 1, pageSize: number = 50) => {
        dispatch({
            type: 'selectors/listRole',
            payload: { withAuth, params: { page, pageSize, ...params } }
        })
    }, [withAuth])

    const handlerSelect = useCallback((rowKeys, rows) => {
        setSelectedItem(rowKeys, rows)
        onChange && onChange(rowKeys, rows);
    }, [])

    const onSearch = useCallback((params) => {
        fetch(params);
    }, [])

    //分页变化
    const onChangePage = useCallback((page, pageSize) => {
        const { filterInfo } = listRole4selectorParams;
        fetch(filterInfo, page, pageSize)
    }, [])

    const tableHeight = useMemo(() => {
        if (!modalHei) return tableHei;
        let hei = modalHei - 300;
        return hei > 0 && hei || 'auto'
    }, [modalHei, tableHei])

    return (<>
        <SearchForm
            searchKey={`role_selector:${userId}`}
            title={tr('角色列表')}
            onSearch={onSearch}
            schema={searchFormschema}
            uiSchema={searchUISchema}
        />
        <Table
            tableKey={`RoleSelectorTable:${userId}`}
            columns={columns}
            rowKey={valueProp}
            hideVisibleMenu
            dataSource={listRole4selector}
            loading={loading}
            scroll={{ x: '100%', y: tableHeight }}
            tail={() => <TailContent ids={selectedRowKeys} type='role' />}
            rowSelection={{
                type: multiple ? 'checkbox' : 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: handlerSelect,
                clickable: true,
            }}
            pagination={{
                pageSizeOptions: ['50', '100', '150', '200'],
                total: listRole4selectorTotal, //总条数
                current: listRole4selectorCurrent, //当前页数
                pageSize: listRole4selectorParams.pageInfo.pageSize, //每页显示数
                onChange: onChangePage,
            }}
        />
    </>)
})

SelectorView.defaultProps = {
    multiple: false,
    tableHei: 'auto',
    value: [],
    valueProp: 'id',
    withAuth: false
}

export interface ConnectProps extends SelectorPanelProps {
    viewRef: object,
}
class ConnectComp extends React.Component<ConnectProps> {
    state = {
        selectedRowKeys: [],
        selectedRows: [],
    }
    static defaultProps = {
        viewRef: {}
    }

    componentDidMount() {
        this.props.viewRef.current = this;
    }
    setSelectedItem = (selectedRowKeys: [string], selectedRows: [any]) => {
        this.setState({ selectedRowKeys, selectedRows })
    }

    getValues = () => {
        const { selectedRowKeys, selectedRows } = this.state;
        return { selectedRowKeys, selectedRows }
    }
    render() {
        const { selectedRowKeys, selectedRows } = this.state;
        return <SelectorView
            {...this.props}
            selectedRowKeys={selectedRowKeys}
            selectedRows={selectedRows}
            setSelectedItem={this.setSelectedItem}
        />
    }
}
export default connect(({ selectors, user, loading }: any) => ({
    loading: loading.effects['selectors/listRole'],
    userId: user.currentUser.id,
    listRole4selector: selectors.listRole4selector,
    listRole4selectorParams: selectors.listRole4selectorParams,
    listRole4selectorTotal: selectors.listRole4selectorTotal,
    listRole4selectorCurrent: selectors.listRole4selectorCurrent,
}))(ConnectComp);
