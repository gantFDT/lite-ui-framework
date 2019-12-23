import React, { useEffect, useCallback, useState, useReducer } from 'react'
import { Card } from 'gantd';
import { Icon, Empty, Button } from 'antd'
import SmartChart from '@/components/specific/smartchart/chart'
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

	const [state, dispatch] = useReducer(reducer, {
		domain: '',
		chartViewConfig: {},
		dataSource: [],
		title: '',
		queryUrl: '',
		queryData: {},
		showAutoUpdate: false,
		searchSchema: {},
		searchSchemaPath: '',
		columns: [],
		columnsPath: '',
		searchPanelId: ''
	})

	const {
		domain,
		chartViewConfig,
		dataSource,
		title,
		queryUrl,
		queryData,
		showAutoUpdate,
		searchSchema,
		searchSchemaPath,
		columns,
		columnsPath,
		searchPanelId
	} = state;

	//请求数据
	const fetch = useCallback(async (payload: any) => {
		setLoading(true)
		const response = await fetchApi(payload);
		if (!response) {
			setLoading(false)
			return
		}
		const { configParams, title, } = JSON.parse(response.bigData)
		const { domain, showAutoUpdate, queryUrl, queryData, columnsPath, searchSchemaPath } = configParams;

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

		if (!queryUrl || !queryData) { return }
		const dataSource = await request(queryUrl, {
			method: 'POST',
			data: queryData
		});
		if (!dataSource) { return }
		dispatch({
			type: 'save',
			payload: {
				domain,
				title,
				showAutoUpdate,
				dataSource,
				...configParams
			}
		})
		setLoading(false)
	}, [])


	//获取数据
	const fetchData = useCallback(
		async (queryData) => {
			const dataSource = await request(queryUrl, {
				method: 'POST',
				data: queryData
			});
			if (!dataSource) { return }
			dispatch({
				type: 'save',
				payload: {
					dataSource
				}
			})
		}, [queryUrl],
	)


	//更新数据
	const update = useCallback(async (payload: any, callback: Function) => {
		setLoading(true)
		const { widgetKey, data } = payload;
		const { title, configParams, domain, showAutoUpdate } = data;
		const { chartViewConfig, queryUrl, queryData, columns } = configParams
		await updateApi({
			widgetKey,
			data
		});
		const dataSource = await request(queryUrl, {
			method: 'POST',
			data: queryData
		});
		dispatch({
			type: 'save',
			payload: {
				domain,
				title,
				showAutoUpdate,
				dataSource,
				...configParams
			}
		})
		callback && callback()
		setLoading(false)
	}, [])

	//刷新
	const load = useCallback(() => {
		fetch({
			widgetKey
		})
	}, [widgetKey, fetch])

	useEffect(() => {
		if (!_.isEmpty(dataSource)) {
			return
		}
		load()
	}, []);

	// console.log('columns',columns)
	// console.log('searchSchema',searchSchema)

	return (<>
		<Card
			bordered={false}
			className="full"
			title={<span><Icon type="bar-chart" className="marginh5" />{title}</span>}
			loading={loading}
			bodyStyle={{ padding: '0px' }}
			extra={showAutoUpdate ? <UpdateTime refresh={load} /> : <Button size="small" icon="reload" onClick={() => load()} loading={loading} />}
		>
			{!_.isEmpty(chartViewConfig) ? <SmartChart
				dataSource={dataSource}
				chartView={chartViewConfig}
				height={itemHeight - 40}
				columns={columns}
			// padding={{
			// 	left:50,
			// 	right:50,
			// 	top:30,
			// 	bottom:20
			// }}
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
