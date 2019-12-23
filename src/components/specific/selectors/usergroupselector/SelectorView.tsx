import React, { useState, useMemo, useCallback, useEffect, Dispatch } from 'react';
import { connect } from 'dva';
import { Button, Tooltip, Row, Col } from 'antd'
import { Table } from 'gantd';
import ExpandIcon from '../components/ExpandIcon';
import TailContent from '../components/TailContent';
import { categoryColumns, groupColumns } from './static';

interface SelectorViewProps {
    multiple?: boolean,
    excludeId?: string,
    modalHei?: number | undefined,
    onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    [propName: string]: any
}

const SelectorView = React.forwardRef((props: SelectorViewProps, ref: any) => {
    const pageKey: string = 'userGroupSelectorView';
    const {
        multiple,
        modalHei,
        tableHei,
        visible,
        selectedRowKeys,
        setSelectedItem,
        onChange,
        onCategoryReload,
        currentUser,
        withAuth,
        listCategoryLoading,
        listUserGroupLoading,
        listUserGroupCategory,
        listUserGroupCategoryByAuth,
        listUserGroupTree,
        save,
        fetchListCategory,
        fetchListUserGroup,
    } = props;

    const [categoryKeysSelected, setCategoryKeysSelected] = useState([]);

    useEffect(() => {
        if (categoryKeysSelected.length) {
            setSelectedItem([], []);
            loadGroup();
        }
    }, [categoryKeysSelected])

    useEffect(() => {
        return () => save({ listUserGroupTree: [] })
    }, [])

    useEffect(() => {
        if (typeof visible === 'boolean') {
            visible && initFetch()
        } else {
            initFetch()
        }
    }, [visible])

    const initFetch = useCallback(() => {
        if (withAuth && listUserGroupCategoryByAuth.length || !withAuth && listUserGroupCategory.length) return;
        loadCategory();
    }, [listUserGroupCategory, listUserGroupCategoryByAuth, withAuth])


    const loadCategory = useCallback(() => {
        fetchListCategory({ withAuth })
        onCategoryReload && onCategoryReload()
    }, [withAuth])

    const loadGroup = useCallback(() => {
        fetchListUserGroup({ id: categoryKeysSelected[0], withAuth })
    }, [categoryKeysSelected, withAuth])


    const handlerSelectCategory = useCallback((_selectedRowKeys: any) => {
        setCategoryKeysSelected(_selectedRowKeys);
    }, [])

    const handlerSelect = useCallback((_selectedRowKeys: string[], _selectedRows: object[]) => {
        setSelectedItem(_selectedRowKeys, _selectedRows)
        onChange && onChange(_selectedRowKeys, _selectedRows);
    }, [])

    const tableHeight = useMemo(() => {
        if (!modalHei) return tableHei;
        let hei = modalHei - 41 - 45 - 60 - 29 - 2;
        return hei > 0 && hei || 'auto'
    }, [modalHei])

    const categoryDataSource = useMemo(() => {
        return withAuth && listUserGroupCategoryByAuth || listUserGroupCategory;
    }, [withAuth, listUserGroupCategory, listUserGroupCategoryByAuth]);

    return (
        <Row>
            <Col span={8}>
                <Table
                    tableKey={`${pageKey}_category:${currentUser.id}`}
                    title={tr('用户组类别列表')}
                    columns={categoryColumns}
                    dataSource={categoryDataSource}
                    rowKey="id"
                    hideVisibleMenu
                    scroll={{ x: '100%', y: tableHeight }}
                    loading={listCategoryLoading}
                    rowSelection={{
                        type: 'radio',
                        selectedRowKeys: categoryKeysSelected,
                        onChange: handlerSelectCategory,
                        clickable: true
                    }}
                    headerRight={<Tooltip title={tr('刷新')}>
                        <Button size="small" icon='reload' onClick={loadCategory} />
                    </Tooltip>}
                />
            </Col>
            <Col span={16}>
                <Table
                    tableKey={`${pageKey}_userGroup:${currentUser.id}`}
                    title={tr('用户组列表')}
                    columns={groupColumns}
                    dataSource={categoryKeysSelected.length ? listUserGroupTree : []}
                    rowKey="id"
                    hideVisibleMenu
                    expandIcon={(_prop: any) => <ExpandIcon {..._prop} isTree={true} />}
                    scroll={{ x: '100%', y: tableHeight == 'auto' ? 'auto' : tableHeight - 33 }}
                    tail={() => <TailContent ids={selectedRowKeys} type='userGroup' />}
                    loading={listUserGroupLoading}
                    emptyDescription={<><div>{tr('暂无数据')}</div><div>{tr('请选择用户组类别')}</div></>}
                    rowSelection={{
                        preventDefault: true,
                        type: multiple ? 'checkbox' : 'radio',
                        selectedRowKeys: selectedRowKeys,
                        onChange: handlerSelect,
                        clickable: true,
                    }}
                    headerRight={<Tooltip title={tr('刷新')}>
                        <Button size="small" icon='reload' onClick={loadGroup} />
                    </Tooltip>}
                />
            </Col>
        </Row>)
})

SelectorView.defaultProps = {
    multiple: false,
    defaultSelectedKeys: [],
    tableHei: 'auto',
    withAuth: false
}

export interface ConnectProps extends SelectorViewProps {
    viewRef: any,
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
    currentUser: user.currentUser,
    listCategoryLoading: loading.effects['selectors/fetchListCategory'],
    listUserGroupLoading: loading.effects['selectors/fetchListUserGroup'],
    listUserGroupCategory: selectors.listUserGroupCategory,
    listUserGroupCategoryByAuth: selectors.listUserGroupCategoryByAuth,
    listUserGroupTree: selectors.listUserGroupTree,
}), (dispatch: Dispatch<any>) => ({
    fetchListCategory: (payload: any) => dispatch({ type: 'selectors/fetchListCategory', payload }),
    fetchListUserGroup: (payload: any) => dispatch({ type: 'selectors/fetchListUserGroup', payload }),
    save: (payload: any) => dispatch({ type: 'selectors/save', payload })
}))(ConnectComp);