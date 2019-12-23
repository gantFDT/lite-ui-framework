import React, { useEffect, useState, useCallback, useMemo } from 'react';
import { Button, Input, Select, Switch } from 'antd'
import { BlockHeader } from 'gantd'
import { getModelData } from '@/utils/utils'
import { TableConfig } from '@/components/specific/smarttable'
import { SmartSearch } from '@/components/specific'

const { Option } = Select;

const Page = (props: any) => {
    const {
        title,
        columns = [],
        update,
        widgetKey,
        queryUrl,
        handleClose,
        domain,
        showAutoUpdate,
        tableViewConfig,//table初始视图
        columnsPath = '',
        searchViewConfig = {},//search初始视图
        initParams = [],
        searchPanelId = '',
        searchSchema = {},
        searchSchemaPath = '',
        pageSize = 20,
        beginIndex = 0,
        fetchData,
        searchMode='normal'
    } = props;


    const [titleValue, setTitleValue] = useState(title)
    const [stateQueryUrl, setStateQueryUrl] = useState(queryUrl)
    const [stateColumnsPath, setStateColumnsPath] = useState(columnsPath)
    const [stateColumns, setStateColumns] = useState(columns)
    const [activeDomain, setActiveDomain] = useState(domain)
    const [stateShowAutoUpdate, setStateShowAutoUpdate] = useState(showAutoUpdate)
    const [stateTableViewConfig, setStateTableViewConfig] = useState(tableViewConfig)
    const [stateSearchViewConfig, setStateSearchViewConfig] = useState(searchViewConfig)
    const [stateInitParams, setStateInitParams] = useState(initParams)
    const [stateSearchPanelId, setStateSearchPanelId] = useState(searchPanelId)
    const [stateSearchSchema, setStateSearchSchema] = useState(searchSchema)
    const [stateSearchSchemaPath, setStateSearchSchemaPath] = useState(searchSchemaPath)
    const [filterInfo, setFilterInfo] = useState([]);
    const [stateSearchMode,setStateSearchMode] = useState(searchMode)

    // console.table(
    //     {
    //         stateQueryUrl:stateQueryUrl,
    //         stateColumnsPath:stateColumnsPath,
    //         stateColumns:stateColumns,
    //         stateTableViewConfig:stateTableViewConfig,
    //         stateSearchViewConfig:stateSearchViewConfig,
    //         stateInitParams:stateInitParams,
    //         stateSearchPanelId:stateSearchPanelId,
    //         stateSearchSchema:stateSearchSchema,
    //         stateSearchSchemaPath:stateSearchSchemaPath,
    //         filterInfo:filterInfo,
    //         stateSearchMode:stateSearchMode,
    //     }
    // );

    const domainData = useMemo(() => {
        return getModelData('config.SMART_TABLE_DOMAIN')
    }, [])
    const userId = useMemo(() => {
        return getModelData('user.currentUser.id')
    }, [])

    //保存配置
    const save = useCallback(() => {
        update({
            widgetKey: widgetKey,
            data: {
                title: titleValue,
                configParams: {
                    domain: activeDomain,
                    showAutoUpdate: stateShowAutoUpdate,
                    queryUrl: stateQueryUrl,
                    tableViewConfig: stateTableViewConfig,
                    columnsPath: stateColumnsPath,
                    searchViewConfig: stateSearchViewConfig,
                    initParams: stateInitParams,
                    searchPanelId: stateSearchPanelId,
                    searchSchemaPath: stateSearchSchemaPath,
                    filterInfo: filterInfo,
                    searchMode:stateSearchMode,
                    stateTableViewConfig
                }
            }
        }, handleClose)
    }, [title, widgetKey, update, titleValue, stateQueryUrl, stateColumns, activeDomain, stateShowAutoUpdate, stateTableViewConfig, stateSearchViewConfig, stateInitParams, stateSearchPanelId, stateSearchSchema, stateSearchSchemaPath, filterInfo,stateSearchMode])

    const handleTitleChange = useCallback((e) => {
        setTitleValue(e.target.value)
    }, [])

    //域改变
    const handleDomainChange = useCallback((value) => {
        setActiveDomain(value)
        let domain = {}
        domainData.map((item: any) => {
            if (item.domain == value) {
                domain = item
            }
        })
        setStateColumnsPath(domain['columnsPath'])
        setStateSearchSchemaPath(domain['searchSchemaPath'])
        setStateQueryUrl(domain['queryUrl'])
        setStateSearchPanelId(domain['searchPanelId'])
        setStateSearchMode(domain['searchMode'])
    }, [domainData, setStateColumnsPath, setStateSearchSchemaPath, setStateQueryUrl, setStateSearchPanelId, columnsPath, searchSchemaPath])

    //自动刷新控件
    const handleAutoUpdateChange = useCallback((value) => {
        setStateShowAutoUpdate(value)
    }, [])


    //查询视图改变
    const onSearchViewChange = useCallback((searchView) => {
        setStateSearchViewConfig(searchView)
    }, [])

    //查询值改变
    const onValueChange = useCallback((values, whereList) => {
        setStateInitParams(values)
        const orderList = stateSearchViewConfig ? (stateSearchViewConfig['panelConfig'] ? stateSearchViewConfig['panelConfig']['orderFields']:[]) : []
        const filter:any = {
            pageInfo: {
                pageSize,
                beginIndex
            }
        }
        if(stateSearchMode == 'normal'){
            filter['filterInfo'] = whereList
        }
        if(stateSearchMode == 'advanced'){
            filter['whereList'] = whereList
            filter['orderList'] = orderList
        }
        setFilterInfo(filter)
    }, [pageSize, beginIndex, stateSearchViewConfig,stateSearchMode])

    //进行查询
    const onSearch = useCallback((params, isInit, filterParams) => {
        setFilterInfo({
            ...params,
            pageInfo: {
                pageSize,
                beginIndex
            }
        })
        fetchData({
            ...params,
            pageInfo: {
                pageSize,
                beginIndex
            }
        })
    }, [pageSize, beginIndex, fetchData])


    useEffect(() => {
        if (stateColumnsPath) {
            import(`@/pages/${stateColumnsPath}`).then((m) => {
                setStateColumns(m['tableSchema'])
            })
        }
    }, [stateColumnsPath]);

    useEffect(() => {
        if (stateSearchSchemaPath) {
            import(`@/pages/${stateSearchSchemaPath}`).then((m) => {
                setStateSearchSchema(m['searchSchema'])
            })
        }
    }, [stateSearchSchemaPath]);

    // console.log('stateInitParams',stateInitParams)
    // console.log('stateSearchViewConfig',stateSearchViewConfig)
    
    return (<>
        <BlockHeader title={tr('业务对象')} type='num' num={1} bottomLine={false} />
        <Select style={{ width: '100%' }} onChange={handleDomainChange} value={activeDomain} placeholder={tr('请选择业务对象')}>
            {
                domainData && domainData.map((item: object) => <Option value={item['domain']}>{item['title']}</Option>)
            }
        </Select>

        {!_.isEmpty(stateColumns) &&
            <>
                <BlockHeader title={tr('标题')} type='num' num={2} bottomLine={false} />
                <Input
                    placeholder={tr('请输入标题')}
                    onChange={handleTitleChange}
                    value={titleValue}
                    style={{ marginBottom: '10px' }}
                />
            </>
        }
        <BlockHeader title={tr('刷新控件')} type='num' num={3} bottomLine={false} />
        <Switch checkedChildren={tr('自动')} unCheckedChildren={tr('默认')} onChange={handleAutoUpdateChange} checked={stateShowAutoUpdate} style={{ marginBottom: '10px' }} />
        {!_.isEmpty(stateColumns) && !_.isEmpty(stateSearchSchema) && <>
            <BlockHeader title="过滤" type='num' num={4} bottomLine={false} />
            <SmartSearch
                title={tr('查询条件')}
                mode='advancedOnly'
                onViewChange={onSearchViewChange}
                searchPanelId={stateSearchPanelId}
                userId={userId || -1}
                schema={stateSearchSchema}
                onSearch={onSearch}
                initView={stateSearchViewConfig ? stateSearchViewConfig : null}
                initParams={stateInitParams}
                onValueChange={onValueChange}
                isCompatibilityMode={stateSearchMode === 'normal'}
            />
            <BlockHeader title="表格信息" type='num' num={5} bottomLine={false} />
            <TableConfig viewConfig={stateTableViewConfig} uiFields={['wrap', 'isZebra', 'bordered']} schema={stateColumns} onChange={(params) => {
                console.log('change',params)
                setStateTableViewConfig(params)
            }} />
        </>
        }

        <div className="widgetconfigfooterblank"></div>
        <div className="widgetconfigfooter">
            <Button size="small" type='primary' onClick={() => save()} disabled={!titleValue || !activeDomain}>{tr('保存')}</Button>
        </div>
    </>)

}

export default Page
