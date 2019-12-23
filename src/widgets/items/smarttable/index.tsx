import React, { useEffect, useCallback, useState, useReducer, useRef } from 'react'
import { Card } from 'gantd';
import { Icon, Empty, Button } from 'antd'
import { SmartTable } from '@/components/specific'
import { fetchApi, updateApi } from './service';
import request from '@/utils/request'
import { reducer } from '@/utils/utils'
import { ConfigBar, ConfigWrap } from '@/widgets/utils'
import ConfigPanel from './ConfigPanel'
import UpdateTime from '@/components/common/updatetime'
import SnapShot from './snapshot.png'
const modelRegisterKey = ''
interface Props {
	loading: any;
	[propname: string]: any;
}

const smartChartWidget = (props: Props) => {
	const { itemHeight, editMode, widgetKey, handleDeleteWidget, } = props;

	const [configVisible, setConfigVisible] = useState(false)
	const [loading, setLoading] = useState(false)
	const [hasPagination, setHasPagination] = useState(true)
	const searchRef = useRef(null);

	const [state, dispatch] = useReducer(reducer, {
		domain: '',
		dataSource: [],
		title: '',
		queryUrl: '',
		queryData: {},
		showAutoUpdate: false,
		tableViewConfig: {},
		searchSchema: {},
		searchSchemaPath: '',
		columns: [],
		columnsPath: '',
		searchPanelId: '',
		pageSize: 20,
		beginIndex: 0,
		userListTotal: 100,
		searchMode: 'normal'
	})

	const {
		domain,
		dataSource,
		title,
		queryUrl,
		queryData,
		showAutoUpdate,
		tableViewConfig,
		searchSchema,
		searchSchemaPath,
		columns,
		columnsPath,
		searchPanelId,
		pageSize,
		beginIndex,
		userListTotal,
		searchMode
	} = state;

	const calcFilter = useCallback(
		(searchMode, filterInfo) => {
			let filter: any = {
				pageInfo: {
					pageSize,
					beginIndex
				}
			}
			const orderList = filterInfo ? filterInfo['orderList'] : []
			const whereList = filterInfo ? filterInfo['whereList'] : []
			const filterInfoChild = filterInfo ? filterInfo['filterInfo'] : []
			if (searchMode == 'normal') {
				filter['filterInfo'] = filterInfoChild
			}
			if (searchMode == 'advanced') {
				filter['whereList'] = whereList
				filter['orderList'] = orderList
			}
			return filter
		},
		[pageSize, beginIndex],
	)

	//发起请求
	const fetch = useCallback(async (payload: any) => {
		setLoading(true)
		const { beginIndex, pageSize, widgetKey, } = payload
		//获取小程序信息
		const response = await fetchApi({ widgetKey });

		if (!response) {
			setLoading(false)
			return
		}
		const { configParams, title, } = JSON.parse(response.bigData)
		const { domain, showAutoUpdate, queryUrl, columnsPath, searchSchemaPath, filterInfo, searchMode } = configParams;
		dispatch({
			type: 'save',
			payload: {
				domain,
				title,
				showAutoUpdate,
				...configParams,
			}
		})
		// console.log('configParams', configParams)
		if (columnsPath) {
			import(`@/pages/${columnsPath}`).then((m) => {
				dispatch({
					type: 'save',
					payload: {
						columns: m['tableSchema']
					}
				})
			})
		}
		if (searchSchemaPath) {
			import(`@/pages/${searchSchemaPath}`).then((m) => {
				dispatch({
					type: 'save',
					payload: {
						searchSchema: m['searchSchema']
					}
				})
			})
		}

		if (!queryUrl) { return }

		//获取小程序数据信息

		const filter = calcFilter(searchMode, filterInfo)
		const dataSource = await request(queryUrl, {
			method: 'POST',
			data: filter
		});
		if (!dataSource) { return }
		if (_.isArray(dataSource)) {
			setHasPagination(false)
		}
		dispatch({
			type: 'save',
			payload: {
				dataSource: _.isArray(dataSource) ? dataSource : dataSource.content,
				userListTotal: _.isArray(dataSource) ? dataSource.length : dataSource.totalCount,
			}
		})
		setLoading(false)
	}, [])

	//获取数据
	const fetchData = useCallback(
		async (filterInfo) => {
			if (!queryUrl) {
				return
			}
			const dataSource = await request(queryUrl, {
				method: 'POST',
				data: filterInfo
			})
			if (!dataSource) { return }
			dispatch({
				type: 'save',
				payload: {
					dataSource: _.isArray(dataSource) ? dataSource : dataSource.content,
					userListTotal: _.isArray(dataSource) ? dataSource.length : dataSource.totalCount,
				}
			})
		}, [queryUrl],
	)

	//更新数据
	const update = useCallback(async (payload: any, callback: Function) => {

		setLoading(true)
		const { widgetKey, data } = payload;
		const { title, configParams, } = data;
		const { queryUrl, domain, showAutoUpdate, filterInfo } = configParams
		await updateApi({
			widgetKey,
			data
		});
		const filter = calcFilter(searchMode, filterInfo)
		const dataSource = await request(queryUrl, {
			method: 'POST',
			data: filter
		});
		dispatch({
			type: 'save',
			payload: {
				domain,
				title,
				showAutoUpdate,
				dataSource: _.isArray(dataSource) ? dataSource : dataSource.content,
				userListTotal: _.isArray(dataSource) ? dataSource.length : dataSource.totalCount,
				...configParams
			}
		})
		callback && callback()
		setLoading(false)
	}, [pageSize, beginIndex, searchMode])

	//刷新
	const load = useCallback((pageSize, beginIndex) => {
		fetch({
			widgetKey,
			beginIndex,
			pageSize
		})
	}, [widgetKey, fetch,])

	//分页改变
	const onPageChange = useCallback((beginIndex, pageSize) => {
		dispatch({
			type: 'save',
			payload: {
				pageSize,
				beginIndex
			}
		})
		load(pageSize, beginIndex)
	}, [])

	useEffect(() => {
		if (!_.isEmpty(dataSource)) {
			return
		}
		load(pageSize, beginIndex)
	}, []);


	return (<>
		<Card
			bordered={false}
			className="full"
			title={<span><Icon type="table" className="marginh5" />{title}</span>}
			loading={loading}
			bodyStyle={{ padding: '0px' }}
			extra={showAutoUpdate ? <UpdateTime refresh={() => load(pageSize, beginIndex)} /> : <Button size="small" icon="reload" onClick={() => load(pageSize, beginIndex)} loading={loading} />}
		>
			{!_.isEmpty(columns) ? <SmartTable
				headerProps={{
					style: { display: 'none' }
				}}
				viewSchema={tableViewConfig}
				tableKey={`${widgetKey}`}
				rowKey="id"
				schema={columns}
				dataSource={dataSource}
				loading={loading}
				ref={searchRef}
				// rowSelection={{
				// 	type: 'radio',
				// 	selectedRowKeys,
				// 	onChange: handleSelect
				// }}
				bodyHeight={itemHeight - 40 - 31 - (hasPagination ? 32 : 0)}
				pageSize={pageSize}
				pageIndex={beginIndex}
				onPageChange={onPageChange}
				totalCount={userListTotal}
				pageSizeOptions={['10', '20', '50', '100']}
				pagination={hasPagination}

			/> :
				<div className="emptyContent" style={{ height: itemHeight - 40 }}>
					<Empty
						description={
							<span>
								{tr('还没有配置')},{tr('请进行配置')}
							</span>
						}
					>
					</Empty>
				</div>
			}

		</Card>
		<ConfigBar widgetKey={widgetKey} editMode={editMode} handleDeleteWidget={handleDeleteWidget} setVisible={setConfigVisible} />
		<ConfigWrap visible={configVisible} setVisible={setConfigVisible} width={800} widgetKey={widgetKey}>
			<ConfigPanel {...state} widgetKey={widgetKey} update={update} fetchData={fetchData} handleClose={() => { setConfigVisible(false) }} />
		</ConfigWrap>
	</>
	)
}

export default smartChartWidget
export { SnapShot, modelRegisterKey }