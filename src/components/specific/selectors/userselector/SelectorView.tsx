import React, { useState, useCallback, useEffect, ReactNode, useMemo, forwardRef } from 'react';
import { connect } from 'dva';
import { Table } from 'gantd';
import { SearchForm } from '@/components/specific';
import { tr } from '@/components/common/formatmessage';
import { map } from 'lodash';
import UserColumn from '@/components/specific/usercolumn';
import TailContent from '../components/TailContent';
import { getCodeList, getCodeNameSync } from '@/utils/codelist';
import { columns } from './static';

const searchUISchema = {
    "ui:col": 6,
    "ui:labelCol": {},
    "ui:wrapperCol": {}
}

const searchFormschema = {
    userLoginName: {
        title: tr('账号'),
    },
    userName: {
        title: tr('用户名'),
    },
    organizationId: {
        title: tr('所属组织'),
        componentType: 'GroupSelector'
    },
    userType: {
        title: tr('用户类型'),
        componentType: 'CodeList',
        props: {
            type: 'FW_USER_TYPE'
        },
    }
}
interface SelectorPanelProps {
    title?: string | ReactNode,
    visible?: boolean,
    onChange?: (rowKeys: string[], rows: any[]) => void,
    onCancel?: () => void,
    onOk?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    ref?: any,
    [propName: string]: any
}

const SelectorView = forwardRef((props: SelectorPanelProps, ref: any) => {
    const {
        userId,
        loading,
        visible,
        value,
        multiple,
        modalHei,
        tableHei,
        valueProp,
        selectedRowKeys,
        onChange,
        setSelectedItem,
        dispatch,
        withAuth,
        listUsers4selector,
        listUsers4selectorTotal,
        listUsers4selectorParams,
        listUsers4selectorCurrent,
    } = props;

    const [userType, setUserType] = useState([]);

    useEffect(() => {
        async function fn() {
            let userTypeList = await getCodeList('FW_USER_TYPE');
            setUserType(userTypeList);
        }
        fn();
    }, [])

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
    }, [value, valueProp])

    const fetch = useCallback((params: object = {}, page: number = 1, pageSize: number = 50) => {
        dispatch({
            type: 'selectors/listUser',
            payload: { withAuth, params: { page, pageSize, ...params } }
        })
    }, [withAuth])

    const handlerSelect = useCallback((rowKeys, rows) => {
        setSelectedItem(rowKeys, rows);
        onChange && onChange(rowKeys, rows);
    }, [])

    const onSearch = useCallback((params) => {
        fetch(params);
    }, [])

    //分页变化
    const onChangePage = useCallback((page, pageSize) => {
        const { filterInfo } = listUsers4selectorParams;
        fetch(filterInfo, page, pageSize)
    }, [listUsers4selectorParams])

    const _columns = useMemo(() => {
        return map(columns, (item) => {
            if (item.key == 'userName') {
                return { ...item, render: (text: any, record: any) => <UserColumn id={record.id} /> }
            } else if (item.key == 'userType') {
                return { ...item, render: (text: any) => getCodeNameSync(userType, text), }
            } else { return item }
        })
    }, [columns, userType])

    const tableHeight = useMemo(() => {
        if (!modalHei) return tableHei;
        let hei = modalHei - 300;
        return hei > 0 && hei || 'auto'
    }, [modalHei, tableHei])

    return (
        <div>
            <SearchForm
                searchKey={`user_selector:${userId}`}
                title={tr('用户列表')}
                onSearch={onSearch}
                uiSchema={searchUISchema}
                schema={searchFormschema}
            />
            <Table
                tableKey={`UserSelectorTable:${userId}`}
                columns={_columns}
                rowKey={valueProp}
                hideVisibleMenu
                dataSource={listUsers4selector}
                loading={loading}
                scroll={{ x: '100%', y: tableHeight }}
                tail={() => <TailContent ids={selectedRowKeys} type='user' />}
                rowSelection={{
                    type: multiple ? 'checkbox' : 'radio',
                    selectedRowKeys: selectedRowKeys,
                    onChange: handlerSelect,
                    clickable: true,
                }}
                pagination={{
                    pageSizeOptions: ['50', '100', '150', '200'],
                    total: listUsers4selectorTotal, //总条数
                    current: listUsers4selectorCurrent, //当前页数
                    pageSize: listUsers4selectorParams.pageInfo.pageSize, //每页显示数
                    onChange: onChangePage,
                }}
            />
        </div>
    )
})

SelectorView.defaultProps = {
    multiple: false,
    value: [],
    valueProp: 'id',
    tableHeight: 'auto',
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
    setSelectedItem = (selectedRowKeys: [number], selectedRows: [any]) => {
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
    loading: loading.effects['selectors/listUser'],
    userId: user.currentUser.id,
    listUsers4selector: selectors.listUsers4selector,
    listUsers4selectorTotal: selectors.listUsers4selectorTotal,
    listUsers4selectorParams: selectors.listUsers4selectorParams,
    listUsers4selectorCurrent: selectors.listUsers4selectorCurrent,
}))(ConnectComp);
