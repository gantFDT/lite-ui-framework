import React, { useEffect, useState, useCallback,useMemo } from 'react';
import { Button, Input, Select, Switch } from 'antd'
import { BlockHeader } from 'gantd'
import ChartConfig from '@/components/specific/smartchart/config'
import styles from './index.less'
import { getChartParams } from '@/components/specific/smartchart/utils'
import { getModelData } from '@/utils/utils'
import { SmartSearch } from '@/components/specific'

const { Option } = Select;

const Page = (props: any) => {
    const {
        chartViewConfig,
        title,
        columns=[],
        columnsPath = '',
        update,
        widgetKey,
        queryUrl,
        handleClose,
        domain,
        showAutoUpdate,
        searchViewConfig = {},
        initParams = [],
        searchPanelId = '',
        searchSchema = {},
        searchSchemaPath = '',
        fetchData
    } = props;

    const [editSchema, setEditSchema] = useState(chartViewConfig)
    const [titleValue, setTitleValue] = useState(title)
    const [stateQueryUrl, setStateQueryUrl] = useState(queryUrl)
    const [stateColumns, setStateColumns] = useState(columns)
    const [stateColumnsPath, setStateColumnsPath] = useState(columnsPath)
    const [activeDomain, setActiveDomain] = useState(domain)
    const [stateShowAutoUpdate, setStateShowAutoUpdate] = useState(showAutoUpdate)
    const [stateSearchViewConfig, setStateSearchViewConfig] = useState(searchViewConfig)
    const [stateInitParams, setStateInitParams] = useState(initParams)
    const [stateSearchPanelId, setStateSearchPanelId] = useState(searchPanelId)
    const [stateSearchSchema, setStateSearchSchema] = useState(searchSchema)
    const [stateSearchSchemaPath, setStateSearchSchemaPath] = useState(searchSchemaPath)
    const [whereList, setWhereList] = useState([]);

    const domainData = useMemo(()=>{
        return getModelData('config.SMART_CHART_DOMAIN')
    },[])
    const userId = useMemo(()=>{
        return getModelData('user.currentUser.id')
    },[])

    //点击保存
    const save = useCallback(() => {
        const queryData = getChartParams(editSchema['dataConfig'])
        update({
            widgetKey: widgetKey,
            data: {
                title: titleValue,
                configParams: {
                    domain: activeDomain,
                    showAutoUpdate: stateShowAutoUpdate,
                    queryUrl: stateQueryUrl,
                    queryData:{
                        ...queryData,
                        filterInfo:whereList,
                    },
                    columnsPath: stateColumnsPath,
                    chartViewConfig: editSchema,
                    searchViewConfig: stateSearchViewConfig,
                    initParams: stateInitParams,
                    searchPanelId: stateSearchPanelId,
                    searchSchemaPath: stateSearchSchemaPath
                }
            }
        }, handleClose)
    }, [editSchema, title, widgetKey, update, titleValue, stateQueryUrl, stateColumns, stateColumnsPath,activeDomain, stateShowAutoUpdate, stateSearchViewConfig, stateInitParams, stateSearchPanelId, stateSearchSchema,stateSearchSchemaPath,whereList])

    //标题改变
    const handleTitleChange = useCallback((e) => {
        setTitleValue(e.target.value)
    }, [])

    //业务域改变
    const handleDomainChange = useCallback((value) => {
        setActiveDomain(value)
        let domain = {}
        domainData.map((item: object) => {
            if (item['domain'] == value) {
                domain = item
            }
        })
        setStateQueryUrl(domain['queryUrl'])
        setStateColumnsPath(domain['columnsPath'])
        setStateSearchSchemaPath(domain['searchSchemaPath'])
        setStateSearchPanelId(domain['searchPanelId'])

    }, [domainData, setStateColumnsPath, setStateSearchSchemaPath, setStateQueryUrl, setStateSearchPanelId, columnsPath, searchSchemaPath])

    //自动刷新控件
    const handleAutoUpdateChange = useCallback((value) => {
        setStateShowAutoUpdate(value)
    }, [])


    //查询视图改变
    const onSearchViewChange = useCallback((searchView) => {
        setStateSearchViewConfig(searchView)
    }, [])

    const onValueChange = useCallback((values, whereList) => {
        setStateInitParams(values)
        setWhereList(whereList)
    }, [stateSearchViewConfig])

    const onSearch = useCallback((params, isInit, filterParams) => {
        setWhereList(params['whereList'])
        if(_.isEmpty(editSchema)){
            return
        }
        let queryData = getChartParams(editSchema['dataConfig'])
        queryData={
            ...queryData,
            filterInfo:whereList,
        },
        fetchData(queryData)
    }, [fetchData,editSchema,whereList])

    //加载tableschema
    useEffect(() => {
        if (stateColumnsPath) {
            import(`@/pages/${stateColumnsPath}`).then((m) => {
                setStateColumns(m['tableSchema'])
            })
        }
    }, [stateColumnsPath]);

    //加载searchschema
    useEffect(() => {
        if (stateSearchSchemaPath) {
            import(`@/pages/${stateSearchSchemaPath}`).then((m) => {
                setStateSearchSchema(m['searchSchema'])
            })
        }
    }, [stateSearchSchemaPath]);


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
            />
            <BlockHeader title="图表信息" type='num' num={5} bottomLine={false} />
            <ChartConfig chartView={editSchema} columns={stateColumns} setEditSchema={setEditSchema} />
        </>
        }

        <div className="widgetconfigfooterblank"></div>
        <div className="widgetconfigfooter">
            <Button size="small" type='primary' onClick={() => save()} disabled={!titleValue || !activeDomain || !editSchema['dataConfig']}>{tr('保存')}</Button>
        </div>
    </>)

}

export default Page
