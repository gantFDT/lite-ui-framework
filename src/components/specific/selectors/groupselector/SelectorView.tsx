import React, { useState, useReducer, useMemo, useCallback, useEffect } from 'react';
import { connect } from 'dva';
import { isEmpty, isEqual } from 'lodash';
import { Title } from '@/components/common';
import { Table } from 'gantd';
import { formatTreeData, isParamsEmpty } from '@/utils/utils';
import exporter from '@/utils/cache';
import { SearchForm } from '@/components/specific';
import PopoverCard from '../components/PopoverCard';
import ExpandIcon from '../components/ExpandIcon';
import TailContent from '../components/TailContent';
import { fields } from './static';
import { getOtherTreeOrgAPI, filterOtherOrgAPI, filterOtherOrgByAuthAPI, filterOrgAPI, filterOrgByAuthAPI } from '@/services/selectors';

const { selector: selectorCache }: { selector?: any } = exporter;
const formSchema = { keyWork: { title: tr('组织编码或名称') } };
const searchUISchema = {
    "ui:col": 24,
    "ui:labelCol": {},
    "ui:wrapperCol": {}
}

export interface Action {
    type: string,
    payload?: any
}

function reducers(state: any, action: Action) {
    const { type, payload } = action
    switch (type) {
        case "save":
            return { ...state, ...payload }
        case "reset":
            return { ...initalState }
    }
}

const initalState = {
    filterData: [],
    filterInfo: {},
    filterLoading: false,
    pageInfo: { pageSize: 50, beginIndex: 0 },
    totalCount: 0,
}

interface SelectorViewProps {
    multiple: boolean,
    excludeId?: string,
    modalHei?: number | undefined,
    onChange?: (selectedRowKeys: string[], selectedRows: object[]) => void,
    [propName: string]: any
}

const SelectorView = React.forwardRef((props: SelectorViewProps, ref: any) => {
    const pageKey: string = 'groupSelectorView';
    const {
        currentUser,
        multiple,
        treeOrganizations,
        treeOrganizationsByAuth,
        excludeId,
        modalHei,
        tableHei,
        value,
        visible,
        selectedRowKeys,
        treeLoading,
        withAuth,
        dispatch,
        setSelectedItem,
        onChange,
    } = props;

    const [excludeData, setExcludeData] = useState([]);
    const [excludeLoading, setExcludeLoading] = useState(false);
    const [searchFormHei, setSearchFormHei] = useState(0);
    const [state, _dispatch] = useReducer(reducers, initalState);
    const { filterData, filterInfo, filterLoading, pageInfo, totalCount } = state;

    useEffect(() => {
        excludeId && getExcludeData()
    }, [excludeId])

    useEffect(() => {
        if (typeof visible === 'boolean') {
            visible && setDefaultSelectedKeys()
        } else {
            setDefaultSelectedKeys()
        }
    }, [visible])

    const initFetch = useCallback(() => {
        if (excludeId) return;
        // if (withAuth && treeOrganizationsByAuth.length || !withAuth && treeOrganizations.length) return;
        dispatch({ type: 'selectors/fetchTreeOrg', payload: { withAuth } })
    }, [treeOrganizations, excludeId, withAuth])

    const handlerSelect = useCallback((_selectedRowKeys: any, _selectedRows: any) => {
        setSelectedItem(_selectedRowKeys, _selectedRows)
        onChange && onChange(_selectedRowKeys, _selectedRows);
    }, [])

    const setDefaultSelectedKeys = useCallback(() => {
        initFetch();
        value.length && setSelectedItem(value, []);
    }, [value])

    const onPageChange = useCallback((page = 1, pageSize = 50) => {
        getFilterData(filterInfo, { beginIndex: page - 1, pageSize })
    }, [filterInfo])

    //smart高度改变
    const onSearchFormSizeChange = useCallback(({ height, width }) => {
        setSearchFormHei(height)
    }, [setSearchFormHei])

    const resetState = useCallback(() => {
        !isEqual(initalState, state) && _dispatch({ type: 'reset' })
    }, [_dispatch, state])

    const getExcludeData = useCallback(async (forceRender?: boolean) => {
        let key = `groupSelector_${withAuth ? 'auth' : 'all'}:${excludeId}`;
        let cacheData = selectorCache.get(key);
        if (!cacheData || forceRender) {
            try {
                setExcludeLoading(true);
                const res = await getOtherTreeOrgAPI({ data: { id: excludeId, node: 'root', pageInfo: {} } });
                formatTreeData(res, 'children', { title: 'orgName' });
                selectorCache.set(key, res);
                cacheData = res;
                setExcludeLoading(false);
            } catch (err) {
                console.log(err);
                setExcludeLoading(false);
            }
        }
        setExcludeData(cacheData);
        resetState();
    }, [excludeId, withAuth, resetState])

    const getFilterData = useCallback(async (filterInfo, pageInfo) => {
        try {
            let api;
            if (excludeId) {
                api = withAuth ? filterOtherOrgByAuthAPI : filterOtherOrgAPI;
            } else {
                api = withAuth ? filterOrgByAuthAPI : filterOrgAPI;
            }
            let _pageInfo = {
                pageSize: pageInfo.pageSize,
                beginIndex: pageInfo.beginIndex * pageInfo.pageSize
            };
            _dispatch({ type: 'save', payload: { filterLoading: true } });
            const res = await api({ data: { filterInfo: excludeId ? { ...filterInfo, excludeId } : filterInfo, pageInfo: _pageInfo } });
            let data = res.content || [];
            formatTreeData(data, 'children', { title: 'orgName' });
            _dispatch({
                type: 'save', payload: {
                    filterData: data,
                    filterInfo,
                    pageInfo,
                    totalCount: res.totalCount || 0,
                    filterLoading: false
                }
            });
        } catch (err) {
            console.log(err);
            _dispatch({ type: 'save', payload: { filterLoading: false } });
        }
    }, [_dispatch, excludeId, withAuth])

    const handleSearch = useCallback((params) => {
        if (isEmpty(params)) {
            excludeId ? getExcludeData(true) : dispatch({ type: 'selectors/fetchTreeOrg', payload: { withAuth }, cb: resetState });
        } else {
            getFilterData(params, pageInfo)
        }
    }, [pageInfo, resetState, excludeId, withAuth, getFilterData])

    const tableHeight = useMemo(() => {
        if (!modalHei) return tableHei;
        let hei = modalHei - searchFormHei - 20 - 41 - 45 - 29 - 3 - 32;
        return hei > 0 && hei || 'auto'
    }, [modalHei, searchFormHei, filterInfo])

    const realDataSource = useMemo(() => {
        if (!isEmpty(filterInfo)) return filterData;
        if (excludeId) return excludeData;
        return withAuth && treeOrganizationsByAuth || treeOrganizations;
    }, [excludeId, withAuth, filterInfo, excludeData, treeOrganizations, treeOrganizationsByAuth, filterData])

    const columns = useMemo(() => {
        return [{
            key: 'orgName',
            dataIndex: 'orgName',
            title: tr('组织名称'),
            render: (text: string, record: any) => (
                <PopoverCard
                    data={record}
                    fields={fields}
                    codeList='FW_ORGANIZATION_TYPE'
                    codeListKey='orgType'
                />)
        },{
            key: 'orgCode',
            dataIndex: 'orgCode',
            title: tr('组织编码'),
        }]
    }, [fields])

    return (<>
        <SearchForm
            searchKey={`${pageKey}:${currentUser.id}`}
            schema={formSchema}
            uiSchema={searchUISchema}
            title={<Title title={tr('组织查询')} showShortLine={true} />}
            onSearch={handleSearch}
            onSizeChange={onSearchFormSizeChange}
            headerProps={{ bottomLine: false }}
            showBottomLine={false}
        />
        <Table
            tableKey={`${pageKey}:${currentUser.id}`}
            columns={columns}
            rowKey="id"
            hideVisibleMenu
            dataSource={realDataSource}
            loading={treeLoading || excludeLoading || filterLoading}
            scroll={{ x: '100%', y: tableHeight }}
            expandIcon={(_prop: any) => <ExpandIcon {..._prop} isTree={isEmpty(filterInfo)} />}
            tail={() => <TailContent ids={selectedRowKeys} />}
            rowSelection={{
                preventDefault: true,
                type: multiple ? 'checkbox' : 'radio',
                selectedRowKeys: selectedRowKeys,
                onChange: handlerSelect,
                clickable: true,
            }}
            pagination={isParamsEmpty(filterInfo) ? undefined : {
                total: totalCount, //总条数
                pageSizeOptions: ['50', '100', '150', '200'],
                current: pageInfo.beginIndex + 1, //当前页数
                pageSize: pageInfo.pageSize, //每页显示数
                onChange: onPageChange,
            }}
        />
    </>)
})

SelectorView.defaultProps = {
    multiple: false,
    tableHei: 'auto',
    value: [],
    withAuth: false,
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
    treeLoading: loading.effects['selectors/fetchTreeOrg'],
    treeOrganizations: selectors.treeOrganizations,
    treeOrganizationsByAuth: selectors.treeOrganizationsByAuth,
}))(ConnectComp);